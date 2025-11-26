import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InputFieldComponent } from '../../components/input-field/input-field';
import { ButtonComponent } from '../../components/button/button';

@Component({
  selector: 'app-login',
  imports: [CommonModule, InputFieldComponent, ButtonComponent, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  employeeId: string = '';
  email: string = '';
  password: string = '';

  onSignup() {
    console.log('Signup:', {
      employeeId: this.employeeId,
      email: this.email,
      password: this.password
    });

}
}
