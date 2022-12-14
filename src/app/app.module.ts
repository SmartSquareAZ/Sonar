import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BesprechungComponent } from './components/besprechung/besprechung.component';
import { AufgabenComponent } from './components/aufgaben/aufgaben.component';
import { LayoutwrapperComponent } from './components/layoutwrapper/layoutwrapper.component';
import { ActionwrapperComponent } from './components/actionwrapper/actionwrapper.component';
import { AgendaComponent } from './components/agenda/agenda.component';
import { AnhaengeComponent } from './components/anhaenge/anhaenge.component';
import { AnwesenheitComponent } from './components/anwesenheit/anwesenheit.component';
import { OnlineComponent } from './components/online/online.component';
import { LoadingComponent } from './components/loading/loading.component';
import { EditorToolbarComponent } from './components/editor-toolbar/editor-toolbar.component';
import { HtmlOutputComponent } from './components/html-output/html-output.component';
import { CustomEditorComponent } from './components/custom-editor/custom-editor.component';
import { AgendapunktheaderComponent } from './components/agendapunktheader/agendapunktheader.component';
import { ProtokollmessageskeletonComponent } from './components/protokollmessageskeleton/protokollmessageskeleton.component';
import { AgendapunktpanelComponent } from './components/agendapunktpanel/agendapunktpanel.component';
import { AgendatableentryComponent } from './components/agendatableentry/agendatableentry.component';
import { ProtokollmessagerowComponent } from './components/protokollmessagerow/protokollmessagerow.component';
import { ProtokollmessageoutputComponent } from './components/protokollmessageoutput/protokollmessageoutput.component';
import { CallbackPipe } from './pipes/callback.pipe';

import { PaginatorModule } from 'primeng/paginator';
import { TreeModule } from 'primeng/tree';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog'
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { TreeTableModule } from 'primeng/treetable';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { EditorModule } from 'primeng/editor';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ScrollerModule } from 'primeng/scroller';
import { SkeletonModule } from 'primeng/skeleton';
import { ListboxModule } from 'primeng/listbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ValidationHttpInterceptor } from './ValidationHttpInterceptor';
import { MessageService } from 'primeng/api';
import {SpeedDialModule} from 'primeng/speeddial';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ProtokollabschlussComponent } from './components/protokollabschluss/protokollabschluss.component';


@NgModule({
  declarations: [
    AppComponent,
    BesprechungComponent,
    AufgabenComponent,
    LayoutwrapperComponent,
    ActionwrapperComponent,
    AgendaComponent,
    AnhaengeComponent,
    AnwesenheitComponent,
    OnlineComponent,
    LoadingComponent,
    EditorToolbarComponent,
    CallbackPipe,
    HtmlOutputComponent,
    CustomEditorComponent,
    AgendapunktheaderComponent,
    ProtokollmessageskeletonComponent,
    AgendapunktpanelComponent,
    AgendatableentryComponent,
    ProtokollmessagerowComponent,
    ProtokollmessageoutputComponent,
    ProtokollabschlussComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    PaginatorModule,
    TreeModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    ColorPickerModule,
    InputTextModule,
    TooltipModule,
    TreeTableModule,
    ProgressSpinnerModule,
    TableModule,
    EditorModule,
    RadioButtonModule,
    DropdownModule,
    CalendarModule,
    SelectButtonModule,
    ConfirmPopupModule,
    HttpClientModule,
    AngularEditorModule,
    ScrollerModule,
    SkeletonModule,
    ListboxModule,
    InputTextareaModule,
    FileUploadModule,
    ToastModule,
    SpeedDialModule,
    ToggleButtonModule
  ],
  providers: [ MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ValidationHttpInterceptor,
      multi: true
    } 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
