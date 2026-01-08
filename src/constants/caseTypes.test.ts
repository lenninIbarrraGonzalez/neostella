import { describe, it, expect } from 'vitest';
import { CASE_TYPES, CASE_TASK_TEMPLATES, getCaseTypeConfig } from './caseTypes';

describe('CASE_TYPES', () => {
  it('should have all expected case types', () => {
    const typeValues = CASE_TYPES.map(t => t.value);
    expect(typeValues).toContain('personal_injury');
    expect(typeValues).toContain('auto_accident');
    expect(typeValues).toContain('immigration_visa');
    expect(typeValues).toContain('immigration_citizenship');
    expect(typeValues).toContain('family_divorce');
    expect(typeValues).toContain('family_custody');
  });

  it('should have exactly 6 case types', () => {
    expect(CASE_TYPES).toHaveLength(6);
  });

  it('should have labels for each case type', () => {
    CASE_TYPES.forEach(caseType => {
      expect(caseType.label).toBeDefined();
      expect(typeof caseType.label).toBe('string');
      expect(caseType.label.length).toBeGreaterThan(0);
    });
  });

  it('should have categories for each case type', () => {
    CASE_TYPES.forEach(caseType => {
      expect(caseType.category).toBeDefined();
      expect(typeof caseType.category).toBe('string');
    });
  });

  it('should have Civil category for injury types', () => {
    const personalInjury = CASE_TYPES.find(t => t.value === 'personal_injury');
    const autoAccident = CASE_TYPES.find(t => t.value === 'auto_accident');
    expect(personalInjury?.category).toBe('Civil');
    expect(autoAccident?.category).toBe('Civil');
  });

  it('should have Immigration category for immigration types', () => {
    const visa = CASE_TYPES.find(t => t.value === 'immigration_visa');
    const citizenship = CASE_TYPES.find(t => t.value === 'immigration_citizenship');
    expect(visa?.category).toBe('Immigration');
    expect(citizenship?.category).toBe('Immigration');
  });

  it('should have Family category for family types', () => {
    const divorce = CASE_TYPES.find(t => t.value === 'family_divorce');
    const custody = CASE_TYPES.find(t => t.value === 'family_custody');
    expect(divorce?.category).toBe('Family');
    expect(custody?.category).toBe('Family');
  });
});

describe('CASE_TASK_TEMPLATES', () => {
  it('should have templates for all case types', () => {
    expect(CASE_TASK_TEMPLATES.personal_injury).toBeDefined();
    expect(CASE_TASK_TEMPLATES.auto_accident).toBeDefined();
    expect(CASE_TASK_TEMPLATES.immigration_visa).toBeDefined();
    expect(CASE_TASK_TEMPLATES.immigration_citizenship).toBeDefined();
    expect(CASE_TASK_TEMPLATES.family_divorce).toBeDefined();
    expect(CASE_TASK_TEMPLATES.family_custody).toBeDefined();
  });

  it('should have non-empty task arrays', () => {
    Object.values(CASE_TASK_TEMPLATES).forEach(tasks => {
      expect(Array.isArray(tasks)).toBe(true);
      expect(tasks.length).toBeGreaterThan(0);
    });
  });

  it('should have string tasks', () => {
    Object.values(CASE_TASK_TEMPLATES).forEach(tasks => {
      tasks.forEach(task => {
        expect(typeof task).toBe('string');
        expect(task.length).toBeGreaterThan(0);
      });
    });
  });

  it('should have 5 tasks per type', () => {
    Object.values(CASE_TASK_TEMPLATES).forEach(tasks => {
      expect(tasks).toHaveLength(5);
    });
  });
});

describe('getCaseTypeConfig', () => {
  it('should return config for personal_injury', () => {
    const config = getCaseTypeConfig('personal_injury');
    expect(config).toBeDefined();
    expect(config?.value).toBe('personal_injury');
    expect(config?.label).toBe('Personal Injury');
    expect(config?.category).toBe('Civil');
  });

  it('should return config for auto_accident', () => {
    const config = getCaseTypeConfig('auto_accident');
    expect(config).toBeDefined();
    expect(config?.value).toBe('auto_accident');
    expect(config?.label).toBe('Auto Accident');
  });

  it('should return config for immigration_visa', () => {
    const config = getCaseTypeConfig('immigration_visa');
    expect(config).toBeDefined();
    expect(config?.value).toBe('immigration_visa');
    expect(config?.label).toBe('Immigration - Visa');
  });

  it('should return config for immigration_citizenship', () => {
    const config = getCaseTypeConfig('immigration_citizenship');
    expect(config).toBeDefined();
    expect(config?.value).toBe('immigration_citizenship');
    expect(config?.label).toBe('Immigration - Citizenship');
  });

  it('should return config for family_divorce', () => {
    const config = getCaseTypeConfig('family_divorce');
    expect(config).toBeDefined();
    expect(config?.value).toBe('family_divorce');
    expect(config?.label).toBe('Family - Divorce');
  });

  it('should return config for family_custody', () => {
    const config = getCaseTypeConfig('family_custody');
    expect(config).toBeDefined();
    expect(config?.value).toBe('family_custody');
    expect(config?.label).toBe('Family - Custody');
  });

  it('should return undefined for invalid type', () => {
    // @ts-expect-error - testing invalid type
    expect(getCaseTypeConfig('invalid')).toBeUndefined();
  });
});
