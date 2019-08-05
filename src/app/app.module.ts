import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomePageComponent } from './components/home-page/home-page.component';
import { CreateContentPageComponent } from './components/document-page/content-page/create-content-page/create-content-page.component';

import { CommonService } from './services/common/common.service';
import { DocumentHomePageComponent } from './components/document-page/document-home-page/document-home-page.component';
import { FormsModule } from '@angular/forms';
import { DocumentService } from './services/document/document.service';
import { DocumentPreviewPageComponent } from './components/document-page/document-preview-page/document-preview-page.component';
import { NoteComponentComponent } from './note-component/note-component.component';
import { DocumentModalPageComponent } from './components/document-page/document-modal-page/document-modal-page.component';
import { DocumentDataControlService } from './services/document/document-data-control.service';
import { LoadingPageComponent } from './components/plugin-page/loading-page/loading-page.component';
import { ExampleDocumentPageComponent } from './components/example-document-page/example-document-page/example-document-page.component';
import { CKEditorModule } from 'ckeditor4-angular';



export const COMPONENTS: any[] = [
  AppComponent,
  HomePageComponent,
  DocumentHomePageComponent,
 CreateContentPageComponent,
 DocumentPreviewPageComponent,
 NoteComponentComponent,
 DocumentModalPageComponent,
 LoadingPageComponent,
 ExampleDocumentPageComponent
];

export const LAYOUTS: any[] = [

];
export const MODULES: any[] = [
  AppRoutingModule,
  CKEditorModule,
  BrowserModule,
  FormsModule
];
export const SERVICES: any[] = [
  CommonService,
  DocumentService,
  DocumentDataControlService
];
export const PIPES: any[] = [

];
export const DIRECTIVES: any[] = [

];
@NgModule({
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES,
    ...LAYOUTS,
    ...PIPES,
    NoteComponentComponent
  ],
  imports: [
    ...MODULES
  ],
  providers: [
    ...SERVICES
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
