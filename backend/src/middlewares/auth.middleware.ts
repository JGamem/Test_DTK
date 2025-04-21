import { Request, Response, NextFunction } from 'express';
import { Container } from '../app.module';
import { AuthService } from '../services/auth.service';
import { AppError } from '../utils/app-error';

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        console.log('Headers completos:', JSON.stringify(req.headers));
        console.log('Header de autorización:', authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Authentication required', 401);
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            throw new AppError('Authentication required', 401);
        }

        console.log('Token extraído:', token.substring(0, 10) + '...');

        const authService = Container.get(AuthService);

        try {
            const decoded = authService.verifyToken(token);
            console.log('Token verificado correctamente, payload:', decoded);
            req.user = decoded;
            next();
        } catch (error) {
            console.error('Error al verificar token:', error);
            throw new AppError('Invalid or expired token', 401);
        }
    } catch (error: any) {
        console.error('Error de autenticación:', error);
        res.status(error.statusCode || 401).json({
            success: false,
            message: error.message || 'Authentication required'
        });
    }
};