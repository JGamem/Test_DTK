import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Vehicle } from '../models/vehicle.model';
import { catchError, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VehicleService {
    private endpoint = 'vehicles';

    constructor(private apiService: ApiService) { }

    getAllVehicles(): Observable<{ success: boolean; data: Vehicle[]; meta?: any }> {
        const timestamp = new Date().getTime();
        return this.apiService.get<{ success: boolean; data: Vehicle[]; meta?: any }>(
            `${this.endpoint}?limit=100&_=${timestamp}`
        );
    }

    getVehicleById(id: string): Observable<{ success: boolean; data: Vehicle }> {
        return this.apiService.getById<{ success: boolean; data: Vehicle }>(this.endpoint, id);
    }

    createVehicle(vehicle: Vehicle): Observable<{ success: boolean; data: Vehicle; message: string }> {
        console.log('Service sending vehicle data:', vehicle);
        
        return this.apiService.post<Vehicle, { success: boolean; data: Vehicle; message: string }>(
            this.endpoint, vehicle
        ).pipe(
            catchError(error => {
                console.error('Service error creating vehicle:', error);
                return throwError(() => error);
            })
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