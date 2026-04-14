import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado } from '../interfaces/empleado.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  private apiUrl = `${environment.API_URL}${environment.EMPLEADO_ENDPOINT}`;

  constructor(private http: HttpClient) {}


  getAll(searchTerm: string = '',empresa_id: string = '', page: number = 1, limit: number = 10): Observable<Empleado[]> {
    let url = `${this.apiUrl}?&empresa_id=${empresa_id}&page=${page}&limit=${limit}`;
    if (searchTerm) {
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }
    return this.http.get<any>(url);
  }

  getById(id: string,empresa_id: string): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.apiUrl}/${id}?empresa_id=${empresa_id}`);
  }

  create(data: Empleado): Observable<Empleado> {
    return this.http.post<Empleado>(`${this.apiUrl}/create`, data);
  }

  

  update(id: string,empresa_id: string, data: Empleado): Observable<Empleado> {
    return this.http.put<Empleado>(`${this.apiUrl}/update/${id}?empresa_id=${empresa_id}`, data);
  }

  delete(id: string,empresa_id: string,): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}?empresa_id=${empresa_id}`);
  }
}