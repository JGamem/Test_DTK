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
        console.log('Token:', token);

        // Clonar la solicitud para modificarla
        const authRequest = request.clone({
            setHeaders: token
                ? { Authorization: `Bearer ${token}` }
                : {}
        });

        return next.handle(authRequest).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error de solicitud:', {
                    status: error.status,
                    mensaje: error.message,
                    url: request.url,
                    body: error.error
                });

                if (error.status === 401) {
                    console.warn('No autorizado');
                    this.authService.logout();
                    this.router.navigate(['/login']);
                }

                return throwError(() => error);
            })
        );
    }
}