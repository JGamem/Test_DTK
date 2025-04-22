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
  paginatorReady = false;
  sortReady = false;
  private refreshSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
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
      console.log("Recibida señal de actualización");
      this.loadVehicles();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializePaginatorAndSort();
    }, 300);
  }

  initializePaginatorAndSort(): void {
    try {
      if (this.paginator) {
        console.log("Paginator encontrado, inicializando");
        this.dataSource.paginator = this.paginator;
        this.paginator.pageSize = 5;
        this.paginatorReady = true;
      } else {
        console.warn("Paginator no disponible");
        setTimeout(() => {
          if (this.paginator) {
            console.log("Paginator encontrado en segundo intento");
            this.dataSource.paginator = this.paginator;
            this.paginator.pageSize = 5;
            this.paginatorReady = true;
          } else {
            console.error("Paginator sigue sin estar disponible");
          }
        }, 500);
      }

      if (this.sort) {
        console.log("Sort encontrado, inicializando");
        this.dataSource.sort = this.sort;
        this.sortReady = true;
      } else {
        console.warn("Sort no disponible");
        setTimeout(() => {
          if (this.sort) {
            console.log("Sort encontrado en segundo intento");
            this.dataSource.sort = this.sort;
            this.sortReady = true;
          } else {
            console.error("Sort sigue sin estar disponible");
          }
        }, 500);
      }
    } catch (error) {
      console.error("Error inicializando paginador y ordenador:", error);
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
        console.log("Respuesta recibida:", response);

        if (response && response.data) {
          this.dataSource.data = response.data;
          console.log("Datos cargados:", this.dataSource.data.length, "vehículos");

          if (this.paginatorReady && this.paginator) {
            this.dataSource.paginator = this.paginator;
          }

          if (this.sortReady && this.sort) {
            this.dataSource.sort = this.sort;
          }

          if (!this.paginatorReady || !this.sortReady) {
            setTimeout(() => {
              this.initializePaginatorAndSort();
            }, 200);
          }
        } else {
          console.error('Format is not valid:', response);
          this.snackBar.open('Vehicle format is not valid', 'Cerrar', { duration: 3000 });
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading vehicles', error);
        this.snackBar.open('Error loading vehicles', 'Close', { duration: 3000 });
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
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this vehicle?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.vehicleService.deleteVehicle(id).subscribe({
          next: () => {
            this.snackBar.open('Vehicle deleted successfully', 'Close', { duration: 3000 });
            this.loadVehicles();
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