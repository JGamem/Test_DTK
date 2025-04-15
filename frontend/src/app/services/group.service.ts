import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Group } from '../models/group.model';
import { VehicleGroup } from '../models/vehicle-group.model';

@Injectable({
    providedIn: 'root'
})
export class GroupService {
    private endpoint = 'groups';

    constructor(private apiService: ApiService) { }

    getAllGroups(): Observable<{ success: boolean; data: Group[] }> {
        return this.apiService.get<{ success: boolean; data: Group[] }>(this.endpoint);
    }

    getGroupById(id: string): Observable<{ success: boolean; data: Group }> {
        return this.apiService.getById<{ success: boolean; data: Group }>(this.endpoint, id);
    }

    createGroup(group: Group): Observable<{ success: boolean; data: Group; message: string }> {
        return this.apiService.post<Group, { success: boolean; data: Group; message: string }>(
            this.endpoint, group
        );
    }

    addVehicleToGroup(vehicleGroup: VehicleGroup): Observable<{ success: boolean; data: Group; message: string }> {
        return this.apiService.post<VehicleGroup, { success: boolean; data: Group; message: string }>(
            `${this.endpoint}/add-vehicle`, vehicleGroup
        );
    }

    removeVehicleFromGroup(vehicleGroup: VehicleGroup): Observable<{ success: boolean; data: Group; message: string }> {
        return this.apiService.post<VehicleGroup, { success: boolean; data: Group; message: string }>(
            `${this.endpoint}/remove-vehicle`, vehicleGroup
        );
    }
}