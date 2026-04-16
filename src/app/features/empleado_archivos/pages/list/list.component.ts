import { Component, OnInit,ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Empleado_archivoService } from '../../services/empleado_archivo.service';
import { EmpleadoService } from '../../../empleados/services/empleado.service';
import { EmpresaService } from '../../../empresas/services/empresa.service';
import { Empleado_archivo } from '../../interfaces/empleado_archivo.interface';
import { Empleado } from '../../../empleados/interfaces/empleado.interface';
import { Empresa } from '../../../empresas/interfaces/empresa.interface';
/*ACCESO A MODULOS*/
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../../../environments/environment";
import { Router } from '@angular/router';
import {PermissionService} from "../../../../shared/services/permission.service";
@Component({
    selector: 'app-empleado_archivo-list',
    templateUrl: './list.component.html',
    providers: [ConfirmationService, MessageService]
})
export class Empleado_archivoListComponent implements OnInit {
    @ViewChild('fileUploadRef') fileUploadRef!: FileUpload;
    empleado_archivos: Empleado_archivo[] = [];
    filteredEmpleado_archivos: Empleado_archivo[] = [];
    globalFilter: string = '';
    modalVisible: boolean = false;
    modalTitle: string = '';
    empleados: Empleado[] = [];
    empresas: Empresa[] = [];
    selected_empleado: { label: string; value: string }[] = [];
    selected_empresa: { label: string; value: string }[] = [];
    empleado_archivoForm: FormGroup;
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
        private empleado_archivoService: Empleado_archivoService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private empleadoService: EmpleadoService,
        private empresaService: EmpresaService,
        private permissionService:PermissionService,
        private router: Router,
        private http: HttpClient
    ) {
        this.empleado_archivoForm = this.fb.group({
            _id: [null],
            empleado_id: ['', Validators.required],
            nombre_archivo: ['', Validators.required],
            tipo_archivo: ['', Validators.required],
            subido_por: ['', Validators.required],
            empresa_id: [this.empresa_id, Validators.required]
        });
    }

    ngOnInit(): void {
       this.permiso();
    }

    onInitial(){
       this.loadEmpleados();
    this.loadEmpresas();
       this.loadEmpleado_archivos(1);
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

    loadEmpleado_archivos(page: number = 1) {
        this.empleado_archivoService.getAll(this.searchTerm,this.empresa_id, page, this.pagination.itemsPerPage).subscribe({
            next: (data: any) => {
                this.empleado_archivos = data.response;
                this.pagination = {
                  currentPage: data.pagination.currentPage,
                  itemsPerPage: data.pagination.itemsPerPage,
                  totalItems: data.pagination.totalItems,
                  totalPages: data.pagination.totalPages
                };
            },
            error: (err) => {
                console.error('Error al cargar Empleado_archivos:', err);
            }
        });
    }

    loadEmpleados() {
        this.empleadoService.getAll().subscribe({
            next: (data:any) => {
                this.empleados = data.response;
                this.selected_empleado = this.empleados.map(empleado => ({
                    label: empleado.nombre,
                    value: empleado._id
                }));
            },
            error: (err) => {
                console.error('Error al cargar empleados:', err);
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
      this.loadEmpleado_archivos(1);
    }

    onPageChange(page: number) {
      this.pagination.currentPage = page;
      this.loadEmpleado_archivos(page);
    }

    onSearch(searchTerm: string) {
      this.searchTerm = searchTerm;
      this.loadEmpleado_archivos(1); // Resetear a primera página al buscar
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
    openModal(mode: 'Nuevo' | 'Editar', empleado_archivo?: Empleado_archivo) {
        this.mode = mode;
        console.log(mode);
        this.modalTitle = `${mode} Empleado_archivo`;
        this.modalVisible = true;
        this.resetFileUpload();
        if (mode === 'Editar' && empleado_archivo) {
            this.empleado_archivoForm.patchValue({
                _id: empleado_archivo._id,
                empleado_id: empleado_archivo.empleado._id,
                nombre_archivo: empleado_archivo.nombre_archivo,
                tipo_archivo: empleado_archivo.tipo_archivo,
                subido_por: empleado_archivo.subido_por,
                empresa_id: empleado_archivo.empresa._id
            });
        } else {
            this.empleado_archivoForm.reset();
        }
    }

    confirmarEliminacion(empleado_archivo: Empleado_archivo) {
        console.log("Clic en eliminar:", empleado_archivo);
        this.confirmationService.confirm({
            message: `¿Estás seguro de eliminar el Empleado_archivo: ${empleado_archivo.empleado._id}?`,
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => {
                this.deleteEmpleado_archivo(empleado_archivo);
            }
        });
    }

    deleteEmpleado_archivo(empleado_archivo: Empleado_archivo) {
        this.empleado_archivoService.delete(empleado_archivo._id,this.empresa_id).subscribe({
            next: () => {
                this.loadEmpleado_archivos(1);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: `Empleado_archivo "${empleado_archivo.empleado._id}" eliminado correctamente`
                });
            },
            error: (err) => {
                console.error('Error al eliminar el empleado_archivo:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `No se pudo eliminar el empleado_archivo "${empleado_archivo.empleado._id}"`
                });
            }
        });
    }

    saveRegistro() {
    if (this.empleado_archivoForm.valid) {
      const empleado_archivo = this.empleado_archivoForm.value;
      console.log('si valid');
      // Verificar si hay una imagen para subir
      if (this.uploadedFile && !empleado_archivo.archivo) {
        // Primero subir la imagen, luego guardar el empleado_archivo
        this.uploadFile().then((imageUrl: string) => {
          empleado_archivo.archivo = imageUrl;
          this.saveEmpleado_archivoData(empleado_archivo);
        }).catch(error => {
          console.error('Error al subir la imagen:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al subir la imagen del empleado_archivo'
          });
        });
      } else {
        // No hay imagen nueva que subir, guardar directamente
        this.saveEmpleado_archivoData(empleado_archivo);
      }
    }else{
      console.log('NO valid');
      console.log('NO VALID'+JSON.stringify(this.empleado_archivoForm.value,null,2))
    }
  }

    private async  saveEmpleado_archivoData(empleado_archivo: any) {
    // Limpiar el ID si es nuevo registro
    empleado_archivo._id === null && delete empleado_archivo._id;
    // Si hay una imagen para subir, procesarla primero
    if (this.uploadedFile) {
      const imageUrl = await this.uploadFile();
      empleado_archivo.archivo = imageUrl;
    }
    let key:number = 1;
    this.empleado_archivos.length===0?key=1:key=this.empleado_archivos[this.empleado_archivos.length - 1].key + 1;
    this.mode === 'Nuevo'? empleado_archivo.key = key:key;
    const saveObservable = this.mode === 'Nuevo'
      ? this.empleado_archivoService.create(empleado_archivo)
      : this.empleado_archivoService.update(empleado_archivo._id,this.empresa_id,empleado_archivo);

    saveObservable.subscribe({
      next: (data) => {
        console.log('Empleado_archivo guardado con éxito:', data);
        this.modalVisible = false;
        this.loadEmpleado_archivos();
        this.mensajeConfirmacion(empleado_archivo, "Registro Actualizado");
        // Resetear el estado de la imagen
        this.uploadedFile = null;
        this.previewImage = null;
      },
      error: (err) => {
        console.error('Error al guardar el empleado_archivo:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al guardar el empleado_archivo'
        });
      }
    });
  }


    onChangeEmpleado(e: any) {
        this.empleado_archivoForm.patchValue({empleado_id: e.value});
    }

    onChangeEmpresa(e: any) {
        this.empleado_archivoForm.patchValue({empresa_id: e.value});
    }


    mensajeConfirmacion(empleado_archivo: Empleado_archivo, mensaje: String) {
        this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Empleado_archivo "${empleado_archivo.empleado._id}" ${mensaje}`
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
