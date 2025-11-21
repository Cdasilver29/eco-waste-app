import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslations from './locales/en.json';
import swTranslations from './locales/sw.json';
import frTranslations from './locales/fr.json';
import esTranslations from './locales/es.json';
import zhTranslations from './locales/zh.json';

i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      sw: { translation: swTranslations },
      fr: { translation: frTranslations },
      es: { translation: esTranslations },
      zh: { translation: zhTranslations }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18next;
