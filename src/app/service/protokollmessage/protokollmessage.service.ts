import { Injectable } from '@angular/core';
import { resolveAfter2Seconds } from 'src/app/Constants';
import { mock_protokollmessage } from 'src/app/mockdata/Mock_Protokollmessage';
import { Protokollmessage } from 'src/app/models/Protokollmessage';

@Injectable({
  providedIn: 'root'
})
export class ProtokollmessageService {
  
  private loadedData: { [agendapunktID: number]: boolean; } = {};
  private protokollMessage: { [agendapunktID: number]: Protokollmessage[]; } = {};

  constructor() { }

  /**
   * Speichert die übergebene Protokollmessage mittels Websocket
   * @param protokollmessage Protokollmessage welche gespeichert werden soll
   * @returns 
   */
  async saveProtokollmessage(protokollmessage: Protokollmessage): Promise<Protokollmessage> {
    // Websocket Stuff
    /*const value = <Protokollmessage>await resolveAfter2Seconds(20);

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
  async deleteProtokollmessage(protokollmessage: Protokollmessage): Promise<Protokollmessage> {
    // Websocket Stuff
    /*const value = <Protokollmessage>await resolveAfter2Seconds(20);

    this.aufgaben.slice(this.aufgaben.indexOf(aufgabe), 1);

    // Daten werden aktualisiert
    //this.readAufgaben();*/

    return protokollmessage;
  }

  async readProtokollmessages(agendapunktID: number = 0): Promise<Protokollmessage[]> {
    // API Stuff
    if (!this.loadedData[agendapunktID]) {
      const value = <Protokollmessage>await resolveAfter2Seconds(10);
      this.protokollMessage[agendapunktID] = mock_protokollmessage(agendapunktID);

      // Flag wird gesetzt
      this.loadedData[agendapunktID] = true;
    }

    return this.protokollMessage[agendapunktID];
  }
}
