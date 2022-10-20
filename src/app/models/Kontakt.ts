import { Person } from "./Person";

export class Kontakt extends Person {
    firmenname: string = '';

    constructor(
        ID: number, 
        anrede: string, 
        titel: string, 
        vorname: string, 
        nachname: string, 
        mobil: string, 
        telefon: string, 
        email: string,
        firmenname: string,
        abteilungID: number
    ) {
        super(ID, anrede, titel, vorname, nachname, mobil, telefon, email, abteilungID);
        this.firmenname = firmenname;
      }

    static buildFromJSON(json: JSON) {
        let object: any = json;

        return new Kontakt(object["ID"], object["ANREDE"], object["TITEL"], object["VORNAME"], object["NACHNAME"], object["MOBIL"], object["TELEFON"], object["EMAIL"], object["FIRMENNAME"], object["ABTEILUNGID"]);
    }
}