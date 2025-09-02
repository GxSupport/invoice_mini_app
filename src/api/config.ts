import axios from 'axios';

export const API_CONFIG = {
  BASE_URL: 'https://back.e-invoice.uz/api',
  DEFAULT_LANGUAGE: 'uz',
  TIMEOUT: 10000,
} as const;

export const getApiLanguage = (): string => {
  const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
  return telegramUser?.language_code || API_CONFIG.DEFAULT_LANGUAGE;
};

// Create axios instance
export const apiClient = axios.create({
  baseURL: `${API_CONFIG.BASE_URL}/${getApiLanguage()}`,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add dynamic language
apiClient.interceptors.request.use(
  (config) => {
    const currentLang = getApiLanguage();
    config.baseURL = `${API_CONFIG.BASE_URL}/${currentLang}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'Network error';
    return Promise.reject(new Error(message));
  }
);