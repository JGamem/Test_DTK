import { Group } from './group.model';

export interface Vehicle {
    id?: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    location?: string;
    groups?: Group[];
    createdAt?: Date;
    updatedAt?: Date;
}