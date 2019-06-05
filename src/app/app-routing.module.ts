import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { CreateContentPageComponent } from './components/content-page/create-content-page/create-content-page.component';
import { MainContentPageComponent } from './components/content-page/main-content-page/main-content-page.component';





const routes: Routes = [
  { path: '', redirectTo: 'mainContent', pathMatch: 'full' },
  { path: 'mainContent', component: MainContentPageComponent },
  { path: 'content', component: CreateContentPageComponent },
   { path: 'home', component: HomePageComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
