export interface User {
  id: string;
  email: string;
  surname: string;
  name: string;
  patronymic: string;
  avatarPath: string;
  createdAt: string;
  city: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  surname: string;
  name: string;
  patronymic: string;
  city: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export type RegisterResponse = AuthResponse;
export type LoginResponse = AuthResponse;
export type RefreshResponse = AuthResponse;
export type WhoAmIResponse = User;

export type AuthStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  status: AuthStatus;
  error: string | null;
}
