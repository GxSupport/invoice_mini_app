export const API_CONFIG = {
  BASE_URL: 'https://back.e-invoice.uz/api',
  DEFAULT_LANGUAGE: 'uz',
};

export const getApiUrl = (endpoint, lang = API_CONFIG.DEFAULT_LANGUAGE) => {
  return `${API_CONFIG.BASE_URL}/${lang}${endpoint}`;
};

export const getApiLanguage = () => {
  const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
  return telegramUser?.language_code || API_CONFIG.DEFAULT_LANGUAGE;
};