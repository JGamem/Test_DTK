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

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Authentication required', 401);
        }

        const token = authHeader.split(' ')[1];
        const authService = Container.get(AuthService);

        try {
            const decoded = authService.verifyToken(token);
            req.user = decoded;
            next();
        } catch (error) {
            throw new AppError('Invalid or expired token', 401);
        }
    } catch (error: any) {
        res.status(error.statusCode || 401).json({
            success: false,
            message: error.message
        });
    }
};