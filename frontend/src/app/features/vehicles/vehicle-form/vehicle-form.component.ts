import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

import { VehicleService } from '../../../services/vehicle.service';
import { Vehicle } from '../../../models/vehicle.model';
import { LoadingComponent } from '../../../shared/loading/loading.component';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatProgressSpinnerModule
  ]
})

export class VehicleFormComponent implements OnInit {
  vehicleForm!: FormGroup;
  isEditMode = false;
  vehicleId = '';
  isLoading = false;
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authService: AuthService 
  ) { }

  ngOnInit(): void {
    this.initForm();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.vehicleId = params['id'];
        this.loadVehicle(this.vehicleId);
      }
    });
  }

  initForm(): void {
    this.vehicleForm = this.fb.group({
      brand: ['', [Validators.required]],
      model: ['', [Validators.required]],
      year: [this.currentYear, [
        Validators.required,
        Validators.min(1900),
        Validators.max(this.currentYear + 1)
      ]],
      color: ['', [Validators.required]],
      location: ['']
    });
  }

  loadVehicle(id: string): void {
    this.isLoading = true;
    this.vehicleService.getVehicleById(id).subscribe({
      next: (response) => {
        const vehicle = response.data;
        this.vehicleForm.patchValue({
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          color: vehicle.color,
          location: vehicle.location
        });
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

  onSubmit(): void {
    if (this.vehicleForm.invalid) {
      return;
    }

    this.isLoading = true;
    const vehicleData: Vehicle = this.vehicleForm.value;

    console.log('Estado de autenticación:', this.authService.isAuthenticated());
    console.log('Token actual:', this.authService.getToken());

    if (this.isEditMode) {
      this.vehicleService.updateVehicle(this.vehicleId, vehicleData).subscribe({
        next: (response) => {
          console.log('Vehículo actualizado:', response);
          this.snackBar.open('Vehicle updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/vehicles']);
        },
        error: (error) => {
          console.error('Error en la API:', error);
          console.error('Respuesta completa:', error.error);
          this.snackBar.open(`Error: ${error.error?.message || 'Unknown error'}`, 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    } else {
      this.vehicleService.createVehicle(vehicleData).subscribe({
        next: (response) => {
          console.log('Vehículo creado:', response);
          this.snackBar.open('Vehicle created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/vehicles']);
        },
        error: (error) => {
          console.error('Error en la API:', error);
          console.error('Respuesta completa:', error.error);
          this.snackBar.open(`Error: ${error.error?.message || 'Unknown error'}`, 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/vehicles']);
  }
}