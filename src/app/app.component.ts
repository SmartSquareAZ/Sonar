import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Kontakt } from './models/Kontakt';
import { Mitarbeiter } from './models/Mitarbeiter';
import { Person } from './models/Person';
import { PersonService } from './service/person/person.service';
import { AnwesendeWebsocketService } from './service/websocket/anwesende-websocket.service';
import { ProtokollmessageWebsocketService } from './service/websocket/protokollmessage-websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: {'window:beforeunload': 'deregisterOnline'}
})
export class AppComponent {
  title = 'Sonar';

  static MANDANTID: number = 0;
  static ABTEILUNGID: number = 0;
  static PROJEKTID: number = 0;
  static AGENDAID: number = 0;
  static PROTOKOLLID: number = 0;
  static PROTOKOLLNUMMER: string = "";
  static PERSONID: number = 0;
  static PERSONTYPE: number = 0;
  static HECTOR: number = 0;
  static FIRMA: string = "";

  static USER_DATA: Person = Person.buildFromEmpty();

  static onlineList: Person[] = [];

  static METAOBJECT(): any {
    return {
      "MID": AppComponent.MANDANTID,
      "AID": AppComponent.ABTEILUNGID,
      "PROJEKTID": AppComponent.PROJEKTID,
      "AGENDAID": AppComponent.AGENDAID,
      "PROTOKOLLID": AppComponent.PROTOKOLLID,
      "PROTOKOLLNUMMER": AppComponent.PROTOKOLLNUMMER,
      "PERSONID": AppComponent.PERSONID,
      "PERSONTYPE": AppComponent.PERSONTYPE,
      "HECTOR": AppComponent.HECTOR,
      "USER_DATA": AppComponent.USER_DATA,
      "FIRMA": AppComponent.FIRMA
    }
  }

  constructor(private route: ActivatedRoute, private personService: PersonService, private onlineSocketService: AnwesendeWebsocketService, private messageSocketService: ProtokollmessageWebsocketService) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        /*AppComponent.MANDANTID = this.validateUrlParam(params['MID']);
        AppComponent.ABTEILUNGID = this.validateUrlParam(params['AID']);
        AppComponent.PROJEKTID = this.validateUrlParam(params['PROJEKTID']);
        AppComponent.AGENDAID = this.validateUrlParam(params['AGENDAID']);
        AppComponent.PROTOKOLLID = this.validateUrlParam(params['PROTOKOLLID']);
        AppComponent.PERSONID = this.validateUrlParam(params['PERSONID']);
        AppComponent.PERSONTYPE = this.validateUrlParam(params['PERSONTYPE']);

        if(AppComponent.PERSONID == 0) {
          return;
        }

        if(AppComponent.PERSONTYPE == 0) {
          this.personService.getMitarbeiterByID((res: JSON) => {
            AppComponent.USER_DATA = Mitarbeiter.buildFromJSON(res);
            this.onlineSocketService.sendOperation("ONLINE", "", JSON.stringify(AppComponent.USER_DATA));
          });
        } else {
          this.personService.getKontaktByID((res: JSON) => {
            AppComponent.USER_DATA = Kontakt.buildFromJSON(res);
            this.onlineSocketService.sendOperation("ONLINE", "", JSON.stringify(AppComponent.USER_DATA));
          });
        }*/
        let dataJSON = this.validataDataParam(params['DATA']);
        if (dataJSON == undefined) return;
        AppComponent.MANDANTID = dataJSON['MID'];
        AppComponent.ABTEILUNGID = dataJSON['AID'];
        AppComponent.PROJEKTID = dataJSON['PROJEKTID'];
        AppComponent.AGENDAID = dataJSON['AGENDAID'];
        AppComponent.PROTOKOLLID = dataJSON['PROTOKOLLID'];
        AppComponent.PERSONID = dataJSON['PERSONID'];
        AppComponent.PERSONTYPE = dataJSON['PERSONTYPE'];
        AppComponent.HECTOR = dataJSON['HECTOR'];

        

        if(AppComponent.PERSONID == 0) {
          return;
        }

        if(AppComponent.PERSONTYPE == 0) {
          this.personService.getMitarbeiterByID((res: JSON) => {
            AppComponent.USER_DATA = Mitarbeiter.buildFromJSON(res);
            this.onlineSocketService.sendOperation("ONLINE", "", JSON.stringify(AppComponent.USER_DATA));
          });
        } else {
          this.personService.getKontaktByID((res: JSON) => {
            AppComponent.USER_DATA = Kontakt.buildFromJSON(res);
            this.onlineSocketService.sendOperation("ONLINE", "", JSON.stringify(AppComponent.USER_DATA));
          });
        }

        this.personService.getMitarbeiterFirma((res: any) => {
          AppComponent.FIRMA = JSON.parse(res)["NAME"];
        });
      }
      );

    this.onlineSocketService.requestCallback = (operation: any, sourceDevice: any, destinationDevice: any, userid: any, data: any) => {
      // Überprüfung, auf den richtigen Befehl
      if (operation == "ONLINE") {
        /*let array: Person[] = [];
        array.push(JSON.parse(data));
        this.mergeArray(array);*/
        AppComponent.onlineList.push(JSON.parse(data));
      }

      if(operation == "OFFLINE") {
        AppComponent.onlineList = Array.from(AppComponent.onlineList.filter(person => person.ID != JSON.parse(data)["ID"]));
      }
    }

    this.onlineSocketService.responseCallback = (operation: any, sourceDevice: any, destinationDevice: any, userid: any, data: any) => {
      // Überprüfung, auf den richtigen Befehl
      if (operation == "ONLINE") {
        /*let array: Person[] = [];
        array.push(JSON.parse(data));
        this.mergeArray(array);*/
        AppComponent.onlineList.push(JSON.parse(data));
      }
    }
  }

  validateUrlParam(value: number, defaultValue = 0): number{
    return value == undefined ? defaultValue : value;
  }

  validataDataParam(value: string) : any {
    if (value == undefined) return;
    return JSON.parse(atob(value));
  }

  private mergeArray(array: Person[]) {
    AppComponent.onlineList = [];
    for(let person of array) {
      AppComponent.onlineList.push(person);
    }
  }

  deregisterOnline() { 
    this.onlineSocketService.sendOperation("OFFLINE", "", JSON.stringify(AppComponent.USER_DATA));
    this.messageSocketService.sendOperation("OFFLINE", "", "");
  }
}
