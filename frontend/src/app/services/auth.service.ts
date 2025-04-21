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
    private token: string | null = null;
    private apiUrl = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.loadToken();
    }

    private loadToken(): void {
        if (isPlatformBrowser(this.platformId)) {
            const storedToken = localStorage.getItem('auth_token');
            console.log('Token cargado:', storedToken);
            this.token = storedToken;
        }
    }

    login(username: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/auth/login`, { username, password })
            .pipe(
                tap(response => {
                    console.log('Respuesta de login completa:', response);

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
                console.log('Respuesta de registro:', response);

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
            console.log('Estableciendo token:', token);
            this.token = token;
            localStorage.setItem('auth_token', token);
        }
    }

    getToken(): string | null {
        this.loadToken();
        return this.token;
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        console.log('Estado de autenticación:', !!token);
        return !!token;
    }

    logout(): void {
        this.token = null;
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('auth_token');
        }
        this.router.navigate(['/login']);
    }
}