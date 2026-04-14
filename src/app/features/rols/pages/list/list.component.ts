import { Component, OnInit,ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolService } from '../../services/rol.service';
import { EmpresaService } from '../../../empresas/services/empresa.service';
import { Rol } from '../../interfaces/rol.interface';
import { Empresa } from '../../../empresas/interfaces/empresa.interface';
/*ACCESO A MODULOS*/
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../../../environments/environment";
import { Router } from '@angular/router';
import {PermissionService} from "../../../../shared/services/permission.service";
@Component({
    selector: 'app-rol-list',
    templateUrl: './list.component.html',
    providers: [ConfirmationService, MessageService]
})
export class RolListComponent implements OnInit {
    @ViewChild('fileUploadRef') fileUploadRef!: FileUpload;
    rols: Rol[] = [];
    filteredRols: Rol[] = [];
    globalFilter: string = '';
    modalVisible: boolean = false;
    modalTitle: string = '';
    empresas: Empresa[] = [];
    selected_empresa: { label: string; value: string }[] = [];
    rolForm: FormGroup;
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
        private rolService: RolService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private empresaService: EmpresaService
        private permissionService:PermissionService,
        private router: Router,
        private http: HttpClient
    ) {
        this.rolForm = this.fb.group({
            _id: [null],
            nombre: ['', Validators.required],
            empresa_id: [this.empresa_id, Validators.required]
        });
    }

    ngOnInit(): void {
       this.permiso();
    }

    onInitial(){
       this.loadEmpresas();
       this.loadRols(1);
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

    loadRols(page: number = 1) {
        this.rolService.getAll(this.searchTerm,this.empresa_id, page, this.pagination.itemsPerPage).subscribe({
            next: (data: any) => {
                this.rols = data.response;
                this.pagination = {
                  currentPage: data.pagination.currentPage,
                  itemsPerPage: data.pagination.itemsPerPage,
                  totalItems: data.pagination.totalItems,
                  totalPages: data.pagination.totalPages
                };
            },
            error: (err) => {
                console.error('Error al cargar Rols:', err);
            }
        });
    }

    loadEmpresas() {
        this.empresaService.getAll().subscribe({
            next: (data:any) => {
                this.empresas = data.response;
                this.selected_empresa = this.empresas.map(empresa => ({
                    label: empresa.nombre,
                    value: empresa._id
                }));
            },
            error: (err) => {
                console.error('Error al cargar empresas:', err);
            }
        });
    }

    filtrar(e:any) {
      //console.log(JSON.stringify(e));
      this.searchTerm = e;
      this.loadRols(1);
    }

    onPageChange(page: number) {
      this.pagination.currentPage = page;
      this.loadRols(page);
    }

    onSearch(searchTerm: string) {
      this.searchTerm = searchTerm;
      this.loadRols(1); // Resetear a primera página al buscar
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
    openModal(mode: 'Nuevo' | 'Editar', rol?: Rol) {
        this.mode = mode;
        console.log(mode);
        this.modalTitle = `${mode} Rol`;
        this.modalVisible = true;
        this.resetFileUpload();
        if (mode === 'Editar' && rol) {
            this.rolForm.patchValue({
                _id: rol._id,
                nombre: rol.nombre,
                empresa_id: rol.empresa._id
            });
        } else {
            this.rolForm.reset();
        }
    }

    confirmarEliminacion(rol: Rol) {
        console.log("Clic en eliminar:", rol);
        this.confirmationService.confirm({
            message: `¿Estás seguro de eliminar el Rol: ${rol.nombre}?`,
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => {
                this.deleteRol(rol);
            }
        });
    }

    deleteRol(rol: Rol) {
        this.rolService.delete(rol._id,this.empresa_id).subscribe({
            next: () => {
                this.loadRols(1);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: `Rol "${rol.nombre}" eliminado correctamente`
                });
            },
            error: (err) => {
                console.error('Error al eliminar el rol:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `No se pudo eliminar el rol "${rol.nombre}"`
                });
            }
        });
    }

    saveRegistro() {
        if (this.rolForm.valid) {
          const rol = this.rolForm.value;
          console.log('si valid');
          this.saveRolData(rol);
        }
    }

    private async  saveRolData(rol: any) {
    // Limpiar el ID si es nuevo registro
    rol._id === null && delete rol._id;
    let key:number = 1;
    this.rols.length===0?key=1:key=this.rols[this.rols.length - 1].key + 1;
    this.mode === 'Nuevo'? rol.key = key:key;
    const saveObservable = this.mode === 'Nuevo'
      ? this.rolService.create(rol)
      : this.rolService.update(rol._id,this.empresa_id,rol);

    saveObservable.subscribe({
      next: (data) => {
        console.log('Rol guardado con éxito:', data);
        this.modalVisible = false;
        this.loadRols();
        this.mensajeConfirmacion(rol, "Registro Actualizado");
      },
      error: (err) => {
        console.error('Error al guardar el rol:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al guardar el rol'
        });
      }
    });
  }


    onChangeEmpresa(e: any) {
        this.rolForm.patchValue({empresa_id: e.value});
    }


    mensajeConfirmacion(rol: Rol, mensaje: String) {
        this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Rol "${rol.nombre}" ${mensaje}`
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
