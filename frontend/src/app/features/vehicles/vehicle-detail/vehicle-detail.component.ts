import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { NgIf, NgFor } from '@angular/common';

import { VehicleService } from '../../../services/vehicle.service';
import { Vehicle } from '../../../models/vehicle.model';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    RouterLink
  ]
})
export class VehicleDetailComponent implements OnInit {
  vehicle: Vehicle | null = null;
  isLoading = true;

  constructor(
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadVehicle(params['id']);
      }
    });
  }

  loadVehicle(id: string): void {
    this.isLoading = true;
    this.vehicleService.getVehicleById(id).subscribe({
      next: (response) => {
        this.vehicle = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading vehicle', error);
        this.snackBar.open('Error loading vehicle', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/vehicles']);
      }
    });
  }

  deleteVehicle(): void {
    if (!this.vehicle?.id) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this vehicle?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.vehicleService.deleteVehicle(this.vehicle!.id!).subscribe({
          next: () => {
            this.snackBar.open('Vehicle deleted successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/vehicles']);
          },
          error: (error) => {
            console.error('Error deleting vehicle', error);
            this.snackBar.open('Error deleting vehicle', 'Close', { duration: 3000 });
            this.isLoading = false;
          }
        });
      }
    });
  }
}