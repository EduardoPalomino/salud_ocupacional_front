import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectedInputComponent } from './ui-controls/selected-input/selected-input.component';
// PrimeNG
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { PaginatorModule } from 'primeng/paginator';
import { ImageModule } from 'primeng/image';
import { ChartModule } from 'primeng/chart';
import { TabViewModule } from 'primeng/tabview';
import { PanelModule } from 'primeng/panel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarModule } from 'primeng/sidebar';
import { MenuModule } from 'primeng/menu';
import { DividerModule } from 'primeng/divider';
import { ToolbarModule } from 'primeng/toolbar';
import { RippleModule } from 'primeng/ripple';
import {InputNumberModule} from "primeng/inputnumber";
import { SplitButtonModule } from 'primeng/splitbutton';
// PrimeNG Services
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import {ReactiveFormsModule} from "@angular/forms";
import { SelectedInput2Component } from './ui-controls/selected-input2/selected-input2.component';
import { MenuSidebarComponent } from './ui-controls/menu-sidebar/menu-sidebar.component';
import { MenuPerfilComponent } from './ui-controls/menu-perfil/menu-perfil.component';
import { ChartLineComponent } from './ui-controls/chart-line/chart-line.component';
import { ChartVerticalBarComponent } from './ui-controls/chart-vertical-bar/chart-vertical-bar.component';
import { DataGridComponent } from './ui-controls/data-grid/data-grid.component';
import { ModalUiComponent } from './ui-controls/modal-ui/modal-ui.component';


@NgModule({
  declarations: [
    SelectedInputComponent,
    SelectedInput2Component,
    MenuSidebarComponent,
    MenuPerfilComponent,
    ChartLineComponent,
    ChartVerticalBarComponent,
    DataGridComponent,
    ModalUiComponent  // ✅ Declara el componente
  ],
  imports: [
    CommonModule,
    TableModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule,
    CalendarModule,
    FileUploadModule,
    RadioButtonModule,
    InputSwitchModule,
    InputTextareaModule,
    CheckboxModule,
    PaginatorModule,
    ImageModule,
    ChartModule,
    TabViewModule,
    PanelModule,
    PanelMenuModule,
    BrowserAnimationsModule,
    SidebarModule,
    MenuModule,
    DividerModule,
    ToolbarModule,
    RippleModule,
    InputNumberModule,
    ReactiveFormsModule,
    SplitButtonModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
  ],
  exports: [
    SelectedInputComponent,
    MenuSidebarComponent,
    CommonModule,
    TableModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule,
    CalendarModule,
    FileUploadModule,
    RadioButtonModule,
    InputSwitchModule,
    InputTextareaModule,
    CheckboxModule,
    PaginatorModule,
    ImageModule,
    ChartModule,
    TabViewModule,
    PanelModule,
    PanelMenuModule,
    BrowserAnimationsModule,
    SidebarModule,
    MenuModule,
    DividerModule,
    ToolbarModule,
    RippleModule,
    InputNumberModule,
    ReactiveFormsModule,
    SplitButtonModule,
    MenuPerfilComponent,
    ChartLineComponent,
    ChartVerticalBarComponent
  ]
})
export class SharedModule { }
