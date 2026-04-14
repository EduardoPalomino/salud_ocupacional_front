import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { RouterModule } from '@angular/router';
import { SplitButtonModule } from 'primeng/splitbutton';
// ✅ Importa PrimeNG aquí
import { MenuModule } from 'primeng/menu';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';

@NgModule({
  declarations: [
    AdminLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MenuModule,
    SidebarModule,
    ButtonModule,
    PanelModule,
    SplitButtonModule,
    PanelMenuModule

  ],
  exports: [
    AdminLayoutComponent  // Lo exportas para que el router lo reconozca
  ]
})
export class LayoutsModule { }
