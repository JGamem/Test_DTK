import { Request, Response } from 'express';
import { VehicleService } from '../services/vehicle.service';
import { CreateVehicleDto, UpdateVehicleDto } from '../dtos/vehicle.dto';

export class VehicleController {
    private vehicleService = new VehicleService();

    /**
     * Get all vehicles
     */
    public getAllVehicles = async (req: Request, res: Response): Promise<void> => {
        try {
            const vehicles = await this.vehicleService.findAll();
            res.status(200).json({
                success: true,
                data: vehicles,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch vehicles',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    };

    /**
     * Get a vehicle by id
     */
    public getVehicleById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            const vehicle = await this.vehicleService.findById(id);

            if (!vehicle) {
                res.status(404).json({
                    success: false,
                    message: `Vehicle with id ${id} not found`,
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: vehicle,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch vehicle',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    };

    /**
     * Create a new vehicle
     */
    public createVehicle = async (req: Request, res: Response): Promise<void> => {
        try {
            const vehicleData: CreateVehicleDto = req.body;
            const newVehicle = await this.vehicleService.create(vehicleData);

            res.status(201).json({
                success: true,
                data: newVehicle,
                message: 'Vehicle created successfully',
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to create vehicle',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    };

    /**
     * Update an existing vehicle
     */
    public updateVehicle = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            const vehicleData: UpdateVehicleDto = req.body;

            const updatedVehicle = await this.vehicleService.update(id, vehicleData);

            if (!updatedVehicle) {
                res.status(404).json({
                    success: false,
                    message: `Vehicle with id ${id} not found`,
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: updatedVehicle,
                message: 'Vehicle updated successfully',
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to update vehicle',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    };

    /**
     * Delete a vehicle
     */
    public deleteVehicle = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            const isDeleted = await this.vehicleService.delete(id);

            if (!isDeleted) {
                res.status(404).json({
                    success: false,
                    message: `Vehicle with id ${id} not found`,
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Vehicle deleted successfully',
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to delete vehicle',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    };
}