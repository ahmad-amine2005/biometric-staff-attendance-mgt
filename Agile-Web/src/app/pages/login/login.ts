import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { InputFieldComponent } from '../../components/input-field/input-field';
import { ButtonComponent } from '../../components/button/button';
import {FormsModule} from '@angular/forms';
import {AdminService} from '../../admin-service';
import {AuthResponse, LoginRequest} from '../../auth.model';

@Component({
  selector: 'app-login',
  imports: [CommonModule, InputFieldComponent, ButtonComponent, RouterModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email: string = '';
  password: string = '';
  loginError: string = '';

  constructor(private adminService: AdminService, private router: Router) {}

  onSignIn() {

    if (!this.email || !this.password) {
      this.loginError = 'Email and password are required';
      return;
    }

    const loginData: LoginRequest = {
      email: this.email,
      password: this.password,
    };

    this.adminService.login(loginData).subscribe({
      next: (response) => {

        // Store token
        this.adminService.storeToken(response.accessToken);

        localStorage.setItem('admin', JSON.stringify(response.admin));
        console.log('✅ Login successful');
        console.log(`token: ${response.accessToken}`);
        console.log(`admin: ${localStorage.getItem('admin')}`);


        // Navigate to dashboard (or wherever)
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.loginError = 'Login failed. Please check your credentials and try again.';
        console.log('❌ login failed ', err);

        let message = "Login failed";

        if(err?.error?.message){
          message = err.error.message;
        } else if(err?.message){
          message = "A Service is unavailable. Try again later!";
        }

        this.loginError = message;
      }
    });
  }

}
