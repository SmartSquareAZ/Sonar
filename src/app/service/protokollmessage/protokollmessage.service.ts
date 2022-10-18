import { Injectable } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { Protokollmessage } from 'src/app/models/Protokollmessage';
import { RequestUrlService } from '../requesturl/request-url.service';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class ProtokollmessageService {
  
  private loadedData: { [agendapunktID: number]: boolean; } = {};
  private protokollMessage: { [agendapunktID: number]: Protokollmessage[]; } = {};

  constructor(private requesturl: RequestUrlService, private utils: UtilsService) { }

  /**
   * Speichert die übergebene Protokollmessage mittels Websocket
   * @param protokollmessage Protokollmessage welche gespeichert werden soll
   * @returns 
   */
  saveProtokollmessage(protokollmessage: Protokollmessage): Protokollmessage {
    // Websocket Stuff
    /*const value = <Protokollmessage>await resolveAfterXSeconds();

    if (aufgabe.ID == 0) {
      let maxID = 0;
      this.aufgaben.forEach(element => {
        if (maxID < element.ID) {
          maxID = element.ID;
        }
      });
      aufgabe.ID = maxID + 1;
    }

    // Daten werden aktualisiert
    this.readAufgaben();*/

    return protokollmessage;
  }

  /**
   * Löscht die übergebene Protokollmessage mittels Websocket
   * @param protokollmessage Protokollmessage welche gelöscht werden soll
   * @returns 
   */
  deleteProtokollmessage(protokollmessage: Protokollmessage): Protokollmessage {
    // Websocket Stuff
    /*const value = <Protokollmessage>await resolveAfterXSeconds();

    this.aufgaben.slice(this.aufgaben.indexOf(aufgabe), 1);

    // Daten werden aktualisiert
    //this.readAufgaben();*/

    return protokollmessage;
  }

  /*async readProtokollmessages(agendapunktID: number = 0): Promise<Protokollmessage[]> {
    // API Stuff
    if (!this.loadedData[agendapunktID]) {
      const value = <Protokollmessage>await resolveAfterXSeconds();
      this.protokollMessage[agendapunktID] = mock_protokollmessage(agendapunktID);

      // Flag wird gesetzt
      this.loadedData[agendapunktID] = true;
    }

    return this.protokollMessage[agendapunktID];
  }*/

  readProtokollmessagesFromAgendaPunkt(agendapunktID: number, success: Function, error: Function = new Function()) {
    // Request wird ausgeführt
    this.utils.GET(this.requesturl.MESSAGE_READAGENDAPUNKT + "?ID=" + agendapunktID, success, error);
  }

  readProtokollmessagesOld(oldID: number, success: Function, error: Function = new Function()) {
    // Request wird ausgeführt
    this.utils.GET(this.requesturl.MESSAGE_READOLD + "?ID=" + oldID, success, error);
  }

  readProtokollmessage(ID: number, success: Function, error: Function = new Function()) {
    // Request wird ausgeführt
    this.utils.GET(this.requesturl.MESSAGE_READ + "?ID=" + ID, success, error);
  }
}
