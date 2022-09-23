// Constructor: https://marketplace.visualstudio.com/items?itemName=toanchivu.tcv-typescript-constructor-generator#:~:text=VSCode%20Extension%20Market-,Usage,-Just%20place%20your
export class Protokollmessage {
    ID: number;
    message: string;
    vType: number;
    vIDs: number[];
    status: number;
    ablaufdatum: Date;
    agendapunktID: number;
    nummer: number;
    oldID: number;

    isEditing: boolean = false;
    countDisplayVerantworliche: number = 2;

    constructor(
        ID: number,
        message: string,
        vType: number,
        vIDs: number[],
        status: number,
        ablaufdatum: Date,
        agendapunktID: number,
        nummer: number,
        oldID: number
    ) {
        this.ID = ID
        this.message = message
        this.vType = vType
        this.vIDs = vIDs
        this.status = status
        this.ablaufdatum = ablaufdatum
        this.agendapunktID = agendapunktID
        this.nummer = nummer
        this.oldID = oldID
    }

    static vTypeText = [
        { type: 0, label: "Info" },
        { type: 1, label: "Alle Anwesenden" },
        { type: 2, label: "Alle Mitarbeiter" },
        { type: 3, label: "Gewählter Mitarbeiter" },
        { type: 4, label: "Gewählter Kontakt" }
    ]

    /**
     * Auswählbare Stati
     */
    private static statusList: any[] = [
        { name: 'Offen', key: 0, class: 'green' },
        { name: 'In Bearbeitung', key: 1, class: 'yellow' },
        { name: 'Erledigt', key: 2, class: 'blue' },
        { name: 'Abgelaufen', key: 3, class: 'red' },
        { name: 'Urgiert', key: 4, class: 'violett' }
    ];

    readVTypeText() {
        let vType = Protokollmessage.vTypeText.find(x => x.type == this.vType);
        return vType == null ? "Kein Type " + this.vType : vType.label;
    }
    readStatusBadge(): string {
        return "status-badge status-" + Protokollmessage.statusList[this.status].class;
    }
    readStatusText(): string {
        return Protokollmessage.statusList[this.status].name;
    }
    readStatus(): any[] {
        return Protokollmessage.statusList;
    }

    createVerantwortlichenTooltip(sourceArray: any[]): string {
        let roles = "";
        let idx = 0;
        this.vIDs.forEach(e => {
            if (idx >= this.countDisplayVerantworliche) {
                roles += sourceArray.find(x => x.ID == e).name + "<br/>"
            }
            idx++;
        });
        return roles;
    }
}