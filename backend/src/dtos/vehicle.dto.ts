export class CreateVehicleDto {
    brand: string = '';
    model: string = '';
    year: number = 0;
    color: string = '';
    location?: string;
}

export class UpdateVehicleDto {
    brand?: string;
    model?: string;
    year?: number;
    color?: string;
    location?: string;
}