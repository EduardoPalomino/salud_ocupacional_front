import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Componentes
import { EmpleadoListComponent } from './pages/list/list.component';
import { FormComponent } from './pages/form/form.component';
import {SharedModule} from "../../shared/shared.module";
// Servicios
import { EmpleadoService } from './services/empleado.service';

@NgModule({
  declarations: [
    EmpleadoListComponent,
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
    EmpleadoService
  ],
  exports: [
    EmpleadoListComponent,
    SharedModule,
    FormComponent
  ]
})
export class EmpleadosModule {}