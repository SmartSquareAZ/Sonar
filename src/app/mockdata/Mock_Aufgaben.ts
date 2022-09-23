import { Aufgabe } from "../models/Aufgabe";

export const mock_aufgaben = (count = 15): Aufgabe[] => {
    let retVal: Aufgabe[] = [];

    for (let idx = 1; idx < count + 1; idx++) {
        retVal.push(new Aufgabe(idx, "Kurzbeschreibung " + idx, 'Beschreibung ' + idx, new Date(), new Date(), new Date(), 1, 0, idx % 2 == 0 ? 1 : idx % 3 == 0 ? 2 : 0, idx % 2 == 0 ? 1 : idx % 3 == 0 ? 2 : 3, 0, 0,));
    }

    return retVal;
}

/*export const mock_aufgaben: Aufgabe[] = [
    //new Aufgabe(1, "Kurzbeschreibung 1", '<ul><li class="ql-align-right"><strong class="ql-size-large" style="color: rgb(153, 51, 255); background-color: rgb(255, 194, 102);"><em><s><u>Beschreibung 5</u></s></em></strong></li></ul>', new Date(), new Date(), new Date(), 1, 0, 0, 1, 0, 0,),
    new Aufgabe(1, "Kurzbeschreibung 1", 'Beschreibung 1', new Date(), new Date(), new Date(), 1, 0, 0, 1, 0, 0,),
    new Aufgabe(2, "Kurzbeschreibung 2", "Beschreibung 2", new Date(), new Date(), new Date(), 2, 1, 0, 3, 0, 0,),
    new Aufgabe(3, "Kurzbeschreibung 3", "Beschreibung 3", new Date(), new Date(), new Date(), 3, 0, 0, 2, 0, 0,),
    new Aufgabe(4, "Kurzbeschreibung 4", "Beschreibung 4", new Date(), new Date(), new Date(), 4, 1, 0, 2, 0, 0,),
    new Aufgabe(5, "Kurzbeschreibung 5", "Beschreibung 5", new Date(), new Date(), new Date(), 5, 0, 0, 3, 0, 0,)
]*/
