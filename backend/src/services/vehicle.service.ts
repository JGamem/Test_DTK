import { Vehicle } from '../entities/vehicle.entity';
import { VehicleRepository } from '../repositories/vehicle.repository';
import { CreateVehicleDto, UpdateVehicleDto } from '../dtos/vehicle.dto';

export class VehicleService {
    /**
     * Get all vehicles with their related groups
     */
    async findAll(): Promise<Vehicle[]> {
        return VehicleRepository.find({
            relations: ['groups'],
        });
    }

    /**
     * Get a vehicle by id with its related groups
     */
    async findById(id: string): Promise<Vehicle | null> {
        return VehicleRepository.findOne({
            where: { id },
            relations: ['groups'],
        });
    }

    /**
     * Create a new vehicle
     */
    async create(vehicleData: CreateVehicleDto): Promise<Vehicle> {
        const newVehicle = VehicleRepository.create(vehicleData);
        return VehicleRepository.save(newVehicle);
    }

    /**
     * Update an existing vehicle
     */
    async update(id: string, vehicleData: UpdateVehicleDto): Promise<Vehicle | null> {
        const vehicle = await this.findById(id);
        if (!vehicle) return null;

        // Update vehicle properties
        VehicleRepository.merge(vehicle, vehicleData);
        return VehicleRepository.save(vehicle);
    }

    /**
     * Delete a vehicle
     */
    async delete(id: string): Promise<boolean> {
        const result = await VehicleRepository.delete(id);
        return (result.affected ?? 0) > 0;
    }
}