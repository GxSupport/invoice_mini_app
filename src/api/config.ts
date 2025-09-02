export const API_CONFIG = {
  BASE_URL: 'https://back.e-invoice.uz/api',
  DEFAULT_LANGUAGE: 'uz',
} as const;

export const getApiUrl = (endpoint: string, lang: string = API_CONFIG.DEFAULT_LANGUAGE): string => {
  return `${API_CONFIG.BASE_URL}/${lang}${endpoint}`;
};

export const getApiLanguage = (): string => {
  const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
  return telegramUser?.language_code || API_CONFIG.DEFAULT_LANGUAGE;
};