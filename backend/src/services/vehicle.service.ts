// src/services/vehicle.service.ts
import { Service } from 'typedi';
import { Vehicle } from '../entities/vehicle.entity';
import { VehicleRepository } from '../repositories/vehicle.repository';
import { CreateVehicleDto, UpdateVehicleDto } from '../dtos/vehicle.dto';
import { AppError } from '../utils/app-error';
import { PaginationOptions, PaginatedResult } from '../utils/pagination';

@Service()
export class VehicleService {
    async findAll(options?: PaginationOptions): Promise<PaginatedResult<Vehicle>> {
        const [vehicles, total] = await VehicleRepository.findAndCount({
            relations: ['groups'],
            skip: options?.page ? (options.page - 1) * (options?.limit || 10) : 0,
            take: options?.limit || 10
        });

        return {
            data: vehicles,
            meta: {
                total,
                page: options?.page || 1,
                limit: options?.limit || 10,
                totalPages: Math.ceil(total / (options?.limit || 10))
            }
        };
    }

    async findById(id: string): Promise<Vehicle> {
        const vehicle = await VehicleRepository.findOne({
            where: { id },
            relations: ['groups'],
        });

        if (!vehicle) {
            throw new AppError(`Vehicle with id ${id} not found`, 404);
        }

        return vehicle;
    }

    async create(vehicleData: CreateVehicleDto): Promise<Vehicle> {
        const newVehicle = VehicleRepository.create(vehicleData);
        return VehicleRepository.save(newVehicle);
    }

    async update(id: string, vehicleData: UpdateVehicleDto): Promise<Vehicle> {
        const vehicle = await this.findById(id);

        VehicleRepository.merge(vehicle, vehicleData);
        return VehicleRepository.save(vehicle);
    }

    async delete(id: string): Promise<void> {
        const result = await VehicleRepository.delete(id);

        if (result.affected === 0) {
            throw new AppError(`Vehicle with id ${id} not found`, 404);
        }
    }
}