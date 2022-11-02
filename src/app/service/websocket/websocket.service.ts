import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { AppComponent } from 'src/app/app.component';
import { RequestUrlService } from '../requesturl/request-url.service';

export interface Message {
  OP: string,
  TYPE: string,
  DDEV: string,
  SDEV: string,
  PID: number,
  DATA: string
}

@Injectable({
  providedIn: 'root'
})
export abstract class WebsocketService {
  /**
   * Credit to:
   * https://blog.angulartraining.com/how-to-use-websockets-with-rxjs-and-angular-b98e7fd8be82
   */
   protected websocket: WebSocketSubject<Message> = new WebSocketSubject("");

  //private socket$: WebSocket;
  //public received: string[] = [];
  //public sent: string[] = [];
  public received: Message[] = [];
  public sent: Message[] = [];

  protected devicename: string = "WEB_" + new Date().getTime();

  public requestCallback: Function;
  public responseCallback: Function;

  constructor(protected requesturlservice: RequestUrlService) {
    this.requestCallback = () => { };
    this.responseCallback = () => { };

    /*this.socket$ = new WebSocket(requesturlservice.WEBSOCKETURL);
    // Verbindung wird automatisch wieder hergestellt
    this.socket$.onclose = ((ev: CloseEvent) => { this.socket$ = new WebSocket(requesturlservice.WEBSOCKETURL); }).bind(this);
    // Nachricht wird verarbeitet
    this.socket$.onmessage = (ev: MessageEvent) => {
      // Nachricht wird ausgewertet
      this.validateMessage(ev.data);
      // Nachricht wird gespeichert
      this.received.push(ev.data);
    };*/

    // Websocket wird konfiguriert
    this.configureWebsocket();
  }

  public abstract configureWebsocket(): void;

  public completeWebsocket() {
    // Websocket wird geschlossen
    this.websocket.complete();
  }

  public sendOperation(operation: string, destinationDevice: string = "", data: string = ""): void {
    // Response wird zusammengesetzt
    let request = {
      OP: operation,
      TYPE: "1",
      DDEV: destinationDevice,
      SDEV: this.devicename,
      PID: AppComponent.PROTOKOLLID,
      DATA: data
    }

    // Nachricht wird versendet
    this.sendMessage(request);
  }

  protected validateMessage(jsonString: string): void {
    // JSON wird geparst
    let json = JSON.parse(jsonString);

    // Überprüfung, ob 1 = Request oder 2 = Response
    if (json['TYPE'] === "1") {
      // Request wird verarbeitet
      this.requestMessage(jsonString);
    } else {
      // Callback wird ausgeführt
      this.responseCallback(json['OP'], json['SDEV'], json['DDEV'], AppComponent.PROTOKOLLID, json['DATA']);
    }
  }

  protected requestMessage(jsonString: string): void {
    
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

    // Callback wird ausgeführt
    this.requestCallback(operation, json['SDEV'], json['DDEV'], AppComponent.PROTOKOLLID, json['DATA']);

    // Überprüfung, ob Response gesendet werden soll
    if (operation == "REGISTER" || operation == "ONLINE") {
      // Message wird gesendet
      this.sendMessage(response);
    }
  }

  protected sendMessage(message: Message) {
    // Message wird gespeichert
    this.sent.push(message);

    // Message wird gesendet
    this.websocket.next(message);
  }
}