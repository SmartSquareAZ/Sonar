import { Injectable } from '@angular/core';
import { Anhang, Anhangkategorie } from 'src/app/models/Anhang';
import { RequestUrlService } from '../requesturl/request-url.service';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class AnhangService {

  private loadedData = false;
  private anhaenge: Anhang[] = [];

  private loadedKategorieData = false;
  private kategorien: Anhangkategorie[] = [];

  constructor(private utilsService: UtilsService, private requestURL: RequestUrlService) { }
  //#region Anhang
  /**
   * Speichert den übergebene Anhang mittels Websocket
   * @param anhang Anhang welcher gespeichert werden soll
   * @returns 
   */
  saveAnhang(anhang: Anhang, success: Function): void {
    // Websocket Stuff
    this.utilsService.POST(this.requestURL.ANHANG_CREATE, anhang.toJSONString(), success);
  }

  updateAnhang(anhang: Anhang, success: Function): void {
    this.utilsService.POST(this.requestURL.ANHANG_UPDATE, anhang.toJSONString(), success);
  }

  /**
   * Löscht den übergebene Anhang mittels Websocket
   * @param anhang Anhang welcher gelöscht werden soll
   * @returns 
   */
  deleteAnhang(anhang: Anhang, success: Function): void {
    // Websocket Stuff
    this.utilsService.POST(this.requestURL.ANHANG_DELETE, anhang.toJSONString(), success);
  }

  readAnhaenge(masterID: number = 0, masterType: number = 0, success: Function): void {
    // API Stuff
    this.utilsService.GET(`${this.requestURL.ANHANG_READ}?MASTERTYPE=${masterType}&MASTERID=${masterID}`, success);
    /*if (!this.loadedData) {
      const value = <Anhang>await resolveAfterXSeconds();
      this.anhaenge = mock_anhaenge();

      // Flag wird gesetzt
      this.loadedData = true;
    }

    return this.anhaenge;*/
  }
  //#endregion

  //#region Kategorie
  readKategorien(abteilungID: number = 0, success: Function): void {
    // API Stuff
    this.utilsService.GET(`${this.requestURL.ANHANGKATEGORIE_READ}?ABTEILUNGID=${abteilungID}`, success);
  }

  saveKategorie(kategorie: Anhangkategorie, success: Function): void {
    console.log(kategorie.toJSONString());
    console.log(this.requestURL.ANHANGKATEGORIE_CREATE);
    this.utilsService.POST(this.requestURL.ANHANGKATEGORIE_CREATE, kategorie.toJSONString(), success);
  }

  deleteKategorie(kategorie: Anhangkategorie, success: Function): void {
    this.utilsService.POST(this.requestURL.ANHANGKATEGORIE_DELETE, kategorie.toJSONString(), success);
  }

  updateKategorie(kategorie: Anhangkategorie, success: Function): void {
    this.utilsService.POST(this.requestURL.ANHANGKATEGORIE_UPDATE, kategorie.toJSONString(), success);
  }
  //#endregion
}
