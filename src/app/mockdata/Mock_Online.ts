export const mock_online = (count = 5): any[] => {
    let retVal: any[] = [];

    for (let idx = 1; idx < count + 1; idx++) {
        retVal.push({ ID: idx, name: "Person " + idx, type: idx % 2 == 0 ? 1 : 0 });
    }

    return retVal;
}