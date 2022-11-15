import { AppComponent } from "../app.component";

export class Anhang {
    ID: number;
    name: string;
    beschreibung: string;
    filename: string;
    storagepath: string;
    masterID: number;
    masterType: number;
    anhangkategorie: Anhangkategorie;

    constructor(
        ID: number,
        name: string,
        beschreibung: string,
        filename: string,
        storagepath: string,
        masterID: number,
        masterType: number,
        anhangkategorie: Anhangkategorie
    ) {
        this.ID = ID
        this.name = name
        this.beschreibung = beschreibung
        this.filename = filename
        this.storagepath = storagepath
        this.masterID = masterID
        this.masterType = masterType
        this.anhangkategorie = anhangkategorie
    }

    static buildEmpty(): Anhang {
        return new Anhang(0, "", "", "", "", 0, 0, null as any);
    }

    static buildFromObject(object: any, kategorienList: Anhangkategorie[] = []): Anhang {
        console.log(object)
        console.log(kategorienList)
        if(kategorienList.length != 0) {
            for(let kategorie of kategorienList) {
                if(kategorie.ID == object["KATEGORIEID"]) {
                    console.log(kategorie)
                    return new Anhang(object["ID"], object["NAME"], object["BESCHREIBUNG"], object["FILENAME"], object["STORAGEPATH"], object["MASTERID"], object["MASTERTYPE"], kategorie);
                }
            }
        }
        return new Anhang(object["ID"], object["NAME"], object["BESCHREIBUNG"], object["FILENAME"], object["STORAGEPATH"], object["MASTERID"], object["MASTERTYPE"], new Anhangkategorie(object["KATEGORIEID"], ""));
    }

    toJSONString(): string {
        let retVal = JSON.parse("{}");
        retVal['ID'] = this.ID;
        retVal['NAME'] = this.name;
        retVal['BESCHREIBUNG'] = this.beschreibung;
        retVal['FILENAME'] = this.filename;
        retVal["STORAGEPATH"] = this.storagepath;
        retVal["MASTERID"] = this.masterID;
        retVal["MASTERTYPE"] = this.masterType;
        retVal["KATEGORIEID"] = this.anhangkategorie.ID;
        return JSON.stringify(retVal);
    }
}

export class Anhangkategorie {
    ID: number;
    name: string;

    constructor(ID: number, name: string) {
        this.ID = ID
        this.name = name
    }

    static buildFromObject(object: any): Anhangkategorie {
        return new Anhangkategorie(object["ID"], object["NAME"]);
    }

    toJSONString(): string {
        let retVal = JSON.parse("{}");
        retVal['ID'] = this.ID;
        retVal['NAME'] = this.name;
        retVal['ABTEILUNGID'] = AppComponent.ABTEILUNGID;
        return JSON.stringify(retVal);
    }
}