import { HttpClient, HttpHandler } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { catchError, Observable, throwError } from 'rxjs';
import { Anhang, Anhangkategorie } from 'src/app/models/Anhang';
import { AnhangService } from 'src/app/service/anhang/anhang.service';
import { saveAs } from 'file-saver';
import { AppComponent } from 'src/app/app.component';
import { AnhangWebsocketService } from 'src/app/service/websocket/anhang-websocket.service';
import { AnhangKategorieWebsocketService } from 'src/app/service/websocket/anhang-kategorie-websocket.service';

@Component({
  selector: 'app-anhaenge',
  templateUrl: './anhaenge.component.html',
  styleUrls: ['./anhaenge.component.css'],
  providers: [ConfirmationService]
})
export class AnhaengeComponent implements OnInit {

  /**
   * Allgemeiner Teil der Url
   */
  private domainUrl = "http://localhost:8075";
  /**
   * Url zu welcher die Datei hochgeladen wird
   */
  uploadUrl = this.domainUrl + "/ANHANG/UPLOAD";
  /**
   * Url von welcher die Datei heruntergeladen wird
   */
  downloadUrl = this.domainUrl + "/ANHANG/DOWNLOAD";

  /**
   * Gibt an, ob die Anhänge geladen werden
   */
  loadingAnhaenge: boolean = false;

  /**
   * Array aller Anhänge
   */
  anhangList: Anhang[] = [];
  /**
   * Array aller Anhangkategorien
   */
  kategorienList: Anhangkategorie[] = [];
  /**
   * Gewählter Anhang im Dialog
   */
  choosenAnhang: Anhang = null as any;
  /**
   * Gewählte Anhangkategorie im Dialog
   */
  choosenAnhangkategorie: Anhangkategorie = null as any;


  /**
   * Flag für den Anhang Dialog
   */
  displayDialog: boolean = false;
  /**
   * Flag für den Kategorie Dialog
   */
  displayKategorieDialog: boolean = false;


  /**
   * Eingabeform des Anhang Dialogs
   */
  anhangForm = this.formBuilder.group({
    name: ["", Validators.required],
    beschreibung: [""],
    kategorie: [null, Validators.required]
  });
  /**
   * Eingabeform des Kategorie Dialogs
   */
  anhangKategorieForm = this.formBuilder.group({
    name: ["", Validators.required]
  })


  /**
   * Upload Komponente
   */
  @ViewChild('fileUploader') fileUploader: FileUpload = null as any;
  /**
   * Indikator, welcher Status der Upload hat
   */
  currentUploadState: number = 0;
  /**
   * Array mit allen möglichen Uploadstates
   */
  uploadStates: string[] = ["Warte auf Datei", "Bereit zum Hochladen", "Upload im Gange", "Upload abgeschlossen", "Upload fehlgeschlagen", ""];
  /**
   * Array mit allen möglichen Uploadstatesstyles
   */
  uploadStyleStates: string[] = ["blue", "yellow", "orange", "green", "red", "green"];


  constructor(private confirmationService: ConfirmationService, 
    private anhangService: AnhangService, 
    private formBuilder: FormBuilder, 
    private httpClient: HttpClient, 
    private anhangSocketService: AnhangWebsocketService,
    private anhangKategorieSocketService: AnhangKategorieWebsocketService) { }

