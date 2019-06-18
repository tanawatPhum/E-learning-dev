import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { CreateContentPageComponent } from './components/content-page/create-content-page/create-content-page.component';
import { DocumentPageComponent } from './components/content-page/document-page/document-page.component';
import { DocumentPreviewPageComponent } from './components/content-page/document-preview-page/document-preview-page.component';






const routes: Routes = [
  { path: '', redirectTo: '/document', pathMatch: 'full' },
  { path: 'document', component: DocumentPageComponent },
  { path: 'documentPreview', component: DocumentPreviewPageComponent },
  { path: 'content', component: CreateContentPageComponent },
   { path: 'home', component: HomePageComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
