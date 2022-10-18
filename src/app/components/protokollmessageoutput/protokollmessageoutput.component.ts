import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-protokollmessageoutput',
  templateUrl: './protokollmessageoutput.component.html',
  styleUrls: ['./protokollmessageoutput.component.css']
})
export class ProtokollmessageoutputComponent implements OnInit {

  @Input() message: any;
  @Input() messageIndex: number = 0;
  @Input() employee: any[] = [];
  @Input() contacts: any[] = [];
  @Input() editable: boolean = false;

  constructor() { }

  ngOnInit(): void {
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
}
