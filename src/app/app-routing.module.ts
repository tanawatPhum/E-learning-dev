import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { CreateContentPageComponent } from './components/document-page/content-page/create-content-page/create-content-page.component';
import { DocumentHomePageComponent } from './components/document-page/document-home-page/document-home-page.component';
import { DocumentPreviewPageComponent } from './components/document-page/document-preview-page/document-preview-page.component';
import { NoteComponentComponent } from './note-component/note-component.component';
import { ExampleDocumentPageComponent } from './components/example-document-page/example-document-page/example-document-page.component';






const routes: Routes = [
  { path: '', redirectTo: '/exampleDoc', pathMatch: 'full' },
  { path: 'documentHome', component: DocumentHomePageComponent },
  { path: 'documentPreview', component: DocumentPreviewPageComponent },
  { path: 'content', component: CreateContentPageComponent },
  { path: 'exampleDoc', component: ExampleDocumentPageComponent },
   { path: 'home', component: HomePageComponent },
   {path: 'note',component: NoteComponentComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
