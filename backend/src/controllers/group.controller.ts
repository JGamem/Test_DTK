import { Request, Response } from 'express';
import { GroupService } from '../services/group.service';
import { CreateGroupDto, VehicleGroupDto } from '../dtos/group.dto';

export class GroupController {
    private groupService = new GroupService();

    /**
     * Get all groups
     */
    public getAllGroups = async (req: Request, res: Response): Promise<void> => {
        try {
            const groups = await this.groupService.findAll();
            res.status(200).json({
                success: true,
                data: groups,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch groups',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    };

    /**
     * Get a group by id
     */
    public getGroupById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;
            const group = await this.groupService.findById(id);

            if (!group) {
                res.status(404).json({
                    success: false,
                    message: `Group with id ${id} not found`,
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: group,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch group',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    };

    /**
     * Create a new group
     */
    public createGroup = async (req: Request, res: Response): Promise<void> => {
        try {
            const groupData: CreateGroupDto = req.body;

            // Validación adicional
            if (!groupData.name || groupData.name.trim() === '') {
                res.status(400).json({
                    success: false,
                    message: 'Group name is required',
                });
                return;
            }

            const newGroup = await this.groupService.create(groupData);

            res.status(201).json({
                success: true,
                data: newGroup,
                message: 'Group created successfully',
            });
        } catch (error) {
            console.error('Error in createGroup controller:', error);
            
            if (error instanceof Error && error.message.includes('already exists')) {
                res.status(409).json({
                    success: false,
                    message: error.message,
                });
                return;
            }

            res.status(500).json({
                success: false,
                message: 'Failed to create group',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    };

    /**
     * Add a vehicle to a group
     */
    public addVehicleToGroup = async (req: Request, res: Response): Promise<void> => {
        try {
            const data: VehicleGroupDto = req.body;
            const updatedGroup = await this.groupService.addVehicleToGroup(data);

            if (!updatedGroup) {
                res.status(404).json({
                    success: false,
                    message: 'Vehicle or group not found',
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: updatedGroup,
                message: 'Vehicle added to group successfully',
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to add vehicle to group',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    };

    /**
     * Remove a vehicle from a group
     */
    public removeVehicleFromGroup = async (req: Request, res: Response): Promise<void> => {
        try {
            const data: VehicleGroupDto = req.body;
            const updatedGroup = await this.groupService.removeVehicleFromGroup(data);

            if (!updatedGroup) {
                res.status(404).json({
                    success: false,
                    message: 'Vehicle or group not found',
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: updatedGroup,
                message: 'Vehicle removed from group successfully',
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to remove vehicle from group',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    };
}