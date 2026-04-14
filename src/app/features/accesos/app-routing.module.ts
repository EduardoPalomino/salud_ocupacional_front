import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccesoListComponent } from './pages/list/list.component';

const routes: Routes = [
  { path: '', component: AccesoListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccesosRoutingModule { }