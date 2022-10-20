import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { resolveAfterXSeconds } from 'src/app/Constants';
import { mock_aufgaben } from 'src/app/mockdata/Mock_Aufgaben';
import { Aufgabe } from 'src/app/models/Aufgabe';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class AufgabenService {

  private loadedData = false;
  private aufgaben: Aufgabe[] = [];

  constructor(private httpClient: HttpClient, private utilsService: UtilsService) { }

  /**
   * Speichert die übergebene Aufgabe mittels Websocket
   * @param aufgabe Aufgabe welche gespeichert werden soll
   * @returns 
   */
  saveAufgabe(aufgabe: Aufgabe, success: Function): void {
    aufgabe.type = 3;
    this.utilsService.POST(`http://localhost:8075/AUFGABE/CREATE`, aufgabe.toJSONString(), success);
    // Websocket Stuff
    /*const value = <Aufgabe>await resolveAfterXSeconds();

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
    //this.readAufgaben();*/

    //return aufgabe;
  }

  updateAufgabe(aufgabe: Aufgabe, success: Function): void {
    this.utilsService.POST(`http://localhost:8075/AUFGABE/UPDATE`, aufgabe.toJSONString(), success);
  }

  /**
   * Löscht die übergebene Aufgabe mittels Websocket
   * @param aufgabe Aufgabe welcher gelöscht werden soll
   * @returns 
   */
  deleteAufgabe(aufgabe: Aufgabe, success: Function): void{
    // Websocket Stuff
    /*const value = <Aufgabe>await resolveAfterXSeconds();

    this.aufgaben.slice(this.aufgaben.indexOf(aufgabe), 1);

    // Daten werden aktualisiert
    //this.readAufgaben();

    return aufgabe;*/
    this.utilsService.POST(`http://localhost:8075/AUFGABE/DELETE`, aufgabe.toJSONString(), success);
  }

  readAufgaben(success: Function): void {
    // API Stuff
    this.utilsService.GET(`http://localhost:8075/AUFGABE/READ?PROJEKTID=${AppComponent.PROJEKTID}&AGENDAID=${AppComponent.AGENDAID}`, success);

    /*if(!this.loadedData){
      const value = <Aufgabe>await resolveAfterXSeconds();
      this.aufgaben = mock_aufgaben();

      // Flag wird gesetzt
      this.loadedData = true;
    }

    return this.aufgaben;*/
  }
}
