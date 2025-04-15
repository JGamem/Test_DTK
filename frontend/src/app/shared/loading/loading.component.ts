import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [MatProgressSpinnerModule, NgIf],
  template: `
    <div class="loading-container" *ngIf="isLoading">
      <mat-spinner [diameter]="diameter"></mat-spinner>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 24px;
      width: 100%;
    }
  `]
})
export class LoadingComponent {
  @Input() isLoading = false;
  @Input() diameter = 40;
}