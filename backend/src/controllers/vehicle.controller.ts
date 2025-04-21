import { Request, Response } from 'express';
import { VehicleService } from '../services/vehicle.service';
import { CreateVehicleDto, UpdateVehicleDto } from '../dtos/vehicle.dto';
import { validate } from '../utils/validation';
import { createVehicleSchema, updateVehicleSchema } from '../schemas/vehicle.schema';
import { AuthRequest } from '../middlewares/auth.middleware';

export class VehicleController {
    constructor(private vehicleService: VehicleService) { }

    getAllVehicles = async (req: Request, res: Response): Promise<void> => {
        try {
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

            const result = await this.vehicleService.findAll({ page, limit });

            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to fetch vehicles',
                error: error.statusCode ? error.message : 'Internal server error'
            });
        }
    };

    getVehicleById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            const vehicle = await this.vehicleService.findById(id);

            res.status(200).json({
                success: true,
                data: vehicle,
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to fetch vehicle',
                error: error.statusCode ? error.message : 'Internal server error'
            });
        }
    };

    createVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const vehicleData: CreateVehicleDto = req.body;

            // Validate request
            await validate(createVehicleSchema, vehicleData);

            const newVehicle = await this.vehicleService.create(vehicleData);

            res.status(201).json({
                success: true,
                data: newVehicle,
                message: 'Vehicle created successfully',
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to create vehicle',
                error: error.statusCode ? error.message : 'Internal server error'
            });
        }
    };

    updateVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            const vehicleData: UpdateVehicleDto = req.body;

            // Validate request
            await validate(updateVehicleSchema, vehicleData);

            const updatedVehicle = await this.vehicleService.update(id, vehicleData);

            res.status(200).json({
                success: true,
                data: updatedVehicle,
                message: 'Vehicle updated successfully',
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to update vehicle',
                error: error.statusCode ? error.message : 'Internal server error'
            });
        }
    };

    deleteVehicle = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            await this.vehicleService.delete(id);

            res.status(200).json({
                success: true,
                message: 'Vehicle deleted successfully',
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to delete vehicle',
                error: error.statusCode ? error.message : 'Internal server error'
            });
        }
    };
}