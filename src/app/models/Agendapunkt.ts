import { TreeNode } from "primeng/api";

export class AgendaPunkt {

    ID: number;
    name: string;
    nummer: string;
    farbe: string;
    agendaID: number;
    parentID: number;
    children: AgendaPunkt[];

    constructor(
        ID: number,
        name: string,
        nummer: string,
        farbe: string,
        agendaID: number,
        parentID: number,
        children: AgendaPunkt[]
    ) {
        this.ID = ID
        this.name = name
        this.nummer = nummer
        this.farbe = farbe
        this.agendaID = agendaID
        this.parentID = parentID
        this.children = children
    }

    static buildFromEmpty(): AgendaPunkt{
        return new AgendaPunkt(0, "", "", "#000", 0, 0, []);
    }

    static createTreeNodeFromList(agendapunkte: AgendaPunkt[]): TreeNode[] {
        let retVal: TreeNode[] = [];

        agendapunkte.forEach(element => {
            retVal.push(AgendaPunkt.createTreeNode(element));
        });

        return retVal;
    }

    static createTreeNode(agendapunkt: AgendaPunkt): TreeNode {

        let localChildren: TreeNode[] = [];

        agendapunkt.children.forEach(child => {
            localChildren.push(this.createTreeNode(child));
        });
        
        return {
            data: agendapunkt,
            key: '' + agendapunkt.ID,
            label: '' + agendapunkt.nummer + " " + agendapunkt.name,
            expanded: true,
            children: localChildren
        };
    }
}