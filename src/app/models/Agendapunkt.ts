import { TreeNode } from "primeng/api";

export class AgendaPunkt {

    ID: number;
    name: string;
    nummer: string;
    farbe: string;
    agendaID: number;
    parentID: number;
    protokollID: number;
    children: AgendaPunkt[];

    constructor(
        ID: number,
        name: string,
        nummer: string,
        farbe: string,
        agendaID: number,
        parentID: number,
        protokollID: number,
        children: AgendaPunkt[]
    ) {
        this.ID = ID
        this.name = name
        this.nummer = nummer
        this.farbe = farbe
        this.agendaID = agendaID
        this.parentID = parentID
        this.protokollID = protokollID;
        this.children = children
    }

    static buildFromEmpty(): AgendaPunkt {
        return new AgendaPunkt(0, "", "", "#000", 0, 0, 0, []);
    }

    static buildFromJSON(data: JSON): AgendaPunkt {
        let dataObj: any = data;
        let slaveObj = dataObj["SLAVES"];

        let slaves = [];

        for (let idx = 0; idx < slaveObj.length; idx++) {
            slaves.push(AgendaPunkt.buildFromJSON(slaveObj[idx]));
        }

        return new AgendaPunkt(dataObj["ID"], dataObj["NAME"], dataObj["NUMMER"],
            "#" + dataObj["FARBE"], dataObj["AGENDAID"], dataObj["PARENTID"],
            dataObj["PROTOKOLLID"], slaves);
    }

    static buildFromJSONArray(data: JSON): AgendaPunkt[] {
        // Datentypkonvertierung
        let array: any = data;
        // Array wird erstellt
        let punkte: AgendaPunkt[] = [];

        // Array wird durchlaufen
        for (let idx = 0; idx < array.length; idx++) {
            // AgendaPunkt wird erstellt
            punkte.push(AgendaPunkt.buildFromJSON(array[idx]));
        }

        return punkte;
    }

    static createTreeNodeFromList(agendapunkte: AgendaPunkt[]): TreeNode[] {
        let retVal: TreeNode[] = [];

        agendapunkte.forEach(element => {
            retVal.push(AgendaPunkt.createTreeNode(element));
        });

        return retVal;
    }

    static createTreeNode(agendapunkt: AgendaPunkt, expanded: boolean = true): TreeNode {

        let localChildren: TreeNode[] = [];

        agendapunkt.children.forEach(child => {
            localChildren.push(this.createTreeNode(child, expanded));
        });

        return {
            data: agendapunkt,
            key: '' + agendapunkt.ID,
            label: '' + agendapunkt.nummer + " " + agendapunkt.name,
            expanded: expanded,
            children: localChildren
        };
    }
}