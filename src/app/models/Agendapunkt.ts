import { TreeNode } from "primeng/api";
import { AppComponent } from "../app.component";

export class AgendaPunkt {

    ID: number;
    name: string;
    nummer: string;
    farbe: string;
    agendaID: number;
    parentID: number;
    protokollID: number;
    oldID: number;
    children: AgendaPunkt[];
    hasMessages: boolean = false;
    blockedMessageEditing: boolean = false;

    constructor(
        ID: number,
        name: string,
        nummer: string,
        farbe: string,
        agendaID: number,
        parentID: number,
        protokollID: number,
        oldID: number,
        children: AgendaPunkt[]
    ) {
        this.ID = ID
        this.name = name
        this.nummer = nummer
        this.farbe = farbe
        this.agendaID = agendaID
        this.parentID = parentID
        this.protokollID = protokollID;
        this.oldID = oldID;
        this.children = children;
        this.hasMessages = false;
        this.blockedMessageEditing = false;
    }

    toJSONString(): string {
        let retVal = JSON.parse("{}");

        retVal["ID"] = this.ID;
        retVal["NAME"] = this.name;
        retVal["NUMMER"] = this.nummer;
        retVal["FARBE"] = this.farbe;
        retVal["AGENDAID"] = this.agendaID;
        retVal["PARENTID"] = this.parentID;
        retVal["PROTOKOLLID"] = AppComponent.PROTOKOLLID;
        retVal["OLDID"] = this.oldID;
        retVal["SLAVES"] = this.children;

        return JSON.stringify(retVal);
    }

    static buildFromEmpty(): AgendaPunkt {
        return new AgendaPunkt(0, "", "", "#000", 0, 0, 0, 0, []);
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
            AppComponent.PROTOKOLLID, dataObj["OLDID"], slaves);
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

        /*if(agendapunkt.parentID == 0 || agendapunkt.parentID == -1) {
            agendapunkt.children = agendapunkt.children.sort((a, b) => {
                let x = a.nummer.slice(0, -1);
                let y = b.nummer.slice(0, -1);
                return Number(x) - Number(y);
            })
        } else {
            agendapunkt.children = agendapunkt.children.sort((a, b) => {
                let x = a.nummer.slice(0, -1).substring(a.nummer.slice(0, - 1).lastIndexOf('.') + 1, a.nummer.length)
                let y = b.nummer.slice(0, -1).substring(b.nummer.slice(0, - 1).lastIndexOf('.') + 1, b.nummer.length)
                console.log(a)
                console.log(b)
                console.log(x)
                console.log(y)
                return Number(x) - Number(y);
            })
        }*/

        agendapunkt.children.forEach(child => {
            let treeNode: TreeNode = this.createTreeNode(child, expanded);
            localChildren.push(treeNode);
        });

        localChildren.sort((a, b) => {
      
            let numbersA = a.data.nummer.split('.');
            let numbersB = b.data.nummer.split('.');
      
            if(numbersA.length - numbersB.length == 0) {
              for(let i = 0; i < numbersA.length; i++) {
                if(Number(numbersA[i]) - Number(numbersB[i]) == 0) {
                  continue;
                } else {
                  return Number(numbersA[i]) - Number(numbersB[i]);
                }
              }
            } else if(numbersA.length - numbersB.length > 0) {
              for(let i = 0; i < numbersB.length; i++) {
                if(Number(numbersA[i]) - Number(numbersB[i]) == 0) {
                  continue;
                } else {
                  return Number(numbersA[i]) - Number(numbersB[i]);
                }
              }
            } else if(numbersA.length - numbersB.length < 0) {
              for(let i = 0; i < numbersA.length; i++) {
                if(Number(numbersA[i]) - Number(numbersB[i]) == 0) {
                  continue;
                } else {
                  return Number(numbersA[i]) - Number(numbersB[i]);
                }
              }
            }
            return 0;
          })

        return {
            data: agendapunkt,
            key: '' + agendapunkt.ID,
            label: '' + agendapunkt.nummer + " " + agendapunkt.name,
            expanded: expanded,
            children: localChildren
        };
    }
}