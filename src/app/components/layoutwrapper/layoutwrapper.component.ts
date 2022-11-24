import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppComponent } from 'src/app/app.component';
import { AgendaPunkt } from 'src/app/models/Agendapunkt';
import { ProtokollService } from 'src/app/service/protokoll/protokoll.service';
import { ProtokollmessageWebsocketService } from 'src/app/service/websocket/protokollmessage-websocket.service';
import { BesprechungComponent } from '../besprechung/besprechung.component';


@Component({
  selector: 'app-layoutwrapper',
  templateUrl: './layoutwrapper.component.html',
  styleUrls: ['./layoutwrapper.component.css']
})
export class LayoutwrapperComponent implements OnInit {

  @Output() agendaChanged = new EventEmitter<{operation: string, value: AgendaPunkt}>();

  @ViewChild('besprechung') besprechungComponent!: BesprechungComponent;

  showAction: boolean = true;

  speedDialItems!: MenuItem[];

  constructor(private messageSocketService: ProtokollmessageWebsocketService, private router: Router, private protokollService: ProtokollService) { }

  ngOnInit(): void {
    this.protokollService.readStatus(AppComponent.PROTOKOLLID, (res: string) => {
        if(JSON.parse(res)["STATUS"] == 3) {
          this.router.navigate(["/done"], {queryParamsHandling: "preserve"});
        }
    });

    this.speedDialItems = [
      {
        icon: 'pi pi-arrow-left',
        tooltip: 'Zurück'
      },
      {
        icon: 'pi pi-flag-fill',
        tooltip: 'Protokoll abschließen',
        command: () => {
          this.protokollService.updateStatus(AppComponent.PROTOKOLLID, 3, () => {
            this.messageSocketService.sendOperation("DONE", "", "");
            this.router.navigate(["/done"]);
          });
        }
      }
    ]
  }

  toggleSize(param: boolean) {
    this.showAction = param;
  }

  onAgendaChanged(event: any) {
    let changedPunkt: AgendaPunkt = event["value"];

    // Check auf Operation
    switch(event["operation"]) {
      case "CREATE":
        // Wenn die parentID == 0, dann wird der Punkt als "Root-Punkt" am Ende der Liste eingefügt
        if(changedPunkt.parentID == 0) {
          this.besprechungComponent.agendaPunkte.push(changedPunkt);
        } else {
          // Der Index des letzten childs zu dem neu hinzugefügten parent wird gesucht, wenn es das erste child ist wird geschaut ob der parent.ID = new.parentID ist
          for(let i = this.besprechungComponent.agendaPunkte.length - 1; i >= 0; i--) {
            if(this.besprechungComponent.agendaPunkte[i].parentID == changedPunkt.parentID || this.besprechungComponent.agendaPunkte[i].ID == changedPunkt.parentID) {
              this.besprechungComponent.agendaPunkte.splice(i + 1, 0, changedPunkt);
              break;
            }
          }
        }
        break;

      case "UPDATE":
        // Über alle Agendapunkte wird iteriert
        for(let i = 0; i < this.besprechungComponent.agendaPunkte.length; i++) {

          // Wenn ID gleich wird der Punkt geupdated
          if(this.besprechungComponent.agendaPunkte[i].ID == changedPunkt.ID) {
            this.besprechungComponent.agendaPunkte[i] = changedPunkt;
          }
        }
        break;

      case "DELETE":
        // Index des Punktes wird gesucht
        let index = this.besprechungComponent.agendaPunkte.findIndex(punkt => punkt.ID == changedPunkt.ID);

        // Der Punkt wird aus dem Array entfernt
        this.besprechungComponent.agendaPunkte.splice(index, 1);

        // Der Callback für den Protokollmessage Service wird aus dem Socket service entfernt
        delete this.messageSocketService.messagesRequestCallbacks[changedPunkt.ID];
        break;
    }
  }

  speeddialVisible(): boolean {
    return AppComponent.HECTOR == 1;
  }

}