  async ngOnInit() {
    // Flag wird gesetzt
    this.loadingAnhaenge = true;

    // Kategorien werden geladen
    this.anhangService.readKategorien(AppComponent.ABTEILUNGID, (res: JSON) => {
      let objectArray: any = res;
      let retVal: Anhangkategorie[] = [];
      for(let anhangKategorieObject of objectArray) {
        retVal.push(Anhangkategorie.buildFromObject(anhangKategorieObject));
      }
      this.kategorienList = retVal;

      // Anhänge werden geladen
      this.anhangService.readAnhaenge(AppComponent.PROTOKOLLID, 1, (res: JSON) => {
        let objectArray: any = res;
        let retVal: Anhang[] = [];
        for(let anhangObject of objectArray) {
          retVal.push(Anhang.buildFromObject(anhangObject, this.kategorienList));
        }
        this.anhangList = retVal;
      });

      // Flag wird gesetzt
      this.loadingAnhaenge = false;
    });

    this.anhangSocketService.requestCallback = (operation: any, sourceDevice: any, destinationDevice: any, pid: any, data: any) => {
      if(operation != "ONLINE" && operation != "REGISTER") {
        data = JSON.parse(data);
      }
      // Überprüfung, auf den richtigen Befehl
      if (operation == "CREATE") {
        this.anhangList.push(Anhang.buildFromObject(data, this.kategorienList));
      }
      if (operation == "UPDATE") {
        this.anhangList[this.anhangList.findIndex((anhang => anhang.ID == data["ID"]))] = Anhang.buildFromObject(data, this.kategorienList);
      }
      if (operation == "DELETE") {
        this.anhangList = this.anhangList.filter(anhang => anhang.ID !== data["ID"]);
      }
    }

    this.anhangKategorieSocketService.requestCallback = (operation: any, sourceDevice: any, destinationDevice: any, pid: any, data: any) => {
      if(operation != "ONLINE" && operation != "REGISTER") {
        data = JSON.parse(data);
      }
      // Überprüfung, auf den richtigen Befehl
      if (operation == "CREATE") {
        this.kategorienList.push(Anhangkategorie.buildFromObject(data));
        this.kategorienList = Array.from(this.kategorienList);
      }
      if (operation == "UPDATE") {
        let newKategorie = Anhangkategorie.buildFromObject(data);
        this.kategorienList[this.kategorienList.findIndex((kategorie => kategorie.ID == data["ID"]))] = newKategorie;
        for(let anhang of this.anhangList) {
          if(anhang.anhangkategorie.ID == newKategorie.ID) {
            anhang.anhangkategorie = newKategorie;
          }
        }
      }
      if (operation == "DELETE") {
        this.kategorienList = this.kategorienList.filter(kategorie => kategorie.ID !== data["ID"]);
        this.kategorienList = Array.from(this.kategorienList);
      }
    }
  }

  ngOnDestroy() {
    this.anhangSocketService.completeWebsocket();
    this.anhangKategorieSocketService.completeWebsocket();
  }

  openDialog(anhang: Anhang = null as any) {
    // Gewählter Anhang wird gespeichert
    this.choosenAnhang = anhang != null ? anhang : Anhang.buildEmpty();

    // Werte werden in Form gesetzt
    this.anhangForm.controls['name'].setValue(this.choosenAnhang.name);
    this.anhangForm.controls['beschreibung'].setValue(this.choosenAnhang.beschreibung);
    this.anhangForm.controls['kategorie'].setValue(this.choosenAnhang.anhangkategorie as any);

    // Uploadstatus wird gesetzt
    this.currentUploadState = this.choosenAnhang.ID != 0 ? 5 : 0;

    // Dialog wird geöffnet
    this.displayDialog = true;
  }

  openKategorieDialog(anhangkategorie: Anhangkategorie = null as any) {
    // Gewählte Anhangkategorie wird gespeichert
    this.choosenAnhangkategorie = anhangkategorie != null ? anhangkategorie : new Anhangkategorie(0, "");

    // Werte werden in Form gesetzt
    this.anhangKategorieForm.controls['name'].setValue(this.choosenAnhangkategorie.name);

    // Dialog wird geöffnet
    this.displayKategorieDialog = true;
  }

  showConfirm(event: any, isDelete: number) {
    this.confirmationService.confirm({
      target: event.target,
      message: 'Sind Sie sicher?',
      icon: 'pi pi-exclamation-triangle',
      accept: isDelete == 0 ? this.deleteAnhang.bind(this) : isDelete == 1 ? this.quitAnhang.bind(this) : this.deleteAnhangkategorie.bind(this)
    });
  }

  private deleteAnhang() {
    // Anhang wird im Service gelöscht
    this.anhangService.deleteAnhang(this.choosenAnhang, (res: JSON) => {
      let object: any = res;
      let anhang: Anhang = Anhang.buildFromObject(object);
      // Element wird aus Liste entfernt
      this.anhangList = this.anhangList.filter(x => x.ID != anhang.ID);
      this.anhangSocketService.sendOperation("DELETE", "", anhang.toJSONString());
    });

    // Dialog wird geschlossen
    this.displayDialog = false;
  }

  private quitAnhang() {
    // Hochgeladene Datei muss gelöscht werden, falls Anhang neu ist

    // Dialog wird geschlossen
    this.displayDialog = false;
  }

  private deleteAnhangkategorie() {
    // Kategorie wird gelöscht
    this.anhangService.deleteKategorie(this.choosenAnhangkategorie, (res: JSON) => {
      let object: any = res;
      let kategorie: Anhangkategorie = Anhangkategorie.buildFromObject(object);
      // Kategorie wird aus Array entfernt
      this.kategorienList = this.kategorienList.filter(x => x.ID != kategorie.ID);
      this.anhangKategorieSocketService.sendOperation("DELETE", "", kategorie.toJSONString());
    });

    // Dialog wird geschlossen
    this.displayKategorieDialog = false;
  }

