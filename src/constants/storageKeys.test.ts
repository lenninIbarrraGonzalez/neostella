import { describe, it, expect } from 'vitest';
import { STORAGE_KEYS } from './storageKeys';

describe('STORAGE_KEYS', () => {
  it('should have CURRENT_USER key', () => {
    expect(STORAGE_KEYS.CURRENT_USER).toBe('neostella_current_user');
  });

  it('should have USERS key', () => {
    expect(STORAGE_KEYS.USERS).toBe('neostella_users');
  });

  it('should have CASES key', () => {
    expect(STORAGE_KEYS.CASES).toBe('neostella_cases');
  });

  it('should have CLIENTS key', () => {
    expect(STORAGE_KEYS.CLIENTS).toBe('neostella_clients');
  });

  it('should have TASKS key', () => {
    expect(STORAGE_KEYS.TASKS).toBe('neostella_tasks');
  });

  it('should have TIME_ENTRIES key', () => {
    expect(STORAGE_KEYS.TIME_ENTRIES).toBe('neostella_time_entries');
  });

  it('should have ACTIVITIES key', () => {
    expect(STORAGE_KEYS.ACTIVITIES).toBe('neostella_activities');
  });

  it('should have NOTES key', () => {
    expect(STORAGE_KEYS.NOTES).toBe('neostella_notes');
  });

  it('should have NOTIFICATIONS key', () => {
    expect(STORAGE_KEYS.NOTIFICATIONS).toBe('neostella_notifications');
  });

  it('should have LANGUAGE key', () => {
    expect(STORAGE_KEYS.LANGUAGE).toBe('neostella_language');
  });

  it('should have THEME key', () => {
    expect(STORAGE_KEYS.THEME).toBe('neostella_theme');
  });

  it('should have SEED_INITIALIZED key', () => {
    expect(STORAGE_KEYS.SEED_INITIALIZED).toBe('neostella_seed_initialized');
  });

  it('should have all keys prefixed with neostella_', () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      expect(key).toMatch(/^neostella_/);
    });
  });

  it('should have exactly 12 keys', () => {
    expect(Object.keys(STORAGE_KEYS)).toHaveLength(12);
  });

  it('should have unique values for all keys', () => {
    const values = Object.values(STORAGE_KEYS);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });
});
