import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  clearAllStorage,
} from './storage';

describe('storage service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('getStorageItem', () => {
    it('should return null for non-existent key', () => {
      expect(getStorageItem('nonExistentKey')).toBeNull();
    });

    it('should return parsed JSON value', () => {
      localStorage.setItem('testKey', JSON.stringify({ name: 'test' }));
      expect(getStorageItem('testKey')).toEqual({ name: 'test' });
    });

    it('should return string value', () => {
      localStorage.setItem('stringKey', JSON.stringify('test string'));
      expect(getStorageItem('stringKey')).toBe('test string');
    });

    it('should return number value', () => {
      localStorage.setItem('numberKey', JSON.stringify(42));
      expect(getStorageItem('numberKey')).toBe(42);
    });

    it('should return array value', () => {
      localStorage.setItem('arrayKey', JSON.stringify([1, 2, 3]));
      expect(getStorageItem('arrayKey')).toEqual([1, 2, 3]);
    });

    it('should convert date strings to Date objects for createdAt', () => {
      const data = { name: 'test', createdAt: '2024-01-15T10:00:00.000Z' };
      localStorage.setItem('dateKey', JSON.stringify(data));
      const result = getStorageItem<typeof data>('dateKey');
      expect(result?.createdAt).toBeInstanceOf(Date);
    });

    it('should convert date strings to Date objects for updatedAt', () => {
      const data = { name: 'test', updatedAt: '2024-01-15T10:00:00.000Z' };
      localStorage.setItem('dateKey', JSON.stringify(data));
      const result = getStorageItem<typeof data>('dateKey');
      expect(result?.updatedAt).toBeInstanceOf(Date);
    });

    it('should convert date strings to Date objects for deadline', () => {
      const data = { title: 'task', deadline: '2024-06-30T00:00:00.000Z' };
      localStorage.setItem('dateKey', JSON.stringify(data));
      const result = getStorageItem<typeof data>('dateKey');
      expect(result?.deadline).toBeInstanceOf(Date);
    });

    it('should convert date strings to Date objects for date field', () => {
      const data = { description: 'entry', date: '2024-01-15T00:00:00.000Z' };
      localStorage.setItem('dateKey', JSON.stringify(data));
      const result = getStorageItem<typeof data>('dateKey');
      expect(result?.date).toBeInstanceOf(Date);
    });

    it('should convert date strings to Date objects for timestamp', () => {
      const data = { action: 'created', timestamp: '2024-01-15T10:00:00.000Z' };
      localStorage.setItem('dateKey', JSON.stringify(data));
      const result = getStorageItem<typeof data>('dateKey');
      expect(result?.timestamp).toBeInstanceOf(Date);
    });

    it('should convert date strings to Date objects for completedAt', () => {
      const data = { title: 'task', completedAt: '2024-03-15T10:00:00.000Z' };
      localStorage.setItem('dateKey', JSON.stringify(data));
      const result = getStorageItem<typeof data>('dateKey');
      expect(result?.completedAt).toBeInstanceOf(Date);
    });

    it('should handle null values in localStorage', () => {
      localStorage.setItem('nullKey', JSON.stringify(null));
      expect(getStorageItem('nullKey')).toBeNull();
    });

    it('should return null for invalid JSON', () => {
      // Store invalid JSON directly
      localStorage.setItem('invalidKey', 'invalid json {');

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(getStorageItem('invalidKey')).toBeNull();

      consoleSpy.mockRestore();
    });
  });

  describe('setStorageItem', () => {
    it('should store object as JSON', () => {
      const data = { name: 'test', value: 123 };
      setStorageItem('testKey', data);
      expect(JSON.parse(localStorage.getItem('testKey') || '')).toEqual(data);
    });

    it('should store string value', () => {
      setStorageItem('stringKey', 'test string');
      expect(JSON.parse(localStorage.getItem('stringKey') || '')).toBe('test string');
    });

    it('should store number value', () => {
      setStorageItem('numberKey', 42);
      expect(JSON.parse(localStorage.getItem('numberKey') || '')).toBe(42);
    });

    it('should store array value', () => {
      const arr = [1, 2, 3];
      setStorageItem('arrayKey', arr);
      expect(JSON.parse(localStorage.getItem('arrayKey') || '')).toEqual(arr);
    });

    it('should store boolean value', () => {
      setStorageItem('boolKey', true);
      expect(JSON.parse(localStorage.getItem('boolKey') || '')).toBe(true);
    });

    it('should store null value', () => {
      setStorageItem('nullKey', null);
      expect(JSON.parse(localStorage.getItem('nullKey') || '')).toBeNull();
    });

    it('should overwrite existing value', () => {
      setStorageItem('testKey', 'first');
      setStorageItem('testKey', 'second');
      expect(JSON.parse(localStorage.getItem('testKey') || '')).toBe('second');
    });

    it('should handle storage operations without throwing', () => {
      // Normal operation should not throw
      expect(() => setStorageItem('testKey', 'value')).not.toThrow();
      expect(JSON.parse(localStorage.getItem('testKey') || '')).toBe('value');
    });
  });

  describe('removeStorageItem', () => {
    it('should remove existing item', () => {
      localStorage.setItem('testKey', 'value');
      removeStorageItem('testKey');
      expect(localStorage.getItem('testKey')).toBeNull();
    });

    it('should not throw for non-existent key', () => {
      expect(() => removeStorageItem('nonExistentKey')).not.toThrow();
    });

    it('should handle remove operations without throwing', () => {
      localStorage.setItem('testKey', 'value');
      expect(() => removeStorageItem('testKey')).not.toThrow();
      expect(localStorage.getItem('testKey')).toBeNull();
    });
  });

  describe('clearAllStorage', () => {
    it('should clear all items from storage', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      localStorage.setItem('key3', 'value3');

      clearAllStorage();

      expect(localStorage.length).toBe(0);
    });

    it('should not throw when storage is empty', () => {
      expect(() => clearAllStorage()).not.toThrow();
    });

    it('should handle clear operations without throwing', () => {
      localStorage.setItem('key1', 'value1');
      expect(() => clearAllStorage()).not.toThrow();
      expect(localStorage.length).toBe(0);
    });
  });
});
