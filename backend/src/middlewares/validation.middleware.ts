import { Request, Response, NextFunction } from 'express';

export class ValidationMiddleware {
    /**
     * Validate vehicle creation data
     */
    static validateCreateVehicle = (req: Request, res: Response, next: NextFunction) => {
        const { brand, model, year, color } = req.body;

        if (!brand || !model || !year || !color) {
            return res.status(400).json({
                success: false,
                message: 'Brand, model, year, and color are required fields',
            });
        }

        if (typeof year !== 'number' || year < 1900 || year > new Date().getFullYear() + 1) {
            return res.status(400).json({
                success: false,
                message: 'Year must be a valid year (between 1900 and the next year)',
            });
        }

        next();
    };

    /**
     * Validate group creation data
     */
    static validateCreateGroup = (req: Request, res: Response, next: NextFunction) => {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Name is a required field',
            });
        }

        next();
    };

    /**
     * Validate vehicle to group assignment
     */
    static validateVehicleGroup = (req: Request, res: Response, next: NextFunction) => {
        const { vehicleId, groupId } = req.body;

        if (!vehicleId || !groupId) {
            return res.status(400).json({
                success: false,
                message: 'Both vehicleId and groupId are required',
            });
        }

        next();
    };
}