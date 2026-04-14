import { Component, OnInit,ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpleadoService } from '../../services/empleado.service';
import { Empleado_cargoService } from '../../../empleado_cargos/services/empleado_cargo.service';
import { Empleado_estadoService } from '../../../empleado_estados/services/empleado_estado.service';
import { EmpresaService } from '../../../empresas/services/empresa.service';
import { Empleado } from '../../interfaces/empleado.interface';
import { Empleado_cargo } from '../../../empleado_cargos/interfaces/empleado_cargo.interface';
import { Empleado_estado } from '../../../empleado_estados/interfaces/empleado_estado.interface';
import { Empresa } from '../../../empresas/interfaces/empresa.interface';
/*ACCESO A MODULOS*/
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../../../environments/environment";
import { Router } from '@angular/router';
import {PermissionService} from "../../../../shared/services/permission.service";
@Component({
    selector: 'app-empleado-list',
    templateUrl: './list.component.html',
    providers: [ConfirmationService, MessageService]
})
export class EmpleadoListComponent implements OnInit {
    @ViewChild('fileUploadRef') fileUploadRef!: FileUpload;
    empleados: Empleado[] = [];
    filteredEmpleados: Empleado[] = [];
    globalFilter: string = '';
    modalVisible: boolean = false;
    modalTitle: string = '';
    empleado_cargos: Empleado_cargo[] = [];
    empleado_estados: Empleado_estado[] = [];
    empresas: Empresa[] = [];
    selected_empleado_cargo: { label: string; value: string }[] = [];
    selected_empleado_estado: { label: string; value: string }[] = [];
    selected_empresa: { label: string; value: string }[] = [];
    empleadoForm: FormGroup;
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
        private empleadoService: EmpleadoService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private empleado_cargoService: Empleado_cargoService,
        private empleado_estadoService: Empleado_estadoService,
        private empresaService: EmpresaService
        private permissionService:PermissionService,
        private router: Router,
        private http: HttpClient
    ) {
        this.empleadoForm = this.fb.group({
            _id: [null],
            nombre: ['', Validators.required],
            paterno: ['', Validators.required],
            materno: ['', Validators.required],
            dni: ['', Validators.required],
            genero: ['', Validators.required],
            empleado_cargo_id: ['', Validators.required],
            empleado_estado_id: ['', Validators.required],
            fecha_nacimiento: ['', Validators.required],
            empresa_id: [this.empresa_id, Validators.required]
        });
    }

    ngOnInit(): void {
       this.permiso();
    }

    onInitial(){
       this.loadEmpleado_cargos();
    this.loadEmpleado_estados();
    this.loadEmpresas();
       this.loadEmpleados(1);
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

    loadEmpleados(page: number = 1) {
        this.empleadoService.getAll(this.searchTerm,this.empresa_id, page, this.pagination.itemsPerPage).subscribe({
            next: (data: any) => {
                this.empleados = data.response;
                this.pagination = {
                  currentPage: data.pagination.currentPage,
                  itemsPerPage: data.pagination.itemsPerPage,
                  totalItems: data.pagination.totalItems,
                  totalPages: data.pagination.totalPages
                };
            },
            error: (err) => {
                console.error('Error al cargar Empleados:', err);
            }
        });
    }

    loadEmpleado_cargos() {
        this.empleado_cargoService.getAll().subscribe({
            next: (data:any) => {
                this.empleado_cargos = data.response;
                this.selected_empleado_cargo = this.empleado_cargos.map(empleado_cargo => ({
                    label: empleado_cargo.nombre,
                    value: empleado_cargo._id
                }));
            },
            error: (err) => {
                console.error('Error al cargar empleado_cargos:', err);
            }
        });
    }

    loadEmpleado_estados() {
        this.empleado_estadoService.getAll().subscribe({
            next: (data:any) => {
                this.empleado_estados = data.response;
                this.selected_empleado_estado = this.empleado_estados.map(empleado_estado => ({
                    label: empleado_estado.nombre,
                    value: empleado_estado._id
                }));
            },
            error: (err) => {
                console.error('Error al cargar empleado_estados:', err);
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
      this.loadEmpleados(1);
    }

    onPageChange(page: number) {
      this.pagination.currentPage = page;
      this.loadEmpleados(page);
    }

    onSearch(searchTerm: string) {
      this.searchTerm = searchTerm;
      this.loadEmpleados(1); // Resetear a primera página al buscar
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
    openModal(mode: 'Nuevo' | 'Editar', empleado?: Empleado) {
        this.mode = mode;
        console.log(mode);
        this.modalTitle = `${mode} Empleado`;
        this.modalVisible = true;
        this.resetFileUpload();
        if (mode === 'Editar' && empleado) {
            this.empleadoForm.patchValue({
                _id: empleado._id,
                nombre: empleado.nombre,
                paterno: empleado.paterno,
                materno: empleado.materno,
                dni: empleado.dni,
                genero: empleado.genero,
                empleado_cargo_id: empleado.empleado_cargo._id,
                empleado_estado_id: empleado.empleado_estado._id,
                fecha_nacimiento: empleado.fecha_nacimiento,
                empresa_id: empleado.empresa._id
            });
        } else {
            this.empleadoForm.reset();
        }
    }

    confirmarEliminacion(empleado: Empleado) {
        console.log("Clic en eliminar:", empleado);
        this.confirmationService.confirm({
            message: `¿Estás seguro de eliminar el Empleado: ${empleado.nombre}?`,
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => {
                this.deleteEmpleado(empleado);
            }
        });
    }

    deleteEmpleado(empleado: Empleado) {
        this.empleadoService.delete(empleado._id,this.empresa_id).subscribe({
            next: () => {
                this.loadEmpleados(1);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: `Empleado "${empleado.nombre}" eliminado correctamente`
                });
            },
            error: (err) => {
                console.error('Error al eliminar el empleado:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `No se pudo eliminar el empleado "${empleado.nombre}"`
                });
            }
        });
    }

    saveRegistro() {
        if (this.empleadoForm.valid) {
          const empleado = this.empleadoForm.value;
          console.log('si valid');
          this.saveEmpleadoData(empleado);
        }
    }

    private async  saveEmpleadoData(empleado: any) {
    // Limpiar el ID si es nuevo registro
    empleado._id === null && delete empleado._id;
    let key:number = 1;
    this.empleados.length===0?key=1:key=this.empleados[this.empleados.length - 1].key + 1;
    this.mode === 'Nuevo'? empleado.key = key:key;
    const saveObservable = this.mode === 'Nuevo'
      ? this.empleadoService.create(empleado)
      : this.empleadoService.update(empleado._id,this.empresa_id,empleado);

    saveObservable.subscribe({
      next: (data) => {
        console.log('Empleado guardado con éxito:', data);
        this.modalVisible = false;
        this.loadEmpleados();
        this.mensajeConfirmacion(empleado, "Registro Actualizado");
      },
      error: (err) => {
        console.error('Error al guardar el empleado:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al guardar el empleado'
        });
      }
    });
  }


    onChangeEmpleado_cargo(e: any) {
        this.empleadoForm.patchValue({empleado_cargo_id: e.value});
    }

    onChangeEmpleado_estado(e: any) {
        this.empleadoForm.patchValue({empleado_estado_id: e.value});
    }

    onChangeEmpresa(e: any) {
        this.empleadoForm.patchValue({empresa_id: e.value});
    }

    selectedCalendarFecha_nacimiento(event: Date) {
        const formattedDate = this.formatDate(event);
        this.empleadoForm.patchValue({
            fecha_nacimiento: formattedDate
        });
    }

    mensajeConfirmacion(empleado: Empleado, mensaje: String) {
        this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Empleado "${empleado.nombre}" ${mensaje}`
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
