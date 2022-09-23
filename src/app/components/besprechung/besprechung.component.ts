import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { AgendaPunkt } from 'src/app/models/Agendapunkt';
import { AgendaService } from 'src/app/service/agenda/agenda.service';

@Component({
  selector: 'app-besprechung',
  templateUrl: './besprechung.component.html',
  styleUrls: ['./besprechung.component.css']
})
export class BesprechungComponent implements OnInit {

  /**
   * Root Agendapunkt
   */
  root: any;

  /**
   * Array aller Agendapunkte
   */
  agendaPunkte: AgendaPunkt[] = [];

  /**
   * Gibt an, ob die Agenda aktuelle geladen wird
   */
  loadingAgenda: boolean = true;

  /**
   * Styling des Table Headers
   */
  headerStyle: string = "font-weight: bold; color: var(--primary-color);";

  employee: any[] = [];
  contacts: any[] = [];

  constructor(private agendaService: AgendaService) { }

  async ngOnInit() {
    for (let idx = 1; idx < 21; idx++) {
      this.employee.push({ ID: idx, name: 'Mitarbeiter ' + idx, type: 0 });
      this.contacts.push({ ID: idx, name: 'Kontakt ' + idx, type: 1 });
    }
  }

  private fillAllAgendapunkte(agendapunktArray: AgendaPunkt[]): AgendaPunkt[] {
    let retVal: AgendaPunkt[] = [];

    // Überprüfung, ob Children vorhanden sind
    if (agendapunktArray != null && agendapunktArray.length > 0) {
      // Children werden durchlaufen
      agendapunktArray.forEach(child => {
        // Element wird Array hinzugefügt
        retVal.push(child);

        // Arraypunkte werden zu retVal hinzugefügt
        retVal = retVal.concat(this.fillAllAgendapunkte(child.children));
      });
    }

    return retVal;
  }

  async loadAgendaDataLazy(event: LazyLoadEvent) {
    // Flag wird gesetzt
    this.loadingAgenda = true;
    // Agenda wird geladen
    this.root = await this.agendaService.readAgendaPunkte(0);

    // AgendaPunkte werden geladen
    this.agendaPunkte = this.fillAllAgendapunkte(this.root.children);

    // Flag wird gesetzt
    this.loadingAgenda = false;
  }

  createRange(number: number) {
    // return new Array(number);
    return new Array(number).fill(0).map((n, index) => index + 1);
  }
}
