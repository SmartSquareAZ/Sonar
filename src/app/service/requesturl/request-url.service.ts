import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RequestUrlService {

  /**
     * -1 = localhost
     * 0 = test.smartsquare.at
     * 1 = rhi-scan.rubnergroup.local
     */
   public readonly STATE: number = -1;

   //#region Protokollmessage
   public MESSAGE_CREATE: string = "";
   public MESSAGE_UPDATE: string = "";
   public MESSAGE_DELETE: string = "";
   public MESSAGE_READ: string = "";
   public MESSAGE_READOLD: string = "";
   public MESSAGE_READAGENDAPUNKT: string = "";
   public MESSAGE_SOCKET: string = "";
   //#endregion

   //#region Agendapunkt
   public AGENDAPUNKT_CREATE: string = "";
   public AGENDAPUNKT_UPDATE: string = "";
   public AGENDAPUNKT_DELETE: string = "";
   public AGENDAPUNKT_READAGENDAPUNKT: string = "";
   public AGENDAPUNKT_READAGENDAPUNKTPARENTS: string = "";
   public AGENDAPUNKT_READAGENDAPUNKTSLAVES: string = "";
   public AGENDAPUNKT_SOCKET: string = "";
   //#endregion

   constructor() {
       // http://localhost:8075
       let websocketProtocol = this.STATE == -1 ? "ws" : "wss";
       let httpProtocol = this.STATE == -1 ? "http" : "https";
       let domain = this.STATE == -1 ? "localhost:8075" : this.STATE == 0 ? "test.smartsquare.at" : "sonar.smartsquare.at";

       // ServerPath wird gesetzt
       let serverPath = this.STATE == 0 || this.STATE == 1 ? "/SONAR" : "";

       // Domain URLs werden zusammengesetzt
       let websocketurl = websocketProtocol + "://" + domain + serverPath + "/SOCKET";
       let url = httpProtocol + "://" + domain + serverPath;

       let createPath = "/CREATE";
       let updatePath = "/UPDATE";
       let deletePath = "/DELETE";

       //#region Protokollmessage
       this.MESSAGE_CREATE = url + "/MESSAGE" + createPath;
       this.MESSAGE_UPDATE = url + "/MESSAGE" + updatePath;
       this.MESSAGE_DELETE = url + "/MESSAGE" + deletePath;
       this.MESSAGE_READ = url + "/MESSAGE/READ";
       this.MESSAGE_READOLD = url + "/MESSAGE/READ/OLD";
       this.MESSAGE_READAGENDAPUNKT = url + "/MESSAGE/READ/AGENDAPUNKT";
       this.MESSAGE_SOCKET = websocketurl + "/MESSAGE"
       //#endregion

       //#region Agendapunkt
       this.AGENDAPUNKT_CREATE = url + "/AGENDAPUNKT" + createPath;
       this.AGENDAPUNKT_UPDATE = url + "/AGENDAPUNKT" + updatePath;
       this.AGENDAPUNKT_DELETE = url + "/AGENDAPUNKT" + deletePath;
       this.AGENDAPUNKT_READAGENDAPUNKT = url + "/AGENDAPUNKT/READ";
       this.AGENDAPUNKT_READAGENDAPUNKTPARENTS = url + "/AGENDAPUNKT/READ/PARENTS";
       this.AGENDAPUNKT_READAGENDAPUNKTSLAVES = url + "/AGENDAPUNKT/READ/SLAVES";
       this.AGENDAPUNKT_SOCKET = websocketurl + "/AGENDAPUNKT"
       //#endregion
   }
}
