import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { resolveAfterXSeconds } from 'src/app/Constants';
import { Person } from 'src/app/models/Person';
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
  @Input() employee: Person[] = [];
  @Input() contacts: Person[] = [];
  @Input() firmenMap: Map<string, number[]> = new Map<string, number[]>();
  @Input() contactMap: Map<number, string> = new Map<number, string>();
  @Input() editable: boolean = false;

  @Output() removeProtokollmessageEvent = new EventEmitter<Protokollmessage>();
  @Output() saveProtokollmessageEvent = new EventEmitter();

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

  /**
   * Array aller Firmen (firmenMap.keys())
   */
  firmenList: string[] = [];

  /**
   * Für die Listbox (um nachher mit firmenMap.get("") die IDs der Kontakte zu holen)
   */
  selectedFirma!: string;

  constructor(private protokollmessageService: ProtokollmessageService, private socketService: ProtokollmessageWebsocketService) { }

  ngOnInit(): void {
    this.firmenList = Array.from(this.firmenMap.keys());
    for(let firma of this.firmenList) {
      if(this.contactMap.get(this.message.vIDs[0]) != undefined && this.contactMap.get(this.message.vIDs[0]) == firma) {
        this.selectedFirma = firma;
      }
    }
  }

  /**
   * Liest die Person aus der jeweiligen Liste und gibt diese zurück
   * 
   * @param vtype Verantwortlichen Type
   * @param vID Verantwortlichen ID
   * @returns Personenobject
   */
  readPersonFromProtokollmessage(vtype: number, vID: number): Person | undefined {
    return (vtype == 3 ? this.employee : this.contacts).find(x => x.ID == vID);
  }

  saveProtokollmessage(protokollmessage: Protokollmessage) {
    //protokollmessage.ausgeblendet = !protokollmessage.ausgeblendet;
    
    if(protokollmessage.vType == 8) {
      let ids = this.firmenMap.get(this.selectedFirma);
      if(ids == undefined) {
        protokollmessage.vIDs = [];
        return;
      }
      protokollmessage.vIDs = ids;
    }
    if(protokollmessage.ID == 0) {
      this.protokollmessageService.saveProtokollmessage(protokollmessage, (retVal: JSON) => {
        let newProtokollmessage: Protokollmessage = Protokollmessage.buildFromJSON(retVal);
        // Bearbeitung wird beendet
        protokollmessage.isEditing = false;
        protokollmessage = newProtokollmessage;
        this.saveProtokollmessageEvent.emit({"index": this.messageIndex, "msg": protokollmessage});
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
    this.removeProtokollmessageEvent.emit(protokollMessage);
  }

  /**
   * Speichert den neuen Status einer bestehenden Nachricht
   */
  oldStatusChanged() {
    // Nachricht wird gespeichert
    this.saveProtokollmessage(this.message.previousProtokollmessage);
  }

  setPreviousEditingTrue() {
    this.message.previousProtokollmessage.isEditing = true;
    this.socketService.sendOperation("BLOCK", "", this.message.previousProtokollmessage.toJSONString());
  }

  getFirmaString(firma: string): string {
    let ids = this.firmenMap.get(firma);
    if(ids == undefined) return "0 Mitarbeiter";
    return `${ids.length.toString()} Mitarbeiter`;
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
