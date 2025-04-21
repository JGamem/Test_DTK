import { Service } from 'typedi';
import { Group } from '../entities/group.entity';
import { GroupRepository } from '../repositories/group.repository';
import { VehicleRepository } from '../repositories/vehicle.repository';
import { CreateGroupDto, VehicleGroupDto } from '../dtos/group.dto';
import { AppError } from '../utils/app-error';
import { PaginationOptions, PaginatedResult } from '../utils/pagination';

@Service()
export class GroupService {
    async findAll(options?: PaginationOptions): Promise<PaginatedResult<Group>> {
        const [groups, total] = await GroupRepository.findAndCount({
            relations: ['vehicles'],
            skip: options?.page ? (options.page - 1) * (options?.limit || 10) : 0,
            take: options?.limit || 10
        });

        return {
            data: groups,
            meta: {
                total,
                page: options?.page || 1,
                limit: options?.limit || 10,
                totalPages: Math.ceil(total / (options?.limit || 10))
            }
        };
    }

    async findById(id: string): Promise<Group> {
        const group = await GroupRepository.findOne({
            where: { id },
            relations: ['vehicles'],
        });

        if (!group) {
            throw new AppError(`Group with id ${id} not found`, 404);
        }

        return group;
    }

    async create(groupData: CreateGroupDto): Promise<Group> {
        const existingGroup = await GroupRepository.findOne({
            where: { name: groupData.name },
        });

        if (existingGroup) {
            throw new AppError('A group with this name already exists', 409);
        }

        const newGroup = GroupRepository.create(groupData);
        return GroupRepository.save(newGroup);
    }

    async addVehicleToGroup(data: VehicleGroupDto): Promise<Group> {
        const { vehicleId, groupId } = data;

        const group = await this.findById(groupId);
        const vehicle = await VehicleRepository.findOne({
            where: { id: vehicleId }
        });

        if (!vehicle) {
            throw new AppError(`Vehicle with id ${vehicleId} not found`, 404);
        }

        if (group.vehicles && group.vehicles.some(v => v.id === vehicleId)) {
            return group; // Vehicle already in the group
        }

        if (!group.vehicles) {
            group.vehicles = [];
        }

        group.vehicles.push(vehicle);
        return GroupRepository.save(group);
    }

    async removeVehicleFromGroup(data: VehicleGroupDto): Promise<Group> {
        const { vehicleId, groupId } = data;

        const group = await this.findById(groupId);

        if (!group.vehicles) {
            return group;
        }

        group.vehicles = group.vehicles.filter(v => v.id !== vehicleId);
        return GroupRepository.save(group);
    }
}