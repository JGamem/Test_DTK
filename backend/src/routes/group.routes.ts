import { Router } from 'express';
import { Container } from '../app.module';
import { GroupController } from '../controllers/group.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const groupController = Container.get(GroupController);

// Public routes
router.get('/', groupController.getAllGroups);
router.get('/:id', groupController.getGroupById);

// Protected routes
router.post('/', authenticate, groupController.createGroup);
router.post('/add-vehicle', authenticate, groupController.addVehicleToGroup);
router.post('/remove-vehicle', authenticate, groupController.removeVehicleFromGroup);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Group:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated UUID for the group
 *         name:
 *           type: string
 *           description: Group name
 *         description:
 *           type: string
 *           description: Group description
 *         vehicles:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Vehicle'
 *           description: Vehicles in this group
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the group was created
 */

/**
 * @swagger
 * /groups:
 *   get:
 *     summary: Returns a list of all groups
 *     tags: [Groups]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A list of groups
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Group'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *   post:
 *     summary: Create a new group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Group created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Group already exists
 *       500:
 *         description: Server error
 * 
 * /groups/{id}:
 *   get:
 *     summary: Get a group by ID
 *     tags: [Groups]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Group ID
 *     responses:
 *       200:
 *         description: A group object
 *       404:
 *         description: Group not found
 * 
 * /groups/add-vehicle:
 *   post:
 *     summary: Add a vehicle to a group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicleId
 *               - groupId
 *             properties:
 *               vehicleId:
 *                 type: string
 *               groupId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vehicle added to group successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Vehicle or group not found
 * 
 * /groups/remove-vehicle:
 *   post:
 *     summary: Remove a vehicle from a group
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicleId
 *               - groupId
 *             properties:
 *               vehicleId:
 *                 type: string
 *               groupId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vehicle removed from group successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Vehicle or group not found
 */