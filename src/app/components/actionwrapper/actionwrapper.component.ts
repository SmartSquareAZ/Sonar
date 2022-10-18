import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-actionwrapper',
  templateUrl: './actionwrapper.component.html',
  styleUrls: ['./actionwrapper.component.css']
})
export class ActionwrapperComponent implements OnInit {

  @Output() toggleEvent = new EventEmitter<boolean>();

  /**
   * Gibt an, ob aktuell das Menü ausgefahren oder eingeklappt ist
   */
  expanded: boolean = true;

  /**
   * Gibt die aktuelle Stage im Paginator an
   */
  currentStage: number = 0;

  /**
   * Gibt die Anzahl der Stages an
   */
  anzahlStage: number = 5;

  /**
   * Gibt an, ob die Besprechung in Hector ist
   */
  inHector: boolean = true;

  private titelArray: string[] = [
    "Agenda", "Aufgaben", "Anhänge", "Anwesenheit", "Online"
  ]

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Listener welcher die aktuelle Page ändert
   * @param event
   */
  onPageChange(event: any) {
    this.currentStage = event.page;
  }

  /**
   * Titel der aktuellen Auswahl
   */
  aktuellerTitel(): string {
    return this.titelArray[this.currentStage];
  }

  toggleSize() {
    this.currentStage = 0;
    this.expanded = !this.expanded;
    this.toggleEvent.emit(this.expanded);
  }
}
