export abstract class Dialog{
    constructor() { }

    /**
     * Öffnet oder schließt den Dialog
     */
    private _displayDialog: boolean = false;
    set displayDialog(_show: boolean) {
        let result: boolean = this._displayDialog != _show;
        if (result == true) {
            // Wert wird gesetzt
            this._displayDialog = _show;
        }
    }
    get displayDialog(): boolean {
        return this._displayDialog;
    }

    /**
     * Öffnet den Dialog
     */
    openDialog(): void {
        // PreHook wird aufgerufen
        this.preDialogOpen();

        // Dialog wird angezeigt
        this.displayDialog = true;

        // PostHook wird aufgerufen
        this.postDialogOpen();
    }
    /**
     * Schließt den Dialog
     */
    closeDialog(): void {
        // PreHook wird aufgerufen
        this.preDialogClose();

        // Dialog wird geschlossen
        this.displayDialog = false;
        
        // PostHook wird aufgerufen
        this.postDialogClose();
    }

    abstract preDialogOpen() : void;
    abstract postDialogOpen() : void;
    abstract preDialogClose() : void;
    abstract postDialogClose() : void;

    
    public static build(preOpen: Function, postOpen: Function, preClose: Function, postClose: Function): Dialog {
        return new class extends Dialog {
            preDialogOpen(): void {
                preOpen();
            }
            postDialogOpen(): void {
                postOpen();
            }
            preDialogClose(): void {
                preClose();
            }
            postDialogClose(): void {
                postClose();
            }
        };
    }
}