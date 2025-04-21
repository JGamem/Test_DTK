import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink]
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    error: string = '';
    loading: boolean = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    ngOnInit(): void {
        // Check if already logged in
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['/vehicles']);
        }
    }

    onSubmit(): void {
        console.log('Datos de inicio de sesión:', {
            username: this.loginForm.get('username')?.value,
            passwordLength: this.loginForm.get('password')?.value?.length
        });
    
        this.authService.login(
            this.loginForm.get('username')?.value, 
            this.loginForm.get('password')?.value
        ).subscribe({
            next: (response) => {
                console.log('Respuesta de login:', {
                    token: response?.data?.token ? 'Token presente' : 'Sin token',
                    completeResponse: response
                });
            },
            error: (error) => {
                console.error('Error de inicio de sesión:', {
                    status: error.status,
                    message: error.message,
                    fullError: error
                });
            }
        });
    }
}