import { describe, it, expect } from 'vitest';
import {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
} from './permissions';

describe('PERMISSIONS constant', () => {
  it('should have all case permission keys', () => {
    expect(PERMISSIONS.CASES_VIEW_ALL).toBe('cases:view:all');
    expect(PERMISSIONS.CASES_VIEW_ASSIGNED).toBe('cases:view:assigned');
    expect(PERMISSIONS.CASES_CREATE).toBe('cases:create');
    expect(PERMISSIONS.CASES_EDIT_ALL).toBe('cases:edit:all');
    expect(PERMISSIONS.CASES_EDIT_ASSIGNED).toBe('cases:edit:assigned');
    expect(PERMISSIONS.CASES_DELETE).toBe('cases:delete');
    expect(PERMISSIONS.CASES_CHANGE_STATUS).toBe('cases:status');
    expect(PERMISSIONS.CASES_ASSIGN).toBe('cases:assign');
  });

  it('should have all client permission keys', () => {
    expect(PERMISSIONS.CLIENTS_VIEW).toBe('clients:view');
    expect(PERMISSIONS.CLIENTS_CREATE).toBe('clients:create');
    expect(PERMISSIONS.CLIENTS_EDIT).toBe('clients:edit');
    expect(PERMISSIONS.CLIENTS_DELETE).toBe('clients:delete');
  });

  it('should have all task permission keys', () => {
    expect(PERMISSIONS.TASKS_VIEW_ALL).toBe('tasks:view:all');
    expect(PERMISSIONS.TASKS_VIEW_ASSIGNED).toBe('tasks:view:assigned');
    expect(PERMISSIONS.TASKS_CREATE).toBe('tasks:create');
    expect(PERMISSIONS.TASKS_COMPLETE).toBe('tasks:complete');
  });

  it('should have all time entry permission keys', () => {
    expect(PERMISSIONS.TIME_ENTRIES_VIEW_ALL).toBe('time:view:all');
    expect(PERMISSIONS.TIME_ENTRIES_VIEW_OWN).toBe('time:view:own');
    expect(PERMISSIONS.TIME_ENTRIES_CREATE).toBe('time:create');
  });

  it('should have all user permission keys', () => {
    expect(PERMISSIONS.USERS_VIEW).toBe('users:view');
    expect(PERMISSIONS.USERS_CREATE).toBe('users:create');
    expect(PERMISSIONS.USERS_EDIT).toBe('users:edit');
  });

  it('should have all settings permission keys', () => {
    expect(PERMISSIONS.SETTINGS_VIEW).toBe('settings:view');
    expect(PERMISSIONS.SETTINGS_EDIT).toBe('settings:edit');
  });
});

