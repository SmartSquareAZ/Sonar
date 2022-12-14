import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { AgendaPunkt } from 'src/app/models/Agendapunkt';
import { Dialog } from 'src/app/models/Dialog';
import { Aufgabe } from 'src/app/models/Aufgabe';
import { AgendaService } from 'src/app/service/agenda/agenda.service';
import { AgendapunktWebsocketService } from 'src/app/service/websocket/agendapunkt-websocket.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
  providers: [ConfirmationService]
})
export class AgendaComponent implements OnInit {

  /**
   * Ob man die Agenda bearbeiten kann oder nicht
   */
  @Input() showEditField: boolean = true;

  /**
   * Um den Agendapunkt zur Aufgabe hinzuzufügen
   */
  @Input() choosenAufgabe: Aufgabe = Aufgabe.buildFromEmpty();
  @Output() choosenAufgabeChange = new EventEmitter<Aufgabe>();

  @Output() agendaChanged = new EventEmitter<{operation: string, value: AgendaPunkt}>();

  /**
   * Root Agendapunkt
   */
  root: any;

  /**
   * Array aller TreeNodes
   */
  agendaPunkteNode: TreeNode<AgendaPunkt>[] = [];

  /**
   * Gibt an, ob die Agenda aktuelle geladen wird
   */
  loadingAgenda: boolean = true;

  /**
   * Eingabeform des Agendapunkt Dialogs
   */
  agendaPunktForm = this.formBuilder.group({
    name: ["", Validators.required],
    nummer: ["", Validators.required],
    farbe: [""]
  });

  selectedNode!: TreeNode;

  /**
   * Node welche im Dialog bearbeitet wird
   */
  choosenAgendaPunktNode: TreeNode<AgendaPunkt> = AgendaPunkt.createTreeNode(AgendaPunkt.buildFromEmpty(), this.showEditField);

  constructor(private formBuilder: FormBuilder, private agendaService: AgendaService, private confirmationService: ConfirmationService, private router: Router, private messageService: MessageService, private socketService: AgendapunktWebsocketService) {
    // Agenda Dialog wird gebuildet
    this.AgendaDialog = Dialog.build(this.preDialogOpenAgenda.bind(this), this.postDialogOpenAgenda.bind(this), this.preDialogCloseAgenda.bind(this), this.postDialogCloseAgenda.bind(this));
    // AgendaPunkt Dialog wird gebuildet
    this.AgendaPunktDialog = Dialog.build(this.preDialogOpenAgendaPunkt.bind(this), this.postDialogOpenAgendaPunkt.bind(this), this.preDialogCloseAgendaPunkt.bind(this), this.postDialogCloseAgendaPunkt.bind(this));
  }

