import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado_estado } from '../interfaces/empleado_estado.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Empleado_estadoService {

  private apiUrl = `${environment.API_URL}${environment.EMPLEADO_ESTADO_ENDPOINT}`;

  constructor(private http: HttpClient) {}


  getAll(searchTerm: string = '',empresa_id: string = '', page: number = 1, limit: number = 10): Observable<Empleado_estado[]> {
    let url = `${this.apiUrl}?&empresa_id=${empresa_id}&page=${page}&limit=${limit}`;
    if (searchTerm) {
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }
    return this.http.get<any>(url);
  }

  getById(id: string,empresa_id: string): Observable<Empleado_estado> {
    return this.http.get<Empleado_estado>(`${this.apiUrl}/${id}?empresa_id=${empresa_id}`);
  }

  create(data: Empleado_estado): Observable<Empleado_estado> {
    return this.http.post<Empleado_estado>(`${this.apiUrl}/create`, data);
  }

  

  update(id: string,empresa_id: string, data: Empleado_estado): Observable<Empleado_estado> {
    return this.http.put<Empleado_estado>(`${this.apiUrl}/update/${id}?empresa_id=${empresa_id}`, data);
  }

  delete(id: string,empresa_id: string,): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}?empresa_id=${empresa_id}`);
  }
}