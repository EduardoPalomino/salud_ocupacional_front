import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Componentes
import { EmpresaListComponent } from './pages/list/list.component';
import { FormComponent } from './pages/form/form.component';
import {SharedModule} from "../../shared/shared.module";
// Servicios
import { EmpresaService } from './services/empresa.service';

@NgModule({
  declarations: [
    EmpresaListComponent,
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
    EmpresaService
  ],
  exports: [
    EmpresaListComponent,
    SharedModule,
    FormComponent
  ]
})
export class EmpresasModule {}