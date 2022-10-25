export class Person {
    ID: number;
    anrede: string;
    titel: string;
    vorname: string;
    nachname: string;
    mobil: string;
    telefon: string;
    email: string;
    abteilungID: number;


  constructor(
    ID: number, 
    anrede: string, 
    titel: string, 
    vorname: string, 
    nachname: string, 
    mobil: string, 
    telefon: string, 
    email: string,
    abteilungID: number
) {
    this.ID = ID
    this.anrede = anrede
    this.titel = titel
    this.vorname = vorname
    this.nachname = nachname
    this.mobil = mobil
    this.telefon = telefon
    this.email = email
    this.abteilungID = abteilungID;
  }

  toOutput(): string {
    return `${this.nachname} ${this.vorname}`;
  }

  static buildFromEmpty(): Person {
    return new Person(0, "", "", "", "", "", "", "", 0);
  }
}