describe('ROLE_PERMISSIONS', () => {
  describe('admin role', () => {
    it('should have all case permissions', () => {
      expect(ROLE_PERMISSIONS.admin).toContain(PERMISSIONS.CASES_VIEW_ALL);
      expect(ROLE_PERMISSIONS.admin).toContain(PERMISSIONS.CASES_CREATE);
      expect(ROLE_PERMISSIONS.admin).toContain(PERMISSIONS.CASES_EDIT_ALL);
      expect(ROLE_PERMISSIONS.admin).toContain(PERMISSIONS.CASES_DELETE);
      expect(ROLE_PERMISSIONS.admin).toContain(PERMISSIONS.CASES_CHANGE_STATUS);
      expect(ROLE_PERMISSIONS.admin).toContain(PERMISSIONS.CASES_ASSIGN);
    });

    it('should have all client permissions', () => {
      expect(ROLE_PERMISSIONS.admin).toContain(PERMISSIONS.CLIENTS_VIEW);
      expect(ROLE_PERMISSIONS.admin).toContain(PERMISSIONS.CLIENTS_CREATE);
      expect(ROLE_PERMISSIONS.admin).toContain(PERMISSIONS.CLIENTS_EDIT);
      expect(ROLE_PERMISSIONS.admin).toContain(PERMISSIONS.CLIENTS_DELETE);
    });

    it('should have all task permissions', () => {
      expect(ROLE_PERMISSIONS.admin).toContain(PERMISSIONS.TASKS_VIEW_ALL);
      expect(ROLE_PERMISSIONS.admin).toContain(PERMISSIONS.TASKS_CREATE);
      expect(ROLE_PERMISSIONS.admin).toContain(PERMISSIONS.TASKS_COMPLETE);
    });

    it('should have all time entry permissions', () => {
      expect(ROLE_PERMISSIONS.admin).toContain(PERMISSIONS.TIME_ENTRIES_VIEW_ALL);
      expect(ROLE_PERMISSIONS.admin).toContain(PERMISSIONS.TIME_ENTRIES_CREATE);
    });

    it('should have all user permissions', () => {
      expect(ROLE_PERMISSIONS.admin).toContain(PERMISSIONS.USERS_VIEW);
      expect(ROLE_PERMISSIONS.admin).toContain(PERMISSIONS.USERS_CREATE);
      expect(ROLE_PERMISSIONS.admin).toContain(PERMISSIONS.USERS_EDIT);
    });

    it('should have all settings permissions', () => {
      expect(ROLE_PERMISSIONS.admin).toContain(PERMISSIONS.SETTINGS_VIEW);
      expect(ROLE_PERMISSIONS.admin).toContain(PERMISSIONS.SETTINGS_EDIT);
    });
  });

  describe('attorney role', () => {
    it('should have limited case permissions', () => {
      expect(ROLE_PERMISSIONS.attorney).toContain(PERMISSIONS.CASES_VIEW_ASSIGNED);
      expect(ROLE_PERMISSIONS.attorney).toContain(PERMISSIONS.CASES_CREATE);
      expect(ROLE_PERMISSIONS.attorney).toContain(PERMISSIONS.CASES_EDIT_ASSIGNED);
      expect(ROLE_PERMISSIONS.attorney).toContain(PERMISSIONS.CASES_CHANGE_STATUS);
      expect(ROLE_PERMISSIONS.attorney).not.toContain(PERMISSIONS.CASES_VIEW_ALL);
      expect(ROLE_PERMISSIONS.attorney).not.toContain(PERMISSIONS.CASES_EDIT_ALL);
      expect(ROLE_PERMISSIONS.attorney).not.toContain(PERMISSIONS.CASES_DELETE);
      expect(ROLE_PERMISSIONS.attorney).not.toContain(PERMISSIONS.CASES_ASSIGN);
    });

    it('should have client view and edit permissions', () => {
      expect(ROLE_PERMISSIONS.attorney).toContain(PERMISSIONS.CLIENTS_VIEW);
      expect(ROLE_PERMISSIONS.attorney).toContain(PERMISSIONS.CLIENTS_CREATE);
      expect(ROLE_PERMISSIONS.attorney).toContain(PERMISSIONS.CLIENTS_EDIT);
      expect(ROLE_PERMISSIONS.attorney).not.toContain(PERMISSIONS.CLIENTS_DELETE);
    });

    it('should have limited task permissions', () => {
      expect(ROLE_PERMISSIONS.attorney).toContain(PERMISSIONS.TASKS_VIEW_ASSIGNED);
      expect(ROLE_PERMISSIONS.attorney).toContain(PERMISSIONS.TASKS_CREATE);
      expect(ROLE_PERMISSIONS.attorney).toContain(PERMISSIONS.TASKS_COMPLETE);
      expect(ROLE_PERMISSIONS.attorney).not.toContain(PERMISSIONS.TASKS_VIEW_ALL);
    });

    it('should have own time entry permissions', () => {
      expect(ROLE_PERMISSIONS.attorney).toContain(PERMISSIONS.TIME_ENTRIES_VIEW_OWN);
      expect(ROLE_PERMISSIONS.attorney).toContain(PERMISSIONS.TIME_ENTRIES_CREATE);
      expect(ROLE_PERMISSIONS.attorney).not.toContain(PERMISSIONS.TIME_ENTRIES_VIEW_ALL);
    });

    it('should not have user management permissions', () => {
      expect(ROLE_PERMISSIONS.attorney).not.toContain(PERMISSIONS.USERS_VIEW);
      expect(ROLE_PERMISSIONS.attorney).not.toContain(PERMISSIONS.USERS_CREATE);
      expect(ROLE_PERMISSIONS.attorney).not.toContain(PERMISSIONS.USERS_EDIT);
    });

    it('should not have settings permissions', () => {
      expect(ROLE_PERMISSIONS.attorney).not.toContain(PERMISSIONS.SETTINGS_VIEW);
      expect(ROLE_PERMISSIONS.attorney).not.toContain(PERMISSIONS.SETTINGS_EDIT);
    });
  });

  describe('paralegal role', () => {
    it('should have minimal case permissions', () => {
      expect(ROLE_PERMISSIONS.paralegal).toContain(PERMISSIONS.CASES_VIEW_ASSIGNED);
      expect(ROLE_PERMISSIONS.paralegal).not.toContain(PERMISSIONS.CASES_VIEW_ALL);
      expect(ROLE_PERMISSIONS.paralegal).not.toContain(PERMISSIONS.CASES_CREATE);
      expect(ROLE_PERMISSIONS.paralegal).not.toContain(PERMISSIONS.CASES_EDIT_ALL);
      expect(ROLE_PERMISSIONS.paralegal).not.toContain(PERMISSIONS.CASES_EDIT_ASSIGNED);
      expect(ROLE_PERMISSIONS.paralegal).not.toContain(PERMISSIONS.CASES_DELETE);
      expect(ROLE_PERMISSIONS.paralegal).not.toContain(PERMISSIONS.CASES_CHANGE_STATUS);
      expect(ROLE_PERMISSIONS.paralegal).not.toContain(PERMISSIONS.CASES_ASSIGN);
    });

    it('should have only client view permission', () => {
      expect(ROLE_PERMISSIONS.paralegal).toContain(PERMISSIONS.CLIENTS_VIEW);
      expect(ROLE_PERMISSIONS.paralegal).not.toContain(PERMISSIONS.CLIENTS_CREATE);
      expect(ROLE_PERMISSIONS.paralegal).not.toContain(PERMISSIONS.CLIENTS_EDIT);
      expect(ROLE_PERMISSIONS.paralegal).not.toContain(PERMISSIONS.CLIENTS_DELETE);
    });

    it('should have limited task permissions', () => {
      expect(ROLE_PERMISSIONS.paralegal).toContain(PERMISSIONS.TASKS_VIEW_ASSIGNED);
      expect(ROLE_PERMISSIONS.paralegal).toContain(PERMISSIONS.TASKS_COMPLETE);
      expect(ROLE_PERMISSIONS.paralegal).not.toContain(PERMISSIONS.TASKS_VIEW_ALL);
      expect(ROLE_PERMISSIONS.paralegal).not.toContain(PERMISSIONS.TASKS_CREATE);
    });

    it('should have own time entry permissions', () => {
      expect(ROLE_PERMISSIONS.paralegal).toContain(PERMISSIONS.TIME_ENTRIES_VIEW_OWN);
      expect(ROLE_PERMISSIONS.paralegal).toContain(PERMISSIONS.TIME_ENTRIES_CREATE);
      expect(ROLE_PERMISSIONS.paralegal).not.toContain(PERMISSIONS.TIME_ENTRIES_VIEW_ALL);
    });

    it('should not have user management permissions', () => {
      expect(ROLE_PERMISSIONS.paralegal).not.toContain(PERMISSIONS.USERS_VIEW);
      expect(ROLE_PERMISSIONS.paralegal).not.toContain(PERMISSIONS.USERS_CREATE);
      expect(ROLE_PERMISSIONS.paralegal).not.toContain(PERMISSIONS.USERS_EDIT);
    });

    it('should not have settings permissions', () => {
      expect(ROLE_PERMISSIONS.paralegal).not.toContain(PERMISSIONS.SETTINGS_VIEW);
      expect(ROLE_PERMISSIONS.paralegal).not.toContain(PERMISSIONS.SETTINGS_EDIT);
    });
  });
});

