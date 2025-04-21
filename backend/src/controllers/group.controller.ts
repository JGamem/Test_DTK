import { Request, Response } from 'express';
import { GroupService } from '../services/group.service';
import { CreateGroupDto, VehicleGroupDto } from '../dtos/group.dto';
import { validate } from '../utils/validation';
import { createGroupSchema, vehicleGroupSchema } from '../schemas/group.schema';
import { AuthRequest } from '../middlewares/auth.middleware';

export class GroupController {
    constructor(private groupService: GroupService) { }

    getAllGroups = async (req: Request, res: Response): Promise<void> => {
        try {
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

            const result = await this.groupService.findAll({ page, limit });

            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to fetch groups',
                error: error.statusCode ? error.message : 'Internal server error'
            });
        }
    };

    getGroupById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            const group = await this.groupService.findById(id);

            res.status(200).json({
                success: true,
                data: group,
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to fetch group',
                error: error.statusCode ? error.message : 'Internal server error'
            });
        }
    };

    createGroup = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const groupData: CreateGroupDto = req.body;

            // Validate request
            await validate(createGroupSchema, groupData);

            const newGroup = await this.groupService.create(groupData);

            res.status(201).json({
                success: true,
                data: newGroup,
                message: 'Group created successfully',
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to create group',
                error: error.statusCode ? error.message : 'Internal server error'
            });
        }
    };

    addVehicleToGroup = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const data: VehicleGroupDto = req.body;

            // Validate request
            await validate(vehicleGroupSchema, data);

            const updatedGroup = await this.groupService.addVehicleToGroup(data);

            res.status(200).json({
                success: true,
                data: updatedGroup,
                message: 'Vehicle added to group successfully',
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to add vehicle to group',
                error: error.statusCode ? error.message : 'Internal server error'
            });
        }
    };

    removeVehicleFromGroup = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const data: VehicleGroupDto = req.body;

            // Validate request
            await validate(vehicleGroupSchema, data);

            const updatedGroup = await this.groupService.removeVehicleFromGroup(data);

            res.status(200).json({
                success: true,
                data: updatedGroup,
                message: 'Vehicle removed from group successfully',
            });
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Failed to remove vehicle from group',
                error: error.statusCode ? error.message : 'Internal server error'
            });
        }
    };
}