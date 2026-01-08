import { describe, it, expect } from 'vitest';
import {
  formatDuration,
  formatDurationLong,
  parseDuration,
  formatCaseNumber,
  formatPhoneNumber,
  truncateText,
  capitalizeFirst,
  formatStatusLabel,
  PRIORITY_COLORS,
  TASK_STATUS_COLORS,
} from './formatters';

describe('PRIORITY_COLORS', () => {
  it('should have color for low priority', () => {
    expect(PRIORITY_COLORS.low).toBe('#4caf50');
  });

  it('should have color for medium priority', () => {
    expect(PRIORITY_COLORS.medium).toBe('#2196f3');
  });

  it('should have color for high priority', () => {
    expect(PRIORITY_COLORS.high).toBe('#ff9800');
  });

  it('should have color for urgent priority', () => {
    expect(PRIORITY_COLORS.urgent).toBe('#f44336');
  });
});

describe('TASK_STATUS_COLORS', () => {
  it('should have color for pending status', () => {
    expect(TASK_STATUS_COLORS.pending).toBe('#ff9800');
  });

  it('should have color for in_progress status', () => {
    expect(TASK_STATUS_COLORS.in_progress).toBe('#2196f3');
  });

  it('should have color for completed status', () => {
    expect(TASK_STATUS_COLORS.completed).toBe('#4caf50');
  });

  it('should have color for cancelled status', () => {
    expect(TASK_STATUS_COLORS.cancelled).toBe('#9e9e9e');
  });
});

describe('formatDuration', () => {
  it('should format zero minutes', () => {
    expect(formatDuration(0)).toBe('0m');
  });

  it('should format minutes only (less than 60)', () => {
    expect(formatDuration(30)).toBe('30m');
  });

  it('should format 45 minutes', () => {
    expect(formatDuration(45)).toBe('45m');
  });

  it('should format exactly one hour', () => {
    expect(formatDuration(60)).toBe('1h');
  });

  it('should format exactly two hours', () => {
    expect(formatDuration(120)).toBe('2h');
  });

  it('should format hours and minutes', () => {
    expect(formatDuration(90)).toBe('1h 30m');
  });

  it('should format 2 hours 30 minutes', () => {
    expect(formatDuration(150)).toBe('2h 30m');
  });

  it('should format large duration', () => {
    expect(formatDuration(480)).toBe('8h');
  });

  it('should format 8 hours 15 minutes', () => {
    expect(formatDuration(495)).toBe('8h 15m');
  });
});

describe('formatDurationLong', () => {
  it('should format zero as 0 minutes', () => {
    expect(formatDurationLong(0)).toBe('0 minutes');
  });

  it('should format 1 minute with singular', () => {
    expect(formatDurationLong(1)).toBe('1 minute');
  });

  it('should format multiple minutes with plural', () => {
    expect(formatDurationLong(30)).toBe('30 minutes');
  });

  it('should format 1 hour with singular', () => {
    expect(formatDurationLong(60)).toBe('1 hour');
  });

  it('should format multiple hours with plural', () => {
    expect(formatDurationLong(120)).toBe('2 hours');
  });

  it('should format 1 hour 1 minute with singular forms', () => {
    expect(formatDurationLong(61)).toBe('1 hour 1 minute');
  });

  it('should format hours and minutes with plural forms', () => {
    expect(formatDurationLong(125)).toBe('2 hours 5 minutes');
  });

  it('should format 1 hour 30 minutes', () => {
    expect(formatDurationLong(90)).toBe('1 hour 30 minutes');
  });
});

describe('parseDuration', () => {
  describe('Xh Ym format', () => {
    it('should parse "2h 30m"', () => {
      expect(parseDuration('2h 30m')).toBe(150);
    });

    it('should parse "1h 15m"', () => {
      expect(parseDuration('1h 15m')).toBe(75);
    });

    it('should parse "3h" without minutes', () => {
      expect(parseDuration('3h')).toBe(180);
    });

    it('should parse "0h 45m"', () => {
      expect(parseDuration('0h 45m')).toBe(45);
    });

    it('should parse case insensitive "2H 30M"', () => {
      expect(parseDuration('2H 30M')).toBe(150);
    });

    it('should parse with extra spaces "2h  30m"', () => {
      expect(parseDuration('2h  30m')).toBe(150);
    });
  });

  describe('X:Y format', () => {
    it('should parse "2:30"', () => {
      expect(parseDuration('2:30')).toBe(150);
    });

    it('should parse "1:15"', () => {
      expect(parseDuration('1:15')).toBe(75);
    });

    it('should parse "0:45"', () => {
      expect(parseDuration('0:45')).toBe(45);
    });

    it('should parse "10:00"', () => {
      expect(parseDuration('10:00')).toBe(600);
    });
  });

  describe('plain minutes format', () => {
    it('should parse "90"', () => {
      expect(parseDuration('90')).toBe(90);
    });

    it('should parse "120"', () => {
      expect(parseDuration('120')).toBe(120);
    });

    it('should parse "0"', () => {
      expect(parseDuration('0')).toBe(0);
    });

    it('should parse "480"', () => {
      expect(parseDuration('480')).toBe(480);
    });
  });

  describe('invalid input', () => {
    it('should return 0 for "invalid"', () => {
      expect(parseDuration('invalid')).toBe(0);
    });

    it('should return 0 for empty string', () => {
      expect(parseDuration('')).toBe(0);
    });

    it('should return 0 for "abc"', () => {
      expect(parseDuration('abc')).toBe(0);
    });
  });
});

