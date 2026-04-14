import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Componentes
import { RolListComponent } from './pages/list/list.component';
import { FormComponent } from './pages/form/form.component';
import {SharedModule} from "../../shared/shared.module";
// Servicios
import { RolService } from './services/rol.service';

@NgModule({
  declarations: [
    RolListComponent,
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
    RolService
  ],
  exports: [
    RolListComponent,
    SharedModule,
    FormComponent
  ]
})
export class RolsModule {}