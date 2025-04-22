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
import { RefreshService } from '../../../services/refresh.service';

import { VehicleService } from '../../../services/vehicle.service';
import { Vehicle } from '../../../models/vehicle.model';

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
    private authService: AuthService,
    private refreshService: RefreshService
  ) { }

  ngOnInit(): void {
    // Verificar autenticación
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

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
    
    // Crear objeto de vehículo limpio
    const vehicleData: Vehicle = {
      brand: this.vehicleForm.get('brand')?.value?.trim() || '',
      model: this.vehicleForm.get('model')?.value?.trim() || '',
      year: Number(this.vehicleForm.get('year')?.value) || this.currentYear,
      color: this.vehicleForm.get('color')?.value?.trim() || '',
      location: this.vehicleForm.get('location')?.value?.trim() || undefined
    };
  
    console.log('Enviando datos de vehículo:', vehicleData);
  
    if (this.isEditMode) {
    } else {
      this.vehicleService.createVehicle(vehicleData).subscribe({
        next: (response) => {
          console.log('Vehículo creado exitosamente:', response);
          this.snackBar.open('Vehículo creado exitosamente', 'Cerrar', { duration: 3000 });
          
          this.refreshService.triggerRefresh();
          
          setTimeout(() => {
            this.router.navigate(['/vehicles']);
          }, 500);
        },
        error: (error) => {
          console.error('Error al crear el vehículo:', error);
          
          let errorMsg = 'Error al crear el vehículo';
          
          if (error.error?.message) {
            errorMsg = `Error del servidor: ${error.error.message}`;
          } else if (error.status === 0) {
            errorMsg = 'No se puede conectar al servidor. Verifique su conexión.';
          }
          
          this.snackBar.open(errorMsg, 'Cerrar', { duration: 5000 });
          this.isLoading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/vehicles']);
  }
}