import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ConfirmationService, FilterMatchMode } from 'primeng/api';
import { AppComponent } from 'src/app/app.component';
import { createDefaultDate } from 'src/app/Constants';
import { Aufgabe } from 'src/app/models/Aufgabe';
import { Dialog } from 'src/app/models/Dialog';
import { AufgabenService } from 'src/app/service/aufgaben/aufgaben.service';
import { AgendaService } from 'src/app/service/agenda/agenda.service';
import { AgendaPunkt } from 'src/app/models/Agendapunkt';
import { PersonService } from 'src/app/service/person/person.service';
import { Mitarbeiter } from 'src/app/models/Mitarbeiter';
import { Kontakt } from 'src/app/models/Kontakt';
import { Person } from 'src/app/models/Person';

@Component({
  selector: 'app-aufgaben',
  templateUrl: './aufgaben.component.html',
  styleUrls: ['./aufgaben.component.css'],
  providers: [ConfirmationService]
})
export class AufgabenComponent implements OnInit {

  /**
   * Indikator, ob Aufgaben noch geladen werden
   */
  loadingAufgaben: boolean = false;

  /**
   * Array aller Aufgaben
   */
  aufgaben: Aufgabe[] = [];

  /**
   * Array der AgendaPunkte im Protokoll
   */
  agendaPunkte: AgendaPunkt[] = [];

  /**
   * Ausgewählte Aufgabe im Dialog
   */
  choosenAufgabe: Aufgabe = Aufgabe.buildFromEmpty();

  /**
   * Auswählbare Wichtigkeiten
   */
  severities: any[] = [
    { name: 'Normal', key: 1, class: 'green' },
    { name: 'Wichtig', key: 2, class: 'yellow' },
    { name: 'Sehr Wichtig', key: 3, class: 'red' }
  ];

  /**
   * Array aller Verantwortlichen
   */
  verantwortliche: Person[] = []

  selectedVerantwortlicher: Person = Person.buildFromEmpty();

  employee: Mitarbeiter[] = [];
  contacts: Kontakt[] = [];

  typeOptions: any[] = [
    { type: 0, name: "Mitarbeiter" },
    { type: 1, name: "Kontakte" }
  ]

  /**
   * Eingabeform des Aufgaben Dialogs
   */
  aufgabenForm = this.formBuilder.group({
    kurzbeschreibung: ["", Validators.required],
    beschreibung: [""],
    wichtigkeit: [1, Validators.required],
    vType: [0, Validators.required],
    vID: [0, Validators.required],
    expireDate: [createDefaultDate(), Validators.required],
    agendaPunkt: [0, Validators.required]
  });

  constructor(private formBuilder: FormBuilder, private agendaService: AgendaService, private aufgabenService: AufgabenService, private personService: PersonService, private confirmationService: ConfirmationService) {
    // Dialog wird gebuildet
    this.Dialog = Dialog.build(this.preDialogOpen.bind(this), this.postDialogOpen.bind(this), this.preDialogClose.bind(this), this.postDialogClose.bind(this));
  }

  async ngOnInit() {
    /*for (let idx = 1; idx < 21; idx++) {
      this.employee.push({ ID: idx, name: 'Mitarbeiter ' + idx, type: 0 });
      this.contacts.push({ ID: idx, name: 'Kontakt ' + idx, type: 1 });
    }*/

    this.personService.getMitarbeiter((res: JSON[]) => {
      for(let mitarbeiterObject of res) {
        this.employee.push(Mitarbeiter.buildFromJSON(mitarbeiterObject));
      }
    });

    this.personService.getKontakte((res: JSON[]) => {
      for(let kontaktObject of res) {
        this.contacts.push(Kontakt.buildFromJSON(kontaktObject));
      }
    });

    this.loadChoosenType();

    // Flag wird gesetzt
    this.loadingAufgaben = true;

    // Aufgaben werden geladen 
    this.aufgabenService.readAufgaben((res: JSON[]) => {
      let objectArray: any = res;
      let retVal: Aufgabe[] = [];
      for(let aufgabenObject of objectArray) {
        retVal.push(Aufgabe.buildFromObject(aufgabenObject));
      }
      this.aufgaben = retVal;
      this.loadingAufgaben = false;
    });

    // AgendaPunkte werden geladen
    this.agendaService.readAgendaPunkte((res: JSON) => {
      this.agendaPunkte = AgendaPunkt.buildFromJSONArray(res);
    });
    
  }