describe('formatCaseNumber', () => {
  it('should format with provided year', () => {
    expect(formatCaseNumber(1, 2024)).toBe('CASE-2024-001');
  });

  it('should format double digit sequence', () => {
    expect(formatCaseNumber(42, 2024)).toBe('CASE-2024-042');
  });

  it('should format triple digit sequence', () => {
    expect(formatCaseNumber(123, 2024)).toBe('CASE-2024-123');
  });

  it('should format sequence over 999', () => {
    expect(formatCaseNumber(1234, 2024)).toBe('CASE-2024-1234');
  });

  it('should use current year by default', () => {
    const currentYear = new Date().getFullYear();
    expect(formatCaseNumber(1)).toBe(`CASE-${currentYear}-001`);
  });

  it('should format with different year', () => {
    expect(formatCaseNumber(5, 2023)).toBe('CASE-2023-005');
  });
});

describe('formatPhoneNumber', () => {
  it('should format 10-digit numbers', () => {
    expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
  });

  it('should return original for numbers less than 10 digits', () => {
    expect(formatPhoneNumber('123456')).toBe('123456');
  });

  it('should return original for numbers more than 10 digits', () => {
    expect(formatPhoneNumber('12345678901')).toBe('12345678901');
  });

  it('should strip non-numeric characters before formatting', () => {
    expect(formatPhoneNumber('(123) 456-7890')).toBe('(123) 456-7890');
  });

  it('should handle phone with dashes', () => {
    expect(formatPhoneNumber('123-456-7890')).toBe('(123) 456-7890');
  });

  it('should handle phone with spaces', () => {
    expect(formatPhoneNumber('123 456 7890')).toBe('(123) 456-7890');
  });

  it('should return empty string as is', () => {
    expect(formatPhoneNumber('')).toBe('');
  });
});

describe('truncateText', () => {
  it('should not truncate short text', () => {
    expect(truncateText('Hello', 10)).toBe('Hello');
  });

  it('should truncate long text with ellipsis', () => {
    expect(truncateText('Hello World', 8)).toBe('Hello...');
  });

  it('should handle exact length', () => {
    expect(truncateText('Hello', 5)).toBe('Hello');
  });

  it('should handle length just over limit', () => {
    expect(truncateText('Helloo', 5)).toBe('He...');
  });

  it('should handle very long text', () => {
    const longText = 'This is a very long text that should be truncated';
    expect(truncateText(longText, 15)).toBe('This is a ve...');
  });

  it('should handle empty string', () => {
    expect(truncateText('', 10)).toBe('');
  });

  it('should handle maxLength of 3 (edge case)', () => {
    expect(truncateText('Hello', 3)).toBe('...');
  });
});

describe('capitalizeFirst', () => {
  it('should capitalize first letter', () => {
    expect(capitalizeFirst('hello')).toBe('Hello');
  });

  it('should handle empty string', () => {
    expect(capitalizeFirst('')).toBe('');
  });

  it('should handle already capitalized', () => {
    expect(capitalizeFirst('Hello')).toBe('Hello');
  });

  it('should handle single character', () => {
    expect(capitalizeFirst('a')).toBe('A');
  });

  it('should handle all caps', () => {
    expect(capitalizeFirst('HELLO')).toBe('HELLO');
  });

  it('should handle numbers', () => {
    expect(capitalizeFirst('123abc')).toBe('123abc');
  });
});

describe('formatStatusLabel', () => {
  it('should convert snake_case to Title Case', () => {
    expect(formatStatusLabel('in_progress')).toBe('In Progress');
  });

  it('should convert pending_client to Pending Client', () => {
    expect(formatStatusLabel('pending_client')).toBe('Pending Client');
  });

  it('should convert under_review to Under Review', () => {
    expect(formatStatusLabel('under_review')).toBe('Under Review');
  });

  it('should handle single word', () => {
    expect(formatStatusLabel('new')).toBe('New');
  });

  it('should handle resolved', () => {
    expect(formatStatusLabel('resolved')).toBe('Resolved');
  });

  it('should handle closed', () => {
    expect(formatStatusLabel('closed')).toBe('Closed');
  });

  it('should handle triple word status', () => {
    expect(formatStatusLabel('some_long_status')).toBe('Some Long Status');
  });
});
