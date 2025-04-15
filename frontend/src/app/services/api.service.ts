import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    get<T>(endpoint: string): Observable<T> {
        return this.http.get<T>(`${this.baseUrl}/${endpoint}`);
    }

    getById<T>(endpoint: string, id: string): Observable<T> {
        return this.http.get<T>(`${this.baseUrl}/${endpoint}/${id}`);
    }

    post<T, R>(endpoint: string, data: T): Observable<R> {
        return this.http.post<R>(`${this.baseUrl}/${endpoint}`, data);
    }

    put<T, R>(endpoint: string, id: string, data: T): Observable<R> {
        return this.http.put<R>(`${this.baseUrl}/${endpoint}/${id}`, data);
    }

    delete<T>(endpoint: string, id: string): Observable<T> {
        return this.http.delete<T>(`${this.baseUrl}/${endpoint}/${id}`);
    }
}