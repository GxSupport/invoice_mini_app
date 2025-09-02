import { getApiUrl, getApiLanguage } from './config';
import type { LoginCredentials, RegisterData, AuthData, VerificationResponse } from '@/types/auth';

export const loginUser = async (credentials: LoginCredentials): Promise<AuthData> => {
  const lang = getApiLanguage();
  const url = getApiUrl('/auth/login', lang);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
};

export const registerUser = async (userData: RegisterData): Promise<AuthData> => {
  const lang = getApiLanguage();
  const url = getApiUrl('/auth/register', lang);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'Registration failed');
  }

  return response.json();
};

export const verifyUser = async (initRawData: string): Promise<VerificationResponse> => {
  const lang = getApiLanguage();
  const url = getApiUrl('/tgapp/check_user', lang);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `tma ${initRawData}`,
    },
    body: JSON.stringify({ init_data: initRawData }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'User verification failed');
  }

  return response.json();
};

export const logoutUser = async (token: string): Promise<{ message: string }> => {
  const lang = getApiLanguage();
  const url = getApiUrl('/auth/logout', lang);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'Logout failed');
  }

  return response.json();
};