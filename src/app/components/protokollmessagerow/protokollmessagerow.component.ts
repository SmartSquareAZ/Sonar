import { Component, Input, OnInit } from '@angular/core';
import { resolveAfterXSeconds } from 'src/app/Constants';
import { Protokollmessage } from 'src/app/models/Protokollmessage';
import { ProtokollmessageService } from 'src/app/service/protokollmessage/protokollmessage.service';

@Component({
  selector: 'app-protokollmessagerow',
  templateUrl: './protokollmessagerow.component.html',
  styleUrls: ['./protokollmessagerow.component.css']
})
export class ProtokollmessagerowComponent implements OnInit {

  @Input() message: any;
  @Input() messageIndex: number = 0;
  @Input() employee: any[] = [];
  @Input() contacts: any[] = [];
  @Input() editable: boolean = false;

  /**
   * Array aller Verantwortlichen Typen
   */
  verantwortlichenTypen = Protokollmessage.vTypeText;

  /**
   * Gibt an, ob die bestehenden vorhergehenden Protokollnachrichten aufgeklappt sind
   */
  expanded: boolean = false;
  /**
   * Gibt an, ob die bestehenden vorhergehenden Protokollnachrichten geladen werden
   */
  loadingOld: boolean = false;

  /**
   * Array aller bestehenden vorhergehenden Protokollnachrichten
   */
  oldProtokollmessages: Protokollmessage[] = [];

  constructor(private protokollmessageService: ProtokollmessageService) { }

  ngOnInit(): void {
  }

  /**
   * Liest die Person aus der jeweiligen Liste und gibt diese zurück
   * 
   * @param vtype Verantwortlichen Type
   * @param vID Verantwortlichen ID
   * @returns Personenobject
   */
  readPersonFromProtokollmessage(vtype: number, vID: number) {
    return (vtype == 3 ? this.employee : this.contacts).find(x => x.ID == vID);
  }

  saveProtokollmessage(protokollmessage: Protokollmessage) {

    // Bearbeitung wird beendet
    protokollmessage.isEditing = false;
  }

  /**
   * Speichert den neuen Status einer bestehenden Nachricht
   */
  oldStatusChanged() {
    // Nachricht wird gespeichert
    this.saveProtokollmessage(this.message.previousProtokollmessage);
  }

  /**
   * Klappt die alten Protokollnachrichten auf oder ein
   */
  async expandProtokollmessage() {
    // Status wird geändert
    this.expanded = !this.expanded

    // Überprüfung, ob ausgeklappt
    if (this.expanded) {
      // Flag wird gesetzt
      this.loadingOld = true;

      // Protokollmessages werden geladen
      this.protokollmessageService.readProtokollmessagesOld(this.message.previousProtokollmessage.ID, (data: JSON) => {
        // Protokollmessages werden konvertiert
        this.oldProtokollmessages = Protokollmessage.buildFromJSONArray(data);

        // Flag wird gesetzt
        this.loadingOld = false;
      });
    }
  }
}