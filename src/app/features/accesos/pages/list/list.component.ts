import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AccesoService } from '../../services/acceso.service';
import { RolService } from '../../../rols/services/rol.service';
import { PageService } from '../../../pages/services/page.service';
import { Acceso } from '../../interfaces/acceso.interface';
import { Rol } from '../../../rols/interfaces/rol.interface';
import { Page } from '../../../pages/interfaces/page.interface';
import {environment} from "../../../../../environments/environment";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {json} from "express";


type IPage = Omit<Page,'created_at'|'updated_at'>& {
  checked:boolean;
};

@Component({
  selector: 'app-acceso-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class AccesoListComponent implements OnInit {
  accesos: Acceso[] = [];
  filteredAccesos: Acceso[] = [];
  modalVisible: boolean = false;
  modalTitle: string = '';
  rols: Rol[] = [];
  pages: IPage[] = [];
  ipages: IPage[] = [];
  selected_rol: { label:string; value:string }[] = [{ label:'Seleccione Rol',value:'0' }];
  accesoForm: FormGroup;
  mode: string = '';
  categories: any[] = [];
  pageList = [
    { id: '01', nombre: 'Página 1', checked: true },
    { id: '02', nombre: 'Página 2', checked: false },
    { id: '03', nombre: 'Página 3', checked: true }
  ];
  selectedPages: IPage[] = [];
  apiUrl = `${environment.API_URL}`;
  pagination: any = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  };
  searchTerm: string = '';
  // ---  DATOS DE SESSION ------
  nombre:string  = sessionStorage.getItem('nombre') || '""';
  apellido:string  = sessionStorage.getItem('apellido') || '""';
  email:string  =  sessionStorage.getItem('email') || '""';
  rol_id: string = sessionStorage.getItem('rol_id') || '""';
  archivo:any  = sessionStorage.getItem('archivo')!=''?sessionStorage.getItem('archivo'):'/uploads/avatar_generico.png';
  empresa_id: string = sessionStorage.getItem('empresa_id') || '""';
  // ---  DATOS DE SESSION ------
  constructor(
    private fb: FormBuilder,
    private accesoService: AccesoService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private rolService: RolService,
    private pageService: PageService,
    private router: Router,
    private http: HttpClient
  ) {
    this.accesoForm = this.fb.group({
      _id: [null],
      rol_id: ['', Validators.required],
      page: [''],
      selectedPages: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadRols(1);
    this.loadAccesos();
    this.loadPages(1);
  }
  loadRols(page: number = 1) {
    this.rolService.getAll(this.searchTerm,this.empresa_id, page, this.pagination.itemsPerPage).subscribe({
      next: (data:any) => {
        if(data && data.response){
          this.rols = data.response;
          this.selected_rol = this.rols.map(rol => ({
            label: rol.descripcion,
            value: rol._id
          }));
        }
      },
      error: (err) => {
        console.error('Error al cargar rols:', err);
      }
    });
  }
  loadAccesos() {
    this.accesoService.getAll().subscribe({
      next: (resp:any) => {
       var data = resp.response;
        if(data){
          this.accesos = data;
          this.filteredAccesos = [...this.accesos];
        }
      },
      error: (err) => {
        console.error('Error al cargar Accesos:', err);
      }
    });
  }

  loadPages(page: number = 1): void {
    this.pageService.getAll('',this.empresa_id, page, 100).subscribe({
      next: (data:any) => {
        if(data && data.response){
          var idata = data.response;
          this.ipages = idata.map((d:any)=>{
            return{
              _id:d._id,
              order: d.order,
              ruta: d.ruta,
              nombre: d.nombre,
              icon:  d.icon,
              checked: false,
            }
          })

        }
        if (this.mode === 'Editar' && this.accesoForm.value._id) {

        }
      },
      error: (err: any) => {
        console.error('Error al cargar pages:', err);
      }
    });
  }
  openModal(mode: 'Nuevo' | 'Editar', acceso?: Acceso) {
    this.mode = mode;
    this.modalTitle = `${mode} Acceso`;
    this.modalVisible = true;
    if (mode === 'Editar' && acceso) {
      this.accesoForm.patchValue({
        _id: acceso._id,
        rol_id: acceso.rol_id,
        page: acceso.page
      });
    } else {
      this.accesoForm.reset();
      this.accesoForm.patchValue({empresa_id:this.empresa_id});
    }
  }
  confirmarEliminacion(acceso: Acceso) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar el Acceso: ${acceso.rol_id}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.deleteAcceso(acceso);
      }
    });
  }
  deleteAcceso(acceso: Acceso) {
    this.accesoService.delete(acceso._id).subscribe({
      next: () => {
        this.loadAccesos();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Acceso "${acceso.rol_id}" eliminado correctamente`
        });
      },
      error: (err) => {
        console.error('Error al eliminar el acceso:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo eliminar el acceso "${acceso.rol_id}"`
        });
      }
    });
  }
  saveRegistro() {
    if (this.accesoForm.valid) {
     // const checkboxStatus = this.getCheckboxStatus();
      const formData = this.accesoForm.value;
      console.log(" JSON.stringify(this.accesos) "+JSON.stringify(this.pages,null,2))
      formData.page = JSON.stringify(this.pages);
      formData.empresa_id = this.empresa_id;
      if (this.mode === 'Nuevo') {
        this.accesoService.create(formData).subscribe({
          next: (data) => {
            this.accesos.push(data);
            this.modalVisible = false;
            this.loadAccesos();
            this.mensajeConfirmacion(data, "Registro Creado");
          },
          error: (err) => {
            console.error('Error al guardar el acceso:', err);
          }
        });
      } else {
        this.accesoService.update(formData._id, formData).subscribe(() => {
          this.modalVisible = false;
          this.loadAccesos();
          this.mensajeConfirmacion(formData, "Registro Actualizado");
        });
      }
    }
  }
  compararActualizar(pages:any,pagesRegistrado:any){
    pagesRegistrado.page = JSON.parse(pagesRegistrado.page);
    const idsRegistrados = new Set(pagesRegistrado.page.map((p:any) => p._id));
    // Filtramos los que faltan
    const faltantes = pages.filter((p:any) => !idsRegistrados.has(p._id));
    // Agregamos los que faltan a registrado
    pagesRegistrado.page = [...pagesRegistrado.page, ...faltantes];
    pagesRegistrado.page = JSON.stringify(pagesRegistrado.page);
    return pagesRegistrado;
  }
  onChangeRol(e: any) {
    const rol_id= e.value
    const registro = this.findAcceso(rol_id);
    this.accesoForm.patchValue({ rol_id: rol_id });
    console.log("registro : "+registro)
    if(registro==0){
      this.mode='Nuevo';
      this.pages = this.ipages;
      console.log(this.pages)
    }else{
      this.mode='Editar';
      this.accesoForm.value._id=this.accesos.find((acceso:any) => acceso.rol._id == rol_id)?._id!
      const pagesRegistro = this.compararActualizar(this.ipages,registro);
      this.pages = JSON.parse(pagesRegistro.page);
      JSON.parse(this.accesos.find((acceso:any) => acceso.rol._id == rol_id)?.page!);
      this.findChecked();

    }
  }
  private findAcceso(rol_id: string): Acceso | any {
    console.log("----ESTOS SON LOS ACCESOS DE FIND ACCESO CON ROL_ID : "+rol_id)
    console.log(JSON.stringify(this.accesos,null,2))
    console.log("----ESTOS SON LOS ACCESOS DE FIND ACCESO CON ROL_ID : "+rol_id)
    return this.accesos.find((p:any) =>p.rol?._id == rol_id) ??0;
  }
  mensajeConfirmacion(acceso: Acceso, mensaje: String) {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: `${mensaje}`
    });
  }
  checkedPage(e:any,index:number){
    this.pages[index].checked = !this.pages[index].checked;
    console.log(this.pages)
    this.findChecked();
  }
  findChecked(){
    this.selectedPages=[];
    this.selectedPages = this.pages.filter(page => page.checked === true);
  }


}
