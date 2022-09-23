import { Component, Input, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { AgendaPunkt } from 'src/app/models/Agendapunkt';
import { Protokollmessage } from 'src/app/models/Protokollmessage';
import { ProtokollmessageService } from 'src/app/service/protokollmessage/protokollmessage.service';

@Component({
  selector: 'app-agendapunktpanel',
  templateUrl: './agendapunktpanel.component.html',
  styleUrls: ['./agendapunktpanel.component.css']
})
export class AgendapunktpanelComponent implements OnInit {

  verantwortlichenTypen = Protokollmessage.vTypeText;

  protokollMessageLoading: boolean = true;
  protokollMessage: Protokollmessage[] = [];

  @Input() headerStyle: string = '';
  @Input() agendapunkt: any;
  @Input() employee: any[] = [];
  @Input() contacts: any[] = [];

  constructor(private protokollmessageService: ProtokollmessageService) { }

  ngOnInit(): void {
    // Styleing wird gesetzt
    this.headerStyle = "font-weight: bold; color: var(--primary-color);"
  }

  /**
   * Liest die Person aus der jeweiligen Liste und gibt diese zurück
   * 
   * @param vtype Verantwortlichen Type
   * @param vID Verantwortlichen ID
   * @returns Personenobject
   */
  readPersonFromProtokollmessage(vtype: number, vID: number) {
    return (vtype == 3 ? this.employee : this.contacts).find(x => x.ID == vID);
  }

  startEdit(event: any, agendapunkt: AgendaPunkt, protokollmessage: Protokollmessage) {
    protokollmessage.isEditing = true;
  }

  async loadDataLazy(event: LazyLoadEvent, agendapunkt: AgendaPunkt) {
    // Flag wird gesetzt
    this.protokollMessageLoading = true;
    // Protokollmessages werden geladen
    this.protokollMessage = await this.protokollmessageService.readProtokollmessages(agendapunkt.ID);
    // Flag wird gesetzt
    this.protokollMessageLoading = false;
  }

  addNewProtokollmessage(agendapunkt: AgendaPunkt) {
    let lastNummer = 1;

    if (this.protokollMessage.length > 0) {
      let sortedArray = this.protokollMessage.sort((n1, n2) => n1.nummer - n2.nummer);
      lastNummer = sortedArray[sortedArray.length - 1].nummer + 1;
    }

    this.protokollMessage.push(new Protokollmessage(0, "", 0, [], 0, new Date(), agendapunkt.ID, lastNummer, 0));
  }

  saveProtokollmessage(protokollmessage: Protokollmessage) {

    // Bearbeitung wird beendet
    this.abortEditing(protokollmessage);
  }

  abortEditing(protokollmessage: Protokollmessage) {
    protokollmessage.isEditing = false;
  }


}
