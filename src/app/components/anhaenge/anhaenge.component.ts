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
    bemerkung: [""],
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


  constructor(private confirmationService: ConfirmationService, private anhangService: AnhangService, private formBuilder: FormBuilder, private httpClient: HttpClient) { }

  async ngOnInit() {
    // Flag wird gesetzt
    this.loadingAnhaenge = true;
    // Aufgaben werden geladen
    this.anhangList = await this.anhangService.readAnhaenge();
    // Kategorien werden geladen
    this.kategorienList = await this.anhangService.readKategorien();
    // Flag wird gesetzt
    this.loadingAnhaenge = false;
  }

  openDialog(anhang: Anhang = null as any) {
    // Gewählter Anhang wird gespeichert
    this.choosenAnhang = anhang != null ? anhang : Anhang.buildEmpty();

    // Werte werden in Form gesetzt
    this.anhangForm.controls['name'].setValue(this.choosenAnhang.name);
    this.anhangForm.controls['bemerkung'].setValue(this.choosenAnhang.bemerkung);
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

  private async deleteAnhang() {
    // Anhang wird im Service gelöscht
    this.anhangService.deleteAnhang(this.choosenAnhang);

    // Element wird aus Liste entfernt
    this.anhangList.filter(x => x.ID == this.choosenAnhang.ID);

    // Dialog wird geschlossen
    this.displayDialog = false;
  }

  private async quitAnhang() {
    // Hochgeladene Datei muss gelöscht werden, falls Anhang neu ist

    // Dialog wird geschlossen
    this.displayDialog = false;
  }

  private async deleteAnhangkategorie() {
    // Kategorie wird gelöscht
    this.anhangService.deleteKategorie(this.choosenAnhangkategorie);

    console.log(this.choosenAnhangkategorie);

    // Kategorie wird aus Array entfernt
    this.kategorienList = this.kategorienList.filter(x => x.ID != this.choosenAnhangkategorie.ID);

    console.log(this.kategorienList.length);

    // Dialog wird geschlossen
    this.displayKategorieDialog = false;
  }

  saveAnhang() {
    // Werte der Form werden in Objekt übernommen
    this.choosenAnhang.name = "" + this.anhangForm.get('name')?.value;
    this.choosenAnhang.bemerkung = "" + this.anhangForm.get('bemerkung')?.value;
    this.choosenAnhang.anhangkategorie = this.anhangForm.get('kategorie')?.value as any;

    // Anhang wird gespeichert
    this.anhangService.saveAnhang(this.choosenAnhang);

    // Anhang wird Service hinzugefügt
    this.anhangList.push(this.choosenAnhang);

    // Dialog wird geschlossen
    this.displayDialog = false;
  }

  saveKategorie() {
    // Werte der Form werden in Objekt übernommen
    this.choosenAnhangkategorie.name = "" + this.anhangKategorieForm.get('name')?.value;

    // Kategorie wird gespeichert
    this.anhangService.saveKategorie(this.choosenAnhangkategorie);

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
          this.choosenAnhang.uploadfilename = responseObj["NAME"];
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
    }).subscribe(blob => saveAs(blob, this.choosenAnhang.uploadfilename));
  }

}
