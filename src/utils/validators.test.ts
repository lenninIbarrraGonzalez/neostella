import { describe, it, expect } from 'vitest';
import { validators, validate, hasErrors } from './validators';

describe('validators', () => {
  describe('required', () => {
    it('should return "required" for null value', () => {
      expect(validators.required(null)).toBe('required');
    });

    it('should return "required" for undefined value', () => {
      expect(validators.required(undefined)).toBe('required');
    });

    it('should return "required" for empty string', () => {
      expect(validators.required('')).toBe('required');
    });

    it('should return "required" for whitespace-only string', () => {
      expect(validators.required('   ')).toBe('required');
    });

    it('should return "required" for empty array', () => {
      expect(validators.required([])).toBe('required');
    });

    it('should return null for valid string', () => {
      expect(validators.required('valid')).toBeNull();
    });

    it('should return null for non-empty array', () => {
      expect(validators.required(['item'])).toBeNull();
    });

    it('should return null for number zero', () => {
      expect(validators.required(0)).toBeNull();
    });

    it('should return null for boolean false', () => {
      expect(validators.required(false)).toBeNull();
    });

    it('should return null for object', () => {
      expect(validators.required({ key: 'value' })).toBeNull();
    });
  });

  describe('email', () => {
    it('should return null for empty value (not required)', () => {
      expect(validators.email('')).toBeNull();
    });

    it('should return "email" for invalid email without @', () => {
      expect(validators.email('invalid')).toBe('email');
    });

    it('should return "email" for invalid email without domain', () => {
      expect(validators.email('invalid@')).toBe('email');
    });

    it('should return "email" for invalid email without local part', () => {
      expect(validators.email('@domain.com')).toBe('email');
    });

    it('should return "email" for email with spaces', () => {
      expect(validators.email('test @example.com')).toBe('email');
    });

    it('should return null for valid simple email', () => {
      expect(validators.email('test@example.com')).toBeNull();
    });

    it('should return null for valid email with subdomain', () => {
      expect(validators.email('user.name@domain.org')).toBeNull();
    });

    it('should return null for valid email with plus', () => {
      expect(validators.email('user+tag@domain.com')).toBeNull();
    });
  });

  describe('minLength', () => {
    it('should return null for empty value', () => {
      expect(validators.minLength(5)('')).toBeNull();
    });

    it('should return "minLength" when value is too short', () => {
      expect(validators.minLength(5)('abc')).toBe('minLength');
    });

    it('should return "minLength" when value is one char short', () => {
      expect(validators.minLength(5)('abcd')).toBe('minLength');
    });

    it('should return null when value meets minimum exactly', () => {
      expect(validators.minLength(5)('abcde')).toBeNull();
    });

    it('should return null when value exceeds minimum', () => {
      expect(validators.minLength(5)('abcdefgh')).toBeNull();
    });
  });

  describe('maxLength', () => {
    it('should return null for empty value', () => {
      expect(validators.maxLength(5)('')).toBeNull();
    });

    it('should return "maxLength" when value is too long', () => {
      expect(validators.maxLength(5)('abcdefgh')).toBe('maxLength');
    });

    it('should return "maxLength" when value is one char over', () => {
      expect(validators.maxLength(5)('abcdef')).toBe('maxLength');
    });

    it('should return null when value is within limit', () => {
      expect(validators.maxLength(5)('abc')).toBeNull();
    });

    it('should return null when value is exactly at limit', () => {
      expect(validators.maxLength(5)('abcde')).toBeNull();
    });
  });

  describe('phone', () => {
    it('should return null for empty value', () => {
      expect(validators.phone('')).toBeNull();
    });

    it('should return "phone" for alphabetic characters', () => {
      expect(validators.phone('abc')).toBe('phone');
    });

    it('should return "phone" for too short number', () => {
      expect(validators.phone('123')).toBe('phone');
    });

    it('should return "phone" for 9 digits', () => {
      expect(validators.phone('123456789')).toBe('phone');
    });

    it('should return null for 10 digit phone', () => {
      expect(validators.phone('1234567890')).toBeNull();
    });

    it('should return null for formatted phone with parentheses', () => {
      expect(validators.phone('(123) 456-7890')).toBeNull();
    });

    it('should return null for international format with plus', () => {
      expect(validators.phone('+1 234 567 8901')).toBeNull();
    });

    it('should return null for phone with dashes', () => {
      expect(validators.phone('123-456-7890')).toBeNull();
    });

    it('should return null for phone with spaces', () => {
      expect(validators.phone('123 456 7890')).toBeNull();
    });
  });

  describe('password', () => {
    it('should return null for empty value', () => {
      expect(validators.password('')).toBeNull();
    });

    it('should return "passwordLength" for password with 5 chars', () => {
      expect(validators.password('12345')).toBe('passwordLength');
    });

    it('should return "passwordLength" for password with 1 char', () => {
      expect(validators.password('a')).toBe('passwordLength');
    });

    it('should return null for password with exactly 6 chars', () => {
      expect(validators.password('123456')).toBeNull();
    });

    it('should return null for longer password', () => {
      expect(validators.password('longerpassword123')).toBeNull();
    });
  });

  describe('passwordMatch', () => {
    it('should return null for empty confirm password', () => {
      expect(validators.passwordMatch('password123')('')).toBeNull();
    });

    it('should return "passwordMatch" when passwords differ', () => {
      expect(validators.passwordMatch('password123')('different')).toBe('passwordMatch');
    });

    it('should return "passwordMatch" when passwords differ by case', () => {
      expect(validators.passwordMatch('Password123')('password123')).toBe('passwordMatch');
    });

    it('should return null when passwords match exactly', () => {
      expect(validators.passwordMatch('password123')('password123')).toBeNull();
    });

    it('should return null when both passwords are special chars', () => {
      expect(validators.passwordMatch('!@#$%^')('!@#$%^')).toBeNull();
    });
  });

  describe('url', () => {
    it('should return null for empty value', () => {
      expect(validators.url('')).toBeNull();
    });

    it('should return "url" for plain text', () => {
      expect(validators.url('not-a-url')).toBe('url');
    });

    it('should return "url" for incomplete URL without protocol', () => {
      expect(validators.url('missing-protocol.com')).toBe('url');
    });

    it('should return "url" for URL without protocol', () => {
      expect(validators.url('example.com')).toBe('url');
    });

    it('should return null for https URL', () => {
      expect(validators.url('https://example.com')).toBeNull();
    });

    it('should return null for http URL', () => {
      expect(validators.url('http://example.com')).toBeNull();
    });

    it('should return null for localhost URL with port', () => {
      expect(validators.url('http://localhost:3000')).toBeNull();
    });

    it('should return null for URL with path', () => {
      expect(validators.url('https://example.com/path/to/resource')).toBeNull();
    });

    it('should return null for URL with query params', () => {
      expect(validators.url('https://example.com?foo=bar&baz=qux')).toBeNull();
    });
  });

  describe('date', () => {
    it('should return null for null value', () => {
      expect(validators.date(null)).toBeNull();
    });

    it('should return "date" for invalid date string', () => {
      expect(validators.date('invalid-date')).toBe('date');
    });

    it('should return "date" for random string', () => {
      expect(validators.date('not a date')).toBe('date');
    });

    it('should return null for valid Date object', () => {
      expect(validators.date(new Date())).toBeNull();
    });

    it('should return null for valid ISO date string', () => {
      expect(validators.date('2024-01-15')).toBeNull();
    });

    it('should return null for valid date with time', () => {
      expect(validators.date('2024-01-15T10:30:00')).toBeNull();
    });
  });

  describe('futureDate', () => {
    it('should return null for null value', () => {
      expect(validators.futureDate(null)).toBeNull();
    });

    it('should return "date" for invalid date', () => {
      expect(validators.futureDate('invalid-date')).toBe('date');
    });

    it('should return "futureDate" for past date', () => {
      const pastDate = new Date('2020-01-01');
      expect(validators.futureDate(pastDate)).toBe('futureDate');
    });

    it('should return "futureDate" for current date', () => {
      const now = new Date();
      expect(validators.futureDate(now)).toBe('futureDate');
    });

    it('should return null for future date', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      expect(validators.futureDate(futureDate)).toBeNull();
    });

    it('should return null for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(validators.futureDate(tomorrow)).toBeNull();
    });
  });
});

