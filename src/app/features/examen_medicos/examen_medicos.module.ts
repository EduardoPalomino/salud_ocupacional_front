import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Componentes
import { Examen_medicoListComponent } from './pages/list/list.component';
import { FormComponent } from './pages/form/form.component';
import {SharedModule} from "../../shared/shared.module";
// Servicios
import { Examen_medicoService } from './services/examen_medico.service';

@NgModule({
  declarations: [
    Examen_medicoListComponent,
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
    Examen_medicoService
  ],
  exports: [
    Examen_medicoListComponent,
    SharedModule,
    FormComponent
  ]
})
export class Examen_medicosModule {}