import { DatePipe } from "@angular/common";
import moment from "moment";
import { AppComponent } from "../app.component";

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

    toJSONString(oldStatus: number = this.status): string {
        const datepipe: DatePipe = new DatePipe('en-US')
        let retVal = JSON.parse("{}");
        retVal['ID'] = this.ID;
        retVal['KURZBESCHREIBUNG'] = this.kurzbeschreibung;
        retVal['BESCHREIBUNG'] = this.beschreibung;
        retVal['ERSTELLZEIT'] = datepipe.transform(this.erstellzeit, "dd_MM_YYYY_HH_mm_ss");
        retVal['ABSCHLUSSZEIT'] = datepipe.transform(this.abschlusszeit, "dd_MM_YYYY_HH_mm_ss");
        retVal['ABLAUFDATUM'] = datepipe.transform(this.ablaufdatum, "dd_MM_YYYY_HH_mm_ss");
        retVal['VERANTWORTLICHERID'] = this.verantwortlicherID;
        retVal['VERANTWORTLICHERTYP'] = this.verantwortlicherTyp;
        retVal['STATUS'] = this.status;
        retVal['WICHTIGKEIT'] = this.wichtigkeit;
        retVal['ERSTELLERID'] = AppComponent.PERSONID;
        retVal['MASTERID'] = this.masterID;
        retVal['TYPE'] = this.type;
        retVal['OLDSTATUS'] = oldStatus;
        return JSON.stringify(retVal);
    }

    static buildFromEmpty(): Aufgabe {
        return new Aufgabe(0, "", "", new Date(), new Date(), new Date(), 0, 0, 0, 1, 0, 0);
    }

    static buildFromObject(object: any): Aufgabe {
        // Date wird konvertiert
        let parsedErstellzeit = moment(object["ERSTELLZEIT"], "DD_MM_YYYY_hh_mm_ss");
        let parsedAbschlusszeit = moment(object["ABSCHLUSSZEIT"], "DD_MM_YYYY_hh_mm_ss");
        let parsedAblaufdatum = moment(object["ABLAUFDATUM"], "DD_MM_YYYY_hh_mm_ss");

        return new Aufgabe(object["ID"], object["KURZBESCHREIBUNG"], object["BESCHREIBUNG"], parsedErstellzeit.toDate(), parsedAbschlusszeit.toDate(),
                            parsedAblaufdatum.toDate(), object["VERANTWORTLICHERID"], object["VERANTWORTLICHERTYP"], object["STATUS"], object["WICHTIGKEIT"],
                            object["MASTERID"], object["TYPE"]);
    }

}