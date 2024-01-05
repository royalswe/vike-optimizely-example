export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_AZURE = process.env.IS_AZURE === 'true';
export const PORT = process.env.PORT || 3000;
export const API_URL = process.env.API_BASE_URL;

export const LANGUAGE_TO_REDIRECT_PAGES = Object.freeze({
  en: '/en/global/',
  sv: '/sv/se/',
  lv: '/lv/lv/',
  da: '/da/dk/',
});

export const MARKET_TO_REDIRECT_PAGES = Object.freeze({
  global: '/en/global/',
  se: '/sv/se/',
  lv: '/lv/lv/',
  dk: '/da/dk/',
});