describe('validate', () => {
  it('should return empty object when no rules provided', () => {
    const result = validate({ name: 'test' }, {});
    expect(result).toEqual({});
  });

  it('should return empty object when all validations pass', () => {
    const data = { email: 'test@example.com', password: 'password123' };
    const rules = {
      email: [validators.required, validators.email],
      password: [validators.required, validators.password],
    };

    const errors = validate(data, rules);
    expect(errors).toEqual({});
  });

  it('should validate multiple fields and return errors', () => {
    const data = {
      email: 'invalid',
      password: '123',
    };
    const rules = {
      email: [validators.required, validators.email],
      password: [validators.required, validators.password],
    };

    const errors = validate(data, rules);

    expect(errors.email).toBe('email');
    expect(errors.password).toBe('passwordLength');
  });

  it('should stop at first error for each field', () => {
    const data = { email: '' };
    const rules = {
      email: [validators.required, validators.email],
    };

    const errors = validate(data, rules);
    expect(errors.email).toBe('required');
  });

  it('should handle fields without validators gracefully', () => {
    const data = { name: 'test', email: 'invalid' };
    const rules = {
      email: [validators.email],
    };

    const errors = validate(data, rules);
    expect(errors.email).toBe('email');
    expect(errors.name).toBeUndefined();
  });

  it('should handle empty data object', () => {
    const data: Record<string, string> = {};
    const rules = {
      email: [validators.required],
    };

    const errors = validate(data, rules);
    expect(errors.email).toBe('required');
  });
});

describe('hasErrors', () => {
  it('should return false for empty object', () => {
    expect(hasErrors({})).toBe(false);
  });

  it('should return false when all values are undefined', () => {
    expect(hasErrors({ email: undefined, password: undefined })).toBe(false);
  });

  it('should return false when all values are null', () => {
    expect(hasErrors({ email: null as unknown as string, password: null as unknown as string })).toBe(false);
  });

  it('should return true when any error exists', () => {
    expect(hasErrors({ email: 'required' })).toBe(true);
  });

  it('should return true when some errors exist and others are undefined', () => {
    expect(hasErrors({ email: undefined, password: 'required' })).toBe(true);
  });

  it('should return true for multiple errors', () => {
    expect(hasErrors({ email: 'email', password: 'passwordLength' })).toBe(true);
  });
});
