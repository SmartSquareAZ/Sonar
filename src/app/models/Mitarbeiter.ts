import { Person } from "./Person";

export class Mitarbeiter extends Person {
    isDisabled: boolean = false;

    override toOutput(): string {
        return `${this.nachname} ${this.vorname}`;
    }

    static buildFromJSON(json: JSON) {
        let object: any = json;

        return new Mitarbeiter(object["ID"], object["ANREDE"], object["TITEL"], object["VORNAME"], object["NACHNAME"], object["MOBIL"], object["TELEFON"], object["EMAIL"], object["ABTEILUNGID"]);
    }
}