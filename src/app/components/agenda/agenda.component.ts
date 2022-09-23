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
  agendaPunkte: TreeNode<AgendaPunkt>[] = [];

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
   * AgendaPunkt welcher im Dialog bearbeitet wird
   */
  choosenAgendaPunkt: AgendaPunkt = AgendaPunkt.buildFromEmpty();
  /**
   * Node welche im Dialog bearbeitet wird
   */
  choosenAgendaPunktNode: any;

  constructor(private formBuilder: FormBuilder, private agendaService: AgendaService, private confirmationService: ConfirmationService) {
    // Agenda Dialog wird gebuildet
    this.AgendaDialog = Dialog.build(this.preDialogOpenAgenda.bind(this), this.postDialogOpenAgenda.bind(this), this.preDialogCloseAgenda.bind(this), this.postDialogCloseAgenda.bind(this));
    // AgendaPunkt Dialog wird gebuildet
    this.AgendaPunktDialog = Dialog.build(this.preDialogOpenAgendaPunkt.bind(this), this.postDialogOpenAgendaPunkt.bind(this), this.preDialogCloseAgendaPunkt.bind(this), this.postDialogCloseAgendaPunkt.bind(this));
  }

  async ngOnInit() {
    // Flag wird gesetzt
    this.loadingAgenda = true;
    // TreeNode wird erstellt
    this.root = AgendaPunkt.createTreeNode(await this.agendaService.readAgendaPunkte(0));
    // Flag wird gesetzt
    this.loadingAgenda = false;

    // AgendaPunkte werden geladen
    this.agendaPunkte = this.root.children;
  }

  nodeSelect(element: any) {
    // Daten werden gesetzt
    this.choosenAgendaPunktNode = element.node;
    this.choosenAgendaPunkt = this.choosenAgendaPunktNode.data;

    // Dialog wird geöffnet
    this.openDialogAgendaPunkt();
  }

  addNewAgendaPunkt(currentNode: any) {
    // Leerer AgendaPunkt wird erstellt
    let agendaPunkt = AgendaPunkt.buildFromEmpty();

    // Überprüfung, ob übergebene Node null ist
    if (currentNode == null) {
      // Root wird als aktueller angenommen
      currentNode = { node: this.root };
    }

    // Daten werden gesetzt
    agendaPunkt.ID = 0;
    agendaPunkt.agendaID = currentNode.node.data.agendaID;
    agendaPunkt.parentID = currentNode.node.data.ID;
    agendaPunkt.name = "Name";

    // Neuer AgendaPunkt wird zu Array hinzugefügt
    currentNode.node.children.push(AgendaPunkt.createTreeNode(agendaPunkt));

    // Ansicht wird aktualisiert
    this.agendaPunkte = Array.from(this.agendaPunkte);
    this.root.children = this.agendaPunkte;
  }

  /**
   * Speichert bzw aktualisiert den gewählten AgendaPunkt
   */
  saveAgendaPunkt() {
    // Werte der Form werden in Objekt übernommen
    this.choosenAgendaPunkt.name = "" + this.agendaPunktForm.get('name')?.value;
    this.choosenAgendaPunkt.farbe = "" + this.agendaPunktForm.get('farbe')?.value;
    this.choosenAgendaPunkt.nummer = "" + this.agendaPunktForm.get('nummer')?.value;

    // Daten werden zurückgesetzt
    this.choosenAgendaPunkt = AgendaPunkt.buildFromEmpty();

    // Ansicht wird aktualisiert
    this.agendaPunkte = Array.from(this.agendaPunkte);

    // Dialog wird geschlossen
    this.closeDialogAgendaPunkt();
  }

  showConfirm(event: any) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Sind Sie sicher?',
      icon: 'pi pi-exclamation-triangle',
      accept: this.deleteAgendapunkt.bind(this)
    });
  }

  deleteAgendapunkt() {
    this.removeFromList(this.agendaPunkte);

    // Dialog wird geschlossen
    this.closeDialogAgendaPunkt();

  }

  private removeFromList(agendaPunkt: any[]) {

    let index = agendaPunkt.findIndex(x => x.data.ID == this.choosenAgendaPunkt.ID);

    if (index == -1) {
      for (let idx = 0; idx < agendaPunkt.length; idx++) {
        if (agendaPunkt[idx].children != null) {
          this.removeFromList(agendaPunkt[idx].children);
        }
      }
    } else {
      agendaPunkt = agendaPunkt.splice(index, 1);

      agendaPunkt = Array.from(agendaPunkt);
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
    // Werte werden in Form gesetzt
    this.agendaPunktForm.controls['name'].setValue(this.choosenAgendaPunkt.name);
    this.agendaPunktForm.controls['farbe'].setValue(this.choosenAgendaPunkt.farbe);
    this.agendaPunktForm.controls['nummer'].setValue(this.choosenAgendaPunkt.nummer);

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
