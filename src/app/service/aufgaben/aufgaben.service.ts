import { Injectable } from '@angular/core';
import { resolveAfter2Seconds } from 'src/app/Constants';
import { mock_aufgaben } from 'src/app/mockdata/Mock_Aufgaben';
import { Aufgabe } from 'src/app/models/Aufgabe';

@Injectable({
  providedIn: 'root'
})
export class AufgabenService {

  private loadedData = false;
  private aufgaben: Aufgabe[] = [];

  constructor() { }

  /**
   * Speichert die übergebene Aufgabe mittels Websocket
   * @param aufgabe Aufgabe welche gespeichert werden soll
   * @returns 
   */
  async saveAufgabe(aufgabe: Aufgabe): Promise<Aufgabe> {
    // Websocket Stuff
    const value = <Aufgabe>await resolveAfter2Seconds(20);

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
    this.readAufgaben();

    return aufgabe;
  }

  /**
   * Löscht die übergebene Aufgabe mittels Websocket
   * @param aufgabe Aufgabe welcher gelöscht werden soll
   * @returns 
   */
  async deleteAufgabe(aufgabe: Aufgabe): Promise<Aufgabe> {
    // Websocket Stuff
    const value = <Aufgabe>await resolveAfter2Seconds(20);

    this.aufgaben.slice(this.aufgaben.indexOf(aufgabe), 1);

    // Daten werden aktualisiert
    //this.readAufgaben();

    return aufgabe;
  }

  async readAufgaben(masterID: number = 0, masterType: number = 0): Promise<Aufgabe[]> {
    // API Stuff
    if(!this.loadedData){
      //const value = <Aufgabe>await this.resolveAfter2Seconds(20);
      this.aufgaben = mock_aufgaben();

      // Flag wird gesetzt
      this.loadedData = true;
    }

    return this.aufgaben;
  }

}
