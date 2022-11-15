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
  saveAgendaPunkt(agendaPunkt: AgendaPunkt, success: Function): void {
    this.utils.POST(this.requesturl.AGENDAPUNKT_CREATE, agendaPunkt.toJSONString(), success);
  }

  updateAgendaPunkt(agendaPunkt: AgendaPunkt, success: Function): void {
    this.utils.POST(this.requesturl.AGENDAPUNKT_UPDATE, agendaPunkt.toJSONString(), success);
  }

  /**
   * Löscht den übergebenen AgendaPunkt mittels Websocket
   * @param agendaPunkt AgendaPunkt welcher gelöscht werden soll
   * @returns 
   */
  deleteAgendaPunkt(agendaPunkt: AgendaPunkt, success: Function, error: Function): void {
    this.utils.POST(this.requesturl.AGENDAPUNKT_DELETE, agendaPunkt.toJSONString(), success, error);
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

  /*readCountMessages(agendaPunkt: AgendaPunkt, success: Function) {
    this.utils.GET(this.requesturl.AGENDAPUNKT_READAGENDAMESSAGESCOUNT + "?ID=" + agendaPunkt.ID, success);
  }*/
}
