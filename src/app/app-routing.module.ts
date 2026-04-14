import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// ✅ Importa correctamente los componentes
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DashboardListComponent } from './features/dashboards/pages/list/list.component';
import {LoginListComponent} from "./features/logins/pages/list/list.component";
import {EmpresaListComponent} from "./features/empresas/pages/list/list.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginListComponent
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboards',
        pathMatch: 'full'
      },
      {
        path: 'dashboards',
        component: DashboardListComponent
      }
    ]
  },
  // Fallback: si no se encuentra la ruta, redirige al dashboard
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
