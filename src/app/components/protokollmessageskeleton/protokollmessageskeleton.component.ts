import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-protokollmessageskeleton',
  templateUrl: './protokollmessageskeleton.component.html',
  styleUrls: ['./protokollmessageskeleton.component.css']
})
export class ProtokollmessageskeletonComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  createRange(number: number) {
    // return new Array(number);
    return new Array(number).fill(0)
      .map((n, index) => index + 1);
  }

}
