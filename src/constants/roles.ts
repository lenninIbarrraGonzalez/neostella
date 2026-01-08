import { UserRole } from '../types';

export interface RoleConfig {
  value: UserRole;
  label: string;
  description: string;
}

export const ROLES: RoleConfig[] = [
  {
    value: 'admin',
    label: 'Administrator',
    description: 'Full access to all features and settings',
  },
  {
    value: 'attorney',
    label: 'Attorney',
    description: 'Can manage assigned cases and clients',
  },
  {
    value: 'paralegal',
    label: 'Paralegal',
    description: 'Can view cases and complete assigned tasks',
  },
];

export function getRoleConfig(role: UserRole): RoleConfig | undefined {
  return ROLES.find(r => r.value === role);
}

export function getRoleLabel(role: UserRole): string {
  return getRoleConfig(role)?.label ?? role;
}
