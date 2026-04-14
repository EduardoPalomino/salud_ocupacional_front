import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Examen_medicoListComponent } from './pages/list/list.component';

const routes: Routes = [
  { path: '', component: Examen_medicoListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Examen_medicosRoutingModule { }