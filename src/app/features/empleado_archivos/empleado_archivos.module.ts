import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Componentes
import { Empleado_archivoListComponent } from './pages/list/list.component';
import { FormComponent } from './pages/form/form.component';
import {SharedModule} from "../../shared/shared.module";
// Servicios
import { Empleado_archivoService } from './services/empleado_archivo.service';

@NgModule({
  declarations: [
    Empleado_archivoListComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
  ],
  providers: [
    Empleado_archivoService
  ],
  exports: [
    Empleado_archivoListComponent,
    SharedModule,
    FormComponent
  ]
})
export class Empleado_archivosModule {}