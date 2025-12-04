import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Staff, StaffRequest, StaffUpdate } from '../models/staff';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/staff`;

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getAllStaff(): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  getStaffById(id: number): Observable<Staff> {
    return this.http.get<Staff>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  createStaff(staff: StaffRequest): Observable<Staff> {
    return this.http.post<Staff>(this.apiUrl, staff, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateStaff(id: number, staff: StaffUpdate): Observable<Staff> {
    return this.http.put<Staff>(`${this.apiUrl}/${id}`, staff, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteStaff(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  getActiveStaff(): Observable<Staff[]> {
    return this.http.get<Staff[]>(`${this.apiUrl}/active`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  getStaffByDepartment(departmentId: number): Observable<Staff[]> {
    return this.http.get<Staff[]>(`${this.apiUrl}/department/${departmentId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.error || `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}