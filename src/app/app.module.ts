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
import { DocumentModalPageComponent } from './components/document-page/document-modal-page/document-modal-page.component';
import { DocumentDataControlService } from './services/document/document-data-control.service';
import { LoadingPageComponent } from './components/plugin-page/loading-page/loading-page.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientService } from './services/common/httpClient.service';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import { SocketIoService } from './services/common/socket.service';
import { CommonDataControlService } from './services/common/common-data-control.service';
import { RangeSliderPageComponent } from './components/plugin-page/range-slider-page/range-slider-page.component';
import { AdHost } from './directives/ad-host/ad-host.directive';
import { ImgContentComponent } from './contents/img-content/img-content';
import { ContentRouting } from './app-content-routing';
import { ContentDataControlService } from './services/content/content-data-control.service';
import { LoadImagePipe } from './pipes/load-img.pipe';
import { LayoutRouting } from './app-layout-routing';
import { CusSrc } from './directives/cus-src.directive';
import { ToolBarService } from './services/document/toolbar.service';
import { ContentService } from './services/content/content.service';

export const COMPONENTS: any[] = [
  AppComponent,
  HomePageComponent,
  DocumentHomePageComponent,
 CreateContentPageComponent,
 DocumentPreviewPageComponent,
 DocumentModalPageComponent,
];
export const PLUGINS: any[] = [
  LoadingPageComponent,
  RangeSliderPageComponent,
];
export const LAYOUTS: any[] = [
  ...LayoutRouting.exports
  
];
export const MODULES: any[] = [
  AppRoutingModule,
  CKEditorModule,
  BrowserModule,
  FormsModule,
  HttpClientModule,
  AmplifyAngularModule
];
export const CONTENTS: any[] = [
  ...ContentRouting.exports
]
export const SERVICES: any[] = [
  CommonService,
  DocumentService,
  CommonDataControlService,
  DocumentDataControlService,
  ContentDataControlService,
  HttpClientService,
  AmplifyService,
  SocketIoService,
  ToolBarService,
  ContentService
];
export const PIPES: any[] = [
  LoadImagePipe

];
export const DIRECTIVES: any[] = [
AdHost,
CusSrc

];
@NgModule({
  declarations: [
    ...COMPONENTS,
    ...CONTENTS,
    ...DIRECTIVES,
    ...LAYOUTS,
    ...PIPES,
    ...PLUGINS,
  ],
  imports: [
    ...MODULES,
    // ...CONTENTS
  ],
  exports:[],
  providers: [
    ...SERVICES
  ],

  entryComponents: [...CONTENTS,...LAYOUTS ],
  // exports:[  
  //   ...CONTENTS 
  // ],
  bootstrap: [AppComponent]
})
export class AppModule { }
