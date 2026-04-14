import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolListComponent } from './pages/list/list.component';

const routes: Routes = [
  { path: '', component: RolListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolsRoutingModule { }