export type ValidationResult = string | null;
export type Validator<T = string> = (value: T) => ValidationResult;

export const validators = {
  required: (value: unknown): ValidationResult => {
    if (value === null || value === undefined) return 'required';
    if (typeof value === 'string' && !value.trim()) return 'required';
    if (Array.isArray(value) && value.length === 0) return 'required';
    return null;
  },

  email: (value: string): ValidationResult => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'email';
    return null;
  },

  minLength: (min: number): Validator => (value: string): ValidationResult => {
    if (!value) return null;
    if (value.length < min) return 'minLength';
    return null;
  },

  maxLength: (max: number): Validator => (value: string): ValidationResult => {
    if (!value) return null;
    if (value.length > max) return 'maxLength';
    return null;
  },

  phone: (value: string): ValidationResult => {
    if (!value) return null;
    const phoneRegex = /^[\d\s\-+()]+$/;
    if (!phoneRegex.test(value)) return 'phone';
    if (value.replace(/\D/g, '').length < 10) return 'phone';
    return null;
  },

  password: (value: string): ValidationResult => {
    if (!value) return null;
    if (value.length < 6) return 'passwordLength';
    return null;
  },

  passwordMatch: (password: string): Validator => (confirmPassword: string): ValidationResult => {
    if (!confirmPassword) return null;
    if (password !== confirmPassword) return 'passwordMatch';
    return null;
  },

  url: (value: string): ValidationResult => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return 'url';
    }
  },

  date: (value: Date | string | null): ValidationResult => {
    if (!value) return null;
    const date = typeof value === 'string' ? new Date(value) : value;
    if (isNaN(date.getTime())) return 'date';
    return null;
  },

  futureDate: (value: Date | string | null): ValidationResult => {
    if (!value) return null;
    const date = typeof value === 'string' ? new Date(value) : value;
    if (isNaN(date.getTime())) return 'date';
    if (date <= new Date()) return 'futureDate';
    return null;
  },
};

export function validate<T extends Record<string, unknown>>(
  data: T,
  rules: Partial<Record<keyof T, Validator[]>>
): Partial<Record<keyof T, string>> {
  const errors: Partial<Record<keyof T, string>> = {};

  for (const [field, fieldValidators] of Object.entries(rules)) {
    if (!fieldValidators) continue;

    const value = data[field as keyof T];

    for (const validator of fieldValidators as Validator[]) {
      const error = validator(value as string);
      if (error) {
        errors[field as keyof T] = error;
        break;
      }
    }
  }

  return errors;
}

export function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some(error => error !== undefined && error !== null);
}
