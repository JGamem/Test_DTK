import {
    HttpRequest,
    HttpHandlerFn,
    HttpInterceptorFn,
    HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    const token = authService.getToken();
    const isApiUrl = req.url.startsWith(environment.apiUrl);

    console.log('Interceptando petición a:', req.url);
    console.log('Es URL de API:', isApiUrl);
    console.log('Token presente:', !!token);

    if (token && isApiUrl) {
        console.log('Añadiendo token a la petición');
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Headers después de añadir token:', req.headers.keys());
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            console.error('Error en petición HTTP:', error);
            
            if (error.status === 401) {
                console.warn('Error 401: Unauthorized');
                authService.logout();
                router.navigate(['/login'], {
                    queryParams: { expired: 'true' }
                });
            }
            return throwError(() => error);
        })
    );
};