import { Component, OnInit,ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Examen_resultadoService } from '../../services/examen_resultado.service';
import { Examen_medicoService } from '../../../examen_medicos/services/examen_medico.service';
import { EmpresaService } from '../../../empresas/services/empresa.service';
import { Examen_resultado } from '../../interfaces/examen_resultado.interface';
import { Examen_medico } from '../../../examen_medicos/interfaces/examen_medico.interface';
import { Empresa } from '../../../empresas/interfaces/empresa.interface';
/*ACCESO A MODULOS*/
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../../../environments/environment";
import { Router } from '@angular/router';
import {PermissionService} from "../../../../shared/services/permission.service";
@Component({
    selector: 'app-examen_resultado-list',
    templateUrl: './list.component.html',
    providers: [ConfirmationService, MessageService]
})
export class Examen_resultadoListComponent implements OnInit {
    @ViewChild('fileUploadRef') fileUploadRef!: FileUpload;
    examen_resultados: Examen_resultado[] = [];
    filteredExamen_resultados: Examen_resultado[] = [];
    globalFilter: string = '';
    modalVisible: boolean = false;
    modalTitle: string = '';
    examen_medicos: Examen_medico[] = [];
    empresas: Empresa[] = [];
    selected_examen_medico: { label: string; value: string }[] = [];
    selected_empresa: { label: string; value: string }[] = [];
    examen_resultadoForm: FormGroup;
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
        private examen_resultadoService: Examen_resultadoService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private examen_medicoService: Examen_medicoService,
        private empresaService: EmpresaService,
        private permissionService:PermissionService,
        private router: Router,
        private http: HttpClient
    ) {
        this.examen_resultadoForm = this.fb.group({
            _id: [null],
            examen_medico_id: ['', Validators.required],
            nombre: ['', Validators.required],
            resultado: ['', Validators.required],
            empresa_id: [this.empresa_id, Validators.required]
        });
    }

    ngOnInit(): void {
       this.permiso();
    }

    onInitial(){
       this.loadExamen_medicos();
    this.loadEmpresas();
       this.loadExamen_resultados(1);
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

    loadExamen_resultados(page: number = 1) {
        this.examen_resultadoService.getAll(this.searchTerm,this.empresa_id, page, this.pagination.itemsPerPage).subscribe({
            next: (data: any) => {
                this.examen_resultados = data.response;
                this.pagination = {
                  currentPage: data.pagination.currentPage,
                  itemsPerPage: data.pagination.itemsPerPage,
                  totalItems: data.pagination.totalItems,
                  totalPages: data.pagination.totalPages
                };
            },
            error: (err) => {
                console.error('Error al cargar Examen_resultados:', err);
            }
        });
    }

    loadExamen_medicos() {
        this.examen_medicoService.getAll().subscribe({
            next: (data:any) => {
                this.examen_medicos = data.response;
                this.selected_examen_medico = this.examen_medicos.map(examen_medico => ({
                    label: examen_medico.empleado.nombre,
                    value: examen_medico._id
                }));
            },
            error: (err) => {
                console.error('Error al cargar examen_medicos:', err);
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
      this.loadExamen_resultados(1);
    }

    onPageChange(page: number) {
      this.pagination.currentPage = page;
      this.loadExamen_resultados(page);
    }

    onSearch(searchTerm: string) {
      this.searchTerm = searchTerm;
      this.loadExamen_resultados(1); // Resetear a primera página al buscar
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
    openModal(mode: 'Nuevo' | 'Editar', examen_resultado?: Examen_resultado) {
        this.mode = mode;
        console.log(mode);
        this.modalTitle = `${mode} Examen_resultado`;
        this.modalVisible = true;
        this.resetFileUpload();
        if (mode === 'Editar' && examen_resultado) {
            this.examen_resultadoForm.patchValue({
                _id: examen_resultado._id,
                examen_medico_id: examen_resultado.examen_medico._id,
                nombre: examen_resultado.nombre,
                resultado: examen_resultado.resultado,
                empresa_id: examen_resultado.empresa._id
            });
        } else {
            this.examen_resultadoForm.reset();
        }
    }

    confirmarEliminacion(examen_resultado: Examen_resultado) {
        console.log("Clic en eliminar:", examen_resultado);
        this.confirmationService.confirm({
            message: `¿Estás seguro de eliminar el Examen_resultado: ${examen_resultado.examen_medico._id}?`,
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => {
                this.deleteExamen_resultado(examen_resultado);
            }
        });
    }

    deleteExamen_resultado(examen_resultado: Examen_resultado) {
        this.examen_resultadoService.delete(examen_resultado._id,this.empresa_id).subscribe({
            next: () => {
                this.loadExamen_resultados(1);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: `Examen_resultado "${examen_resultado.examen_medico._id}" eliminado correctamente`
                });
            },
            error: (err) => {
                console.error('Error al eliminar el examen_resultado:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `No se pudo eliminar el examen_resultado "${examen_resultado.examen_medico._id}"`
                });
            }
        });
    }

    saveRegistro() {
        if (this.examen_resultadoForm.valid) {
          const examen_resultado = this.examen_resultadoForm.value;
          console.log('si valid');
          this.saveExamen_resultadoData(examen_resultado);
        }
    }

    private async  saveExamen_resultadoData(examen_resultado: any) {
    // Limpiar el ID si es nuevo registro
    examen_resultado._id === null && delete examen_resultado._id;
    let key:number = 1;
    this.examen_resultados.length===0?key=1:key=this.examen_resultados[this.examen_resultados.length - 1].key + 1;
    this.mode === 'Nuevo'? examen_resultado.key = key:key;
    const saveObservable = this.mode === 'Nuevo'
      ? this.examen_resultadoService.create(examen_resultado)
      : this.examen_resultadoService.update(examen_resultado._id,this.empresa_id,examen_resultado);

    saveObservable.subscribe({
      next: (data) => {
        console.log('Examen_resultado guardado con éxito:', data);
        this.modalVisible = false;
        this.loadExamen_resultados();
        this.mensajeConfirmacion(examen_resultado, "Registro Actualizado");
      },
      error: (err) => {
        console.error('Error al guardar el examen_resultado:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al guardar el examen_resultado'
        });
      }
    });
  }


    onChangeExamen_medico(e: any) {
        this.examen_resultadoForm.patchValue({examen_medico_id: e.value});
    }

    onChangeEmpresa(e: any) {
        this.examen_resultadoForm.patchValue({empresa_id: e.value});
    }


    mensajeConfirmacion(examen_resultado: Examen_resultado, mensaje: String) {
        this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Examen_resultado "${examen_resultado.examen_medico._id}" ${mensaje}`
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
