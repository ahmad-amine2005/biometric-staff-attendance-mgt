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
      next: () => {
        console.log('Signup successful');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Signup failed:', err);
        this.resultError = 'signup failed: ' + (err.error?.message || 'server error');

        let message = 'Registration failed';

        if(err?.error?.message){
          message = err.error.message;
        } else if (err?.status === 409){
          message = 'Resource already available';
        } else if (err?.message) {
          message = 'A Service is unavailable. Try again later!';
        }

        this.resultError = message;
      }
    });
  }

}
