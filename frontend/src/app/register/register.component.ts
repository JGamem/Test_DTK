import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
    registerForm: FormGroup;
    error: string = '';
    loading: boolean = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required]
        }, {
            validators: this.passwordMatchValidator
        });
    }

    // Validador para comprobar que las contraseñas coinciden
    passwordMatchValidator(g: FormGroup) {
        const password = g.get('password')?.value;
        const confirmPassword = g.get('confirmPassword')?.value;

        return password === confirmPassword ? null : { 'mismatch': true };
    }

    onSubmit(): void {
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.error = '';

        const { username, email, password } = this.registerForm.value;

        this.authService.register(username, email, password).subscribe({
            next: () => {
                this.router.navigate(['/login'], {
                    queryParams: { registered: 'true' }
                });
            },
            error: (error) => {
                console.error('Registration error', error);
                this.error = error.error?.message || 'Registration failed. Please try again.';
                this.loading = false;
            },
            complete: () => {
                this.loading = false;
            }
        });
    }
}