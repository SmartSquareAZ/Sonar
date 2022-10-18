import { AgendaPunkt } from "../models/Agendapunkt";

let maxCount = 0;

export const mock_agendapunkte = (maincount = 2, deepth = 3): AgendaPunkt => {
    maxCount = deepth - 1;

    let retVal = new AgendaPunkt(0, "ROOT", "0", "#000", 1, -1, 0, []);

    for (let idx = 1; idx < maincount + 1; idx++) {
        retVal.children.push(createAgendaPunkt(0, idx, "" + idx));
    }

    return retVal;
}

const createAgendaPunkt = (currentcount: number, idx: number, nummer: string, childcount = 2): AgendaPunkt => {
    let retVal = new AgendaPunkt(idx, "Test", "" + nummer, "#000", 1, 0, 0, []);

    if (currentcount < maxCount) {
        for (let childidx = 1; childidx < childcount + 1; childidx++) {
            retVal.children.push(createAgendaPunkt(currentcount + 1, +("" + idx + "" + childidx), nummer + "." + childidx, childcount));
        }
    }

    return retVal;
}
