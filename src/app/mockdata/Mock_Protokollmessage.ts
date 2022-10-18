import { Protokollmessage } from "../models/Protokollmessage";

export const mock_protokollmessage = (agendapunktID = 0, count = 5): Protokollmessage[] => {
    let retVal: Protokollmessage[] = [];

    for (let idx = 1; idx < count + 1; idx++) {
        let randomNum = idx % 2 == 0 ? 1 : idx % 3 == 0 ? 0 : 3;
        retVal.push(new Protokollmessage(idx, "Protokollaufgabe " + idx, randomNum, [2, 5, 1], randomNum, new Date(), agendapunktID, idx, previousProtokollmessage(idx, agendapunktID)));
    }

    return retVal;
}

const previousProtokollmessage = (protokollmessageID: number, agendapunktID: number) : Protokollmessage => {
    let randomNum = protokollmessageID % 2 == 0 ? 1 : protokollmessageID % 3 == 0 ? 0 : 3;
    return new Protokollmessage(protokollmessageID, "Protokollaufgabe " + protokollmessageID + "_OLD", randomNum, [2, 5, 1], randomNum, new Date(), agendapunktID, protokollmessageID, null as any);
}