import { Injectable } from '@angular/core';
import { UtilsService } from '../utils/utils.service';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from 'src/app/app.component';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private httpClient: HttpClient, private utilsService: UtilsService) { }

  getMitarbeiter(success: Function): void {
    this.utilsService.GET(`http://localhost:8075/MITARBEITER/READ?ABTEILUNGID=${AppComponent.ABTEILUNGID}`, success);
  }

  getKontakte(success: Function): void {
    this.utilsService.GET(`http://localhost:8075/KONTAKTE/READ?ABTEILUNGID=${AppComponent.ABTEILUNGID}`, success);
  }

  getMitarbeiterByID(success: Function): void {
    this.utilsService.GET(`http://localhost:8075/MITARBEITER/READ/ID?PERSONID=${AppComponent.PERSONID}`, success);
  }

  getKontaktByID(success: Function): void {
    this.utilsService.GET(`http://localhost:8075/KONTAKTE/READ/ID?PERSONID=${AppComponent.PERSONID}`, success)
  }
}
