import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Componentes
import { PageListComponent } from './pages/list/list.component';
import { FormComponent } from './pages/form/form.component';
import {SharedModule} from "../../shared/shared.module";
// Servicios
import { PageService } from './services/page.service';

@NgModule({
  declarations: [
    PageListComponent,
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
    PageService
  ],
  exports: [
    PageListComponent,
    SharedModule,
    FormComponent
  ]
})
export class PagesModule {}