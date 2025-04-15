import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';

import { GroupService } from '../../../services/group.service';
import { Group } from '../../../models/group.model';
import { LoadingComponent } from '../../../shared/loading/loading.component';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink
  ]
})
export class GroupListComponent implements OnInit {
  groups: Group[] = [];
  isLoading = true;

  constructor(
    private groupService: GroupService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadGroups();
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

  loadGroups(): void {
    this.isLoading = true;
    this.groupService.getAllGroups().subscribe({
      next: (response) => {
        this.groups = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading groups', error);
        this.snackBar.open('Error loading groups', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }
}