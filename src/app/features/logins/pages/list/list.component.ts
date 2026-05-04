import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../usuarios/services/usuario.service';
import { Usuario } from '../../../usuarios/interfaces/usuario.interface';
@Component({
  selector: 'app-login-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class LoginListComponent implements OnInit {
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  loginForm: FormGroup;
  mode:string='';
  nombre: string = '';
  password: string = '';
  usuarios: Usuario[] = [];
  constructor(
  private fb: FormBuilder,
  private router: Router,
  private usuarioService: UsuarioService,
  private confirmationService: ConfirmationService,
  private messageService: MessageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  // this.loadUsuarios()
  }

  loadUsuarios() {
    this.usuarioService.getAll().subscribe({
      next: (data:any) => {
        this.usuarios = data.data;
      },
      error: (err) => {
        console.error('Error al cargar Usuarios:', err);
      }
    });
  }

  login() {
    if (this.loginForm.valid) { // Verifica que el formulario sea válido
      const login = this.loginForm.value; // Obtener valores del formulario
      console.log(JSON.stringify(login+'DATOS DE FORM'));
        this.usuarioService.login(login).subscribe({
          next: (data:any) => {
            console.log(JSON.stringify(data+'--RESPUESTA----'));
            console.log('Login  éxitoso DATA ES :', JSON.stringify(data));
            sessionStorage.setItem('nombre', data.user.nombre);
            sessionStorage.setItem('apellido', data.user.apellido);
            sessionStorage.setItem('email', data.user.email);
            sessionStorage.setItem('rol_id', data.user.rol_id);
            sessionStorage.setItem('archivo', data.user.archivo);
            sessionStorage.setItem('empresa_id', data.user.empresa_id);
            //sessionStorage.setItem('archivo','');
            this.router.navigate(['/admin/dashboards']); // Redirige
          },
          error: (err) => {
            console.error('Error de acceso contacte con el adminstrador del sistema :', err);
            this.router.navigate(['/login']); // Redirige
          }
        });
    }
  }

  /*
  login() {
      // Buscar usuario coincidente
    const usuarioEncontrado = this.usuarios.find(u =>
      u.email === this.nombre && u.password === this.password
    );
    if (usuarioEncontrado) {
      this.router.navigate(['dashboards']);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Usuario o contraseña incorrectos'
      });
    }
  }
  */

  }




