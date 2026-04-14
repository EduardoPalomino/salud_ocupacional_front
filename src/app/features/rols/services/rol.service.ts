import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rol } from '../interfaces/rol.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private apiUrl = `${environment.API_URL}${environment.ROL_ENDPOINT}`;

  constructor(private http: HttpClient) {}


  getAll(searchTerm: string = '',empresa_id: string = '', page: number = 1, limit: number = 10): Observable<Rol[]> {
    let url = `${this.apiUrl}?&empresa_id=${empresa_id}&page=${page}&limit=${limit}`;
    if (searchTerm) {
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }
    return this.http.get<any>(url);
  }

  getById(id: string,empresa_id: string): Observable<Rol> {
    return this.http.get<Rol>(`${this.apiUrl}/${id}?empresa_id=${empresa_id}`);
  }

  create(data: Rol): Observable<Rol> {
    return this.http.post<Rol>(`${this.apiUrl}/create`, data);
  }

  

  update(id: string,empresa_id: string, data: Rol): Observable<Rol> {
    return this.http.put<Rol>(`${this.apiUrl}/update/${id}?empresa_id=${empresa_id}`, data);
  }

  delete(id: string,empresa_id: string,): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}?empresa_id=${empresa_id}`);
  }
}