import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AjoutAdminComponent } from './ajout-admin/ajout-admin.component';
import { ConnexionAdminComponent } from './connexion-admin/connexion-admin.component';
import { GardienLoginAdminGuard } from './gardien-login-admin.guard';
import { ListeCatalogueComponent } from './liste-catalogue/liste-catalogue.component';
import { ListeUsagerComponent } from './liste-usager/liste-usager.component';
const routes: Routes = [
  { path : "admin", component : ConnexionAdminComponent},
  { path : "admin/liste-usager", component : ListeUsagerComponent, canActivate:[GardienLoginAdminGuard]},
  { path : "admin/catalogue", component : ListeCatalogueComponent, canActivate:[GardienLoginAdminGuard]},
  { path : "admin/ajout-admin", component : AjoutAdminComponent, canActivate:[GardienLoginAdminGuard]},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
