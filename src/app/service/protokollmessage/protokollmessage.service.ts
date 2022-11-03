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
   */
  saveProtokollmessage(protokollmessage: Protokollmessage, success: Function): void {
    this.utils.POST(this.requesturl.MESSAGE_CREATE, protokollmessage.toJSONString(), success);
  }

  /**
   * Updated die Protokollmessage auf der API
   * @param protokollMessage Protokollmessage die geupdated werden soll
   * @param success Methode die bei erfolgreicher Ausführung als Callback ausgeführt werden soll
   */
  updateProtokollmessage(protokollMessage: Protokollmessage, success: Function): void {
    this.utils.POST(this.requesturl.MESSAGE_UPDATE, protokollMessage.toJSONString(), success);
  }

  /*
  /**
   * Löscht die übergebene Protokollmessage mittels Websocket
   * @param protokollmessage Protokollmessage welche gelöscht werden soll
   * @returns 
   *
  deleteProtokollmessage(protokollmessage: Protokollmessage, success: Function): void {
    this.utils.POST(this.requesturl.MESSAGE_DELETE, protokollmessage.toJSONString(), success);
  }*/

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
