import { describe, it, expect } from 'vitest';
import { ROLES, getRoleConfig, getRoleLabel } from './roles';

describe('ROLES', () => {
  it('should have all expected roles', () => {
    const roleValues = ROLES.map(r => r.value);
    expect(roleValues).toContain('admin');
    expect(roleValues).toContain('attorney');
    expect(roleValues).toContain('paralegal');
  });

  it('should have exactly 3 roles', () => {
    expect(ROLES).toHaveLength(3);
  });

  it('should have labels for each role', () => {
    ROLES.forEach(role => {
      expect(role.label).toBeDefined();
      expect(typeof role.label).toBe('string');
      expect(role.label.length).toBeGreaterThan(0);
    });
  });

  it('should have descriptions for each role', () => {
    ROLES.forEach(role => {
      expect(role.description).toBeDefined();
      expect(typeof role.description).toBe('string');
      expect(role.description.length).toBeGreaterThan(0);
    });
  });

  it('should have correct admin config', () => {
    const admin = ROLES.find(r => r.value === 'admin');
    expect(admin?.label).toBe('Administrator');
    expect(admin?.description).toBe('Full access to all features and settings');
  });

  it('should have correct attorney config', () => {
    const attorney = ROLES.find(r => r.value === 'attorney');
    expect(attorney?.label).toBe('Attorney');
    expect(attorney?.description).toBe('Can manage assigned cases and clients');
  });

  it('should have correct paralegal config', () => {
    const paralegal = ROLES.find(r => r.value === 'paralegal');
    expect(paralegal?.label).toBe('Paralegal');
    expect(paralegal?.description).toBe('Can view cases and complete assigned tasks');
  });
});

describe('getRoleConfig', () => {
  it('should return config for admin', () => {
    const config = getRoleConfig('admin');
    expect(config).toBeDefined();
    expect(config?.value).toBe('admin');
    expect(config?.label).toBe('Administrator');
  });

  it('should return config for attorney', () => {
    const config = getRoleConfig('attorney');
    expect(config).toBeDefined();
    expect(config?.value).toBe('attorney');
    expect(config?.label).toBe('Attorney');
  });

  it('should return config for paralegal', () => {
    const config = getRoleConfig('paralegal');
    expect(config).toBeDefined();
    expect(config?.value).toBe('paralegal');
    expect(config?.label).toBe('Paralegal');
  });

  it('should return undefined for invalid role', () => {
    // @ts-expect-error - testing invalid role
    expect(getRoleConfig('invalid')).toBeUndefined();
  });
});

describe('getRoleLabel', () => {
  it('should return label for admin', () => {
    expect(getRoleLabel('admin')).toBe('Administrator');
  });

  it('should return label for attorney', () => {
    expect(getRoleLabel('attorney')).toBe('Attorney');
  });

  it('should return label for paralegal', () => {
    expect(getRoleLabel('paralegal')).toBe('Paralegal');
  });

  it('should return role value for invalid role', () => {
    // @ts-expect-error - testing invalid role
    expect(getRoleLabel('invalid')).toBe('invalid');
  });
});
