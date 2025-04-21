import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import { AppDataSource } from './config/database.config';
import { appConfig } from './config/app.config';
import { errorMiddleware } from './middlewares/error.middleware';
import vehicleRoutes from './routes/vehicle.routes';
import groupRoutes from './routes/group.routes';
import authRoutes from './routes/auth.routes';
import './app.module';

const app = express();

// API rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests, please try again later.'
    }
});

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Vehicle Management API',
            version: '1.0.0',
            description: 'A REST API for managing vehicles and groups with drag and drop functionality',
        },
        servers: [
            {
                url: `http://localhost:${appConfig.port}${appConfig.apiPrefix}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

// Apply middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

// API routes
app.use(`${appConfig.apiPrefix}/vehicles`, vehicleRoutes);
app.use(`${appConfig.apiPrefix}/groups`, groupRoutes);
app.use(`${appConfig.apiPrefix}/auth`, authRoutes);

// Swagger documentation
app.use(`${appConfig.apiPrefix}/docs`, swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Error handling middleware
app.use(errorMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize db cnx and start server
const startServer = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Database has been initialized');

        app.listen(appConfig.port, () => {
            console.log(`Server is running on port ${appConfig.port}`);
            console.log(`API is available at ${appConfig.apiPrefix}`);
            console.log(`Documentation is available at ${appConfig.apiPrefix}/docs`);
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