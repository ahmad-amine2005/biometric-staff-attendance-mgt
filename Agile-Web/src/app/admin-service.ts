import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Observable} from 'rxjs';
import {AuthResponse, LoginRequest, RegisterRequest} from './auth.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiEntry = environment.apiEntry;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');

    console.log('Using token:', token?.substring(0, 20) + '...');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiEntry}/auth/admin/login`, data);
  }

  register(data: RegisterRequest): Observable<object> {
    return this.http.post(`${this.apiEntry}/auth/admin/register`, data);
  }

  storeToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
