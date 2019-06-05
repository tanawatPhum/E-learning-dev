import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomePageComponent } from './components/home-page/home-page.component';
import { CreateContentPageComponent } from './components/content-page/create-content-page/create-content-page.component';
import { MainContentPageComponent } from './components/content-page/main-content-page/main-content-page.component';
import { CommonService } from './services/common/common.service';





export const COMPONENTS: any[] = [
  AppComponent,
  HomePageComponent,
  MainContentPageComponent,
 CreateContentPageComponent
];
export const LAYOUTS: any[] = [

];
export const MODULES: any[] = [
  BrowserModule,
  AppRoutingModule,
];
export const SERVICES: any[] = [
  CommonService
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
