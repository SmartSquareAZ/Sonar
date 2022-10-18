
export class Anhang {
    ID: number;
    name: string;
    bemerkung: string;
    uploadfilename: string;
    storagepath: string;
    masterID: number;
    masterType: number;
    anhangkategorie: Anhangkategorie;

    constructor(
        ID: number,
        name: string,
        bemerkung: string,
        uploadfilename: string,
        storagepath: string,
        masterID: number,
        masterType: number,
        anhangkategorie: Anhangkategorie
    ) {
        this.ID = ID
        this.name = name
        this.bemerkung = bemerkung
        this.uploadfilename = uploadfilename
        this.storagepath = storagepath
        this.masterID = masterID
        this.masterType = masterType
        this.anhangkategorie = anhangkategorie
    }

    static buildEmpty(): Anhang{
        return new Anhang(0, "", "", "", "", 0, 0, null as any);
    }
}

export class Anhangkategorie {
    ID: number;
    name: string;

    constructor(ID: number, name: string) {
        this.ID = ID
        this.name = name
    }
}