  loadChoosenType(event: any = null) {
    this.verantwortliche = this.aufgabenForm.get("vType")?.value == 0 ? this.employee : this.contacts;
    this.verantwortlicheDropdownChanged({value: this.choosenAufgabe.verantwortlicherID});
    this.aufgabenForm.controls['vID'].setValue(this.choosenAufgabe.verantwortlicherID);
  }
  
  verantwortlicheDropdownChanged(event: any = null) {
    if(event.value == 0) {
      this.selectedVerantwortlicher = Person.buildFromEmpty();
      return;
    }
    for(let verantwortlicher of this.verantwortliche) {
      if(event.value == verantwortlicher.ID) {
        this.selectedVerantwortlicher = verantwortlicher;
      }
    }    
  }

  saveAufgabe() {
    // Werte der Form werden in Objekt übernommen
    this.choosenAufgabe.kurzbeschreibung = "" + this.aufgabenForm.get('kurzbeschreibung')?.value;
    this.choosenAufgabe.beschreibung = "" + this.aufgabenForm.get('beschreibung')?.value;
    this.choosenAufgabe.wichtigkeit = +("" + this.aufgabenForm.get('wichtigkeit')?.value);
    this.choosenAufgabe.verantwortlicherTyp = +("" + this.aufgabenForm.get('vType')?.value);
    this.choosenAufgabe.verantwortlicherID = +("" + this.aufgabenForm.get('vID')?.value);
    this.choosenAufgabe.ablaufdatum = this.aufgabenForm.get('expireDate')?.value;
    // Überprüfung, ob neue Aufgabe
    if (this.choosenAufgabe.ID == 0) {
      this.aufgaben.push(this.choosenAufgabe);
      // Daten wird gespeichert
      this.aufgabenService.saveAufgabe(this.choosenAufgabe, (res: object) => res);
    } else {
      this.aufgabenService.updateAufgabe(this.choosenAufgabe, (res: object) => res);
    }

    

    // Daten werden zurückgesetzt
    this.choosenAufgabe = Aufgabe.buildFromEmpty();

    // Dialog wird geschlossen
    this.closeDialog();
  }

  showConfirm(event: any) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Sind Sie sicher?',
      icon: 'pi pi-exclamation-triangle',
      accept: this.deleteAufgabe.bind(this)
    });
  }

  deleteAufgabe() {
    this.aufgaben = this.aufgaben.filter(obj => obj.ID !== this.choosenAufgabe.ID);
    this.aufgabenService.deleteAufgabe(this.choosenAufgabe, (res: object) => res);
    this.closeDialog();
  }

  //#region Dialog
  Dialog: Dialog;
  preDialogOpen(): void { }
  preDialogClose(): void { }
  postDialogOpen(): void { }
  postDialogClose(): void { }

  get displayDialog(): boolean {
    return this.Dialog.displayDialog;
  }
  set displayDialog(_show: boolean) {
    _show ? this.openDialog() : this.closeDialog();
  }

  /**
   * Öffnet den Dialog
   */
  openDialog(aufgabe: any = null): void {
    if (aufgabe == null) {
      aufgabe = Aufgabe.buildFromEmpty();
    }
    this.choosenAufgabe = aufgabe;

    // Werte werden in Form gesetzt
    this.aufgabenForm.controls['kurzbeschreibung'].setValue(this.choosenAufgabe.kurzbeschreibung);
    this.aufgabenForm.controls['beschreibung'].setValue(this.choosenAufgabe.beschreibung);
    this.aufgabenForm.controls['wichtigkeit'].setValue(this.choosenAufgabe.wichtigkeit);
    this.aufgabenForm.controls['vType'].setValue(this.choosenAufgabe.verantwortlicherTyp);
    this.aufgabenForm.controls['vID'].setValue(this.choosenAufgabe.verantwortlicherID);
    this.aufgabenForm.controls['expireDate'].setValue(this.choosenAufgabe.ablaufdatum);

    // Die korrekte Verantwortlichen-List wird geladen
    this.loadChoosenType();

    // Dropdown selectedVerantwortlicher wird gesetzt
    this.verantwortlicheDropdownChanged({value: this.choosenAufgabe.verantwortlicherID});

    // Dialog wird geöffnet
    this.Dialog.openDialog();
  }
  /**
   * Schließt den Dialog
   */
  closeDialog(): void {
    // Dialog wird geschlossen
    this.Dialog.closeDialog();
  }
  //#endregion

  
}
