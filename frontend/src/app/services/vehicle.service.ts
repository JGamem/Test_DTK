import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Vehicle } from '../models/vehicle.model';

@Injectable({
    providedIn: 'root'
})
export class VehicleService {
    private endpoint = 'vehicles';

    constructor(private apiService: ApiService) { }

    getAllVehicles(): Observable<{ success: boolean; data: Vehicle[] }> {
        return this.apiService.get<{ success: boolean; data: Vehicle[] }>(this.endpoint);
    }

    getVehicleById(id: string): Observable<{ success: boolean; data: Vehicle }> {
        return this.apiService.getById<{ success: boolean; data: Vehicle }>(this.endpoint, id);
    }

    createVehicle(vehicle: Vehicle): Observable<{ success: boolean; data: Vehicle; message: string }> {
        return this.apiService.post<Vehicle, { success: boolean; data: Vehicle; message: string }>(
            this.endpoint, vehicle
        );
    }

    updateVehicle(id: string, vehicle: Partial<Vehicle>): Observable<{ success: boolean; data: Vehicle; message: string }> {
        return this.apiService.put<Partial<Vehicle>, { success: boolean; data: Vehicle; message: string }>(
            this.endpoint, id, vehicle
        );
    }

    deleteVehicle(id: string): Observable<{ success: boolean; message: string }> {
        return this.apiService.delete<{ success: boolean; message: string }>(this.endpoint, id);
    }
}