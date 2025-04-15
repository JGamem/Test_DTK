import { Vehicle } from './vehicle.model';

export interface Group {
    id?: string;
    name: string;
    description?: string;
    vehicles?: Vehicle[];
    createdAt?: Date;
}