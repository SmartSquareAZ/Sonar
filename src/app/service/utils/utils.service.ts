import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private httpClient: HttpClient) { }

  GET(url: string, success: Function, error: Function = new Function()) {
    // Request wird ausgeführt
    this.httpClient.get<JSON>(url).subscribe((result) => {
      // Response wird geparst
      let response = JSON.parse(JSON.stringify(result));

      // Überprüfung, ob CODE korrekt ist
      if (response['CODE'] == 200) {
        // Callback wird mit den Daten ausgeführt
        success(response['DATA']);
      } else {
        // Callback wird mit den Daten ausgeführt
        error(response);
      }
    });
  }

  POST(url: string, data: string, success: Function, error: Function = new Function()) {
    // Request wird ausgeführt
    this.httpClient.post<JSON>(url, data).subscribe((result) => {
      // Response wird geparst
      let response = JSON.parse(JSON.stringify(result));

      // Überprüfung, ob CODE korrekt ist
      if (response['CODE'] == 200) {
        // Callback wird mit den Daten ausgeführt
        success(response['DATA']);
      } else {
        // Callback wird mit den Daten ausgeführt
        error(response);
      }
    });
  }

  static validateResponse(data: any, messageService: MessageService) {
    // Response wird geparst
    let response = JSON.parse(JSON.stringify(data));

    // Code wird gelesen
    let code = response['CODE'];

    if (code == 611) {
      // Message wird ausgegeben
      messageService.add({ severity: 'warn', summary: 'Achtung', detail: 'Benutzer bereits vorhanden' });
    }
    else if (code == 620) {
      // Message wird ausgegeben
      messageService.add({ severity: 'warn', summary: 'Achtung', detail: 'Ungültiger Token' });
    }
    else if (code == 621) {
      // Message wird ausgegeben
      messageService.add({ severity: 'warn', summary: 'Achtung', detail: 'Kein Benutzer gefunden' });
    }
    else if (code == 622) {
      // Message wird ausgegeben
      messageService.add({ severity: 'warn', summary: 'Achtung', detail: 'Anmeldedaten inkorrekt' });
    } else {
      alert(JSON.stringify(data));
    }
  }
}
