import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [
        CommonModule, 
        ReactiveFormsModule, 
        RouterLink,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule
    ]
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    error: string = '';
    loading: boolean = false;
    hidePassword = true;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        // Check if already logged in
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['/vehicles']);
        }

        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.error = '';

        this.authService.login(
            this.loginForm.get('username')?.value,
            this.loginForm.get('password')?.value
        ).subscribe({
            next: (response) => {
                console.log('Login exitoso:', response);
                setTimeout(() => {
                    this.router.navigate(['/vehicles']);
                }, 100);
            },
            error: (error) => {
                console.error('Error de login:', error);
                this.error = error.error?.message || 'Login failed';
                this.loading = false;
            }
        });
    }

    togglePasswordVisibility() {
        this.hidePassword = !this.hidePassword;
    }
}