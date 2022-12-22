import { Injectable } from '@angular/core';
import { RequestUrlService } from '../requesturl/request-url.service';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class ProtokollService {

  constructor(private utilsService: UtilsService, private requestURL: RequestUrlService) { }

  updateStatus(protokollID: number, status: number, success: Function): void {
    let json = JSON.parse("{}");
    json["PROTOKOLLID"] = protokollID;
    json["STATUS"] = status;
    this.utilsService.POST(this.requestURL.PROTOKOLL_UPDATE_STATUS, JSON.stringify(json), success);
  }

  readStatus(protokollID: number, success: Function) {
    this.utilsService.GET(`${this.requestURL.PROTOKOLL_READ_STATUS}?PID=${protokollID}`, success);
  }

  readNummer(protokollID: number, success: Function) {
    this.utilsService.GET(`${this.requestURL.PROTOKOLL_READ_NUMMER}?PID=${protokollID}`, success);
  }
}
