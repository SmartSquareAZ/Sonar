import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { resolveAfter2Seconds } from 'src/app/Constants';
import { mock_agendapunkte } from '../../mockdata/Mock_AgendaPunkte';
import { AgendaPunkt } from '../../models/Agendapunkt';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  private loadedData = false;
  private root: AgendaPunkt = AgendaPunkt.buildFromEmpty();

  constructor() { }

  /**
   * Speichert den übergebenen AgendaPunkt mittels Websocket
   * @param agendaPunkt AgendaPunkt welcher gespeichert werden soll
   * @returns 
   */
  async saveAgendaPunkt(agendaPunkt: AgendaPunkt): Promise<AgendaPunkt> {
    // Websocket Stuff
    const value = <AgendaPunkt>await resolveAfter2Seconds(20);

    // Daten werden aktualisiert
    this.readAgendaPunkte(this.root.agendaID);

    return agendaPunkt;
  }

  /**
   * Löscht den übergebenen AgendaPunkt mittels Websocket
   * @param agendaPunkt AgendaPunkt welcher gelöscht werden soll
   * @returns 
   */
  async deleteAgendaPunkt(agendaPunkt: AgendaPunkt): Promise<AgendaPunkt> {
    // Websocket Stuff
    const value = <AgendaPunkt>await resolveAfter2Seconds(20);

    // Daten werden aktualisiert
    this.readAgendaPunkte(this.root.agendaID);

    return agendaPunkt;
  }

  async readAgendaPunkte(agendaID: number): Promise<AgendaPunkt> {
    // API Stuff
    if (!this.loadedData) {
      const value = <AgendaPunkt>await resolveAfter2Seconds(20);
      this.root = mock_agendapunkte();
      this.root.agendaID = agendaID;

      // Flag wird gesetzt
      this.loadedData = true;
    }

    return this.root;
  }
}
