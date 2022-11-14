import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { AgendaPunkt } from 'src/app/models/Agendapunkt';
import { Kontakt } from 'src/app/models/Kontakt';
import { Mitarbeiter } from 'src/app/models/Mitarbeiter';
import { AgendaService } from 'src/app/service/agenda/agenda.service';
import { PersonService } from 'src/app/service/person/person.service';
import { AgendapunktpanelComponent } from '../agendapunktpanel/agendapunktpanel.component';

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

  constructor(private agendaService: AgendaService, private personService: PersonService) { }

  ngOnInit() {
    this.personService.getMitarbeiter((res: JSON[]) => {
      for(let mitarbeiterObject of res) {
        this.employee.push(Mitarbeiter.buildFromJSON(mitarbeiterObject));
      }
    });

    this.personService.getKontakte((res: JSON[]) => {
      for(let kontaktObject of res) {
        this.contacts.push(Kontakt.buildFromJSON(kontaktObject));
      }
    });
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

  loadAgendaDataLazy(event: LazyLoadEvent) {
    // Flag wird gesetzt
    this.loadingAgenda = true;

    // Parents werden geladen
    this.agendaService.readAgendaPunkte((data: JSON) => {
      // Root wird gesetzt
      this.root = new AgendaPunkt(0, "ROOT", "0", "#000", 1, -1, 0, 0, AgendaPunkt.buildFromJSONArray(data));

      // AgendaPunkte werden geladen
      this.agendaPunkte = this.fillAllAgendapunkte(this.root.children);

      // Flag wird gesetzt
      this.loadingAgenda = false;
    });
  }

  createRange(number: number) {
    // return new Array(number);
    return new Array(number).fill(0).map((n, index) => index + 1);
  }
}