describe('hasPermission', () => {
  it('should return true for admin with any permission', () => {
    expect(hasPermission('admin', PERMISSIONS.CASES_DELETE)).toBe(true);
    expect(hasPermission('admin', PERMISSIONS.USERS_CREATE)).toBe(true);
    expect(hasPermission('admin', PERMISSIONS.SETTINGS_EDIT)).toBe(true);
  });

  it('should return true for attorney with allowed permissions', () => {
    expect(hasPermission('attorney', PERMISSIONS.CASES_CREATE)).toBe(true);
    expect(hasPermission('attorney', PERMISSIONS.CLIENTS_EDIT)).toBe(true);
    expect(hasPermission('attorney', PERMISSIONS.TASKS_CREATE)).toBe(true);
  });

  it('should return false for attorney with disallowed permissions', () => {
    expect(hasPermission('attorney', PERMISSIONS.CASES_DELETE)).toBe(false);
    expect(hasPermission('attorney', PERMISSIONS.USERS_CREATE)).toBe(false);
    expect(hasPermission('attorney', PERMISSIONS.SETTINGS_VIEW)).toBe(false);
  });

  it('should return true for paralegal with allowed permissions', () => {
    expect(hasPermission('paralegal', PERMISSIONS.CASES_VIEW_ASSIGNED)).toBe(true);
    expect(hasPermission('paralegal', PERMISSIONS.CLIENTS_VIEW)).toBe(true);
    expect(hasPermission('paralegal', PERMISSIONS.TASKS_COMPLETE)).toBe(true);
  });

  it('should return false for paralegal with disallowed permissions', () => {
    expect(hasPermission('paralegal', PERMISSIONS.CASES_CREATE)).toBe(false);
    expect(hasPermission('paralegal', PERMISSIONS.CLIENTS_CREATE)).toBe(false);
    expect(hasPermission('paralegal', PERMISSIONS.TASKS_CREATE)).toBe(false);
  });

  it('should return false for invalid role', () => {
    // @ts-expect-error - testing invalid role
    expect(hasPermission('invalid_role', PERMISSIONS.CASES_VIEW_ALL)).toBe(false);
  });

  it('should return false for null role', () => {
    // @ts-expect-error - testing null role
    expect(hasPermission(null, PERMISSIONS.CASES_VIEW_ALL)).toBe(false);
  });

  it('should return false for undefined role', () => {
    // @ts-expect-error - testing undefined role
    expect(hasPermission(undefined, PERMISSIONS.CASES_VIEW_ALL)).toBe(false);
  });
});

