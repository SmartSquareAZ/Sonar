import { Component, Input, OnInit } from '@angular/core';
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

  @Input() headerStyle: string = '';
  @Input() agendapunkt: any;
  @Input() employee: any[] = [];
  @Input() contacts: any[] = [];

  constructor(private protokollmessageService: ProtokollmessageService, private socketService: ProtokollmessageWebsocketService) { }

  ngOnInit(): void {
    // Styleing wird gesetzt
    this.headerStyle = "font-weight: bold; color: var(--primary-color);"

    
    /*
    this.socketService.requestCallback = (operation: any, sourceDevice: any, destinationDevice: any, pid: any, data: any) => {
      if(operation != "ONLINE" && operation != "REGISTER") {
        data = JSON.parse(data);
      }
      // Überprüfung, auf den richtigen Befehl
      if (operation == "CREATE") {
        this.protokollMessage.push(Protokollmessage.buildFromJSON(data));
      }
      if (operation == "UPDATE") {
        this.protokollMessage[this.protokollMessage.findIndex((msg => msg.ID == data["ID"]))] = Protokollmessage.buildFromJSON(data);
      }
    }
    */
    this.socketService.messagesRequestCallbacks[this.agendapunkt.ID] = (operation: any, sourceDevice: any, destinationDevice: any, pid: any, data: any) => {
        if(operation != "ONLINE" && operation != "REGISTER") {
          data = JSON.parse(data);
        }
        // Überprüfung, auf den richtigen Befehl
        if (operation == "CREATE") {
          this.protokollMessage.push(Protokollmessage.buildFromJSON(data));
        }
        if (operation == "UPDATE") {
          this.protokollMessage[this.protokollMessage.findIndex((msg => msg.ID == data["ID"]))] = Protokollmessage.buildFromJSON(data);
        }
      }
  }

  async loadDataLazy(event: LazyLoadEvent, agendapunkt: AgendaPunkt) {
    // Flag wird gesetzt
    this.protokollMessageLoading = true;

    // Messages werden geladen
    this.protokollmessageService.readProtokollmessagesFromAgendaPunkt(agendapunkt.ID, (data: JSON) => {
      // Protokollmessages werden geladen
      this.protokollMessage = Protokollmessage.buildFromJSONArray(data);

      for(let i = 0; i < this.protokollMessage.length; i++) {
        if(this.protokollMessage[i].previousProtokollmessage.ID != 0 && this.protokollMessage[i].previousProtokollmessage.nummer == 0) {
          this.protokollmessageService.readProtokollmessage(this.protokollMessage[i].previousProtokollmessage.ID, (res: JSON) => {
            this.protokollMessage[i].previousProtokollmessage = Protokollmessage.buildFromJSON(res);
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

}
