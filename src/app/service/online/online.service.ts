import { Injectable } from '@angular/core';
import { resolveAfter2Seconds } from 'src/app/Constants';
import { mock_online } from 'src/app/mockdata/Mock_Online';

@Injectable({
  providedIn: 'root'
})
export class OnlineService {

  private loadingOnline: boolean = false;
  private onlineList: any[] = [];

  constructor() { }

  async readOnlinePersons(protokollID: number = 0): Promise<any[]> {
    // API Stuff
    if (!this.loadingOnline) {
      const value = <any>await resolveAfter2Seconds(10);
      this.onlineList = mock_online();

      // Flag wird gesetzt
      this.loadingOnline = true;
    }

    return this.onlineList;
  }
}
