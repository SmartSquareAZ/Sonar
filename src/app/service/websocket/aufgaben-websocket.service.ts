import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { AppComponent } from 'src/app/app.component';
import { RequestUrlService } from '../requesturl/request-url.service';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class AufgabenWebsocketService extends WebsocketService {

  constructor(protected override requesturlservice: RequestUrlService) {
    super(requesturlservice);
   }

   public override configureWebsocket(): void {
    // Websocket wird erstellt
    this.websocket = webSocket(this.requesturlservice.WEBSOCKET_AUFGABE);


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
}
