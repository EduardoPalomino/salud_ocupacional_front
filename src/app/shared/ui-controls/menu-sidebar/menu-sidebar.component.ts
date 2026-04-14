import { Component } from '@angular/core';
import {MenuItem} from "primeng/api";

@Component({
  selector: 'menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent {
  //MENU
  items: MenuItem[] = [
    {
      label: 'Empresa',
      icon: 'pi pi-home',
      routerLink: ['/admin/empresas']
    },
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: ['/admin/dashboards']
    },
    {
      label: 'Inventario',
      icon: 'pi pi-box',
      items: [
        {
          label: 'Categoría Producto',
          icon: 'pi pi-tags',
          routerLink: ['/admin/categoria_productos']
        },
        {
          label: 'Productos',
          icon: 'pi pi-box',
          routerLink: ['/admin/productos']
        },
        {
          label: 'Proveedores',
          icon: 'pi pi-truck',
          routerLink: ['/admin/proveedors']
        },
        {
          label: 'Compras',
          icon: 'pi pi-shopping-cart',
          routerLink: ['/admin/compras']
        },
        {
          label: 'Ventas',
          icon: 'pi pi-dollar',
          routerLink: ['/admin/ventas']
        },
        {
          label: 'Pagos',
          icon: 'pi pi-credit-card',
          routerLink: ['/admin/pagos']
        }
      ]
    },
    {
      label: 'Mascotas',
      icon: 'pi pi-heart',
      items: [
        {
          label: 'Mascotas',
          icon: 'pi pi-heart',
          routerLink: ['/admin/mascotas']
        },
         {
          label: 'Especies',
          icon: 'pi pi-clone',
          routerLink: ['/admin/especies']
        },
        {
          label: 'Razas',
          icon: 'pi pi-tag',
          routerLink: ['/admin/razas']
        }
      ]
    },
    {
      label: 'Usuarios y Accesos',
      icon: 'pi pi-user',
      items: [
        {
          label: 'Usuarios',
          icon: 'pi pi-users',
          routerLink: ['/admin/users']
        },
        {
          label: 'Roles',
          icon: 'pi pi-lock',
          routerLink: ['/admin/rols']
        },
        {
          label: 'Accesos',
          icon: 'pi pi-key',
          routerLink: ['/admin/accesos']
        },
        {
          label: 'Login',
          icon: 'pi pi-sign-in',
          routerLink: ['/admin/login']
        }
      ]
    },
    {
      label: 'Clientes',
      icon: 'pi pi-car',
      items: [
        {
          label: 'Clientes',
          icon: 'pi pi-car',
          routerLink: ['/admin/clientes']
        }
      ]
    },
    {
      label: 'Historia Clínica',
      icon: 'pi pi-book',
      items: [
        {
          label: 'Historia Clínica',
          icon: 'pi pi-bookmark',
          routerLink: ['/admin/historia_clinicas']
        }
      ]
    },
    {
      label: 'Reportes',
      icon: 'pi pi-chart-bar',
      items: [
        {
          label: 'Reportes Generales',
          icon: 'pi pi-chart-pie',
          routerLink: ['/admin/reportes']
        }
      ]
    },
    {
      label: 'Configuración',
      icon: 'pi pi-cog',
      items: [
        {
          label: 'Páginas',
          icon: 'pi pi-clone',
          routerLink: ['/admin/pages']
        },
        {
          label: 'Logout',
          icon: 'pi pi-sign-out',
          routerLink: ['#'],
          //command: () => this.logout()
        }
      ]
    }
  ];
}
