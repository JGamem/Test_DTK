import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';

export const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`Error: ${error.message}`);

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }

    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message,
    });
};