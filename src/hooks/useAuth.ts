import { useCallback, useMemo } from 'react';
import { useAuth as useAuthContext } from '../contexts/AuthContext';
import { PERMISSIONS, ROLE_PERMISSIONS, Permission } from '../constants/permissions';
import { Case } from '../types';

export function useAuth() {
  const auth = useAuthContext();

  const hasPermission = useCallback((permission: Permission): boolean => {
    if (!auth.user) return false;
    return ROLE_PERMISSIONS[auth.user.role]?.includes(permission) ?? false;
  }, [auth.user]);

  const hasAnyPermission = useCallback((permissions: Permission[]): boolean => {
    return permissions.some(p => hasPermission(p));
  }, [hasPermission]);

  const hasAllPermissions = useCallback((permissions: Permission[]): boolean => {
    return permissions.every(p => hasPermission(p));
  }, [hasPermission]);

  const canViewAllCases = useMemo(() => {
    return hasPermission(PERMISSIONS.CASES_VIEW_ALL);
  }, [hasPermission]);

  const canCreateCase = useMemo(() => {
    return hasPermission(PERMISSIONS.CASES_CREATE);
  }, [hasPermission]);

  const canDeleteCase = useMemo(() => {
    return hasPermission(PERMISSIONS.CASES_DELETE);
  }, [hasPermission]);

  const canAssignCases = useMemo(() => {
    return hasPermission(PERMISSIONS.CASES_ASSIGN);
  }, [hasPermission]);

  const canEditCase = useCallback((caseData: Case): boolean => {
    if (!auth.user) return false;
    if (hasPermission(PERMISSIONS.CASES_EDIT_ALL)) return true;
    if (hasPermission(PERMISSIONS.CASES_EDIT_ASSIGNED)) {
      return caseData.assignedTo.includes(auth.user.id);
    }
    return false;
  }, [auth.user, hasPermission]);

  const canChangeCaseStatus = useCallback((caseData: Case): boolean => {
    if (!auth.user) return false;
    if (!hasPermission(PERMISSIONS.CASES_CHANGE_STATUS)) return false;
    if (hasPermission(PERMISSIONS.CASES_EDIT_ALL)) return true;
    return caseData.assignedTo.includes(auth.user.id);
  }, [auth.user, hasPermission]);

  const canViewCase = useCallback((caseData: Case): boolean => {
    if (!auth.user) return false;
    if (hasPermission(PERMISSIONS.CASES_VIEW_ALL)) return true;
    if (hasPermission(PERMISSIONS.CASES_VIEW_ASSIGNED)) {
      return caseData.assignedTo.includes(auth.user.id);
    }
    return false;
  }, [auth.user, hasPermission]);

  const canCreateClient = useMemo(() => {
    return hasPermission(PERMISSIONS.CLIENTS_CREATE);
  }, [hasPermission]);

  const canEditClient = useMemo(() => {
    return hasPermission(PERMISSIONS.CLIENTS_EDIT);
  }, [hasPermission]);

  const canDeleteClient = useMemo(() => {
    return hasPermission(PERMISSIONS.CLIENTS_DELETE);
  }, [hasPermission]);

  const canCreateTask = useMemo(() => {
    return hasPermission(PERMISSIONS.TASKS_CREATE);
  }, [hasPermission]);

  const canViewSettings = useMemo(() => {
    return hasPermission(PERMISSIONS.SETTINGS_VIEW);
  }, [hasPermission]);

  const canManageUsers = useMemo(() => {
    return hasPermission(PERMISSIONS.USERS_VIEW);
  }, [hasPermission]);

  return {
    ...auth,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canViewAllCases,
    canCreateCase,
    canDeleteCase,
    canAssignCases,
    canEditCase,
    canChangeCaseStatus,
    canViewCase,
    canCreateClient,
    canEditClient,
    canDeleteClient,
    canCreateTask,
    canViewSettings,
    canManageUsers,
  };
}

export default useAuth;
