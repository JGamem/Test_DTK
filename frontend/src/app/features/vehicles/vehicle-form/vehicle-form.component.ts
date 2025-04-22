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
      // Mostrar los errores específicos para ayudar al usuario
      Object.keys(this.vehicleForm.controls).forEach(key => {
        const control = this.vehicleForm.get(key);
        if (control?.invalid) {
          console.log(`Campo ${key} inválido:`, control.errors);
        }
      });

      this.snackBar.open('Por favor, corrija los errores en el formulario', 'Cerrar', { duration: 3000 });
      return;
    }

    // Verificar autenticación nuevamente antes de enviar
    if (!this.authService.isAuthenticated()) {
      this.snackBar.open('Your session has expired. Please login again.', 'Login', {
        duration: 5000
      }).onAction().subscribe(() => {
        this.router.navigate(['/login']);
      });
      return;
    }

    this.isLoading = true;

    // Limpia y sanitiza los datos antes de enviarlos
    const vehicleData: Vehicle = {
      brand: this.sanitizeInput(this.vehicleForm.get('brand')?.value),
      model: this.sanitizeInput(this.vehicleForm.get('model')?.value),
      year: Number(this.vehicleForm.get('year')?.value) || this.currentYear,
      color: this.sanitizeInput(this.vehicleForm.get('color')?.value),
      location: this.sanitizeInput(this.vehicleForm.get('location')?.value) || undefined
    };

    console.log('Submitting vehicle data:', vehicleData);

    if (this.isEditMode) {
      // Código para actualizar vehículo...
    } else {
      // Crear nuevo vehículo con manejador mejorado de errores
      this.vehicleService.createVehicle(vehicleData).subscribe({
        next: (response) => {
          console.log('Vehicle created successfully:', response);
          this.snackBar.open('Vehicle created successfully', 'Close', { duration: 3000 });

          // Notificar que se deben actualizar los datos
          this.refreshService.triggerRefresh();

          // Limpia el formulario
          this.vehicleForm.reset();

          // Espera un poco antes de navegar para asegurar que la actualización llegue
          setTimeout(() => {
            // Navegar a la lista de vehículos
            this.router.navigate(['/vehicles']);
          }, 1000);
        },
        error: (error) => {
          console.error('Error creating vehicle:', error);

          // Mensaje de error más específico
          let errorMsg = 'Failed to create vehicle';

          if (error.error?.message) {
            errorMsg = `Server error: ${error.error.message}`;
          } else if (error.status === 0) {
            errorMsg = 'Cannot connect to server. Please check your connection.';
          } else if (error.status === 400) {
            errorMsg = 'Invalid data. Please check your input.';
          } else if (error.status === 401) {
            errorMsg = 'Authentication failed. Please login again.';
            this.authService.logout();
          } else if (error.status === 409) {
            errorMsg = 'This vehicle may already exist in the database.';
          } else if (error.message) {
            errorMsg = error.message;
          }

          this.snackBar.open(errorMsg, 'Close', { duration: 5000 });
          this.isLoading = false;
        }
      });
    }
  }
  private sanitizeInput(value: any): string {
    if (value === null || value === undefined) return '';
    return String(value).trim();
  }
  onCancel(): void {
    this.router.navigate(['/vehicles']);
  }
}