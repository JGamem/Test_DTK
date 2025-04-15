import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';

import { GroupService } from '../../../services/group.service';
import { Group } from '../../../models/group.model';

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class GroupFormComponent implements OnInit {
  groupForm!: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.groupForm.invalid) {
      return;
    }

    this.isLoading = true;
    const groupData: Group = this.groupForm.value;

    this.groupService.createGroup(groupData).subscribe({
      next: () => {
        this.snackBar.open('Group created successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/groups']);
      },
      error: (error) => {
        console.error('Error creating group', error);
        this.snackBar.open(
          error.error?.message || 'Error creating group', 
          'Close', 
          { duration: 3000 }
        );
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/groups']);
  }
}