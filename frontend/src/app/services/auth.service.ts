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
            console.log('Token loaded:', !!storedToken);
            this.token = storedToken;
        }
    }

    login(username: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/auth/login`, { username, password })
            .pipe(
                tap(response => {
                    console.log('Login Response:', response);

                    if (response?.data?.token) {
                        this.setToken(response.data.token);
                    } else {
                        console.error('No token received', response);
                        throw new Error('Login failed');
                    }
                }),
                catchError(error => {
                    console.error('Login Error:', error);
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
                console.log('Registration Response:', response);

                if (response?.data?.token) {
                    this.setToken(response.data.token);
                }
            }),
            catchError(error => {
                console.error('Registration Error:', error);
                return throwError(() => error);
            })
        );
    }

    private setToken(token: string): void {
        if (isPlatformBrowser(this.platformId)) {
            this.token = token;
            localStorage.setItem('auth_token', token);
            console.log('Token set successfully');
        }
    }

    private decodeToken(token: string): any {
        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (error) {
            console.error('Error al decodificar token:', error);
            return null;
        }
    }

    getToken(): string | null {
        const token = localStorage.getItem('auth_token');

        if (token) {
            try {
                const decoded = this.decodeToken(token);
                const currentTime = Math.floor(Date.now() / 1000);

                if (decoded.exp && decoded.exp < currentTime) {
                    console.warn('Token expirado');
                    this.logout();
                    return null;
                }
            } catch (error) {
                console.error('Error al decodificar token:', error);
                this.logout();
                return null;
            }
        }

        return token;
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    logout(): void {
        this.token = null;
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('auth_token');
        }
        this.router.navigate(['/login']);
    }
}