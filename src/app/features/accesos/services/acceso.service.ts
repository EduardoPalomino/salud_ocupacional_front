import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Acceso } from '../interfaces/acceso.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {

  private apiUrl = `${environment.API_URL}${environment.ACCESO_ENDPOINT}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Acceso[]> {
    return this.http.get<Acceso[]>(this.apiUrl);
  }
  getByRolId(id: string): Observable<Acceso> {
    return this.http.get<Acceso>(`${this.apiUrl}/rol/${id}`);
  }
  getById(id: string): Observable<Acceso> {
    return this.http.get<Acceso>(`${this.apiUrl}/${id}`);
  }

  create(data: Acceso): Observable<Acceso> {
    return this.http.post<Acceso>(`${this.apiUrl}/create`, data);
  }

  update(id: string, data: Acceso): Observable<Acceso> {
    return this.http.put<Acceso>(`${this.apiUrl}/update/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
