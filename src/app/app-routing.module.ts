import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { CreateContentPageComponent } from './components/document-page/content-page/create-content-page/create-content-page.component';
import { DocumentHomePageComponent } from './components/document-page/document-home-page/document-home-page.component';
import { DocumentPreviewPageComponent } from './components/document-page/document-preview-page/document-preview-page.component';
import { DemoPageComponent } from './components/demo-page/demo-page.component';







const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'documentHome', component: DocumentHomePageComponent },
  { path: 'documentPreview', component: DocumentPreviewPageComponent },
  { path: 'content', component: CreateContentPageComponent },
   { path: 'home', component: HomePageComponent },
   { path: 'demo', component: DemoPageComponent },

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
