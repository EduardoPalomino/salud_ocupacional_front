import { Component, OnInit,ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { RolService } from '../../../rols/services/rol.service';
import { EmpresaService } from '../../../empresas/services/empresa.service';
import { Usuario } from '../../interfaces/usuario.interface';
import { Rol } from '../../../rols/interfaces/rol.interface';
import { Empresa } from '../../../empresas/interfaces/empresa.interface';
/*ACCESO A MODULOS*/
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../../../environments/environment";
import { Router } from '@angular/router';
import {PermissionService} from "../../../../shared/services/permission.service";
@Component({
    selector: 'app-usuario-list',
    templateUrl: './list.component.html',
    providers: [ConfirmationService, MessageService]
})
export class UsuarioListComponent implements OnInit {
    @ViewChild('fileUploadRef') fileUploadRef!: FileUpload;
    usuarios: Usuario[] = [];
    filteredUsuarios: Usuario[] = [];
    globalFilter: string = '';
    modalVisible: boolean = false;
    modalTitle: string = '';
    rols: Rol[] = [];
    empresas: Empresa[] = [];
    selected_rol: { label: string; value: string }[] = [];
    selected_empresa: { label: string; value: string }[] = [];
    usuarioForm: FormGroup;
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
        private usuarioService: UsuarioService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private rolService: RolService,
        private empresaService: EmpresaService,
        private permissionService:PermissionService,
        private router: Router,
        private http: HttpClient
    ) {
        this.usuarioForm = this.fb.group({
            _id: [null],
            nombre: ['', Validators.required],
            apellido: ['', Validators.required],
            email: ['', Validators.required],
            user: ['', Validators.required],
            password: ['', Validators.required],
            archivo: [''],
            rol_id: ['', Validators.required],
            empresa_id: [this.empresa_id, Validators.required]
        });
    }

    ngOnInit(): void {
       this.permiso();
    }

    onInitial(){
       this.loadRols();
    this.loadEmpresas();
       this.loadUsuarios(1);
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

    loadUsuarios(page: number = 1) {
        this.usuarioService.getAll(this.searchTerm,this.empresa_id, page, this.pagination.itemsPerPage).subscribe({
            next: (data: any) => {
                this.usuarios = data.response;
                this.pagination = {
                  currentPage: data.pagination.currentPage,
                  itemsPerPage: data.pagination.itemsPerPage,
                  totalItems: data.pagination.totalItems,
                  totalPages: data.pagination.totalPages
                };
            },
            error: (err) => {
                console.error('Error al cargar Usuarios:', err);
            }
        });
    }

    loadRols() {
        this.rolService.getAll().subscribe({
            next: (data:any) => {
                this.rols = data.response;
                this.selected_rol = this.rols.map(rol => ({
                    label: rol.descripcion,
                    value: rol._id
                }));
            },
            error: (err) => {
                console.error('Error al cargar rols:', err);
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
      this.loadUsuarios(1);
    }

    onPageChange(page: number) {
      this.pagination.currentPage = page;
      this.loadUsuarios(page);
    }

    onSearch(searchTerm: string) {
      this.searchTerm = searchTerm;
      this.loadUsuarios(1); // Resetear a primera página al buscar
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
    openModal(mode: 'Nuevo' | 'Editar', usuario?: Usuario) {
        this.mode = mode;
        console.log(mode);
        this.modalTitle = `${mode} Usuario`;
        this.modalVisible = true;
        this.resetFileUpload();
        if (mode === 'Editar' && usuario) {
            this.usuarioForm.patchValue({
                _id: usuario._id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                user: usuario.user,
                password: usuario.password,
                archivo: usuario.archivo,
                rol_id: usuario.rol._id,
                empresa_id: usuario.empresa._id
            });
        } else {
            this.usuarioForm.reset();
        }
    }

    confirmarEliminacion(usuario: Usuario) {
        console.log("Clic en eliminar:", usuario);
        this.confirmationService.confirm({
            message: `¿Estás seguro de eliminar el Usuario: ${usuario.nombre}?`,
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => {
                this.deleteUsuario(usuario);
            }
        });
    }

    deleteUsuario(usuario: Usuario) {
        this.usuarioService.delete(usuario._id,this.empresa_id).subscribe({
            next: () => {
                this.loadUsuarios(1);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: `Usuario "${usuario.nombre}" eliminado correctamente`
                });
            },
            error: (err) => {
                console.error('Error al eliminar el usuario:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: `No se pudo eliminar el usuario "${usuario.nombre}"`
                });
            }
        });
    }

    saveRegistro() {
    if (this.usuarioForm.valid) {
      const usuario = this.usuarioForm.value;
      console.log('si valid');
      // Verificar si hay una imagen para subir
      if (this.uploadedFile && !usuario.archivo) {
        // Primero subir la imagen, luego guardar el usuario
        this.uploadFile().then((imageUrl: string) => {
          usuario.archivo = imageUrl;
          this.saveUsuarioData(usuario);
        }).catch(error => {
          console.error('Error al subir la imagen:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al subir la imagen del usuario'
          });
        });
      } else {
        // No hay imagen nueva que subir, guardar directamente
        this.saveUsuarioData(usuario);
      }
    }else{
      console.log('NO valid');
      console.log('NO VALID'+JSON.stringify(this.usuarioForm.value,null,2))
    }
  }

    private async  saveUsuarioData(usuario: any) {
    // Limpiar el ID si es nuevo registro
    usuario._id === null && delete usuario._id;
    // Si hay una imagen para subir, procesarla primero
    if (this.uploadedFile) {
      const imageUrl = await this.uploadFile();
      usuario.archivo = imageUrl;
    }
    let key:number = 1;
    this.usuarios.length===0?key=1:key=this.usuarios[this.usuarios.length - 1].key + 1;
    this.mode === 'Nuevo'? usuario.key = key:key;
    const saveObservable = this.mode === 'Nuevo'
      ? this.usuarioService.create(usuario)
      : this.usuarioService.update(usuario._id,this.empresa_id,usuario);

    saveObservable.subscribe({
      next: (data) => {
        console.log('Usuario guardado con éxito:', data);
        this.modalVisible = false;
        this.loadUsuarios();
        this.mensajeConfirmacion(usuario, "Registro Actualizado");
        // Resetear el estado de la imagen
        this.uploadedFile = null;
        this.previewImage = null;
      },
      error: (err) => {
        console.error('Error al guardar el usuario:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al guardar el usuario'
        });
      }
    });
  }


    onChangeRol(e: any) {
        this.usuarioForm.patchValue({rol_id: e.value});
    }

    onChangeEmpresa(e: any) {
        this.usuarioForm.patchValue({empresa_id: e.value});
    }


    mensajeConfirmacion(usuario: Usuario, mensaje: String) {
        this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Usuario "${usuario.nombre}" ${mensaje}`
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
