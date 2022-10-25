import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Sonar';

  static MANDANTID: number = 0;
  static ABTEILUNGID: number = 0;
  static PROJEKTID: number = 0;
  static AGENDAID: number = 0;
  static PROTOKOLLID: number = 0;
  static PERSONID: number = 0;
  static PERSONTYPE: number = 0;

  static METAOBJECT(): any {
    return {
      "MANDANTID": AppComponent.MANDANTID,
      "ABTEILUNGID": AppComponent.ABTEILUNGID,
      "PROJEKTID": AppComponent.PROJEKTID,
      "AGENDAID": AppComponent.AGENDAID,
      "PROTOKOLLID": AppComponent.PROTOKOLLID,
      "PERSONID": AppComponent.PERSONID,
      "PERSONTYPE": AppComponent.PERSONTYPE,
    }
  }

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        AppComponent.MANDANTID = this.validateUrlParam(params['MANDANTID']);
        AppComponent.ABTEILUNGID = this.validateUrlParam(params['ABTEILUNGID']);
        AppComponent.PROJEKTID = this.validateUrlParam(params['PROJEKTID']);
        AppComponent.AGENDAID = this.validateUrlParam(params['AGENDAID']);
        AppComponent.PROTOKOLLID = this.validateUrlParam(params['PROTOKOLLID']);
        AppComponent.PERSONID = this.validateUrlParam(params['PERSONID']);
        AppComponent.PERSONTYPE = this.validateUrlParam(params['PERSONTYPE']);
      }
      );
  }

  validateUrlParam(value: number, defaultValue = 0): number{
    return value == undefined ? defaultValue : value;
  }
}
