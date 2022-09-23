import { AgendaPunkt } from "../models/Agendapunkt";

export const mock_agendapunkte = (maincount = 7, subcount = 5): AgendaPunkt => {
    let retVal = new AgendaPunkt(0, "ROOT", "0", "#000", 1, -1, []);

    for (let idx = 1; idx < maincount + 1; idx++) {
        let punkt = new AgendaPunkt(idx, "Test", "" + idx, "#000", 1, 0, []);

        for (let childidx = 1; childidx < subcount + 1; childidx++) {
            punkt.children.push(new AgendaPunkt(+("" + idx + "" + childidx), "Test", "" + idx + "." + childidx, "#000", 1, idx, []));
        }

        retVal.children.push(punkt);
    }
    return retVal;
}

/*export const mock_agendapunkte: AgendaPunkt = {
    ID: 0, name: "ROOT", nummer: "0", farbe: "#000", agendaID: 1, parentID: -1, children: [
        {
            ID: 1, name: "Test", nummer: "1", farbe: "#000", agendaID: 1, parentID: 0, children: [
                { ID: 11, name: "Test", nummer: "1.1", farbe: "#000", agendaID: 1, parentID: 1, children: [] },
                { ID: 12, name: "Test", nummer: "1.2", farbe: "#000", agendaID: 1, parentID: 1, children: [] },
                { ID: 13, name: "Test", nummer: "1.3", farbe: "#000", agendaID: 1, parentID: 1, children: [] },
            ]
        },

        {
            ID: 2, name: "Test", nummer: "2", farbe: "#000", agendaID: 1, parentID: 0, children: [
                { ID: 21, name: "Test", nummer: "2.1", farbe: "#000", agendaID: 1, parentID: 2, children: [] },
                { ID: 22, name: "Test", nummer: "2.2", farbe: "#000", agendaID: 1, parentID: 2, children: [] },
                { ID: 23, name: "Test", nummer: "2.3", farbe: "#000", agendaID: 1, parentID: 2, children: [] },
            ]
        },

        {
            ID: 3, name: "Test", nummer: "3", farbe: "#000", agendaID: 1, parentID: 0, children: [
                { ID: 31, name: "Test", nummer: "3.1", farbe: "#000", agendaID: 1, parentID: 3, children: [] },
                { ID: 32, name: "Test", nummer: "3.2", farbe: "#000", agendaID: 1, parentID: 3, children: [] },
                { ID: 33, name: "Test", nummer: "3.3", farbe: "#000", agendaID: 1, parentID: 3, children: [] },
            ]
        }
    ]
}*/
