import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-protokollabschluss',
  templateUrl: './protokollabschluss.component.html',
  styleUrls: ['./protokollabschluss.component.css']
})
export class ProtokollabschlussComponent implements OnInit {
  timer = 5;
  interval!: any;

  constructor() { }

  ngOnInit(): void {
    this.timer = 5;
    this.interval = setInterval(() => {
      this.timer -= 1;
      if(this.timer == 0) {
        this.finish();
      }
    }, 1000);
  }

  isGlassEffect() {
    return !AppComponent.HECTOR;
  }

  finish() {
    clearInterval(this.interval);
    window.parent.postMessage('protokollFinished', '*')
  }

  getText() {
    return `Sie werden in ${this.timer} ${this.timer == 1 ? 'Sekunde' : 'Sekunden'} automatisch weitergeleitet`;
  }

}
