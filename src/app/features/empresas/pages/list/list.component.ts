import { Component, OnInit,ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpresaService } from '../../services/empresa.service';

import { Empresa } from '../../interfaces/empresa.interface';

/*ACCESO A MODULOS*/
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../../../environments/environment";
import { Router } from '@angular/router';
import {PermissionService} from "../../../../shared/services/permission.service";
@Component({
    selector: 'app-empresa-list',
    templateUrl: './list.component.html',
    providers: [ConfirmationService, MessageService]
})
export class EmpresaListComponent implements OnInit {
    @ViewChild('fileUploadRef') fileUploadRef!: FileUpload;
    empresas: Empresa[] = [];
    filteredEmpresas: Empresa[] = [];
    globalFilter: string = '';
    modalVisible: boolean = false;
    modalTitle: string = '';
    
    
    empresaForm: FormGroup;
    mode: string = '';
    pagination: any = {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 0
    };
    searchTerm: string = '';
    uploadedFile: File | null = null;
    previewImage: string | ArrayBuffer | null = null;
    file:any;
    apiUrl = `${environment.API_URL}`;
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
        private empresaService: EmpresaService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        
        private permissionService:PermissionService,
        private router: Router,
        private http: HttpClient
    ) {
        this.empresaForm = this.fb.group({
            _id: [null],
            nombre: ['', Validators.required],
            ruc: ['', Validators.required],
            direccion: ['', Validators.required],
            telefono: ['', Validators.required],
            email: ['', Validators.required],
            estado: ['', Validators.required]
        });
    }

    ngOnInit(): void {
       this.permiso();
    }

    onInitial(){
       
       this.loadEmpresas(1);
    }

    permiso():void{
      console.log("this.rol_id "+this.rol_id)
      this.permissionService.permiso(this.rol_id).subscribe((tienePermiso) => {
        if (tienePermiso) {
          // acceso permitido
          console.log(tienePermiso+'si')
          this.onInitial();
        } else {
          console.log(tienePermiso+'no')
          // redirigido o sin acceso
          this.router.navigate(['admin/dashboard']);
        }
      });
    }

    loadEmpresas(page: number = 1) {
        this.empresaService.getAll(this.searchTerm,this.empresa_id, page, this.pagination.itemsPerPage).subscribe({
            next: (data: any) => {
                this.empresas = data.response;
                this.pagination = {
                  currentPage: data.pagination.currentPage,
                  itemsPerPage: data.pagination.itemsPerPage,
                  totalItems: data.pagination.totalItems,
                  totalPages: data.pagination.totalPages
                };
            },
            error: (err) => {
                console.error('Error al cargar Empresas:', err);
            }
        });
    }


    filtrar(e:any) {
      //console.log(JSON.stringify(e));
      this.searchTerm = e;
      this.loadEmpresas(1);
    }

    onPageChange(page: number) {
      this.pagination.currentPage = page;
      this.loadEmpresas(page);
    }

    onSearch(searchTerm: string) {
      this.searchTerm = searchTerm;
      this.loadEmpresas(1); // Resetear a primera página al buscar
    }

    descargar(){

    }

    importar(){

    }
    private resetFileUpload() {
      // 1. Limpiar variables de estado
      this.uploadedFile = null;
      this.previewImage = null;

      // 2. Resetear el componente FileUpload si está disponible
      if (this.fileUploadRef) {
        // Desactivar auto temporalmente
        const wasAuto = this.fileUploadRef.auto;
        this.fileUploadRef.auto = false;

        // Limpiar archivos seleccionados
        this.fileUploadRef.clear();

        // Resetear arrays internos
        this.fileUploadRef.files = [];
        (this.fileUploadRef as any)._files = []; // Usamos 'any' para acceder a propiedad privada

        // Limpiar input file nativo
        if ((this.fileUploadRef as any).basicFileInput?.nativeElement) {
          (this.fileUploadRef as any).basicFileInput.nativeElement.value = '';
        }

        // Restaurar estado auto
        setTimeout(() => {
          this.fileUploadRef.auto = wasAuto;
        }, 100);
      }
    }
    openModal(mode: 'Nuevo' | 'Editar', empresa?: Empresa) {
        this.mode = mode;
        console.log(mode);
        this.modalTitle = `${mode} Empresa`;
        this.modalVisible = true;
        this.resetFileUpload();
        if (mode === 'Editar' && empresa) {
            this.empresaForm.patchValue({
                _id: empresa._id,
                nombre: empresa.nombre,
                ruc: empresa.ruc,
                direccion: empresa.direccion,
                telefono: empresa.telefono,
                email: empresa.email,
                estado: empresa.estado
            });
        } else {
            this.empresaForm.reset();
        }
    }

    confirmarEliminacion(empresa: Empresa) {
        console.log("Clic en eliminar:", empresa);
        this.confirmationService.confirm({
            message: `¿Estás seguro de eliminar el Empresa: ${empresa.nombre}?`,
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => {
                this.deleteEmpresa(empresa);
            }
        });
    }

    deleteEmpresa(empresa: Empresa) {
        this.empresaService.delete(empresa._id,this.empresa_id).subscribe({
            next: () => {
                this.loadEmpresas(1);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: `Empresa "${empresa.nombre}" eliminado correctamente`
                });
            },
            error: (err) => {
                console.error('Error al eliminar el empresa:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `No se pudo eliminar el empresa "${empresa.nombre}"`
                });
            }
        });
    }

    saveRegistro() {
        if (this.empresaForm.valid) {
          const empresa = this.empresaForm.value;
          console.log('si valid');
          this.saveEmpresaData(empresa);
        }
    }

    private async  saveEmpresaData(empresa: any) {
    // Limpiar el ID si es nuevo registro
    empresa._id === null && delete empresa._id;
    let key:number = 1;
    this.empresas.length===0?key=1:key=this.empresas[this.empresas.length - 1].key + 1;
    this.mode === 'Nuevo'? empresa.key = key:key;
    const saveObservable = this.mode === 'Nuevo'
      ? this.empresaService.create(empresa)
      : this.empresaService.update(empresa._id,this.empresa_id,empresa);

    saveObservable.subscribe({
      next: (data) => {
        console.log('Empresa guardado con éxito:', data);
        this.modalVisible = false;
        this.loadEmpresas();
        this.mensajeConfirmacion(empresa, "Registro Actualizado");
      },
      error: (err) => {
        console.error('Error al guardar el empresa:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al guardar el empresa'
        });
      }
    });
  }




    mensajeConfirmacion(empresa: Empresa, mensaje: String) {
        this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Empresa "${empresa.nombre}" ${mensaje}`
        });
    }

  formatDate(isoString: string): string {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }



  formatDatePicker(date: Date): string {
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  convertDateToISO(dateInput: string | Date): string {
    let day, month, year;

    if (dateInput instanceof Date) {
      day = dateInput.getDate();
      month = dateInput.getMonth() + 1;
      year = dateInput.getFullYear();
    } else {
      const parts = dateInput.split('/').map(Number);
      if (parts.length !== 3) throw new Error("Formato inválido. Use dd/mm/yyyy");
      [day, month, year] = parts;
    }

    const date = new Date(Date.UTC(year, month - 1, day, 5, 0, 0));
    return date.toISOString();
  }


  onFileSelect(event: any) {
    this.resetFileUpload();
    const file = event.files?.[0] || event.target?.files?.[0];
    if (file) {
      this.uploadedFile = file;

      // Mostrar previsualización
      const reader = new FileReader();
      reader.onload = (e) => this.previewImage = e.target?.result || null;
      reader.readAsDataURL(file);
    }
  }
  // Modificamos uploadFile para que devuelva una Promise
  private async uploadFile(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!this.uploadedFile) {
      reject('No hay archivo para subir');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.uploadedFile);

    this.http.post(`${this.apiUrl}upload`, formData).subscribe({
      next: (res: any) => {
        resolve(res.url); // Resuelve con la URL de la imagen
      },
      error: (err) => {
        reject(err);
      }
    });
  });
}
}