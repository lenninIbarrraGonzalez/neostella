import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';

// Create mock context value
const mockAuthContext = {
  user: null as any,
  isAuthenticated: false,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
  updateUser: vi.fn(),
};

// Mock the contexts
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => mockAuthContext,
}));

// Import useAuth after mocking
import { useAuth } from './useAuth';
import { PERMISSIONS } from '../constants/permissions';

describe('useAuth hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthContext.user = null;
    mockAuthContext.isAuthenticated = false;
  });

  describe('with no user', () => {
    it('should return false for hasPermission when no user', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.hasPermission(PERMISSIONS.CASES_VIEW_ALL)).toBe(false);
    });

    it('should return false for canViewAllCases when no user', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.canViewAllCases).toBe(false);
    });

    it('should return false for canCreateCase when no user', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.canCreateCase).toBe(false);
    });

    it('should return false for canDeleteCase when no user', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.canDeleteCase).toBe(false);
    });
  });

  describe('with admin user', () => {
    beforeEach(() => {
      mockAuthContext.user = {
        id: 'user-admin-1',
        email: 'admin@test.com',
        name: 'Admin User',
        role: 'admin',
        isActive: true,
      };
      mockAuthContext.isAuthenticated = true;
    });

    it('should return true for hasPermission with admin permission', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.hasPermission(PERMISSIONS.CASES_DELETE)).toBe(true);
    });

    it('should return true for canViewAllCases', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.canViewAllCases).toBe(true);
    });

    it('should return true for canCreateCase', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.canCreateCase).toBe(true);
    });

    it('should return true for canDeleteCase', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.canDeleteCase).toBe(true);
    });

    it('should return true for canAssignCases', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.canAssignCases).toBe(true);
    });

    it('should return true for canCreateClient', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.canCreateClient).toBe(true);
    });

    it('should return true for canEditClient', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.canEditClient).toBe(true);
    });

    it('should return true for canDeleteClient', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.canDeleteClient).toBe(true);
    });

    it('should return true for canCreateTask', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.canCreateTask).toBe(true);
    });

    it('should return true for canViewSettings', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.canViewSettings).toBe(true);
    });

    it('should return true for canManageUsers', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.canManageUsers).toBe(true);
    });

    it('should return true for canEditCase for any case', () => {
      const { result } = renderHook(() => useAuth());
      const mockCase = {
        id: 'case-1',
        assignedTo: ['other-user'],
      };
      expect(result.current.canEditCase(mockCase as any)).toBe(true);
    });

    it('should return true for canChangeCaseStatus for any case', () => {
      const { result } = renderHook(() => useAuth());
      const mockCase = {
        id: 'case-1',
        assignedTo: ['other-user'],
      };
      expect(result.current.canChangeCaseStatus(mockCase as any)).toBe(true);
    });

    it('should return true for canViewCase for any case', () => {
      const { result } = renderHook(() => useAuth());
      const mockCase = {
        id: 'case-1',
        assignedTo: ['other-user'],
      };
      expect(result.current.canViewCase(mockCase as any)).toBe(true);
    });
  });

  describe('with attorney user', () => {
    beforeEach(() => {
      mockAuthContext.user = {
        id: 'user-attorney-1',
        email: 'attorney@test.com',
        name: 'Attorney User',
        role: 'attorney',
        isActive: true,
      };
      mockAuthContext.isAuthenticated = true;
    });

    it('should return false for hasPermission with admin-only permission', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.hasPermission(PERMISSIONS.CASES_DELETE)).toBe(false);
    });

    it('should return true for hasPermission with attorney permission', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.hasPermission(PERMISSIONS.CASES_CREATE)).toBe(true);
    });

    it('should return false for canViewAllCases', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.canViewAllCases).toBe(false);
    });

    it('should return true for canCreateCase', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.canCreateCase).toBe(true);
    });

    it('should return false for canDeleteCase', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.canDeleteCase).toBe(false);
    });

    it('should return false for canAssignCases', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.canAssignCases).toBe(false);
    });

    it('should return true for canEditCase when assigned', () => {
      const { result } = renderHook(() => useAuth());
      const mockCase = {
        id: 'case-1',
        assignedTo: ['user-attorney-1'],
      };
      expect(result.current.canEditCase(mockCase as any)).toBe(true);
    });

    it('should return false for canEditCase when not assigned', () => {
      const { result } = renderHook(() => useAuth());
      const mockCase = {
        id: 'case-1',
        assignedTo: ['other-user'],
      };
      expect(result.current.canEditCase(mockCase as any)).toBe(false);
    });

    it('should return true for canChangeCaseStatus when assigned', () => {
      const { result } = renderHook(() => useAuth());
      const mockCase = {
        id: 'case-1',
        assignedTo: ['user-attorney-1'],
      };
      expect(result.current.canChangeCaseStatus(mockCase as any)).toBe(true);
    });

    it('should return false for canChangeCaseStatus when not assigned', () => {
      const { result } = renderHook(() => useAuth());
      const mockCase = {
        id: 'case-1',
        assignedTo: ['other-user'],
      };
      expect(result.current.canChangeCaseStatus(mockCase as any)).toBe(false);
    });

    it('should return true for canViewCase when assigned', () => {
      const { result } = renderHook(() => useAuth());
      const mockCase = {
        id: 'case-1',
        assignedTo: ['user-attorney-1'],
      };
      expect(result.current.canViewCase(mockCase as any)).toBe(true);
    });

    it('should return false for canViewCase when not assigned', () => {
      const { result } = renderHook(() => useAuth());
      const mockCase = {
        id: 'case-1',
        assignedTo: ['other-user'],
      };
      expect(result.current.canViewCase(mockCase as any)).toBe(false);
    });
  });

  describe('with paralegal user', () => {
    beforeEach(() => {
      mockAuthContext.user = {
        id: 'user-paralegal-1',
        email: 'paralegal@test.com',
        name: 'Paralegal User',
        role: 'paralegal',
        isActive: true,
      };
      mockAuthContext.isAuthenticated = true;
    });

    it('should return false for canCreateCase', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.canCreateCase).toBe(false);
    });

    it('should return false for canDeleteCase', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.canDeleteCase).toBe(false);
    });

    it('should return false for canCreateClient', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.canCreateClient).toBe(false);
    });

    it('should return false for canEditClient', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.canEditClient).toBe(false);
    });

    it('should return false for canDeleteClient', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.canDeleteClient).toBe(false);
    });

    it('should return false for canCreateTask', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.canCreateTask).toBe(false);
    });

    it('should return false for canViewSettings', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.canViewSettings).toBe(false);
    });

    it('should return false for canManageUsers', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.canManageUsers).toBe(false);
    });

    it('should return false for canEditCase even when assigned (no edit permission)', () => {
      const { result } = renderHook(() => useAuth());
      const mockCase = {
        id: 'case-1',
        assignedTo: ['user-paralegal-1'],
      };
      expect(result.current.canEditCase(mockCase as any)).toBe(false);
    });

    it('should return false for canChangeCaseStatus (no permission)', () => {
      const { result } = renderHook(() => useAuth());
      const mockCase = {
        id: 'case-1',
        assignedTo: ['user-paralegal-1'],
      };
      expect(result.current.canChangeCaseStatus(mockCase as any)).toBe(false);
    });
  });

  describe('hasAnyPermission', () => {
    beforeEach(() => {
      mockAuthContext.user = {
        id: 'user-paralegal-1',
        role: 'paralegal',
        isActive: true,
      };
    });

    it('should return true if user has at least one permission', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.hasAnyPermission([
        PERMISSIONS.CASES_DELETE,
        PERMISSIONS.CLIENTS_VIEW,
      ])).toBe(true);
    });

    it('should return false if user has none of the permissions', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.hasAnyPermission([
        PERMISSIONS.CASES_DELETE,
        PERMISSIONS.USERS_CREATE,
      ])).toBe(false);
    });
  });

  describe('hasAllPermissions', () => {
    beforeEach(() => {
      mockAuthContext.user = {
        id: 'user-admin-1',
        role: 'admin',
        isActive: true,
      };
    });

    it('should return true if user has all permissions', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.hasAllPermissions([
        PERMISSIONS.CASES_VIEW_ALL,
        PERMISSIONS.CASES_DELETE,
      ])).toBe(true);
    });

    it('should return false if user is missing any permission', () => {
      mockAuthContext.user.role = 'attorney';
      const { result } = renderHook(() => useAuth());
      expect(result.current.hasAllPermissions([
        PERMISSIONS.CASES_CREATE,
        PERMISSIONS.CASES_DELETE,
      ])).toBe(false);
    });
  });
});
