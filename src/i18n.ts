import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enDashboard from './locales/en/dashboard.json';
import enCases from './locales/en/cases.json';
import enClients from './locales/en/clients.json';
import enTasks from './locales/en/tasks.json';
import enCalendar from './locales/en/calendar.json';
import enTimeTracking from './locales/en/timeTracking.json';
import enSettings from './locales/en/settings.json';

import esCommon from './locales/es/common.json';
import esAuth from './locales/es/auth.json';
import esDashboard from './locales/es/dashboard.json';
import esCases from './locales/es/cases.json';
import esClients from './locales/es/clients.json';
import esTasks from './locales/es/tasks.json';
import esCalendar from './locales/es/calendar.json';
import esTimeTracking from './locales/es/timeTracking.json';
import esSettings from './locales/es/settings.json';

const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    dashboard: enDashboard,
    cases: enCases,
    clients: enClients,
    tasks: enTasks,
    calendar: enCalendar,
    timeTracking: enTimeTracking,
    settings: enSettings,
  },
  es: {
    common: esCommon,
    auth: esAuth,
    dashboard: esDashboard,
    cases: esCases,
    clients: esClients,
    tasks: esTasks,
    calendar: esCalendar,
    timeTracking: esTimeTracking,
    settings: esSettings,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: [
      'common',
      'auth',
      'dashboard',
      'cases',
      'clients',
      'tasks',
      'calendar',
      'timeTracking',
      'settings',
    ],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'neostella_language',
    },
  });

export default i18n;
