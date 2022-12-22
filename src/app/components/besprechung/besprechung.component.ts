import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { AppComponent } from 'src/app/app.component';
import { AgendaPunkt } from 'src/app/models/Agendapunkt';
import { Kontakt } from 'src/app/models/Kontakt';
import { Mitarbeiter } from 'src/app/models/Mitarbeiter';
import { Person } from 'src/app/models/Person';
import { AgendaService } from 'src/app/service/agenda/agenda.service';
import { PersonService } from 'src/app/service/person/person.service';
import { VerteilerService } from 'src/app/service/verteiler/verteiler.service';
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

  employee: Person[] = [];
  contacts: Person[] = [];
  contactMap: Map<number, string> = new Map<number, string>();
  firmenMap: Map<string, number[]> = new Map<string, number[]>();
  //verteilerKontaktIDs: object[] = [];

  constructor(private agendaService: AgendaService, private personService: PersonService, private verteilerService: VerteilerService) { }

  ngOnInit() {
    this.personService.getMitarbeiter((res: JSON[]) => {
      for(let mitarbeiterObject of res) {
        this.employee.push(Mitarbeiter.buildFromJSON(mitarbeiterObject));
      }
    });

    this.personService.getKontakte((res: JSON[]) => {
      for(let kontaktObject of res) {
        let kontakt = Kontakt.buildFromJSON(kontaktObject);
        this.contactMap.set(kontakt.ID, kontakt.firmenname);
        if(kontakt.toOutput() != "") {
          this.contacts.push(kontakt);
        }
      }
    });

    this.verteilerService.getVerteilerFromProtokoll((res: any) => {
      for(let verteiler of res) {
        if(verteiler["KID"] != 0) {

          let firma = this.contactMap.get(verteiler["KID"]);

          if(firma == undefined) continue;

          let idsOfFirma = this.firmenMap.get(firma);

          if(idsOfFirma == undefined) {
            idsOfFirma = [];
          }

          idsOfFirma.push(verteiler["KID"]);

          this.firmenMap.set(firma, idsOfFirma);

        } else if (verteiler["MID"] != 0) {
          let ids = this.firmenMap.get(AppComponent.FIRMA);
          if(ids == undefined) {
            ids = [];
            ids.push(verteiler["MID"]);
            this.firmenMap.set(AppComponent.FIRMA, ids);
            continue;
          } else {
            ids.push(verteiler["MID"]);
            this.firmenMap.set(AppComponent.FIRMA, ids);
          }
        }
      }
    })

  }

  private fillAllAgendapunkte(agendapunktArray: AgendaPunkt[]): AgendaPunkt[] {
    let retVal: AgendaPunkt[] = [];

    // Überprüfung, ob Children vorhanden sind
    if (agendapunktArray != null && agendapunktArray.length > 0) {

      agendapunktArray = agendapunktArray.sort((a, b) => {
      
        let numbersA = a.nummer.split('.');
        let numbersB = b.nummer.split('.');
  
        if(numbersA.length - numbersB.length == 0) {
          for(let i = 0; i < numbersA.length; i++) {
            if(Number(numbersA[i]) - Number(numbersB[i]) == 0) {
              continue;
            } else {
              return Number(numbersA[i]) - Number(numbersB[i]);
            }
          }
        } else if(numbersA.length - numbersB.length > 0) {
          for(let i = 0; i < numbersB.length; i++) {
            if(Number(numbersA[i]) - Number(numbersB[i]) == 0) {
              continue;
            } else {
              return Number(numbersA[i]) - Number(numbersB[i]);
            }
          }
        } else if(numbersA.length - numbersB.length < 0) {
          for(let i = 0; i < numbersA.length; i++) {
            if(Number(numbersA[i]) - Number(numbersB[i]) == 0) {
              continue;
            } else {
              return Number(numbersA[i]) - Number(numbersB[i]);
            }
          }
        }
        return 0;
      })

      // Children werden durchlaufen
      agendapunktArray.forEach(child => {
        // Element wird Array hinzugefügt
        retVal.push(child);

        // Arraypunkte werden zu retVal hinzugefügt
        retVal = retVal.concat(this.fillAllAgendapunkte(child.children));
      });

      // Agendapunkte werden zur Map hinzugefügt
      agendapunktArray.forEach(child => {
        this.agendaService.agendaPunkteMap.set(child.ID, child);
      })
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
