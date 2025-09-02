import { apiClient } from './config';
import type { LoginCredentials, RegisterData, AuthData, VerificationResponse, ProfileResponse } from '@/types/auth';

export const loginUser = async (credentials: LoginCredentials): Promise<AuthData> => {
  return apiClient.post('/auth/login', credentials);
};

export const registerUser = async (userData: RegisterData): Promise<AuthData> => {
  return apiClient.post('/auth/register', userData);
};

export const verifyUser = async (initRawData: string): Promise<VerificationResponse> => {
  return apiClient.get('/tgapp/check_user', {
    headers: {
      'Authorization': `tma ${initRawData}`,
    }
  });
};

export const getProfile = async (token: string): Promise<ProfileResponse> => {
  return apiClient.get('/profile/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
};

export const logoutUser = async (token: string): Promise<{ message: string }> => {
  return apiClient.post('/auth/logout', {}, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
};