import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CdkDragDrop, transferArrayItem, CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { NgIf, NgFor } from '@angular/common';

import { GroupService } from '../../../services/group.service';
import { VehicleService } from '../../../services/vehicle.service';
import { Group } from '../../../models/group.model';
import { Vehicle } from '../../../models/vehicle.model';
import { VehicleGroup } from '../../../models/vehicle-group.model';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CdkDropList,
    CdkDrag,
    RouterLink
  ]
})
export class GroupDetailComponent implements OnInit {
  group: Group | null = null;
  availableVehicles: Vehicle[] = [];
  isLoading = true;

  constructor(
    private groupService: GroupService,
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadGroup(params['id']);
        this.loadAvailableVehicles();
      }
    });
  }

  loadGroup(id: string): void {
    this.isLoading = true;
    this.groupService.getGroupById(id).subscribe({
      next: (response) => {
        this.group = response.data;
        // Asegúrate de que group.vehicles sea siempre un array
        if (!this.group.vehicles) {
          this.group.vehicles = [];
        }
        this.isLoading = false;
        this.filterAvailableVehicles();
      },
      error: (error) => {
        console.error('Error loading group', error);
        this.snackBar.open('Error loading group', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/groups']);
      }
    });
  }

  loadAvailableVehicles(): void {
    this.vehicleService.getAllVehicles().subscribe({
      next: (response) => {
        this.availableVehicles = response.data;
        if (this.group) {
          this.filterAvailableVehicles();
        }
      },
      error: (error) => {
        console.error('Error loading vehicles', error);
        this.snackBar.open('Error loading vehicles', 'Close', { duration: 3000 });
      }
    });
  }

  filterAvailableVehicles(): void {
    if (!this.group || !this.group.vehicles) return;

    const groupVehicleIds = this.group.vehicles.map(v => v.id);
    this.availableVehicles = this.availableVehicles.filter(v => !groupVehicleIds.includes(v.id));
  }

  onDrop(event: CdkDragDrop<Vehicle[]>): void {
    if (!this.group || !this.group.id) return;

    if (event.previousContainer === event.container) {
      return;
    }

    const vehicle = event.previousContainer.data[event.previousIndex];

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );

    const vehicleGroup: VehicleGroup = {
      vehicleId: vehicle.id!,
      groupId: this.group.id
    };

    if (event.container.id === 'group-vehicles') {
      this.groupService.addVehicleToGroup(vehicleGroup).subscribe({
        error: (err) => {
          console.error('Error adding vehicle to group', err);
          this.snackBar.open('Error adding vehicle to group', 'Close', { duration: 3000 });
          this.loadGroup(this.group!.id!);
          this.loadAvailableVehicles();
        }
      });
    } else {
      this.groupService.removeVehicleFromGroup(vehicleGroup).subscribe({
        error: (err) => {
          console.error('Error removing vehicle from group', err);
          this.snackBar.open('Error removing vehicle from group', 'Close', { duration: 3000 });
          this.loadGroup(this.group!.id!);
          this.loadAvailableVehicles();
        }
      });
    }
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  quickAddToGroup(vehicle: Vehicle): void {
    if (!this.group || !this.group.id) return;

    const vehicleGroup: VehicleGroup = {
      vehicleId: vehicle.id!,
      groupId: this.group.id
    };

    const index = this.availableVehicles.findIndex(v => v.id === vehicle.id);
    if (index > -1) {
      const [movedVehicle] = this.availableVehicles.splice(index, 1);
      if (!this.group.vehicles) {
        this.group.vehicles = [];
      }
      this.group.vehicles.push(movedVehicle);
    }

    this.groupService.addVehicleToGroup(vehicleGroup).subscribe({
      error: (err) => {
        console.error('Error adding vehicle to group', err);
        this.snackBar.open('Error adding vehicle to group', 'Close', { duration: 3000 });
        this.loadGroup(this.group!.id!);
        this.loadAvailableVehicles();
      }
    });
  }

  quickRemoveFromGroup(vehicle: Vehicle): void {
    if (!this.group || !this.group.id) return;

    const vehicleGroup: VehicleGroup = {
      vehicleId: vehicle.id!,
      groupId: this.group.id
    };

    if (this.group.vehicles) {
      const index = this.group.vehicles.findIndex(v => v.id === vehicle.id);
      if (index > -1) {
        const [movedVehicle] = this.group.vehicles.splice(index, 1);
        this.availableVehicles.push(movedVehicle);
      }
    }

    this.groupService.removeVehicleFromGroup(vehicleGroup).subscribe({
      error: (err) => {
        console.error('Error removing vehicle from group', err);
        this.snackBar.open('Error removing vehicle from group', 'Close', { duration: 3000 });
        // Revertir cambios UI
        this.loadGroup(this.group!.id!);
        this.loadAvailableVehicles();
      }
    });
  }
}