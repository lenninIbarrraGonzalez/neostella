import { UserRole } from '../types';

export const PERMISSIONS = {
  // Cases
  CASES_VIEW_ALL: 'cases:view:all',
  CASES_VIEW_ASSIGNED: 'cases:view:assigned',
  CASES_CREATE: 'cases:create',
  CASES_EDIT_ALL: 'cases:edit:all',
  CASES_EDIT_ASSIGNED: 'cases:edit:assigned',
  CASES_DELETE: 'cases:delete',
  CASES_CHANGE_STATUS: 'cases:status',
  CASES_ASSIGN: 'cases:assign',

  // Clients
  CLIENTS_VIEW: 'clients:view',
  CLIENTS_CREATE: 'clients:create',
  CLIENTS_EDIT: 'clients:edit',
  CLIENTS_DELETE: 'clients:delete',

  // Tasks
  TASKS_VIEW_ALL: 'tasks:view:all',
  TASKS_VIEW_ASSIGNED: 'tasks:view:assigned',
  TASKS_CREATE: 'tasks:create',
  TASKS_COMPLETE: 'tasks:complete',

  // Time Entries
  TIME_ENTRIES_VIEW_ALL: 'time:view:all',
  TIME_ENTRIES_VIEW_OWN: 'time:view:own',
  TIME_ENTRIES_CREATE: 'time:create',

  // Users
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_EDIT: 'users:edit',

  // Settings
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    PERMISSIONS.CASES_VIEW_ALL,
    PERMISSIONS.CASES_CREATE,
    PERMISSIONS.CASES_EDIT_ALL,
    PERMISSIONS.CASES_DELETE,
    PERMISSIONS.CASES_CHANGE_STATUS,
    PERMISSIONS.CASES_ASSIGN,
    PERMISSIONS.CLIENTS_VIEW,
    PERMISSIONS.CLIENTS_CREATE,
    PERMISSIONS.CLIENTS_EDIT,
    PERMISSIONS.CLIENTS_DELETE,
    PERMISSIONS.TASKS_VIEW_ALL,
    PERMISSIONS.TASKS_CREATE,
    PERMISSIONS.TASKS_COMPLETE,
    PERMISSIONS.TIME_ENTRIES_VIEW_ALL,
    PERMISSIONS.TIME_ENTRIES_CREATE,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_EDIT,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_EDIT,
  ],
  attorney: [
    PERMISSIONS.CASES_VIEW_ASSIGNED,
    PERMISSIONS.CASES_CREATE,
    PERMISSIONS.CASES_EDIT_ASSIGNED,
    PERMISSIONS.CASES_CHANGE_STATUS,
    PERMISSIONS.CLIENTS_VIEW,
    PERMISSIONS.CLIENTS_CREATE,
    PERMISSIONS.CLIENTS_EDIT,
    PERMISSIONS.TASKS_VIEW_ASSIGNED,
    PERMISSIONS.TASKS_CREATE,
    PERMISSIONS.TASKS_COMPLETE,
    PERMISSIONS.TIME_ENTRIES_VIEW_OWN,
    PERMISSIONS.TIME_ENTRIES_CREATE,
  ],
  paralegal: [
    PERMISSIONS.CASES_VIEW_ASSIGNED,
    PERMISSIONS.CLIENTS_VIEW,
    PERMISSIONS.TASKS_VIEW_ASSIGNED,
    PERMISSIONS.TASKS_COMPLETE,
    PERMISSIONS.TIME_ENTRIES_VIEW_OWN,
    PERMISSIONS.TIME_ENTRIES_CREATE,
  ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(role, p));
}

export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every(p => hasPermission(role, p));
}
