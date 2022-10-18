import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService, TreeNode } from 'primeng/api';
import { Observable } from 'rxjs';
import { mock_agendapunkte } from 'src/app/mockdata/Mock_AgendaPunkte';
import { AgendaPunkt } from 'src/app/models/Agendapunkt';
import { Dialog } from 'src/app/models/Dialog';
import { AgendaService } from 'src/app/service/agenda/agenda.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
  providers: [ConfirmationService]
})
export class AgendaComponent implements OnInit {

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

  /**
   * Node welche im Dialog bearbeitet wird
   */
  choosenAgendaPunktNode: TreeNode<AgendaPunkt> = AgendaPunkt.createTreeNode(AgendaPunkt.buildFromEmpty());

  constructor(private formBuilder: FormBuilder, private agendaService: AgendaService, private confirmationService: ConfirmationService) {
    // Agenda Dialog wird gebuildet
    this.AgendaDialog = Dialog.build(this.preDialogOpenAgenda.bind(this), this.postDialogOpenAgenda.bind(this), this.preDialogCloseAgenda.bind(this), this.postDialogCloseAgenda.bind(this));
    // AgendaPunkt Dialog wird gebuildet
    this.AgendaPunktDialog = Dialog.build(this.preDialogOpenAgendaPunkt.bind(this), this.postDialogOpenAgendaPunkt.bind(this), this.preDialogCloseAgendaPunkt.bind(this), this.postDialogCloseAgendaPunkt.bind(this));
  }

  ngOnInit() {
    // Flag wird gesetzt
    this.loadingAgenda = true;

    // Parents werden geladen
    this.agendaService.readAgendaPunkte((data: JSON) => {
      // Root wird gesetzt
      this.root = AgendaPunkt.createTreeNode(new AgendaPunkt(0, "ROOT", "0", "#000", 1, -1, 0, AgendaPunkt.buildFromJSONArray(data)));

      // AgendaPunkte werden geladen
      this.agendaPunkteNode = this.root.children;

      // Flag wird gesetzt
      this.loadingAgenda = false;
    });
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
    this.root.children.push(AgendaPunkt.createTreeNode(agendaPunkt));

    // Ansicht wird aktualisiert
    this.agendaPunkteNode = Array.from(this.agendaPunkteNode);
    this.root.children = this.agendaPunkteNode;
  }

  /**
   * Speichert bzw aktualisiert den gewählten AgendaPunkt
   */
  saveAgendaPunkt() {
    if (this.choosenAgendaPunktNode.data != null) {
      // Werte der Form werden in Objekt übernommen
      this.choosenAgendaPunktNode.data.name = "" + this.agendaPunktForm.get('name')?.value;
      this.choosenAgendaPunktNode.data.farbe = "" + this.agendaPunktForm.get('farbe')?.value;
      this.choosenAgendaPunktNode.data.nummer = "" + this.agendaPunktForm.get('nummer')?.value;

      // Agendapunkt wird im Service gespeichert
      this.agendaService.saveAgendaPunkt(this.choosenAgendaPunktNode.data);
    }

    // Ansicht wird aktualisiert
    this.root = AgendaPunkt.createTreeNode(this.root.data);
    this.agendaPunkteNode = this.root.children;

    // Dialog wird geschlossen
    this.closeDialogAgendaPunkt();
  }

  showConfirm(event: any) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Sind Sie sicher?',
      icon: 'pi pi-exclamation-triangle',
      accept: this.deleteAgendapunktTreeNode.bind(this)
    });
  }

  private deleteAgendapunktTreeNode(element: TreeNode<AgendaPunkt> = this.choosenAgendaPunktNode) {
    if (element.data != null) {
      // Agendapunkt wird im Service gelöscht
      this.agendaService.deleteAgendaPunkt(element.data);
    }

    if (element.parent != null && element.parent?.children != null) {
      // Index des Elements wird gesucht
      let index = element.parent.children.findIndex(x => x.data?.ID == element.data?.ID);
      // Element wird aus Array entfernt
      element.parent.children.splice(index, 1);
      // Array wird neu erstellt
      element.parent.children = [...element.parent.children];
    }

    // Dialog wird geschlossen
    this.closeDialogAgendaPunkt();
  }

  private deleteAgendapunkt(element: AgendaPunkt){
    
  }

  nodeSelectChild(element: TreeNode<AgendaPunkt>) {
    // Daten werden gesetzt
    this.choosenAgendaPunktNode = element;

    // Dialog wird geöffnet
    this.openDialogAgendaPunkt();
  }

  addAgendapunktChild(element: TreeNode<AgendaPunkt>) {

  }

  deleteAgendapunktChild(element: TreeNode<AgendaPunkt>) {

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
