import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empleado_archivo } from '../interfaces/empleado_archivo.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Empleado_archivoService {

  private apiUrl = `${environment.API_URL}${environment.EMPLEADO_ARCHIVO_ENDPOINT}`;

  constructor(private http: HttpClient) {}


  getAll(searchTerm: string = '',empresa_id: string = '', page: number = 1, limit: number = 10): Observable<Empleado_archivo[]> {
    let url = `${this.apiUrl}?&empresa_id=${empresa_id}&page=${page}&limit=${limit}`;
    if (searchTerm) {
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }
    return this.http.get<any>(url);
  }

  getById(id: string,empresa_id: string): Observable<Empleado_archivo> {
    return this.http.get<Empleado_archivo>(`${this.apiUrl}/${id}?empresa_id=${empresa_id}`);
  }

  create(data: Empleado_archivo): Observable<Empleado_archivo> {
    return this.http.post<Empleado_archivo>(`${this.apiUrl}/create`, data);
  }

  

  update(id: string,empresa_id: string, data: Empleado_archivo): Observable<Empleado_archivo> {
    return this.http.put<Empleado_archivo>(`${this.apiUrl}/update/${id}?empresa_id=${empresa_id}`, data);
  }

  delete(id: string,empresa_id: string,): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}?empresa_id=${empresa_id}`);
  }
}