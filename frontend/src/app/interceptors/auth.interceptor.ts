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
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = this.authService.getToken();

        console.group('Detalles de Solicitud HTTP');
        console.log('URL:', request.url);
        console.log('Método:', request.method);
        console.log('Token raw:', token);

        if (token) {
            const authRequest = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Token en cabecera:', `Bearer ${token}`);

            return next.handle(authRequest).pipe(
                catchError((error: HttpErrorResponse) => {
                    console.error('Detalles del Error:', {
                        status: error.status,
                        mensaje: error.message,
                        detalles: error.error,
                        url: request.url
                    });

                    if (error.status === 401) {
                        console.warn('Error de Autorización:', {
                            mensaje: error.error?.message,
                            token: token
                        });
                        this.authService.logout();
                        this.router.navigate(['/login']);
                    }

                    return throwError(() => error);
                })
            );
        }

        console.warn('No se encontró token');
        return next.handle(request);
    }
}