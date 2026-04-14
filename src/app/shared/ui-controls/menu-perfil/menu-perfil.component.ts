import { Component,Input } from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ConfirmationService, MessageService} from "primeng/api";
import {Router} from "@angular/router";

@Component({
  selector: 'menu-perfil',
  templateUrl: './menu-perfil.component.html',
  styleUrls: ['./menu-perfil.component.scss']
})
export class MenuPerfilComponent {
  @Input() label: string = '';
  items = [
    {
      label: 'Logout',
      command: () => {
        this.logout();
      }
    }
  ];
  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {

  }
  logout(){
    this.router.navigate(['/login']);
  }
}
