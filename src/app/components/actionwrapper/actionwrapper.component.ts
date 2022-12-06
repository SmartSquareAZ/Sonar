import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AgendaPunkt } from 'src/app/models/Agendapunkt';
import { AgendaComponent } from '../agenda/agenda.component';

@Component({
  selector: 'app-actionwrapper',
  templateUrl: './actionwrapper.component.html',
  styleUrls: ['./actionwrapper.component.css']
})
export class ActionwrapperComponent implements OnInit {

  @Output() toggleEvent = new EventEmitter<boolean>();

  @Output() agendaChanged = new EventEmitter<{operation: string, value: AgendaPunkt}>();

  @ViewChild('agenda') agendaComponent!: AgendaComponent;

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
  //anzahlStage: number = 5;
  //anzahlStage: number = 4;
  anzahlStage: number = 3;

  /**
   * Gibt an, ob die Besprechung in Hector ist
   */
  inHector: boolean = true;

  private titelArray: string[] = [
    //"Agenda", "Aufgaben", "Anhänge", "Anwesenheit", "Online"
    //"Agenda", "Aufgaben", "Anhänge", "Online"
    "Agenda", "Anhänge", "Online"
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

  onAgendaChanged(event: any) {
    let agendaPunkt: AgendaPunkt = event['value'];
    let node = this.agendaComponent.findTreeNode(this.agendaComponent.root, agendaPunkt.ID);
    /*console.log(agendaPunkt);
    console.log(node)
    console.log(this.agendaComponent.agendaPunkteNode)*/
    // Agenda wird sortiert
    if(node != undefined && node.data != undefined) {
      if(node.data.parentID == 0) {
        this.agendaComponent.agendaPunkteNode = this.agendaComponent.agendaPunkteNode.sort((a, b) => {
          if(a.data == undefined || b.data == undefined) return 0;
          let x = a.data.nummer.slice(0, -1);
          let y = b.data.nummer.slice(0, -1);
          return Number(x) - Number(y);
        })
      } else {
        if(node.parent?.data?.ID != undefined) {
          node.parent.children = this.agendaComponent.findTreeNode(this.agendaComponent.root, node.parent?.data?.ID)?.children?.sort((a, b) => {
            if(a.data == undefined || b.data == undefined) return 0;
            let x = a.data.nummer.slice(0, -1).substring(a.data.nummer.slice(0, - 1).lastIndexOf('.') + 1, a.data.nummer.length)
            let y = b.data.nummer.slice(0, -1).substring(b.data.nummer.slice(0, - 1).lastIndexOf('.') + 1, b.data.nummer.length)
            return Number(x) - Number(y);
          });
        }
        
      }
    }
    this.agendaChanged.emit(event);
  }

}
