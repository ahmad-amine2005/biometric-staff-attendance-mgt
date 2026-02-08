import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import { InputFieldComponent } from '../../components/input-field/input-field';
import { ButtonComponent } from '../../components/button/button';
import {FormsModule} from '@angular/forms';
import {RegisterRequest} from '../../auth.model';
import {AdminService} from '../../admin-service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, InputFieldComponent, ButtonComponent, RouterModule, FormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss']
})
export class SignupComponent {

  // Password validation properties
  passwordsMatch: boolean = true;
  showPasswordError: boolean = false;

  name: string = '';
  surname: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  signupError: string = '';
  resultError: string = '';

  constructor(private adminService: AdminService, private router: Router) {}

  validationForm(): boolean {
    if (!this.name.trim()) {
      this.signupError = 'this field is required';
      return false;
    }
    if (!this.surname.trim()) {
      this.signupError = 'surname is required';
      return false;
    }
    if (!this.email.trim()) {
      this.signupError = 'email is required';
      return false;
    }
    // simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.signupError = 'email format is invalid';
      return false;
    }
    if (!this.password.trim()) {
      this.signupError = 'password is required';
      return false;
    }
    if (this.password.length < 6) {
      this.signupError = 'password must be at least 6 characters';
      return false;
    }
    if (this.password !== this.confirmPassword) {
      this.signupError = 'password mismatch';
      this.passwordsMatch = false;
      this.showPasswordError = true;
      return false;
    }

    // clear error if all checks pass
    this.signupError = '';
    this.passwordsMatch = true;
    this.showPasswordError = false;
    return true;
  }

  onSignup() {
    if (!this.validationForm()) {
      return;
    }

    const registerData: RegisterRequest = {
      name: this.name,
      surname: this.surname,
      email: this.email,
      password: this.password
    };

    this.adminService.register(registerData).subscribe({
      next: (response) => {
        console.log('Signup successful:', response);
        // Clear any previous errors
        this.resultError = '';
        // Navigate to login page on success
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Signup failed:', err);
        
        let message = 'Registration failed. Please try again.';

        // Handle backend error responses
        if (err?.error) {
          // Backend returns error message in 'error' key (from AuthController)
          if (err.error.error) {
            message = err.error.error;
          } 
          // Handle validation errors from Spring @Valid
          else if (err.error.message) {
            message = err.error.message;
          }
          // Handle Spring validation errors array
          else if (Array.isArray(err.error) && err.error.length > 0) {
            message = err.error[0].defaultMessage || err.error[0].message || message;
          }
        }

        // Handle HTTP status codes
        if (err?.status === 400) {
          // Bad request - validation or business logic error
          // Message already set from error body above
        } else if (err?.status === 409) {
          message = 'Email already registered';
        } else if (err?.status === 0 || err?.status === undefined) {
          message = 'Unable to connect to server. Please check your connection.';
        } else if (err?.status >= 500) {
          message = 'Server error. Please try again later.';
        }

        this.resultError = message;
      }
    });
  }

}
