import { Injectable } from '@angular/core';
import { resolveAfterXSeconds } from 'src/app/Constants';
import { mock_anhaenge, mock_anhangkategorien } from 'src/app/mockdata/Mock_Anhaenge';
import { Anhang, Anhangkategorie } from 'src/app/models/Anhang';

@Injectable({
  providedIn: 'root'
})
export class AnhangService {

  private loadedData = false;
  private anhaenge: Anhang[] = [];

  private loadedKategorieData = false;
  private kategorien: Anhangkategorie[] = [];

  constructor() { }

  /**
   * Speichert den übergebene Anhang mittels Websocket
   * @param anhang Anhang welcher gespeichert werden soll
   * @returns 
   */
  async saveAnhang(anhang: Anhang): Promise<Anhang> {
    // Websocket Stuff
    const value = <Anhang>await resolveAfterXSeconds();

    if (anhang.ID == 0) {
      let maxID = 0;
      this.anhaenge.forEach(element => {
        if (maxID < element.ID) {
          maxID = element.ID;
        }
      });
      anhang.ID = maxID + 1;
    }

    // Daten werden aktualisiert
    this.readAnhaenge();

    return anhang;
  }

  /**
   * Löscht den übergebene Anhang mittels Websocket
   * @param anhang Anhang welcher gelöscht werden soll
   * @returns 
   */
  async deleteAnhang(anhang: Anhang): Promise<Anhang> {
    // Websocket Stuff
    const value = <Anhang>await resolveAfterXSeconds();

    this.anhaenge.slice(this.anhaenge.indexOf(anhang), 1);

    return anhang;
  }

  async readAnhaenge(masterID: number = 0, masterType: number = 0): Promise<Anhang[]> {
    // API Stuff
    if (!this.loadedData) {
      const value = <Anhang>await resolveAfterXSeconds();
      this.anhaenge = mock_anhaenge();

      // Flag wird gesetzt
      this.loadedData = true;
    }

    return this.anhaenge;
  }

  async readKategorien(abteilungID: number = 0): Promise<Anhangkategorie[]> {
    // API Stuff
    if (!this.loadedKategorieData) {
      const value = <Anhang>await resolveAfterXSeconds();
      this.kategorien = mock_anhangkategorien();

      // Flag wird gesetzt
      this.loadedKategorieData = true;
    }

    return this.kategorien;
  }

  async saveKategorie(kategorie: Anhangkategorie): Promise<Anhangkategorie> {
    // Kategorie wird im Array gespeichert
    this.kategorien.push(kategorie);

    return kategorie;
  }

  async deleteKategorie(kategorie: Anhangkategorie): Promise<Anhangkategorie> {
    // Kategorie wird aus Array entfernt
    this.kategorien = this.kategorien.filter(x => x.ID != kategorie.ID);

    return kategorie;
  }
}
