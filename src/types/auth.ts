import type { ReactNode } from 'react';

export interface User {
  id: number;
  full_name?: string;
  username?: string;
  languageCode?: string;
  phoneNumber?: string;
}
export interface InvoiceUser {
    user_id: string;
    phone: string;
    tin: number;
    activeCompany: number;
    full_name: string;
    category: number;
    realizationpurpose: number;
    branch: {
        branchName: string | null;
        branchNum: string | null;
        tin: string | null;
        name: string | null;
    };
    activeCompanyInfo: {
        shortName: string;
        Tin: number;
        director: string;
        soato: string | null;
    };
    tariff: {
        title: string;
        amount: number;
        minusamount: string;
    };
    balance: {
        amount: number;
        allowcount: number;
        tin: number;
    };
}


export interface AuthData {
  token: string;
}

export interface AuthState {
  token: string | null;
  user: InvoiceUser | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  phoneNumber: string;
  password: string;
}

export interface RegisterData {
  phoneNumber: string;
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
  is_exist: boolean;
  token: string;
  user: InvoiceUser | null;
}

export interface ProfileResponse {
    message: string;
    data: InvoiceUser;
}
