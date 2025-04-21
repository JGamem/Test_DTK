// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { validate } from '../utils/validation';
import { loginSchema, registerSchema } from '../schemas/auth.schema';

export class AuthController {
    constructor(private authService: AuthService) { }

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const credentials: LoginDto = req.body;

            // Validate request
            await validate(loginSchema, credentials);

            const result = await this.authService.login(credentials);

            res.status(200).json({
                success: true,
                data: result,
                message: 'Login successful'
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to login',
                error: error.statusCode ? error.message : 'Internal server error'
            });
        }
    };

    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const userData: RegisterDto = req.body;

            // Validate request
            await validate(registerSchema, userData);

            const result = await this.authService.register(userData);

            res.status(201).json({
                success: true,
                data: result,
                message: 'Registration successful'
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to register',
                error: error.statusCode ? error.message : 'Internal server error'
            });
        }
    };
}