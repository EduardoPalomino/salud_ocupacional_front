import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Examen_resultadoListComponent } from './pages/list/list.component';

const routes: Routes = [
  { path: '', component: Examen_resultadoListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Examen_resultadosRoutingModule { }