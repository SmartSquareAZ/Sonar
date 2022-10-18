let Mock_Duration = 2000;
Mock_Duration = 0;

export const resolveAfterXSeconds = (duration: number = Mock_Duration) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(123);
        }, duration);
    });
}

export const createDefaultDate = (): any => {
    let interval = 15 * 60 * 1000;
    let retVal: any = new Date();

    return new Date(Math.round(retVal / interval) * interval);
}