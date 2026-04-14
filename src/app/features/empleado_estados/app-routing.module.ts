import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Empleado_estadoListComponent } from './pages/list/list.component';

const routes: Routes = [
  { path: '', component: Empleado_estadoListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Empleado_estadosRoutingModule { }