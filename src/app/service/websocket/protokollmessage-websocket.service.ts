import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { webSocket } from 'rxjs/webSocket';
import { AppComponent } from 'src/app/app.component';
import { RequestUrlService } from '../requesturl/request-url.service';
import { WebsocketService, Message } from './websocket.service';

export interface MessageRequestCallback {
  [agendapunktID: number]: Function
}

@Injectable({
  providedIn: 'root'
})
export class ProtokollmessageWebsocketService extends WebsocketService {

  public messagesRequestCallbacks: MessageRequestCallback = {};

  constructor(protected override requesturlservice: RequestUrlService, private router: Router) {
    super(requesturlservice);
   }

   public override configureWebsocket(): void {
    // Websocket wird erstellt
    this.websocket = webSocket(this.requesturlservice.WEBSOCKET_PROTOKOLLMESSAGE);


    // Nachrichten werden verarbeitet
    this.websocket.subscribe((msg) => {
      // Message wird gespeichert
      this.received.push(msg);

      // Message wird ausgewertet
      this.validateMessage(JSON.stringify(msg));
    },
      (err) => {
        console.error("WEBSOCKET SERVICE:")
        console.warn(err);
        // Websocket wird konfiguriert
        this.configureWebsocket();
      },
      () => {
        console.warn("Websocket wurde geschlossen");
        // Websocket wird konfiguriert
        this.configureWebsocket();
      });
  }

  protected override requestMessage(jsonString: string): void {
    // JSON wird geparst
    let json = JSON.parse(jsonString);

    // Befehl wird glesen
    let operation = json['OP'];

    // Response wird zusammengesetzt
    let response: Message = {
      OP: json['OP'],
      TYPE: "2",
      DDEV: json['SDEV'],
      SDEV: this.devicename,
      PID: AppComponent.PROTOKOLLID,
      DATA: JSON.stringify(AppComponent.USER_DATA)
    }

    if(operation == "DONE") {
      this.router.navigate(["done"]);
      return;
    }

    // Callback wird ausgeführt
    if(operation == "CREATE" || operation == "UPDATE" || operation == "BLOCK" || (operation == "UNBLOCK" && JSON.parse(json['DATA'])['AGENDAPUNKTID'] != 0)) {
      this.messagesRequestCallbacks[JSON.parse(json['DATA'])['AGENDAPUNKTID']](operation, json['SDEV'], json['DDEV'], AppComponent.PROTOKOLLID, json['DATA']);
    }
    
    // Überprüfung, ob Response gesendet werden soll
    if (operation == "REGISTER" || operation == "ONLINE") {
      // Message wird gesendet
      this.sendMessage(response);
    }
  }
}