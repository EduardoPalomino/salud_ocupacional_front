import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

// Importa el nuevo LayoutsModule
import { LayoutsModule } from './layouts/layouts.module';
import { DashboardsModule } from './features/dashboards/dashboards.module';
import {LoginsModule} from "./features/logins/logins.module";
import {AccesosModule} from "./features/accesos/accesos.module";

import { EmpresasModule } from "./features/empresas/empresas.module";
import { RolsModule } from "./features/rols/rols.module";
import { PagesModule } from "./features/pages/pages.module";
import { UsuariosModule } from "./features/usuarios/usuarios.module";
import { Empleado_estadosModule } from "./features/empleado_estados/empleado_estados.module";
import { Empleado_cargosModule } from "./features/empleado_cargos/empleado_cargos.module";
import { EmpleadosModule } from "./features/empleados/empleados.module";
import { Empleado_archivosModule } from "./features/empleado_archivos/empleado_archivos.module";
import { Examen_medicosModule } from "./features/examen_medicos/examen_medicos.module";
import { Examen_resultadosModule } from "./features/examen_resultados/examen_resultados.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LayoutsModule,
    DashboardsModule,
    LoginsModule,
    AccesosModule,
    FormsModule,

    EmpresasModule,
    RolsModule,
    PagesModule,
    AccesosModule,
    UsuariosModule,
    Empleado_estadosModule,
    Empleado_cargosModule,
    EmpleadosModule,
    Empleado_archivosModule,
    Examen_medicosModule,
    Examen_resultadosModule,
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
