import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Empleado_cargoListComponent } from './pages/list/list.component';

const routes: Routes = [
  { path: '', component: Empleado_cargoListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Empleado_cargosRoutingModule { }