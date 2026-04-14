import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = `${environment.API_URL}${environment.USUARIO_ENDPOINT}`;

  constructor(private http: HttpClient) {}


  getAll(searchTerm: string = '',empresa_id: string = '', page: number = 1, limit: number = 10): Observable<Usuario[]> {
    let url = `${this.apiUrl}?&empresa_id=${empresa_id}&page=${page}&limit=${limit}`;
    if (searchTerm) {
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }
    return this.http.get<any>(url);
  }

  getById(id: string,empresa_id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}?empresa_id=${empresa_id}`);
  }

  create(data: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/create`, data);
  }

  login(data: Usuario): Observable<Usuario> {
  return this.http.post<Usuario>(`${this.apiUrl}/login`, data);
}

  update(id: string,empresa_id: string, data: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/update/${id}?empresa_id=${empresa_id}`, data);
  }

  delete(id: string,empresa_id: string,): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}?empresa_id=${empresa_id}`);
  }
}