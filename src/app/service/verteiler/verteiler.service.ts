import { Injectable } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { RequestUrlService } from '../requesturl/request-url.service';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class VerteilerService {

  constructor(private utilsService: UtilsService, private requestURL: RequestUrlService) { }

  getVerteilerFromProtokoll(success: Function): void {
    this.utilsService.GET(`${this.requestURL.VERTEILER_READ}?PID=${AppComponent.PROTOKOLLID}`, success);
  }
}
