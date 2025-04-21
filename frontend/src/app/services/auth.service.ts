import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/api/v1';

    private token: string | null = null;

    constructor(private http: HttpClient) {
        this.token = localStorage.getItem('auth_token');
    }

    login(username: string, password: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/auth/login`, { username, password })
            .pipe(
                tap(response => {
                    if (response?.data?.token) {
                        this.token = response.data.token;
                        localStorage.setItem('auth_token', response.data.token);
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
        localStorage.removeItem('auth_token');
    }
}