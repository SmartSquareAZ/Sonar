import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-layoutwrapper',
  templateUrl: './layoutwrapper.component.html',
  styleUrls: ['./layoutwrapper.component.css']
})
export class LayoutwrapperComponent implements OnInit {

  showAction: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  toggleSize(param: boolean) {
    this.showAction = param;
  }

}
