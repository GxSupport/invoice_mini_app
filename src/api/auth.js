import { getApiUrl, getApiLanguage } from './config.js';

export const loginUser = async (credentials) => {
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

export const registerUser = async (userData) => {
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

export const verifyUser = async (initRawData) => {
  const lang = getApiLanguage();
  const url = getApiUrl('/auth/verify', lang);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ initData: initRawData }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'User verification failed');
  }

  return response.json();
};

export const logoutUser = async (token) => {
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