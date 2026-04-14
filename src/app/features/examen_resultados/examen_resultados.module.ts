import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Componentes
import { Examen_resultadoListComponent } from './pages/list/list.component';
import { FormComponent } from './pages/form/form.component';
import {SharedModule} from "../../shared/shared.module";
// Servicios
import { Examen_resultadoService } from './services/examen_resultado.service';

@NgModule({
  declarations: [
    Examen_resultadoListComponent,
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
    Examen_resultadoService
  ],
  exports: [
    Examen_resultadoListComponent,
    SharedModule,
    FormComponent
  ]
})
export class Examen_resultadosModule {}