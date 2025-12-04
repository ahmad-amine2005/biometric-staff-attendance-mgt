import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DepartmentRequest {
  dpmtName: string;
}

export interface DepartmentResponse {
  dpmtId: number;
  dpmtName: string;
  totalStaff?: number;
  activeStaff?: number;
  totalReports?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/departments`;

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getAllDepartments(): Observable<DepartmentResponse[]> {
    return this.http.get<DepartmentResponse[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  getDepartmentById(id: number): Observable<DepartmentResponse> {
    return this.http.get<DepartmentResponse>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  createDepartment(department: DepartmentRequest): Observable<DepartmentResponse> {
    return this.http.post<DepartmentResponse>(this.apiUrl, department, {
      headers: this.getAuthHeaders()
    });
  }

  updateDepartment(id: number, department: DepartmentRequest): Observable<DepartmentResponse> {
    return this.http.put<DepartmentResponse>(`${this.apiUrl}/${id}`, department, {
      headers: this.getAuthHeaders()
    });
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}

