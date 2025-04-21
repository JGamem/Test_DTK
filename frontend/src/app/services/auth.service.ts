import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl;
    private tokenKey = 'auth_token';
    private authStatusSubject = new BehaviorSubject<boolean>(this.isAuthenticated());

    constructor(
        private http: HttpClient,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    login(username: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/auth/login`, { username, password })
            .pipe(
                tap(response => {
                    if (response?.data?.token) {
                        console.log('Token recibido:', response.data.token);
                        this.setToken(response.data.token);
                        this.authStatusSubject.next(true);
                    } else {
                        console.error('No se recibió token válido', response);
                        throw new Error('No token received');
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
                    console.log('Token recibido en registro:', response.data.token);
                    this.setToken(response.data.token);
                    this.authStatusSubject.next(true);
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
            console.log('Token guardado en localStorage');
        }
    }

    getToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem(this.tokenKey);
            console.log('Obteniendo token:', token ? 'Token presente' : 'No hay token');
            return token;
        }
        return null;
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        return !!token;
    }

    getAuthStatus(): Observable<boolean> {
        return this.authStatusSubject.asObservable();
    }

    logout(): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(this.tokenKey);
            this.authStatusSubject.next(false);
        }
        this.router.navigate(['/login']);
    }

    checkAuthStatus(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/auth/verify`)
            .pipe(
                tap(response => {
                    console.log('Estado de autenticación:', response);
                }),
                catchError(error => {
                    console.error('Error verificando autenticación:', error);
                    return throwError(() => error);
                })
            );
    }
}