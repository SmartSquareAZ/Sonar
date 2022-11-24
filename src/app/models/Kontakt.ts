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

    override toOutput(): string {
        let retVal: string = "";

        let hasNachOrVorname = this.nachname != "" || this.vorname != "";

        if(hasNachOrVorname) {
            retVal += `${this.nachname} ${this.vorname}`;
        }
        if(this.firmenname != "") {
            if(hasNachOrVorname) {
                retVal += " - "
            }
            
            retVal += `${this.firmenname}`;
        }

        return retVal;
    }

    static buildFromJSON(json: JSON) {
        let object: any = json;
        return new Kontakt(object["ID"], object["ANREDE"], object["TITEL"], object["VORNAME"], object["NACHNAME"], object["MOBIL"], object["TELEFON"], object["EMAIL"], object["FIRMENNAME"], object["ABTEILUNGID"]);
    }
}