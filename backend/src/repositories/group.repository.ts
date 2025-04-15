import { Repository } from 'typeorm';
import { Group } from '../entities/group.entity';
import { AppDataSource } from '../config/database.config';

export const GroupRepository = AppDataSource.getRepository(Group);