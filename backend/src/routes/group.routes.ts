import { Router } from 'express';
import { GroupController } from '../controllers/group.controller';
import { ValidationMiddleware } from '../middlewares/validation.middleware';

const router = Router();
const groupController = new GroupController();

// GET all groups
router.get('/', groupController.getAllGroups);

// GET group by id
router.get('/:id', groupController.getGroupById);

// POST create new group
router.post('/', ValidationMiddleware.validateCreateGroup, groupController.createGroup);

// POST add vehicle to group
router.post('/add-vehicle', ValidationMiddleware.validateVehicleGroup, groupController.addVehicleToGroup);

// POST remove vehicle from group
router.post('/remove-vehicle', ValidationMiddleware.validateVehicleGroup, groupController.removeVehicleFromGroup);

export default router;