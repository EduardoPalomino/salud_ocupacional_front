import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from '../interfaces/empresa.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private apiUrl = `${environment.API_URL}${environment.EMPRESA_ENDPOINT}`;

  constructor(private http: HttpClient) {}


  getAll(searchTerm: string = '',empresa_id: string = '', page: number = 1, limit: number = 10): Observable<Empresa[]> {
    let url = `${this.apiUrl}?&empresa_id=${empresa_id}&page=${page}&limit=${limit}`;
    if (searchTerm) {
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }
    return this.http.get<any>(url);
  }

  getById(id: string,empresa_id: string): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.apiUrl}/${id}?empresa_id=${empresa_id}`);
  }

  create(data: Empresa): Observable<Empresa> {
    return this.http.post<Empresa>(`${this.apiUrl}/create`, data);
  }

  

  update(id: string,empresa_id: string, data: Empresa): Observable<Empresa> {
    return this.http.put<Empresa>(`${this.apiUrl}/update/${id}?empresa_id=${empresa_id}`, data);
  }

  delete(id: string,empresa_id: string,): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}?empresa_id=${empresa_id}`);
  }
}