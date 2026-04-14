import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Componentes
import { DashboardListComponent } from './pages/list/list.component';
import {SharedModule} from "../../shared/shared.module";
// Servicios

@NgModule({
  declarations: [
    DashboardListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [],
  exports: [
    DashboardListComponent,
  ]
})
export class DashboardsModule {}