describe('hasAnyPermission', () => {
  it('should return true if user has at least one permission', () => {
    expect(hasAnyPermission('paralegal', [
      PERMISSIONS.CASES_DELETE,
      PERMISSIONS.CLIENTS_VIEW,
    ])).toBe(true);
  });

  it('should return true if user has first permission', () => {
    expect(hasAnyPermission('paralegal', [
      PERMISSIONS.CLIENTS_VIEW,
      PERMISSIONS.CASES_DELETE,
    ])).toBe(true);
  });

  it('should return false if user has none of the permissions', () => {
    expect(hasAnyPermission('paralegal', [
      PERMISSIONS.CASES_DELETE,
      PERMISSIONS.USERS_CREATE,
    ])).toBe(false);
  });

  it('should return false for empty permissions array', () => {
    expect(hasAnyPermission('admin', [])).toBe(false);
  });

  it('should return true if user has all permissions', () => {
    expect(hasAnyPermission('admin', [
      PERMISSIONS.CASES_VIEW_ALL,
      PERMISSIONS.CASES_DELETE,
    ])).toBe(true);
  });

  it('should handle single permission', () => {
    expect(hasAnyPermission('admin', [PERMISSIONS.CASES_VIEW_ALL])).toBe(true);
    expect(hasAnyPermission('paralegal', [PERMISSIONS.CASES_DELETE])).toBe(false);
  });
});

describe('hasAllPermissions', () => {
  it('should return true if user has all permissions', () => {
    expect(hasAllPermissions('admin', [
      PERMISSIONS.CASES_VIEW_ALL,
      PERMISSIONS.CASES_CREATE,
      PERMISSIONS.CASES_DELETE,
    ])).toBe(true);
  });

  it('should return false if user is missing any permission', () => {
    expect(hasAllPermissions('attorney', [
      PERMISSIONS.CASES_CREATE,
      PERMISSIONS.CASES_DELETE,
    ])).toBe(false);
  });

  it('should return false if user is missing last permission', () => {
    expect(hasAllPermissions('attorney', [
      PERMISSIONS.CASES_CREATE,
      PERMISSIONS.CLIENTS_VIEW,
      PERMISSIONS.USERS_CREATE,
    ])).toBe(false);
  });

  it('should return true for empty permissions array', () => {
    expect(hasAllPermissions('paralegal', [])).toBe(true);
  });

  it('should return true for single permission user has', () => {
    expect(hasAllPermissions('paralegal', [PERMISSIONS.CLIENTS_VIEW])).toBe(true);
  });

  it('should return false for single permission user lacks', () => {
    expect(hasAllPermissions('paralegal', [PERMISSIONS.CASES_DELETE])).toBe(false);
  });

  it('should handle many permissions for admin', () => {
    expect(hasAllPermissions('admin', [
      PERMISSIONS.CASES_VIEW_ALL,
      PERMISSIONS.CASES_CREATE,
      PERMISSIONS.CASES_DELETE,
      PERMISSIONS.CLIENTS_VIEW,
      PERMISSIONS.CLIENTS_CREATE,
      PERMISSIONS.USERS_VIEW,
      PERMISSIONS.SETTINGS_EDIT,
    ])).toBe(true);
  });
});
