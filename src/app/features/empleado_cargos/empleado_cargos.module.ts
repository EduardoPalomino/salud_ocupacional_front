import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Componentes
import { Empleado_cargoListComponent } from './pages/list/list.component';
import { FormComponent } from './pages/form/form.component';
import {SharedModule} from "../../shared/shared.module";
// Servicios
import { Empleado_cargoService } from './services/empleado_cargo.service';

@NgModule({
  declarations: [
    Empleado_cargoListComponent,
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
    Empleado_cargoService
  ],
  exports: [
    Empleado_cargoListComponent,
    SharedModule,
    FormComponent
  ]
})
export class Empleado_cargosModule {}