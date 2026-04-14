import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Examen_resultado } from '../interfaces/examen_resultado.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Examen_resultadoService {

  private apiUrl = `${environment.API_URL}${environment.EXAMEN_RESULTADO_ENDPOINT}`;

  constructor(private http: HttpClient) {}


  getAll(searchTerm: string = '',empresa_id: string = '', page: number = 1, limit: number = 10): Observable<Examen_resultado[]> {
    let url = `${this.apiUrl}?&empresa_id=${empresa_id}&page=${page}&limit=${limit}`;
    if (searchTerm) {
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }
    return this.http.get<any>(url);
  }

  getById(id: string,empresa_id: string): Observable<Examen_resultado> {
    return this.http.get<Examen_resultado>(`${this.apiUrl}/${id}?empresa_id=${empresa_id}`);
  }

  create(data: Examen_resultado): Observable<Examen_resultado> {
    return this.http.post<Examen_resultado>(`${this.apiUrl}/create`, data);
  }

  

  update(id: string,empresa_id: string, data: Examen_resultado): Observable<Examen_resultado> {
    return this.http.put<Examen_resultado>(`${this.apiUrl}/update/${id}?empresa_id=${empresa_id}`, data);
  }

  delete(id: string,empresa_id: string,): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}?empresa_id=${empresa_id}`);
  }
}