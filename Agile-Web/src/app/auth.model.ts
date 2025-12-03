import {Admin} from './admin';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string
  surname: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  expiresIn: number;
  issuedAt: Date;
  expiresAt: Date;
  admin: Admin;
}
