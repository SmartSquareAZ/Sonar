import { Component, Input, OnInit, AfterContentInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { AgendaPunkt } from 'src/app/models/Agendapunkt';
import { Protokollmessage } from 'src/app/models/Protokollmessage';
import { ProtokollmessageService } from 'src/app/service/protokollmessage/protokollmessage.service';
import { ProtokollmessageWebsocketService } from 'src/app/service/websocket/protokollmessage-websocket.service';

@Component({
  selector: 'app-agendapunktpanel',
  templateUrl: './agendapunktpanel.component.html',
  styleUrls: ['./agendapunktpanel.component.css']
})
export class AgendapunktpanelComponent implements OnInit {

  verantwortlichenTypen = Protokollmessage.vTypeText;

  protokollMessageLoading: boolean = true;
  protokollMessage: Protokollmessage[] = [];

  requestCallback: Function = (operation: any, sourceDevice: any, destinationDevice: any, pid: any, data: any) => {
    if(operation != "ONLINE" && operation != "REGISTER") {
      data = JSON.parse(data);
    }
    // Überprüfung, auf den richtigen Befehl
    if (operation == "CREATE") {
      this.protokollMessage.push(Protokollmessage.buildFromJSON(data));
    }
    if (operation == "UPDATE") {
      let idx: number = this.protokollMessage.findIndex((msg => msg.ID == data["ID"]));
      let updatedProtokollMessage: Protokollmessage = Protokollmessage.buildFromJSON(data);

      if(idx != -1) {
        this.protokollMessage[idx] = updatedProtokollMessage;
      } else {
        for(let protokollMessage of this.protokollMessage) {
          if(protokollMessage.previousProtokollmessage.ID == data["ID"]) {
            protokollMessage.previousProtokollmessage = updatedProtokollMessage;
          }
        }
      }   
    }

    if(operation == "BLOCK") {
      this.agendapunkt.blockedMessageEditing = true;
    }

    if(operation == "UNBLOCK") {
      this.agendapunkt.blockedMessageEditing = false;
    }
  };

  @Input() headerStyle: string = '';
  @Input() agendapunkt: any;
  @Input() employee: any[] = [];
  @Input() contacts: any[] = [];

  constructor(private protokollmessageService: ProtokollmessageService, private socketService: ProtokollmessageWebsocketService) { }

  ngOnInit(): void {
    // Styleing wird gesetzt
    this.headerStyle = "font-weight: bold; color: var(--primary-color);"

    this.socketService.messagesRequestCallbacks[this.agendapunkt.ID] = this.requestCallback;
  }

  async loadDataLazy(event: LazyLoadEvent, agendapunkt: AgendaPunkt) {
    // Flag wird gesetzt
    this.protokollMessageLoading = true;

    // Messages werden geladen
    this.protokollmessageService.readProtokollmessagesFromAgendaPunkt(agendapunkt.ID, (data: JSON) => {
      // Protokollmessages werden geladen
      this.protokollMessage = Protokollmessage.buildFromJSONArray(data);

      for(let i = 0; i < this.protokollMessage.length; i++) {

        // Die vorherige Protokollmessage wird geladen
        if(this.protokollMessage[i].previousProtokollmessage.ID != 0 && this.protokollMessage[i].previousProtokollmessage.nummer == 0) {
          this.protokollmessageService.readProtokollmessage(this.protokollMessage[i].previousProtokollmessage.ID, (res: JSON) => {
            this.protokollMessage[i].previousProtokollmessage = Protokollmessage.buildFromJSON(res);

            // Für die vorherige Protokollmessage im Agendapunktpanel wird auch eine Callback Funktion hinzugefügt
            if(this.protokollMessage[i].previousProtokollmessage.agendapunktID != this.agendapunkt) {
              this.socketService.messagesRequestCallbacks[this.protokollMessage[i].previousProtokollmessage.agendapunktID] = this.requestCallback;
            };
          });
        }
      }

      // Flag wird gesetzt
      this.protokollMessageLoading = false;
    });
  }

  addNewProtokollmessage(agendapunkt: AgendaPunkt) {
    let lastNummer = 1;

    if (this.protokollMessage.length > 0) {
      let sortedArray = this.protokollMessage.sort((n1, n2) => n1.nummer - n2.nummer);
      lastNummer = sortedArray[sortedArray.length - 1].nummer + 1;
    }

    // Neue Protokollmessage wird Array hinzugefügt
    this.protokollMessage.push(Protokollmessage.buildNew(agendapunkt.ID, lastNummer));
  }

  removeProtokollmessage(protokollMessage: Protokollmessage) {
    this.protokollMessage = this.protokollMessage.filter(msg => msg.ID != protokollMessage.ID);
  }

  updateSavedProtokollmessage(event: any) {
    this.protokollMessage[event["index"]] = event["msg"];
  }

}
