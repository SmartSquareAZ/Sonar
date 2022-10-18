import { Aufgabe } from "../models/Aufgabe";

export const mock_aufgaben = (count = 15): Aufgabe[] => {
    let retVal: Aufgabe[] = [];

    for (let idx = 1; idx < count + 1; idx++) {
        retVal.push(new Aufgabe(idx, "Kurzbeschreibung " + idx, 'Beschreibung ' + idx, new Date(), new Date(), new Date(), 1, 0, idx % 2 == 0 ? 1 : idx % 3 == 0 ? 2 : 0, idx % 2 == 0 ? 1 : idx % 3 == 0 ? 2 : 3, 0, 0,));
    }

    return retVal;
}

