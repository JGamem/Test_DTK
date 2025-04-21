import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl;
    private tokenKey = 'auth_token';

    constructor(
        private http: HttpClient,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    login(username: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/auth/login`, { username, password })
            .pipe(
                tap(response => {
                    if (response?.data?.token) {
                        this.setToken(response.data.token);
                    } else {
                        console.error('No se recibió token válido', response);
                        throw new Error('Inicio de sesión fallido');
                    }
                }),
                catchError(error => {
                    console.error('Error de login:', error);
                    return throwError(() => error);
                })
            );
    }

    register(username: string, email: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/auth/register`, {
            username,
            email,
            password
        }).pipe(
            tap(response => {
                if (response?.data?.token) {
                    this.setToken(response.data.token);
                }
            }),
            catchError(error => {
                console.error('Error de registro:', error);
                return throwError(() => error);
            })
        );
    }

    private setToken(token: string): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.tokenKey, token);
        }
    }

    getToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem(this.tokenKey);
        }
        return null;
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    logout(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(this.tokenKey);
        }
        this.router.navigate(['/login']);
    }
}