  saveAnhang() {
    // Werte der Form werden in Objekt übernommen
    this.choosenAnhang.name = "" + this.anhangForm.get('name')?.value;
    this.choosenAnhang.beschreibung = "" + this.anhangForm.get('beschreibung')?.value;
    this.choosenAnhang.anhangkategorie = this.anhangForm.get('kategorie')?.value as any;
    this.choosenAnhang.masterID = AppComponent.PROTOKOLLID;
    this.choosenAnhang.masterType = 1;

    if(this.choosenAnhang.ID == 0) {
      // Anhang wird gespeichert
      this.anhangService.saveAnhang(this.choosenAnhang, (res: JSON) => {
        let object: any = res;
        let anhang: Anhang = Anhang.buildFromObject(object);
        // Element wird zur List hinzugefügt
        this.anhangList.push(anhang);
        this.anhangSocketService.sendOperation("CREATE", "", anhang.toJSONString());
      });
    } else {
      this.anhangService.updateAnhang(this.choosenAnhang, (res: JSON) => {
        let object: any = res;
        let updatedAnhang: Anhang = Anhang.buildFromObject(object);
        for(let anhang of this.anhangList) {
          if(anhang.ID == updatedAnhang.ID) {
            anhang = updatedAnhang;
          }
        }
        this.anhangList = Array.from(this.anhangList);
        this.anhangSocketService.sendOperation("UPDATE", "", updatedAnhang.toJSONString());
      });
    }


    // Dialog wird geschlossen
    this.displayDialog = false;
  }

  saveKategorie() {
    // Werte der Form werden in Objekt übernommen
    this.choosenAnhangkategorie.name = "" + this.anhangKategorieForm.get('name')?.value;

    if(this.choosenAnhangkategorie.ID == 0) {
      // Kategorie wird gespeichert
      this.anhangService.saveKategorie(this.choosenAnhangkategorie, (res: JSON) => {
        let object: any = res;
        let kategorie: Anhangkategorie = Anhangkategorie.buildFromObject(object);
        this.kategorienList.push(kategorie);
        this.anhangKategorieSocketService.sendOperation("CREATE", "", kategorie.toJSONString());
      });
    } else {
      // Kategorie wird aktualisiert
      this.anhangService.updateKategorie(this.choosenAnhangkategorie, (res: JSON) => {
        let object: any = res;
        let updatedKategorie: Anhangkategorie = Anhangkategorie.buildFromObject(object);
        for(let kategorie of this.kategorienList) {
          if(kategorie.ID == updatedKategorie.ID) {
            kategorie = updatedKategorie;
          }
        }
        this.kategorienList = Array.from(this.kategorienList);
        this.anhangKategorieSocketService.sendOperation("UPDATE", "", updatedKategorie.toJSONString());
      });
    }
    

    // Dialog wird geschlossen
    this.displayKategorieDialog = false;
  }

  uploadHandler(event: any) {
    // Form wird erstellt
    let formData = new FormData();
    // Files werden durchlaufen
    for (var i = 0; i < event.files.length; i++) {
      // File wird Form hinzugefügt
      formData.append("file", event.files[i], event.files[i].name);
    }

    let metadata = AppComponent.METAOBJECT();

    // Metadaten werden in Form hinzugefügt
    formData.append("meta", JSON.stringify(metadata));

    this.currentUploadState = 2;

    try {
      this.httpClient.post(this.uploadUrl, formData)
        .pipe(catchError(err => this.handleError(err)))
        .subscribe((response: any) => {
          let responseObj = JSON.parse(JSON.stringify(response));
          this.currentUploadState = 5;
          this.choosenAnhang.filename = responseObj["NAME"];
          this.choosenAnhang.storagepath = responseObj["PATH"];
          this.fileUploader.clear();
        });
    } catch (err) {
      this.currentUploadState = 4;
    }

  }

  private handleError(error: any): Observable<Response> {
    this.currentUploadState = 4;
    return throwError(error);
  }

  downloadAnhangFile() {
    //this.choosenAnhang.storagepath = "C:\\FILESTORAGE\\4\\5\\1\\13\\09_02_2022_15_15_52_034.txt"

    this.httpClient.get(this.downloadUrl + "?path=" + btoa(this.choosenAnhang.storagepath), {
      responseType: 'blob'
    }).subscribe(blob => saveAs(blob, this.choosenAnhang.filename));
  }

}
