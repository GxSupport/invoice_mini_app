import type { ReactNode } from 'react';

export interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  email?: string;
}

export interface AuthData {
  token: string;
  user: User;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthContextType {
  getStoredAuth: () => Promise<AuthState | null>;
  setAuth: (authData: AuthData) => Promise<void>;
  clearAuth: () => Promise<void>;
}

export interface AuthGuardProps {
  children: ReactNode;
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface VerificationResponse extends AuthData {
  message?: string;
}