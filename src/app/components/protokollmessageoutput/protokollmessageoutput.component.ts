import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { Protokollmessage } from 'src/app/models/Protokollmessage';
import { AgendaService } from 'src/app/service/agenda/agenda.service';
import { ProtokollmessageWebsocketService } from 'src/app/service/websocket/protokollmessage-websocket.service';

@Component({
  selector: 'app-protokollmessageoutput',
  templateUrl: './protokollmessageoutput.component.html',
  styleUrls: ['./protokollmessageoutput.component.css']
})
export class ProtokollmessageoutputComponent implements OnInit {

  @Input() message: any;
  @Input() messageIndex: number = 0;
  @Input() employee: any[] = [];
  @Input() contacts: any[] = [];
  @Input() editable: boolean = false;
  @Input() contactMap: Map<number, string> = new Map<number, string>();

  @Output() saveEvent: EventEmitter<Protokollmessage> = new EventEmitter<Protokollmessage>();

  constructor(private socketService: ProtokollmessageWebsocketService, private agendaService: AgendaService) { }

  ngOnInit(): void {
  }

  saveProtokollmessage(protokollmessage: Protokollmessage) {
    this.saveEvent.emit(protokollmessage);
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

  checkAndSetEditing() {
    this.message.isEditing = this.editable ? true : false;
    this.message.title = this.message.title == "Kein Titel" ? "" : this.message.title;
    this.socketService.sendOperation("BLOCK", "", this.message.toJSONString());
  }

  getTypeTooltip(): string {

    
    if(this.message.vType == 8) {
      let firma = this.contactMap.get(this.message.vIDs[0]);

      if(firma == undefined || firma == "") return AppComponent.FIRMA;
      return firma;
    }
    return "";
  }

  getAusblendenTooltipFromMessage(message: Protokollmessage): string {
    return message.ausgeblendet ? "Ausblenden" : "Einblenden"
  }

  getAgendapunktNummer(message: Protokollmessage): string {
    let retVal = this.agendaService.agendaPunkteMap.get(message.agendapunktID)?.nummer;
    if(retVal == undefined) return "";
    return retVal;
  }

  isPreviousMessage() {
    return this.message.protokollNummer != AppComponent.PROTOKOLLNUMMER;
  }
}
