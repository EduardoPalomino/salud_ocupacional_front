import { Component, OnInit} from '@angular/core';
import { ConfirmationService, MessageService,MenuItem} from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {environment} from "../../../../../environments/environment";
@Component({
  selector: 'app-dashboard-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService],


})
export class DashboardListComponent implements OnInit {
  userCountry: string = 'México';
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  mode:string='';
  selected_producto:any[]=[];
  selected_reporte: { label: string; value: string}[] = [{label: 'Gráfico Lineal', value: 'lineal'},{ label: 'Gráfico Barras', value: 'barra'}];
  grafico:{ tipo: string; num: number }[]= [{ tipo: 'lineal',num: 1 }];
  grafico2:{ tipo: string; num: number }[]= [{ tipo: 'lineal',num: 2 }];
  //MENU
  apiUrl = `${environment.API_URL}`;
  // ---  DATOS DE SESSION ------
  nombre:any  = sessionStorage.getItem('nombre');
  apellido:any  = sessionStorage.getItem('apellido');
  email:any  = sessionStorage.getItem('email');
  rol_id:any  = sessionStorage.getItem('rol_id');
  archivo:any  = sessionStorage.getItem('archivo')!=''?sessionStorage.getItem('archivo'):'/uploads/avatar_generico.png';
  empresa_id:any  = sessionStorage.getItem('empresa_id');
  // ---  DATOS DE SESSION ------

  constructor(
  private fb: FormBuilder,
  private confirmationService: ConfirmationService,
  private messageService: MessageService,
  private router: Router
  ) {

  }

  ngOnInit(): void {
  }
  redirectToMenu(link:String) {
    console.log("click en boton");
    this.router.navigate([link]);
  }
  logout(){
    this.router.navigate(['/login']);
  }
  onChangeReporte(e: any,num:number) {
    const tipo = e.value;
    //{label: 'Gráfico Lineal', value: 'lineal',grafico:1 }
      if(tipo=='lineal'){
        num==1?this.grafico=[{ tipo: 'lineal',num: 1 }]:this.grafico2=[{ tipo: 'lineal',num: 2 }];
      }else{
        num==1?this.grafico=[{ tipo: 'barra',num: 1 }]:this.grafico2=[{ tipo: 'barra',num: 2 }];
      }
    }
}
