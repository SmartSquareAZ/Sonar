import { DatePipe } from "@angular/common";
import moment from "moment";
import { AppComponent } from "../app.component";
import { Person } from "./Person";

// Constructor: https://marketplace.visualstudio.com/items?itemName=toanchivu.tcv-typescript-constructor-generator#:~:text=VSCode%20Extension%20Market-,Usage,-Just%20place%20your
export class Protokollmessage {
    ID: number;
    title: string;
    message: string;
    vType: number;
    vIDs: number[];
    status: number;
    ablaufdatum: Date;
    agendapunktID: number;
    protokollNummer: string;
    nummer: number;
    ausgeblendet: boolean;
    previousProtokollmessage: Protokollmessage;

    isEditing: boolean = false;
    countDisplayVerantworliche: number = 2;

    constructor(
        ID: number,
        title: string,
        message: string,
        vType: number,
        vIDs: number[],
        status: number,
        ablaufdatum: Date,
        agendapunktID: number,
        protokollNummer: string,
        nummer: number,
        ausgeblendet: number,
        previousProtokollmessage: Protokollmessage
    ) {
        this.ID = ID
        this.title = title;
        this.message = message;
        this.vType = vType
        this.vIDs = vIDs
        this.status = status
        this.ablaufdatum = ablaufdatum
        this.agendapunktID = agendapunktID
        this.protokollNummer = protokollNummer;
        this.nummer = nummer;
        this.ausgeblendet = ausgeblendet == 1 ? false : true;
        this.previousProtokollmessage = previousProtokollmessage
    }

    static vTypeText = [
        { type: 0, label: "Info" },
        { type: 1, label: "Alle Anwesenden" },
        //{ type: 2, label: "Alle Mitarbeiter" },
        { type: 3, label: "Gewählter Mitarbeiter" },
        { type: 4, label: "Gewählter Kontakt" },
        { type: 8, label: "Gewählte Firma"}
    ]

    /**
     * Auswählbare Stati (alt)
     */
    /*private static statusList: any[] = [
        { name: 'Offen', key: 0, class: 'green' },
        { name: 'In Bearbeitung', key: 1, class: 'yellow' },
        { name: 'Erledigt', key: 2, class: 'blue' },
        { name: 'Abgelaufen', key: 3, class: 'red' },
        { name: 'Urgiert', key: 4, class: 'violett' }
    ];*/

    /**
     * Auswählbare Stati
     */
     private static statusList: any[] = [
        { name: 'In Bearbeitung', key: 1, class: 'yellow' },
        { name: 'Erledigt', key: 2, class: 'green' },
        { name: 'Verzug', key: 3, class: 'red' }
    ];

    readVTypeText() {
        let vType = Protokollmessage.vTypeText.find(x => x.type == this.vType);
        return vType == null ? "Kein Type " + this.vType : vType.label;
    }
    readStatusBadge(status: number = this.status): string {
        return "status-badge status-" + this.readStatusHelper(status).class;
    }
    readStatusText(status: number = this.status): string {
        return this.readStatusHelper(status).name;
    }
    readStatus(): any[] {
        return Protokollmessage.statusList;
    }
    /**
     * Liest das Status Objekt mithilfe der Status ID
     * (Konvertiert von Statussystem alt zu Statussystem neu)
     * 
     * @param status StatusID (im System alt)
     * @returns statusobjekt (neu)
     */
    readStatusHelper(status: number): any {
        if(status == 0 || status == 1 || status == 4) {
            return Protokollmessage.statusList[0];
        }
        return Protokollmessage.statusList[status - 1];
    }

    createVerantwortlichenTooltip(sourceArray: any[]): string {
        let roles = "";
        let idx = 0;
        this.vIDs.forEach(e => {
            if (idx >= this.countDisplayVerantworliche) {
                let person: Person = sourceArray.find(x => x.ID == e);
                roles += person.toOutput() + "<br/>"
            }
            idx++;
        });
        return roles;
    }

    toJSONString(): string {
        const datepipe: DatePipe = new DatePipe('en-US');

        let retVal = JSON.parse("{}");
        retVal["ID"] = this.ID;
        retVal["TITLE"] = this.title;
        retVal["MESSAGE"] = this.message;

        if(this.vType == 8 && AppComponent.PERSONTYPE == 0 && this.vIDs.includes(AppComponent.PERSONID)) {
            retVal["VTYPE"] = 9;
        } else {
            retVal["VTYPE"] = this.vType;
        }

        // Statussystem alt wird zu Statussystem neu konvertiert (Offen und Urgiert wird zu In Bearbeitung)
        if(this.status == 0 || this.status == 4) {
            this.status = 1;
        }

        retVal["VIDS"] = this.vIDs;
        retVal["VID"] = AppComponent.PERSONID;
        retVal["STATUS"] = this.status;
        retVal["ABLAUFDATUM"] = datepipe.transform(this.ablaufdatum, "dd_MM_YYYY_HH_mm_ss");
        retVal["AGENDAPUNKTID"] = this.agendapunktID;
        retVal["PROTOKOLLNUMMER"] = this.protokollNummer;
        retVal["NUMMER"] = this.nummer;
        retVal["OLDID"] = this.previousProtokollmessage != null ? this.previousProtokollmessage.ID : 0;
        retVal["AUSGEBLENDET"] = this.ausgeblendet ? 0 : 1;
        return JSON.stringify(retVal);
    }

    static buildFromEmpty(): Protokollmessage {
        return new Protokollmessage(0, "", "", 0, [], 0, new Date(), 0, "", 0, 0, null as any);
    }

    static buildNew(agendapunktID: number, lastNummer: number): Protokollmessage {
        return new Protokollmessage(0, "", "", 0, [], 0, new Date(), agendapunktID, AppComponent.PROTOKOLLNUMMER, lastNummer, 0, null as any)
    }

    static buildFromJSON(data: JSON): Protokollmessage {
        let dataObj: any = data;

        let oldMessage = Protokollmessage.buildFromEmpty();
        oldMessage.ID = dataObj["OLDID"];

        let vType = dataObj["VTYPE"];

        if(vType == 9) {
            vType = 8;
        }

        let status = dataObj["STATUS"];
        if(status == 0 || status == 4) {
            status = 1;
        }

        // Date wird konvertiert
        let parsedDate = moment(dataObj["ABLAUFDATUM"], "DD_MM_YYYY_hh_mm_ss");
        return new Protokollmessage(dataObj["ID"], dataObj["TITLE"], dataObj["MESSAGE"], vType,
            dataObj["VIDS"], status, parsedDate.toDate(),
            dataObj["AGENDAPUNKTID"], dataObj["PROTOKOLLNUMMER"], dataObj["NUMMER"], dataObj["AUSGEBLENDET"], oldMessage);
    }

    static buildFromJSONArray(data: JSON): Protokollmessage[] {
        // Datentypkonvertierung
        let array: any = data;
        // Array wird erstellt
        let punkte: Protokollmessage[] = [];

        // Array wird durchlaufen
        for (let idx = 0; idx < array.length; idx++) {
            // Protokollmessage wird erstellt
            punkte.push(Protokollmessage.buildFromJSON(array[idx]));
        }

        return punkte;
    }
}