import { Component, OnInit } from '@angular/core';
import { OnlineService } from 'src/app/service/online/online.service';

@Component({
  selector: 'app-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.css']
})
export class OnlineComponent implements OnInit {

  loadingOnline: boolean = false;
  onlineList: any[] = [];

  constructor(private onlineService: OnlineService) { }

  async ngOnInit() {
    // Flag wird gesetzt
    this.loadingOnline = true;
    // Daten werden geladen
    this.onlineList = await this.onlineService.readOnlinePersons();
    // Flag wird gesetzt
    this.loadingOnline = false;
  }

}
