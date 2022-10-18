import { Injectable } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { resolveAfterXSeconds } from 'src/app/Constants';
import { AgendaPunkt } from '../../models/Agendapunkt';
import { RequestUrlService } from '../requesturl/request-url.service';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  constructor(private requesturl: RequestUrlService, private utils: UtilsService) { }

  /**
   * Speichert den übergebenen AgendaPunkt mittels Websocket
   * @param agendaPunkt AgendaPunkt welcher gespeichert werden soll
   * @returns 
   */
  saveAgendaPunkt(agendaPunkt: AgendaPunkt): AgendaPunkt {
    // Websocket Stuff
    //const value = <AgendaPunkt>await resolveAfterXSeconds();

    // Daten werden aktualisiert
    //this.readAgendaPunkte(this.root.agendaID);

    return agendaPunkt;
  }

  /**
   * Löscht den übergebenen AgendaPunkt mittels Websocket
   * @param agendaPunkt AgendaPunkt welcher gelöscht werden soll
   * @returns 
   */
  deleteAgendaPunkt(agendaPunkt: AgendaPunkt): AgendaPunkt {
    // Websocket Stuff
    //const value = <AgendaPunkt>await resolveAfterXSeconds();

    return agendaPunkt;
  }

  readAgendaPunkte(success: Function, error: Function = new Function()) {
    // Request wird ausgeführt
    this.utils.GET(this.requesturl.AGENDAPUNKT_READAGENDAPUNKT + "?PROTOKOLLID=" + AppComponent.PROTOKOLLID, success, error);
  }

  readAgendaPunkteParents(success: Function, error: Function = new Function()) {
    // Request wird ausgeführt
    this.utils.GET(this.requesturl.AGENDAPUNKT_READAGENDAPUNKTPARENTS + "?PROTOKOLLID=" + AppComponent.PROTOKOLLID, success, error);
  }

  readAgenaPunkteSlaves(parent: AgendaPunkt, success: Function, error: Function = new Function()) {
    // Request wird ausgeführt
    this.utils.GET(this.requesturl.AGENDAPUNKT_READAGENDAPUNKTSLAVES + "?PARENTID=" + parent.ID, success, error);
  }
}
