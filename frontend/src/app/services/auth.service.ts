import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  message: string;
  token: string;
  email: string;
  is_admin: boolean;
}

export interface SignupResponse {
  message: string;
  user_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login/`, credentials).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('jwt_token', response.token);
          localStorage.setItem('email', response.email);
          localStorage.setItem('is_admin', response.is_admin.toString());
          this.isLoggedInSubject.next(true);
        }
      })
    );
  }

  signup(credentials: any): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(`${this.apiUrl}/signup/`, credentials);
  }

  logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('email');
    localStorage.removeItem('is_admin');
    this.isLoggedInSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  getEmail(): string | null {
    return localStorage.getItem('email');
  }

  isAdmin(): boolean {
    return localStorage.getItem('is_admin') === 'true';
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('jwt_token');
  }
}
