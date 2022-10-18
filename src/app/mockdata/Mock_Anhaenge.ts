import { Anhang, Anhangkategorie } from "../models/Anhang";

export const mock_anhaenge = (count = 5): Anhang[] => {
    let retVal: Anhang[] = [];

    let kategorien = mock_anhangkategorien();

    for (let idx = 1; idx < count + 1; idx++) {
        let kategorie = kategorien[idx % 2 == 0 ? 0 : idx % 3 == 0 ? 1 : 2];
        retVal.push(new Anhang(idx, "Name " + idx, 'Bemerkung ' + idx, "Anhang " + idx + ".pdf", "Storagepath", 1, 0, kategorie));
    }

    return retVal;
}

const anhangkategorien: Anhangkategorie[] = [];

export const mock_anhangkategorien = (count = 3): Anhangkategorie[] => {
    if (anhangkategorien.length == 0) {
        for (let idx = 1; idx < count + 1; idx++) {
            anhangkategorien.push(new Anhangkategorie(idx, "Kategorie " + idx));
        }
    }

    return anhangkategorien;
}