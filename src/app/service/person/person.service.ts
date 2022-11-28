import { Injectable } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from 'src/app/app.component';
import { RequestUrlService } from '../requesturl/request-url.service';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private httpClient: HttpClient, private utilsService: UtilsService, private requestURL: RequestUrlService) { }

  getMitarbeiter(success: Function): void {
    this.utilsService.GET(`${this.requestURL.MITARBEITER_READ}?ABTEILUNGID=${AppComponent.ABTEILUNGID}`, success);
  }

  getMitarbeiterFirma(success: Function): void {
    this.utilsService.GET(`${this.requestURL.MITARBEITER_READ_FIRMA}?ABTEILUNGID=${AppComponent.ABTEILUNGID}`, success);
  }

  getKontakte(success: Function): void {
    this.utilsService.GET(`${this.requestURL.KONTAKTE_READ}?ABTEILUNGID=${AppComponent.ABTEILUNGID}`, success);
  }

  getMitarbeiterByID(success: Function): void {
    this.utilsService.GET(`${this.requestURL.MITARBEITER_READ_ID}?PERSONID=${AppComponent.PERSONID}`, success);
  }

  getKontaktByID(success: Function): void {
    this.utilsService.GET(`${this.requestURL.KONTAKTE_READ_ID}?PERSONID=${AppComponent.PERSONID}`, success)
  }
}
