export class Aufgabe {
    ID: number;
    kurzbeschreibung: string;
    beschreibung: string;
    erstellzeit: Date;
    abschlusszeit: Date;
    ablaufdatum: Date;
    verantwortlicherID: number;
    verantwortlicherTyp: number;
    status: number;
    wichtigkeit: number;
    masterID: number;
    type: number;


    constructor(
        ID: number,
        kurzbeschreibung: string,
        beschreibung: string,
        erstellzeit: Date,
        abschlusszeit: Date,
        ablaufdatum: Date,
        verantwortlicherID: number,
        verantwortlicherTyp: number,
        status: number,
        wichtigkeit: number,
        masterID: number,
        type: number
    ) {
        this.ID = ID
        this.kurzbeschreibung = kurzbeschreibung
        this.beschreibung = beschreibung
        this.erstellzeit = erstellzeit
        this.abschlusszeit = abschlusszeit
        this.ablaufdatum = ablaufdatum
        this.verantwortlicherID = verantwortlicherID
        this.verantwortlicherTyp = verantwortlicherTyp
        this.status = status
        this.wichtigkeit = wichtigkeit
        this.masterID = masterID
        this.type = type
    }

    private static severityBadges: string[] = ["gray", "green", "yellow", "red"];
    private static severityText: string[] = ["Keine", "Normal", "Wichtig", "Sehr Wichtig"];
    private static statusBadges: string[] = ["green", "blue", "red"];
    private static statusText: string[] = ["Offen", "Erledigt", "Abgelaufen"];

    readSeverityBadge(): string {
        return "status-badge status-" + Aufgabe.severityBadges[this.wichtigkeit];
    }
    readSeverityText(): string {
        return Aufgabe.severityText[this.wichtigkeit];
    }

    readStatusBadge(): string {
        return "status-badge status-" + Aufgabe.statusBadges[this.status];
    }
    readStatusText(): string {
        return Aufgabe.statusText[this.status];
    }

    static buildFromEmpty(): Aufgabe {
        return new Aufgabe(0, "", "", new Date(), new Date(), new Date(), 0, 0, 0, 1, 0, 0);
    }

}