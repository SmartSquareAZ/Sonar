import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { resolveAfterXSeconds } from 'src/app/Constants';
import { Protokollmessage } from 'src/app/models/Protokollmessage';
import { ProtokollmessageService } from 'src/app/service/protokollmessage/protokollmessage.service';
import { ProtokollmessageWebsocketService } from 'src/app/service/websocket/protokollmessage-websocket.service';

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

  @Output() removeProtokollmessageEvent = new EventEmitter<Protokollmessage>();

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

  constructor(private protokollmessageService: ProtokollmessageService, private socketService: ProtokollmessageWebsocketService) { }

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
    if(protokollmessage.ID == 0) {
      this.protokollmessageService.saveProtokollmessage(protokollmessage, (retVal: JSON) => {
        let newProtokollmessage: Protokollmessage = Protokollmessage.buildFromJSON(retVal);
        // Bearbeitung wird beendet
        protokollmessage.isEditing = false;
        protokollmessage = newProtokollmessage;
        this.socketService.sendOperation("CREATE", "", protokollmessage.toJSONString());
        this.socketService.sendOperation("UNBLOCK", "", protokollmessage.toJSONString());
      });
    } else {
      this.protokollmessageService.updateProtokollmessage(protokollmessage, (retVal: JSON) => {
        let updatedProtokollmessage: Protokollmessage = Protokollmessage.buildFromJSON(retVal);
        protokollmessage.isEditing = false;
        protokollmessage = updatedProtokollmessage;
        this.socketService.sendOperation("UPDATE", "", protokollmessage.toJSONString());
        this.socketService.sendOperation("UNBLOCK", "", protokollmessage.toJSONString());
      })
    }
  }

  removeProtokollmessage(protokollMessage: Protokollmessage) {
    protokollMessage.isEditing = false;
    this.socketService.sendOperation("UNBLOCK", "", protokollMessage.toJSONString());
    if(protokollMessage.ID == 0) {
      this.removeProtokollmessageEvent.emit(protokollMessage);
    }
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