  ngOnInit() {
    this.buildTree();

    this.socketService.requestCallback = (operation: any, sourceDevice: any, destinationDevice: any, pid: any, data: any) => {
      if(operation != "ONLINE" && operation != "REGISTER") {
        data = JSON.parse(data);
      }
      // Überprüfung, auf den richtigen Befehl
      if (operation == "CREATE") {
        let newAgendapunkt = AgendaPunkt.createTreeNode(AgendaPunkt.buildFromJSON(data));
        if(data["PARENTID"] == 0) {
          this.agendaPunkteNode.push(newAgendapunkt);
          this.root.children = this.agendaPunkteNode;
        } else {
          let parentNode = this.findTreeNode(this.root, data["PARENTID"]);
          parentNode?.children?.push(newAgendapunkt);
        }
        this.agendaChanged.emit({operation: "CREATE", "value": newAgendapunkt.data});
      }
      if (operation == "UPDATE") {
        let toUpdate: TreeNode<AgendaPunkt> | undefined = this.findTreeNode(this.root, data["ID"]);
        if(toUpdate == undefined) return;
        let newAgendapunkt = AgendaPunkt.buildFromJSON(data);
        toUpdate.data = newAgendapunkt;
        toUpdate.label = newAgendapunkt.nummer + " " + newAgendapunkt.name;
        toUpdate.key = "" + newAgendapunkt.ID;

        this.agendaChanged.emit({operation: "UPDATE", "value": newAgendapunkt});
      }
      if (operation == "DELETE") {
        let nodeToDelete = this.findTreeNode(this.root, data["ID"]);
        
        if(nodeToDelete?.data?.parentID == 0) {
          // Index des Elements wird gesucht
          let index = this.agendaPunkteNode.findIndex(x => x.data?.ID == nodeToDelete?.data?.ID);
          // Element wird aus Array entfernt
          this.agendaPunkteNode.splice(index, 1);
          // Array wird neu erstellt
          this.agendaPunkteNode = [...this.agendaPunkteNode];
        } else {
          // Index des Elements wird gesucht
          let index = nodeToDelete?.parent?.children?.findIndex(x => x.data?.ID == nodeToDelete?.data?.ID);
          if(index == undefined) return;
          // Element wird aus Array entfernt
          nodeToDelete?.parent?.children?.splice(index, 1);
        }

        if(nodeToDelete?.data == undefined) return;
        this.agendaChanged.emit({operation: "DELETE", "value": nodeToDelete?.data});
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["showEditField"]?.currentValue != undefined) {
      this.buildTree();
    }
  }

  findTreeNode(node: TreeNode<AgendaPunkt>, agendaPunktID: number): TreeNode<AgendaPunkt> | undefined {
    console.log(node);
    if(node.children != null && node.children.length != 0) {
      for(let i = node.children.length - 1; i >= 0; i--) {
        if(node.children[i].data?.ID == agendaPunktID) {
          return node.children[i];
        }
        let retVal = this.findTreeNode(node.children[i], agendaPunktID);
        if(retVal == undefined) continue;
        return retVal;
      }
    }
    return undefined;
  }

  buildTree(): void {
    // Flag wird gesetzt
    this.loadingAgenda = true;

    // Parents werden geladen
    this.agendaService.readAgendaPunkte((data: JSON) => {
      // Root wird gesetzt
      this.root = AgendaPunkt.createTreeNode(new AgendaPunkt(0, "ROOT", "0", "#000", 1, -1, 0, 0, AgendaPunkt.buildFromJSONArray(data)), this.showEditField);

      // AgendaPunkte werden geladen
      this.agendaPunkteNode = this.root.children;

      // Flag wird gesetzt
      this.loadingAgenda = false;
    });
  }

  agendaPunktSelected(event: any) {
    if(this.showEditField) {
        const element = document.getElementById(`${event.node.key}`);
        if (element != undefined) element.scrollIntoView({behavior: 'smooth'});
    } else {
      this.choosenAufgabe.masterID = event.node.data?.ID;
      this.choosenAufgabeChange.emit(this.choosenAufgabe);
    }
  }

  addNewAgendaPunkt() {
    // Leerer AgendaPunkt wird erstellt
    let agendaPunkt = AgendaPunkt.buildFromEmpty();

    // Daten werden gesetzt
    agendaPunkt.ID = 0;
    agendaPunkt.agendaID = this.root.data.agendaID;
    agendaPunkt.parentID = this.root.data.ID;
    agendaPunkt.name = "Name";

    // Neuer AgendaPunkt wird zu Array hinzugefügt
    let treeNode: TreeNode = AgendaPunkt.createTreeNode(agendaPunkt);
    
    //this.root.children.push(treeNode);
    this.agendaPunkteNode.push(treeNode);

    // Ansicht wird aktualisiert
    this.agendaPunkteNode = Array.from(this.agendaPunkteNode);
    //this.root.children = this.agendaPunkteNode;
  }

  /**
   * Speichert bzw aktualisiert den gewählten AgendaPunkt
   */
  saveAgendaPunkt() {
    if (this.choosenAgendaPunktNode.data != null) {
      // Werte der Form werden in Objekt übernommen
      this.choosenAgendaPunktNode.data.name = "" + this.agendaPunktForm.get('name')?.value;
      this.choosenAgendaPunktNode.data.farbe = "" + this.agendaPunktForm.get('farbe')?.value?.substring(1, this.agendaPunktForm.get('farbe')?.value?.length);
      this.choosenAgendaPunktNode.data.nummer = "" + this.agendaPunktForm.get('nummer')?.value;

      if(this.choosenAgendaPunktNode.data.ID == 0) {
        // Agendapunkt wird im Service gespeichert
        this.agendaService.saveAgendaPunkt(this.choosenAgendaPunktNode.data, (res: JSON) => {
          let newAgendapunkt = AgendaPunkt.buildFromJSON(res);
          this.socketService.sendOperation("CREATE", "", newAgendapunkt.toJSONString());

          this.choosenAgendaPunktNode.data = newAgendapunkt;
          this.choosenAgendaPunktNode.key = "" + newAgendapunkt.ID;
          this.choosenAgendaPunktNode.label = newAgendapunkt.nummer + " " + newAgendapunkt.name;

          // Ansicht wird aktualisiert
          this.agendaPunkteNode = Array.from(this.agendaPunkteNode);
          this.root.children = this.agendaPunkteNode;

          this.agendaChanged.emit({operation: "CREATE", "value": newAgendapunkt});

          // Dialog wird geschlossen
          this.closeDialogAgendaPunkt();
        });
      } else {
        // Agendapunkt wird im Service geupdated
        this.agendaService.updateAgendaPunkt(this.choosenAgendaPunktNode.data, (res: JSON) => {
          let newAgendapunkt = AgendaPunkt.buildFromJSON(res);
          this.socketService.sendOperation("UPDATE", "", newAgendapunkt.toJSONString());
          this.agendaChanged.emit({operation: "UPDATE", "value": newAgendapunkt});

          this.choosenAgendaPunktNode.data = newAgendapunkt;
          this.choosenAgendaPunktNode.key = "" + newAgendapunkt.ID;
          this.choosenAgendaPunktNode.label = newAgendapunkt.nummer + " " + newAgendapunkt.name;

          // Ansicht wird aktualisiert

          this.agendaPunkteNode = Array.from(this.agendaPunkteNode);
          // Dialog wird geschlossen
          this.closeDialogAgendaPunkt();
        });
      }
    }
  }

  showConfirm(event: any) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Sind Sie sicher?',
      icon: 'pi pi-exclamation-triangle',
      accept: this.deleteAgendapunktTreeNode.bind(this)
    });
  }

  deleteAgendapunktTreeNode(element: TreeNode<AgendaPunkt> = this.choosenAgendaPunktNode) {
    if(element.children != null && element.children.length != 0) {
      for(let i = element.children.length - 1; i >= 0; i--) {
        this.deleteAgendapunktTreeNode(element.children[i]);
      }
    }

    if (element.data != null && !element.data.hasMessages && element.data.ID != 0) {
      // Agendapunkt wird im Service gelöscht
      this.agendaService.deleteAgendaPunkt(element.data, (res: JSON) => {
        this.socketService.sendOperation("DELETE", "", element.data?.toJSONString())
        if (element.data == undefined) return;
        this.agendaChanged.emit({operation: "DELETE", "value": element.data});
      },
      (err: any) => {
        this.messageService.add({severity:'error', summary:'Fehler beim Löschen des Agendapunktes', detail:`Für den Agendapunkt "${element.data?.nummer} ${element.data?.name}" existiert noch mindestens eine Protokollnachricht`});
      });
    }

    if(!element.data?.hasMessages) {
      // Wenn das element eine ChildNode ist wird sie vom parent entfernt
      if (element.parent != null && element.parent?.children != null) {
        // Index des Elements wird gesucht
        let index = element.parent.children.findIndex(x => x.data?.ID == element.data?.ID);
        // Element wird aus Array entfernt
        element.parent.children.splice(index, 1);
        // Array wird neu erstellt
        element.parent.children = [...element.parent.children];
      } else {
        // Index des Elements wird gesucht
        let index = this.agendaPunkteNode.findIndex(x => x.data?.ID == element.data?.ID);
        // Element wird aus Array entfernt
        this.agendaPunkteNode.splice(index, 1);
        // Array wird neu erstellt
        this.agendaPunkteNode = [...this.agendaPunkteNode];
      }
    }

    // Dialog wird geschlossen
    this.closeDialogAgendaPunkt();
  }

  nodeSelectChild(element: TreeNode<AgendaPunkt>) {
    // Daten werden gesetzt
    this.choosenAgendaPunktNode = element;

    // Dialog wird geöffnet
    this.openDialogAgendaPunkt();
  }

  addAgendapunktChild(element: TreeNode<AgendaPunkt>) {

  }

  getCountMessagesFromAgendaPunkt(agendaPunkt: AgendaPunkt | undefined) {
    if (agendaPunkt == undefined) return;
    let agendaPunktTyped : AgendaPunkt = agendaPunkt;

    for(let agendaChild of agendaPunktTyped.children) {
      this.getCountMessagesFromAgendaPunkt(agendaChild);
    }
    
    agendaPunktTyped.hasMessages = Number(document.getElementById("" + agendaPunktTyped.ID)?.getAttribute('length')) > 0;
    if(!agendaPunktTyped.hasMessages) {
      for(let agendaChild of agendaPunktTyped.children) {
        if(agendaChild.hasMessages) {
          agendaPunktTyped.hasMessages = true;
          return;
        }
      }
    }
  }

  //#region Agenda Dialog
  AgendaDialog: Dialog;
  preDialogOpenAgenda(): void { }
  preDialogCloseAgenda(): void { }
  postDialogOpenAgenda(): void { }
  postDialogCloseAgenda(): void { }

  get displayDialogAgenda(): boolean {
    return this.AgendaDialog.displayDialog;
  }
  set displayDialogAdenda(_show: boolean) {
    _show ? this.openDialogAgenda() : this.closeDialogAgenda();
  }

  /**
   * Öffnet den Agenda Dialog
   */
  openDialogAgenda(): void {
    this.AgendaDialog.openDialog();
    for(let agendaPunkt of this.agendaPunkteNode) {
      this.getCountMessagesFromAgendaPunkt(agendaPunkt.data);
    }
  }
  /**
   * Schließt den Agenda Dialog
   */
  closeDialogAgenda(): void {
    this.root = (JSON.parse(JSON.stringify(this.root)));
    this.AgendaDialog.closeDialog();
  }
  //#endregion

  //#region AgendaPunkt Dialog
  AgendaPunktDialog: Dialog;
  preDialogOpenAgendaPunkt(): void { }
  preDialogCloseAgendaPunkt(): void { }
  postDialogOpenAgendaPunkt(): void { }
  postDialogCloseAgendaPunkt(): void { }

  get displayDialogAgendaPunkt(): boolean {
    return this.AgendaPunktDialog.displayDialog;
  }
  set displayDialogAdendaPunkt(_show: boolean) {
    _show ? this.openDialogAgendaPunkt() : this.closeDialogAgendaPunkt();
  }

  /**
   * Öffnet den AgendaPunkt Dialog
   */
  openDialogAgendaPunkt(): void {
    if (this.choosenAgendaPunktNode.data != null) {
      // Werte werden in Form gesetzt
      this.agendaPunktForm.controls['name'].setValue(this.choosenAgendaPunktNode.data.name);
      this.agendaPunktForm.controls['farbe'].setValue(this.choosenAgendaPunktNode.data.farbe);
      this.agendaPunktForm.controls['nummer'].setValue(this.choosenAgendaPunktNode.data.nummer);
    }

    // Dialog wird geöffnet
    this.AgendaPunktDialog.openDialog();
  }
  /**
   * Schließt den AgendaPunkt Dialog
   */
  closeDialogAgendaPunkt(): void {
    this.AgendaPunktDialog.closeDialog();
  }
  //#endregion

}
