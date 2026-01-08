export const STORAGE_KEYS = {
  CURRENT_USER: 'neostella_current_user',
  USERS: 'neostella_users',
  CASES: 'neostella_cases',
  CLIENTS: 'neostella_clients',
  TASKS: 'neostella_tasks',
  TIME_ENTRIES: 'neostella_time_entries',
  ACTIVITIES: 'neostella_activities',
  NOTES: 'neostella_notes',
  NOTIFICATIONS: 'neostella_notifications',
  LANGUAGE: 'neostella_language',
  THEME: 'neostella_theme',
  SEED_INITIALIZED: 'neostella_seed_initialized',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
