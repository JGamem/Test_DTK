import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { ValidationMiddleware } from '../middlewares/validation.middleware';

const router = Router();
const vehicleController = new VehicleController();

// GET all vehicles
router.get('/', vehicleController.getAllVehicles);

// GET vehicle by id
router.get('/:id', vehicleController.getVehicleById);

// POST create new vehicle
router.post('/', ValidationMiddleware.validateCreateVehicle, vehicleController.createVehicle);

// PUT update existing vehicle
router.put('/:id', vehicleController.updateVehicle);

// DELETE vehicle
router.delete('/:id', vehicleController.deleteVehicle);

export default router;