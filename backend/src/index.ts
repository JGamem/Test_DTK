import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { AppDataSource } from './config/database.config';
import { appConfig } from './config/app.config';
import { errorMiddleware } from './middlewares/error.middleware';
import vehicleRoutes from './routes/vehicle.routes';
import groupRoutes from './routes/group.routes';

// Initialize express app
const app = express();

// Apply middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use(`${appConfig.apiPrefix}/vehicles`, vehicleRoutes);
app.use(`${appConfig.apiPrefix}/groups`, groupRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize database connection and start server
const startServer = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Database has been initialized');

        app.listen(appConfig.port, () => {
            console.log(`Server is running on port ${appConfig.port}`);
            console.log(`API is available at ${appConfig.apiPrefix}`);
        });
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Start the server
startServer();