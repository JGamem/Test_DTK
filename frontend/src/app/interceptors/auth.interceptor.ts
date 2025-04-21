import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = this.authService.getToken();

        console.log('Interceptando petición a:', request.url);
        console.log('Token disponible:', !!token);

        if (token) {
            const authReq = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Enviando petición con token');

            return next.handle(authReq).pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        console.error('Error 401: Token posiblemente inválido o expirado');
                        this.authService.logout();
                    }
                    return throwError(() => error);
                })
            );
        }

        console.log('Enviando petición sin token');
        return next.handle(request);
    }
}