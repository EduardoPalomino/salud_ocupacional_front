import { Component } from '@angular/core';

@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss']
})
export class DataGridComponent {
  datos= [
    {'key':'1','nombre':'lorem-ipdum','ruc':'lorem-ipdum','telefono':'lorem-ipdum','direccion':'lorem-ipdum','representante':'lorem-ipdum'},
    {'key':'2','nombre':'lorem-ipdum','ruc':'lorem-ipdum','telefono':'lorem-ipdum','direccion':'lorem-ipdum','representante':'lorem-ipdum'}
  ];
  filtro:string[] = ['nombre','ruc','telefono','direccion','representante'];
  head:string[] = ['key','nombre','ruc','telefono','direccion','representante'];
  pagination: any = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  };
}
