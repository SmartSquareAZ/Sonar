import { Injectable } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { Aufgabe } from 'src/app/models/Aufgabe';
import { RequestUrlService } from '../requesturl/request-url.service';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class AufgabenService {

  constructor(private utilsService: UtilsService, private requestURL: RequestUrlService) { }

  /**
   * Speichert die übergebene Aufgabe mittels Websocket
   * @param aufgabe Aufgabe welche gespeichert werden soll
   * @returns 
   */
  saveAufgabe(aufgabe: Aufgabe, success: Function): void {
    aufgabe.type = 3;
    this.utilsService.POST(this.requestURL.AUFGABE_CREATE, aufgabe.toJSONString(), success);
    // Websocket Stuff
  }

  updateAufgabe(aufgabe: Aufgabe, success: Function): void {
    this.utilsService.POST(this.requestURL.AUFGABE_UPDATE, aufgabe.toJSONString(), success);
  }

  /**
   * Löscht die übergebene Aufgabe mittels Websocket
   * @param aufgabe Aufgabe welcher gelöscht werden soll
   * @returns 
   */
  deleteAufgabe(aufgabe: Aufgabe, success: Function): void{
    // Websocket Stuff
    this.utilsService.POST(this.requestURL.AUFGABE_DELETE, aufgabe.toJSONString(), success);
  }

  readAufgaben(success: Function): void {
    // API Stuff
    this.utilsService.GET(`${this.requestURL.AUFGABE_READ}?PROJEKTID=${AppComponent.PROJEKTID}&AGENDAID=${AppComponent.AGENDAID}`, success);
  }
}
