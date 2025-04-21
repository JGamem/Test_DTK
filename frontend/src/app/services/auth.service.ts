import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/api/v1';
    private token: string | null = null;

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.token = localStorage.getItem('auth_token');
        }
    }

    login(username: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/auth/login`, { username, password })
            .pipe(
                tap(response => {
                    if (response?.data?.token) {
                        this.token = response.data.token;
                        if (isPlatformBrowser(this.platformId)) {
                            localStorage.setItem('auth_token', response.data.token);
                        }
                    }
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
                    this.token = response.data.token;
                    if (isPlatformBrowser(this.platformId)) {
                        localStorage.setItem('auth_token', response.data.token);
                    }
                }
            })
        );
    }

    getToken(): string | null {
        return this.token;
    }

    isAuthenticated(): boolean {
        return !!this.token;
    }

    logout(): void {
        this.token = null;
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('auth_token');
        }
    }
}