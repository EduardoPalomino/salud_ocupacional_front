import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// ✅ Importa correctamente los componentes
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DashboardListComponent } from './features/dashboards/pages/list/list.component';
import {LoginListComponent} from "./features/logins/pages/list/list.component";


import { AccesoListComponent } from "./features/accesos/pages/list/list.component";
import { EmpleadoListComponent } from "./features/empleados/pages/list/list.component";
import { Empleado_archivoListComponent } from "./features/empleado_archivos/pages/list/list.component";
import { Empleado_cargoListComponent } from "./features/empleado_cargos/pages/list/list.component";
import { Empleado_estadoListComponent } from "./features/empleado_estados/pages/list/list.component";
import { EmpresaListComponent } from "./features/empresas/pages/list/list.component";
import { Examen_medicoListComponent } from "./features/examen_medicos/pages/list/list.component";
import { Examen_resultadoListComponent } from "./features/examen_resultados/pages/list/list.component";
import { PageListComponent } from "./features/pages/pages/list/list.component";
import { RolListComponent } from "./features/rols/pages/list/list.component";
import { UsuarioListComponent } from "./features/usuarios/pages/list/list.component";


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
        ,
      {
        path: 'accesos',
        component: AccesoListComponent
      },
      {
        path: 'empleados',
        component: EmpleadoListComponent
      },
      {
        path: 'empleado_archivos',
        component: Empleado_archivoListComponent
      },
      {
        path: 'empleado_cargos',
        component: Empleado_cargoListComponent
      },
      {
        path: 'empleado_estados',
        component: Empleado_estadoListComponent
      },
      {
        path: 'empresas',
        component: EmpresaListComponent
      },
      {
        path: 'examen_medicos',
        component: Examen_medicoListComponent
      },
      {
        path: 'examen_resultados',
        component: Examen_resultadoListComponent
      },
      {
        path: 'pages',
        component: PageListComponent
      },
      {
        path: 'rols',
        component: RolListComponent
      },
      {
        path: 'usuarios',
        component: UsuarioListComponent
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
