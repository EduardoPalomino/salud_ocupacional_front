import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AccesoService } from '../../features/accesos/services/acceso.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(
    private router: Router,
    private accesoService: AccesoService
  ) {}

  permiso(rol_id: string): Observable<boolean> {
   console.log("ESTAS EN PERMISO  "+rol_id)
    if (!rol_id) {
      console.log("ESTAS EN PERMISO OP 1  "+rol_id)
      this.router.navigate(['admin/login']);
      return of(false);
    } else {
      console.log("ESTAS EN PERMISO OP 2  "+rol_id)
      return this.findPermisionRolPage(rol_id);
    }
  }

  private findPermisionRolPage(rol_id: string): Observable<boolean> {
    return this.accesoService.getByRolId(rol_id).pipe(
      map((data: any) => {
        console.log('------ findPermisionRolPage-------')
        console.log(JSON.stringify(data))
        console.log('------ findPermisionRolPage-------')
        const acceso = data.acceso[0];
        return this.checkAccessPermissions(acceso);
      }),
      catchError((err) => {
        console.error('Error al cargar Acceso:', err);
        return of(false);
      })
    );
  }

  private checkAccessPermissions(acceso: any): boolean {
    const pages: any[] = JSON.parse(acceso.page);
    const nombreRoute = this.router.url;
    const page = pages.find(p => p.ruta === nombreRoute);
    if (!page || !page.checked) {
      this.router.navigate(['admin/login']); // o a una ruta específica de "sin permiso"
      return false;
    }
    return true;
  }
}
