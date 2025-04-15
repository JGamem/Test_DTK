import { Group } from '../entities/group.entity';
import { GroupRepository } from '../repositories/group.repository';
import { VehicleRepository } from '../repositories/vehicle.repository';
import { CreateGroupDto, VehicleGroupDto } from '../dtos/group.dto';

export class GroupService {
    /**
     * Get all groups with their vehicles
     */
    async findAll(): Promise<Group[]> {
        return GroupRepository.find({
            relations: ['vehicles'],
        });
    }

    /**
     * Get a group by id with its vehicles
     */
    async findById(id: string): Promise<Group | null> {
        return GroupRepository.findOne({
            where: { id },
            relations: ['vehicles'],
        });
    }

    /**
     * Create a new group
     */
    async create(groupData: CreateGroupDto): Promise<Group> {
        try {
            const existingGroup = await GroupRepository.findOne({
                where: { name: groupData.name },
            });

            if (existingGroup) {
                throw new Error('A group with this name already exists');
            }

            const newGroup = GroupRepository.create(groupData);
            return await GroupRepository.save(newGroup);
        } catch (error) {
            console.error('Error creating group:', error);
            throw error;
        }
    }

    /**
     * Add a vehicle to a group
     */
    async addVehicleToGroup(data: VehicleGroupDto): Promise<Group | null> {
        const { vehicleId, groupId } = data;

        const group = await this.findById(groupId);
        const vehicle = await VehicleRepository.findOne({
            where: { id: vehicleId }
        });

        if (!group || !vehicle) return null;

        // Check if the vehicle is already in the group
        if (group.vehicles && group.vehicles.some(v => v.id === vehicleId)) {
            return group; // Vehicle already in the group
        }

        // Initialize vehicles array if it doesn't exist
        if (!group.vehicles) {
            group.vehicles = [];
        }

        group.vehicles.push(vehicle);
        return GroupRepository.save(group);
    }

    /**
     * Remove a vehicle from a group
     */
    async removeVehicleFromGroup(data: VehicleGroupDto): Promise<Group | null> {
        const { vehicleId, groupId } = data;

        const group = await this.findById(groupId);
        if (!group || !group.vehicles) return null;

        // Filter out the vehicle
        group.vehicles = group.vehicles.filter(v => v.id !== vehicleId);
        return GroupRepository.save(group);
    }
}