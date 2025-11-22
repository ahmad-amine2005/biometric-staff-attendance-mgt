import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputFieldComponent } from '../../components/input-field/input-field';
import { ButtonComponent } from '../../components/button/button';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, InputFieldComponent, ButtonComponent],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss']
})
export class SignupComponent {
  employeeId: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  onSignup() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Signup:', {
      employeeId: this.employeeId,
      email: this.email,
      password: this.password
    });
    // Add your signup logic here
  }
}