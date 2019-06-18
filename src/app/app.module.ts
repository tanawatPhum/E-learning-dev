import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomePageComponent } from './components/home-page/home-page.component';
import { CreateContentPageComponent } from './components/content-page/create-content-page/create-content-page.component';

import { CommonService } from './services/common/common.service';
import { DocumentPageComponent } from './components/content-page/document-page/document-page.component';
import { FormsModule } from '@angular/forms';
import { ContentService } from './services/document/content.service';
import { DocumentPreviewPageComponent } from './components/content-page/document-preview-page/document-preview-page.component';




export const COMPONENTS: any[] = [
  AppComponent,
  HomePageComponent,
  DocumentPageComponent,
 CreateContentPageComponent,
 DocumentPreviewPageComponent
];
export const LAYOUTS: any[] = [

];
export const MODULES: any[] = [
  FormsModule,
  BrowserModule,
  AppRoutingModule,
];
export const SERVICES: any[] = [
  CommonService,
  ContentService
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
    ...PIPES
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
