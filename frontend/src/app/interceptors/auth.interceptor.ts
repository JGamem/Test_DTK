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

    if (token && isApiUrl) {
        const cleanToken = token.trim();
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${cleanToken}`
            }
        });
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                authService.logout();
                router.navigate(['/login'], {
                    queryParams: { expired: 'true' }
                });
            }
            return throwError(() => error);
        })
    );
};