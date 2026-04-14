import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Componentes
import { AccesoListComponent } from './pages/list/list.component';

// Servicios
import { AccesoService } from './services/acceso.service';
import {SharedModule} from "../../shared/shared.module";





@NgModule({
  declarations: [
    AccesoListComponent,

  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        SharedModule
    ],
  providers: [
    AccesoService
  ],
  exports: [
    AccesoListComponent
  ]
})
export class AccesosModule {}
