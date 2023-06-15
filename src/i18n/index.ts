import { createI18n } from 'vue-i18n';

import sv from '@/i18n/locales/sv.json';
import en from '@/i18n/locales/en.json';
import da from '@/i18n/locales/da.json';
import et from '@/i18n/locales/et.json';
import lv from '@/i18n/locales/lv.json';

const languages = { sv, en, da, et, lv };

export type MessageSchema = typeof en;

export function i18n(defaultLang = 'en') {
  return createI18n({
    legacy: false,
    locale: defaultLang,
    fallbackLocale: defaultLang,
    messages: languages as any,
  });
}

export default i18n;
