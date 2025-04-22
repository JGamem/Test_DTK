import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { Subscription } from 'rxjs';

import { VehicleService } from '../../../services/vehicle.service';
import { Vehicle } from '../../../models/vehicle.model';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { RefreshService } from '../../../services/refresh.service';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    RouterLink
  ]
})
export class VehicleListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['brand', 'model', 'year', 'color', 'location', 'actions'];
  dataSource = new MatTableDataSource<Vehicle>([]);
  isLoading = true;
  private refreshSubscription!: Subscription;
  
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private vehicleService: VehicleService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private refreshService: RefreshService
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Vehicle>([]);
    this.loadVehicles();
    this.refreshSubscription = this.refreshService.refresh$.subscribe(() => {
      console.log("Recibiendo señal de actualización");
      this.loadVehicles();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setupPaginatorAndSort();
    }, 300);
  }
  
  setupPaginatorAndSort(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      console.log("Paginator asignado correctamente:", this.paginator);
    } else {
      console.warn("Paginator no disponible");
    }
    
    if (this.sort) {
      this.dataSource.sort = this.sort;
      console.log("Sort asignado correctamente:", this.sort);
    } else {
      console.warn("Sort no disponible");
    }
  }
  
  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadVehicles(): void {
    this.isLoading = true;
    console.log("Cargando vehículos...");
    
    this.vehicleService.getAllVehicles().subscribe({
      next: (response) => {
        console.log("Respuesta del servidor:", response);
        
        if (response && response.data) {
          this.dataSource.data = response.data;
          console.log("Vehículos cargados:", this.dataSource.data.length);

          setTimeout(() => {
            if (this.paginator) {
              this.dataSource.paginator = this.paginator;
            }
            
            if (this.sort) {
              this.dataSource.sort = this.sort;
            }
            
            this.isLoading = false;
          }, 100);
        } else {
          console.error('Respuesta del servidor no válida:', response);
          this.snackBar.open('Error loading vehicles', 'Cerrar', { duration: 3000 });
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error al cargar los vehículos:', error);
        this.snackBar.open('Error loading vehicles', 'Cerrar', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteVehicle(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmar eliminación',
        message: '¿Estás seguro de que deseas eliminar este vehículo?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.vehicleService.deleteVehicle(id).subscribe({
          next: () => {
            this.snackBar.open('Vehículo eliminado correctamente', 'Cerrar', { duration: 3000 });
            this.loadVehicles();
          },
          error: (error) => {
            console.error('Error al eliminar el vehículo:', error);
            this.snackBar.open('Error al eliminar el vehículo', 'Cerrar', { duration: 3000 });
            this.isLoading = false;
          }
        });
      }
    });
  }
}