import { Repository } from 'typeorm';
import { Vehicle } from '../entities/vehicle.entity';
import { AppDataSource } from '../config/database.config';

export const VehicleRepository = AppDataSource.getRepository(Vehicle);