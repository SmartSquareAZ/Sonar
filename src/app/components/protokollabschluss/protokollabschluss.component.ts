import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-protokollabschluss',
  templateUrl: './protokollabschluss.component.html',
  styleUrls: ['./protokollabschluss.component.css']
})
export class ProtokollabschlussComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  isGlassEffect() {
    return !AppComponent.HECTOR;
  }

}
