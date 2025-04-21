import { AppDataSource } from '../config/database.config';
import { User } from '../entities/user.entity';

export const UserRepository = AppDataSource.getRepository(User);