import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  adminId: number;
  email: string;
  name: string;
  surname: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/auth';

  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  /**
   * Login with email and password
   */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        this.setToken(response.token);
        this.setUser(response);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  /**
   * Logout and clear stored data
   */
  logout(): void {
    this.clearToken();
    this.clearUser();
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Get stored JWT token
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Store JWT token
   */
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Remove JWT token
   */
  private clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  /**
   * Check if user has a token
   */
  hasToken(): boolean {
    return !!this.getToken();
  }

  /**
   * Get stored user data
   */
  getUser(): LoginResponse | null {
    const userJson = localStorage.getItem(this.userKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  /**
   * Store user data
   */
  private setUser(user: LoginResponse): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  /**
   * Clear user data
   */
  private clearUser(): void {
    localStorage.removeItem(this.userKey);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.hasToken();
  }
}
