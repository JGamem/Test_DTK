import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    get<T>(endpoint: string, params?: HttpParams): Observable<T> {
        return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { params })
            .pipe(catchError(this.handleError));
    }

    getById<T>(endpoint: string, id: string): Observable<T> {
        return this.http.get<T>(`${this.baseUrl}/${endpoint}/${id}`)
            .pipe(catchError(this.handleError));
    }

    post<T, R>(endpoint: string, data: T): Observable<R> {
        return this.http.post<R>(`${this.baseUrl}/${endpoint}`, data)
            .pipe(catchError(this.handleError));
    }

    put<T, R>(endpoint: string, id: string, data: T): Observable<R> {
        return this.http.put<R>(`${this.baseUrl}/${endpoint}/${id}`, data)
            .pipe(catchError(this.handleError));
    }

    delete<T>(endpoint: string, id: string): Observable<T> {
        return this.http.delete<T>(`${this.baseUrl}/${endpoint}/${id}`)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: any) {
        console.error('API Error:', error);
        let errorMessage = 'An unknown error occurred';

        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side error
            errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        return throwError(() => error);
    }
}