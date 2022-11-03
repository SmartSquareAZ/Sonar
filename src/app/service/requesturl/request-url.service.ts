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

  //#region Aufgabe
  public AUFGABE_CREATE: string = "";
  public AUFGABE_UPDATE: string = "";
  public AUFGABE_DELETE: string = "";
  public AUFGABE_READ: string = "";
  //#endregion

  //#region Anhang
  public ANHANG_CREATE: string = "";
  public ANHANG_UPDATE: string = "";
  public ANHANG_DELETE: string = "";
  public ANHANG_READ: string = "";
  //#endregion

  //#region Anhangkategorie
  public ANHANGKATEGORIE_CREATE: string = "";
  public ANHANGKATEGORIE_UPDATE: string = "";
  public ANHANGKATEGORIE_DELETE: string = "";
  public ANHANGKATEGORIE_READ: string = "";
  //#endregion

  //#region Websockets
  public WEBSOCKET_AGENDAPUNKT: string = "";
  public WEBSOCKET_AUFGABE: string = "";
  public WEBSOCKET_ANHANG: string = "";
  public WEBSOCKET_ANHANGKATEGORIE: string = "";
  public WEBSOCKET_ANWESENDE: string = "";
  public WEBSOCKET_PROTOKOLLMESSAGE: string = "";
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

      //#region Aufgabe
      this.AUFGABE_CREATE = url + "/AUFGABE" + createPath;
      this.AUFGABE_UPDATE = url + "/AUFGABE" + updatePath;
      this.AUFGABE_DELETE = url + "/AUFGABE" + deletePath;
      this.AUFGABE_READ = url + "/AUFGABE/READ";
      //#endregion

      //#region Anhang
      this.ANHANG_CREATE = url + "/ANHANG" + createPath;
      this.ANHANG_UPDATE = url + "/ANHANG" + updatePath;
      this.ANHANG_DELETE = url + "/ANHANG" + deletePath;
      this.ANHANG_READ = url + "/ANHANG/READ";
      //#endregion

      //#region Anhangkategorie
      this.ANHANGKATEGORIE_CREATE = url + "/ANHANGKATEGORIE" + createPath;
      this.ANHANGKATEGORIE_UPDATE = url + "/ANHANGKATEGORIE" + updatePath;
      this.ANHANGKATEGORIE_DELETE = url + "/ANHANGKATEGORIE" + deletePath;
      this.ANHANGKATEGORIE_READ = url + "/ANHANGKATEGORIE/READ";
      //#endregion

      //#region Websockets
      this.WEBSOCKET_AGENDAPUNKT = websocketurl + "/AGENDAPUNKT";
      this.WEBSOCKET_AUFGABE = websocketurl + "/AUFGABE";
      this.WEBSOCKET_ANHANG = websocketurl + "/ANHANG";
      this.WEBSOCKET_ANHANGKATEGORIE = websocketurl + "/ANHANGKATEGORIE";
      this.WEBSOCKET_ANWESENDE = websocketurl + "/ANWESENDE";
      this.WEBSOCKET_PROTOKOLLMESSAGE = websocketurl + "/MESSAGE";
      //#endregion
  }
}
