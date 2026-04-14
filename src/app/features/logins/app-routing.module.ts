import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginListComponent } from './pages/list/list.component';

const routes: Routes = [
  { path: '', component: LoginListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginsRoutingModule { }