import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {SharedModule} from "../../shared/shared.module";
// PrimeNG
// Componentes
import { LoginListComponent } from './pages/list/list.component';

// Servicios

@NgModule({
  declarations: [
    LoginListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [
  ],
  exports: [
    LoginListComponent
  ]
})
export class LoginsModule {}
