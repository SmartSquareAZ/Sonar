import { Protokollmessage } from "../models/Protokollmessage";

export const mock_protokollmessage = (agendapunktID = 0, count = 5): Protokollmessage[] => {
    let retVal: Protokollmessage[] = [];

    for (let idx = 1; idx < count + 1; idx++) {
        let randomNum = idx % 2 == 0 ? 1 : idx % 3 == 0 ? 0 : 3;
        retVal.push(new Protokollmessage(idx, "Protokollaufgabe " + idx, randomNum, [2, 5, 1], randomNum, new Date(), agendapunktID, idx, 0));
    }

    return retVal;
}