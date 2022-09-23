import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-agendapunktheader',
  templateUrl: './agendapunktheader.component.html',
  styleUrls: ['./agendapunktheader.component.css']
})
export class AgendapunktheaderComponent implements OnInit {

  @Input() headerStyle = '';
  
  constructor() { }

  ngOnInit(): void {
  }

}
