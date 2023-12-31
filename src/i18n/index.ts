import type { PageContext } from '#src/renderer/types';
import { createI18n } from 'vue-i18n';
import dayjs from 'dayjs';

import sv from '#src/i18n/locales/sv.json';
import en from '#src/i18n/locales/en.json';
import da from '#src/i18n/locales/da.json';
import et from '#src/i18n/locales/et.json';
import lv from '#src/i18n/locales/lv.json';

import 'dayjs/locale/sv' // import locale
import 'dayjs/locale/en' // import locale
import 'dayjs/locale/da' // import locale
import 'dayjs/locale/et' // import locale
import 'dayjs/locale/lv' // import locale

const languages = { sv, en, da, et, lv } as const;

let i18nInstance: ReturnType<typeof createI18n> | null = null; // This will hold the single instance

export function i18n(defaultLang: PageContext['locale'] = 'en') {
  if (i18nInstance === null) {
    i18nInstance = createI18n({
      legacy: false,
      locale: defaultLang,
      fallbackLocale: defaultLang,
      messages: languages,
      globalInjection: true,
    });
    dayjs.locale(defaultLang);
  }
  else {
    // i18n keeps the previous locale value on full page refresh, so we need to change it to the new visited page locale
    updateLanguage(defaultLang);
  }
  return i18nInstance;
}

export function updateLanguage(newLocale: PageContext['locale']) {
  if (!i18nInstance || newLocale == null) {
    return; // i18n has not been initialized yet
  }
  if (i18nInstance.global.locale.value === newLocale) {
    return; // already set
  }
  if (!languages[newLocale]) {
    return console.warn(`Language ${newLocale} is not supported.`);
  }
  // Update the i18n instance with the new locale
  i18nInstance.global.locale.value = newLocale;
  // Update dayjs locale
  dayjs.locale(newLocale);
}

export default i18n;
