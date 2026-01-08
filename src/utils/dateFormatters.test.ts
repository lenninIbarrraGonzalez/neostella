import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatDate,
  formatDateTime,
  formatRelative,
  formatTime,
  formatMonthYear,
  getDeadlineStatus,
  getDeadlineColor,
  isOverdue,
  isDueSoon,
} from './dateFormatters';

describe('dateFormatters', () => {
  // Fixed date for consistent tests - use local time to avoid timezone issues
  const FIXED_DATE = new Date(2024, 5, 15, 10, 0, 0, 0); // June 15, 2024 10:00 local time

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_DATE);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatDate', () => {
    it('should return "-" for null date', () => {
      expect(formatDate(null)).toBe('-');
    });

    it('should return "-" for invalid date string', () => {
      expect(formatDate('invalid')).toBe('-');
    });

    it('should return "-" for empty string', () => {
      expect(formatDate('')).toBe('-');
    });

    it('should format date in English (MM/dd/yyyy)', () => {
      const date = new Date(2024, 5, 15); // June 15, 2024
      expect(formatDate(date, 'en')).toBe('06/15/2024');
    });

    it('should format date in Spanish (dd/MM/yyyy)', () => {
      const date = new Date(2024, 5, 15); // June 15, 2024
      expect(formatDate(date, 'es')).toBe('15/06/2024');
    });

    it('should accept date string with local date constructor', () => {
      const date = new Date(2024, 5, 15);
      expect(formatDate(date, 'en')).toBe('06/15/2024');
    });

    it('should default to English', () => {
      const date = new Date(2024, 5, 15); // June 15, 2024
      expect(formatDate(date)).toBe('06/15/2024');
    });

    it('should handle January date', () => {
      const date = new Date(2024, 0, 5); // January 5, 2024
      expect(formatDate(date, 'en')).toBe('01/05/2024');
    });

    it('should handle December date', () => {
      const date = new Date(2024, 11, 31); // December 31, 2024
      expect(formatDate(date, 'en')).toBe('12/31/2024');
    });

    it('should fallback to English for unknown language', () => {
      const date = new Date(2024, 5, 15); // June 15, 2024
      expect(formatDate(date, 'fr')).toBe('06/15/2024');
    });
  });

  describe('formatDateTime', () => {
    it('should return "-" for null', () => {
      expect(formatDateTime(null)).toBe('-');
    });

    it('should return "-" for invalid date', () => {
      expect(formatDateTime('invalid')).toBe('-');
    });

    it('should format datetime in English', () => {
      const date = new Date(2024, 5, 15, 14, 30, 0); // June 15, 2024 14:30
      const result = formatDateTime(date, 'en');
      expect(result).toMatch(/06\/15\/2024/);
      expect(result).toMatch(/2:30 PM/i);
    });

    it('should format datetime in Spanish', () => {
      const date = new Date(2024, 5, 15, 14, 30, 0); // June 15, 2024 14:30
      const result = formatDateTime(date, 'es');
      expect(result).toMatch(/15\/06\/2024/);
      expect(result).toMatch(/14:30/);
    });

    it('should handle morning time', () => {
      const date = new Date(2024, 5, 15, 9, 15, 0); // June 15, 2024 09:15
      const result = formatDateTime(date, 'en');
      expect(result).toMatch(/9:15 AM/i);
    });
  });

  describe('formatRelative', () => {
    it('should return "-" for null', () => {
      expect(formatRelative(null)).toBe('-');
    });

    it('should return "-" for invalid date', () => {
      expect(formatRelative('invalid')).toBe('-');
    });

    it('should format past date as "ago"', () => {
      const pastDate = new Date(2024, 5, 14, 10, 0, 0); // June 14, 2024
      const result = formatRelative(pastDate, 'en');
      expect(result).toMatch(/ago/i);
    });

    it('should format future date as "in"', () => {
      const futureDate = new Date(2024, 5, 16, 10, 0, 0); // June 16, 2024
      const result = formatRelative(futureDate, 'en');
      expect(result).toMatch(/in/i);
    });
  });

  describe('formatTime', () => {
    it('should return "-" for null', () => {
      expect(formatTime(null)).toBe('-');
    });

    it('should return "-" for invalid date', () => {
      expect(formatTime('invalid')).toBe('-');
    });

    it('should format time in Spanish (24h)', () => {
      const date = new Date(2024, 5, 15, 14, 30, 0); // 14:30
      expect(formatTime(date, 'es')).toBe('14:30');
    });

    it('should format time in English (12h)', () => {
      const date = new Date(2024, 5, 15, 14, 30, 0); // 14:30
      const result = formatTime(date, 'en');
      expect(result).toMatch(/2:30 PM/i);
    });

    it('should handle midnight', () => {
      const date = new Date(2024, 5, 15, 0, 0, 0); // 00:00
      expect(formatTime(date, 'es')).toBe('00:00');
    });
  });

  describe('formatMonthYear', () => {
    it('should return "-" for null', () => {
      expect(formatMonthYear(null)).toBe('-');
    });

    it('should return "-" for invalid date', () => {
      expect(formatMonthYear('invalid')).toBe('-');
    });

    it('should format month and year in English', () => {
      const date = new Date(2024, 5, 15); // June 15, 2024
      expect(formatMonthYear(date, 'en')).toBe('June 2024');
    });

    it('should format month and year in Spanish', () => {
      const date = new Date(2024, 5, 15); // June 15, 2024
      expect(formatMonthYear(date, 'es')).toBe('junio 2024');
    });

    it('should handle January', () => {
      const date = new Date(2024, 0, 15); // January 15, 2024
      expect(formatMonthYear(date, 'en')).toBe('January 2024');
    });

    it('should handle December', () => {
      const date = new Date(2024, 11, 15); // December 15, 2024
      expect(formatMonthYear(date, 'en')).toBe('December 2024');
    });
  });

  describe('getDeadlineStatus', () => {
    it('should return "none" for null deadline', () => {
      expect(getDeadlineStatus(null)).toBe('none');
    });

    it('should return "overdue" for yesterday', () => {
      const yesterday = new Date(2024, 5, 14); // June 14
      expect(getDeadlineStatus(yesterday)).toBe('overdue');
    });

    it('should return "overdue" for past dates', () => {
      const pastDate = new Date(2024, 5, 10); // June 10
      expect(getDeadlineStatus(pastDate)).toBe('overdue');
    });

    it('should return "urgent" for today', () => {
      const today = new Date(2024, 5, 15); // June 15 (same as FIXED_DATE)
      expect(getDeadlineStatus(today)).toBe('urgent');
    });

    it('should return "urgent" for dates within 3 days', () => {
      const urgentDate = new Date(2024, 5, 16); // June 16
      expect(getDeadlineStatus(urgentDate)).toBe('urgent');
    });

    it('should return "urgent" for 2 days from now', () => {
      const urgentDate = new Date(2024, 5, 17); // June 17
      expect(getDeadlineStatus(urgentDate)).toBe('urgent');
    });

    it('should return "warning" for 3 days from now', () => {
      const warningDate = new Date(2024, 5, 18); // June 18
      expect(getDeadlineStatus(warningDate)).toBe('warning');
    });

    it('should return "warning" for dates within 7 days', () => {
      const warningDate = new Date(2024, 5, 20); // June 20
      expect(getDeadlineStatus(warningDate)).toBe('warning');
    });

    it('should return "warning" for 6 days from now', () => {
      const warningDate = new Date(2024, 5, 21); // June 21
      expect(getDeadlineStatus(warningDate)).toBe('warning');
    });

    it('should return "ok" for 8 days from now', () => {
      const okDate = new Date(2024, 5, 23); // June 23 (8 days from June 15)
      expect(getDeadlineStatus(okDate)).toBe('ok');
    });

    it('should return "ok" for dates beyond 7 days', () => {
      const okDate = new Date(2024, 5, 30); // June 30
      expect(getDeadlineStatus(okDate)).toBe('ok');
    });
  });

  describe('getDeadlineColor', () => {
    it('should return red for overdue', () => {
      expect(getDeadlineColor('overdue')).toBe('#f44336');
    });

    it('should return orange for urgent', () => {
      expect(getDeadlineColor('urgent')).toBe('#ff9800');
    });

    it('should return yellow for warning', () => {
      expect(getDeadlineColor('warning')).toBe('#ffc107');
    });

    it('should return green for ok', () => {
      expect(getDeadlineColor('ok')).toBe('#4caf50');
    });

    it('should return grey for none', () => {
      expect(getDeadlineColor('none')).toBe('#9e9e9e');
    });
  });

  describe('isOverdue', () => {
    it('should return false for null', () => {
      expect(isOverdue(null)).toBe(false);
    });

    it('should return true for past dates', () => {
      const pastDate = new Date(2024, 5, 10); // June 10
      expect(isOverdue(pastDate)).toBe(true);
    });

    it('should return true for yesterday', () => {
      const yesterday = new Date(2024, 5, 14); // June 14
      expect(isOverdue(yesterday)).toBe(true);
    });

    it('should return false for today (same day)', () => {
      const today = new Date(2024, 5, 15); // June 15 (same as FIXED_DATE)
      // isOverdue uses startOfDay, so same day is not overdue
      expect(isOverdue(today)).toBe(false);
    });

    it('should return false for future dates', () => {
      const futureDate = new Date(2024, 5, 20); // June 20
      expect(isOverdue(futureDate)).toBe(false);
    });

    it('should return false for tomorrow', () => {
      const tomorrow = new Date(2024, 5, 16); // June 16
      expect(isOverdue(tomorrow)).toBe(false);
    });
  });

  describe('isDueSoon', () => {
    it('should return false for null', () => {
      expect(isDueSoon(null)).toBe(false);
    });

    it('should return false for past dates', () => {
      const pastDate = new Date(2024, 5, 10); // June 10
      expect(isDueSoon(pastDate, 7)).toBe(false);
    });

    it('should return false for today (not strictly in future)', () => {
      const today = new Date(2024, 5, 15); // June 15
      expect(isDueSoon(today, 7)).toBe(false);
    });

    it('should return true for tomorrow', () => {
      const tomorrow = new Date(2024, 5, 16); // June 16
      expect(isDueSoon(tomorrow, 7)).toBe(true);
    });

    it('should return true for dates within specified days', () => {
      const soonDate = new Date(2024, 5, 18); // June 18 (3 days from now)
      expect(isDueSoon(soonDate, 7)).toBe(true);
    });

    it('should return true for date at edge of range (6 days from now)', () => {
      const edgeDate = new Date(2024, 5, 21); // June 21 (6 days from June 15)
      expect(isDueSoon(edgeDate, 7)).toBe(true);
    });

    it('should return false for date beyond range (8 days from now)', () => {
      const edgeDate = new Date(2024, 5, 23); // June 23 (8 days from June 15)
      expect(isDueSoon(edgeDate, 7)).toBe(false);
    });

    it('should return false for dates beyond specified days', () => {
      const farDate = new Date(2024, 5, 30); // June 30
      expect(isDueSoon(farDate, 7)).toBe(false);
    });

    it('should work with custom days parameter', () => {
      const soonDate = new Date(2024, 5, 17); // June 17 (2 days from now)
      expect(isDueSoon(soonDate, 3)).toBe(true);
      expect(isDueSoon(soonDate, 1)).toBe(false);
    });

    it('should return true for 3 days with default 7', () => {
      const date = new Date(2024, 5, 18); // June 18 (3 days from now)
      expect(isDueSoon(date)).toBe(true);
    });
  });
});
