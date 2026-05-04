import { Component, OnInit,ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Examen_medicoService } from '../../services/examen_medico.service';
import { EmpleadoService } from '../../../empleados/services/empleado.service';
import { EmpresaService } from '../../../empresas/services/empresa.service';
import { Examen_medico } from '../../interfaces/examen_medico.interface';
import { Empleado } from '../../../empleados/interfaces/empleado.interface';
import { Empresa } from '../../../empresas/interfaces/empresa.interface';
/*ACCESO A MODULOS*/
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../../../environments/environment";
import { Router } from '@angular/router';
import {PermissionService} from "../../../../shared/services/permission.service";
@Component({
    selector: 'app-examen_medico-list',
    templateUrl: './list.component.html',
    providers: [ConfirmationService, MessageService]
})
export class Examen_medicoListComponent implements OnInit {
    @ViewChild('fileUploadRef') fileUploadRef!: FileUpload;
    examen_medicos: Examen_medico[] = [];
    filteredExamen_medicos: Examen_medico[] = [];
    globalFilter: string = '';
    modalVisible: boolean = false;
    modalTitle: string = '';
    empleados: Empleado[] = [];
    empresas: Empresa[] = [];
    selected_empleado: { label: string; value: string }[] = [];
    selected_empresa: { label: string; value: string }[] = [];
    examen_medicoForm: FormGroup;
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
        private examen_medicoService: Examen_medicoService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private empleadoService: EmpleadoService,
        private empresaService: EmpresaService,
        private permissionService:PermissionService,
        private router: Router,
        private http: HttpClient
    ) {
        this.examen_medicoForm = this.fb.group({
            _id: [null],
            empleado_id: ['', Validators.required],
            tipo_examen: ['', Validators.required],
            estado: ['', Validators.required],
            creado_por: ['', Validators.required],
            fecha_examen: ['', Validators.required],
            empresa_id: [this.empresa_id, Validators.required]
        });
    }

    ngOnInit(): void {
       this.permiso();
    }

    onInitial(){
       this.loadEmpleados();
    this.loadEmpresas();
       this.loadExamen_medicos(1);
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

    loadExamen_medicos(page: number = 1) {
        this.examen_medicoService.getAll(this.searchTerm,this.empresa_id, page, this.pagination.itemsPerPage).subscribe({
            next: (data: any) => {
                this.examen_medicos = data.response;
                this.pagination = {
                  currentPage: data.pagination.currentPage,
                  itemsPerPage: data.pagination.itemsPerPage,
                  totalItems: data.pagination.totalItems,
                  totalPages: data.pagination.totalPages
                };
            },
            error: (err) => {
                console.error('Error al cargar Examen_medicos:', err);
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
      this.loadExamen_medicos(1);
    }

    onPageChange(page: number) {
      this.pagination.currentPage = page;
      this.loadExamen_medicos(page);
    }

    onSearch(searchTerm: string) {
      this.searchTerm = searchTerm;
      this.loadExamen_medicos(1); // Resetear a primera página al buscar
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
    openModal(mode: 'Nuevo' | 'Editar', examen_medico?: Examen_medico) {
        this.mode = mode;
        console.log(mode);
        this.modalTitle = `${mode} Examen_medico`;
        this.modalVisible = true;
        this.resetFileUpload();
        if (mode === 'Editar' && examen_medico) {
            this.examen_medicoForm.patchValue({
                _id: examen_medico._id,
                empleado_id: examen_medico.empleado._id,
                tipo_examen: examen_medico.tipo_examen,
                estado: examen_medico.estado,
                creado_por: examen_medico.creado_por,
                fecha_examen: examen_medico.fecha_examen,
                empresa_id: examen_medico.empresa._id
            });
        } else {
            this.examen_medicoForm.reset();
        }
    }

    confirmarEliminacion(examen_medico: Examen_medico) {
        console.log("Clic en eliminar:", examen_medico);
        this.confirmationService.confirm({
            message: `¿Estás seguro de eliminar el Examen_medico: ${examen_medico.empleado._id}?`,
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => {
                this.deleteExamen_medico(examen_medico);
            }
        });
    }

    deleteExamen_medico(examen_medico: Examen_medico) {
        this.examen_medicoService.delete(examen_medico._id,this.empresa_id).subscribe({
            next: () => {
                this.loadExamen_medicos(1);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: `Examen_medico "${examen_medico.empleado._id}" eliminado correctamente`
                });
            },
            error: (err) => {
                console.error('Error al eliminar el examen_medico:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `No se pudo eliminar el examen_medico "${examen_medico.empleado._id}"`
                });
            }
        });
    }

    saveRegistro() {
        if (this.examen_medicoForm.valid) {
          const examen_medico = this.examen_medicoForm.value;
          console.log('si valid');
          this.saveExamen_medicoData(examen_medico);
        }
    }

    private async  saveExamen_medicoData(examen_medico: any) {
    // Limpiar el ID si es nuevo registro
    examen_medico._id === null && delete examen_medico._id;
    let key:number = 1;
    this.examen_medicos.length===0?key=1:key=this.examen_medicos[this.examen_medicos.length - 1].key + 1;
    this.mode === 'Nuevo'? examen_medico.key = key:key;
    const saveObservable = this.mode === 'Nuevo'
      ? this.examen_medicoService.create(examen_medico)
      : this.examen_medicoService.update(examen_medico._id,this.empresa_id,examen_medico);

    saveObservable.subscribe({
      next: (data) => {
        console.log('Examen_medico guardado con éxito:', data);
        this.modalVisible = false;
        this.loadExamen_medicos();
        this.mensajeConfirmacion(examen_medico, "Registro Actualizado");
      },
      error: (err) => {
        console.error('Error al guardar el examen_medico:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al guardar el examen_medico'
        });
      }
    });
  }


    onChangeEmpleado(e: any) {
        this.examen_medicoForm.patchValue({empleado_id: e.value});
    }

    onChangeEmpresa(e: any) {
        this.examen_medicoForm.patchValue({empresa_id: e.value});
    }

    selectedCalendarFecha_examen(event: Date) {
        const formattedDate = this.formatDate(event);
        this.examen_medicoForm.patchValue({
            fecha_examen: formattedDate
        });
    }

    mensajeConfirmacion(examen_medico: Examen_medico, mensaje: String) {
        this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Examen_medico "${examen_medico.empleado._id}" ${mensaje}`
        });
    }

  formatDate(isoString: Date): string {
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
