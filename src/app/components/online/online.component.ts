import { Component, OnInit } from '@angular/core';
import { OnlineService } from 'src/app/service/online/online.service';
import { AnwesendeWebsocketService } from 'src/app/service/websocket/anwesende-websocket.service';
import { Person } from 'src/app/models/Person';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.css']
})
export class OnlineComponent implements OnInit {
  
  

  constructor(private onlineService: OnlineService, private socketService: AnwesendeWebsocketService) { }

  async ngOnInit() {
    
  }

  get onlineList(): Person[] {
    console.log(AppComponent.onlineList)
    return AppComponent.onlineList;
  }

}
