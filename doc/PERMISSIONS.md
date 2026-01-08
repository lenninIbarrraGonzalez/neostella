# Permissions System

## Overview

Neostella implements a role-based access control (RBAC) system with three predefined roles and granular permissions.

## Roles

| Role | Description |
|------|-------------|
| `admin` | Full system access, user management |
| `attorney` | Case management, client creation, assigned cases |
| `paralegal` | Read access to assigned cases, task completion |

## Permissions

Permissions are defined in `src/constants/permissions.ts`.

### Case Permissions

| Permission | Admin | Attorney | Paralegal |
|------------|:-----:|:--------:|:---------:|
| `CASES_VIEW_ALL` | ✓ | | |
| `CASES_VIEW_ASSIGNED` | ✓ | ✓ | ✓ |
| `CASES_CREATE` | ✓ | ✓ | |
| `CASES_EDIT_ALL` | ✓ | | |
| `CASES_EDIT_ASSIGNED` | ✓ | ✓ | |
| `CASES_DELETE` | ✓ | | |
| `CASES_ASSIGN` | ✓ | | |
| `CASES_CHANGE_STATUS` | ✓ | ✓ | |

### Client Permissions

| Permission | Admin | Attorney | Paralegal |
|------------|:-----:|:--------:|:---------:|
| `CLIENTS_VIEW` | ✓ | ✓ | ✓ |
| `CLIENTS_CREATE` | ✓ | ✓ | |
| `CLIENTS_EDIT` | ✓ | ✓ | |
| `CLIENTS_DELETE` | ✓ | | |

### Task Permissions

| Permission | Admin | Attorney | Paralegal |
|------------|:-----:|:--------:|:---------:|
| `TASKS_VIEW_ALL` | ✓ | | |
| `TASKS_VIEW_ASSIGNED` | ✓ | ✓ | ✓ |
| `TASKS_CREATE` | ✓ | ✓ | |
| `TASKS_EDIT` | ✓ | ✓ | |
| `TASKS_DELETE` | ✓ | ✓ | |
| `TASKS_COMPLETE` | ✓ | ✓ | ✓ |

### Time Entry Permissions

| Permission | Admin | Attorney | Paralegal |
|------------|:-----:|:--------:|:---------:|
| `TIME_ENTRIES_VIEW_ALL` | ✓ | | |
| `TIME_ENTRIES_VIEW_OWN` | ✓ | ✓ | ✓ |
| `TIME_ENTRIES_CREATE` | ✓ | ✓ | ✓ |
| `TIME_ENTRIES_DELETE` | ✓ | ✓ | |

### User Permissions

| Permission | Admin | Attorney | Paralegal |
|------------|:-----:|:--------:|:---------:|
| `USERS_VIEW` | ✓ | | |
| `USERS_CREATE` | ✓ | | |
| `USERS_EDIT` | ✓ | | |
| `USERS_DELETE` | ✓ | | |

### Settings Permissions

| Permission | Admin | Attorney | Paralegal |
|------------|:-----:|:--------:|:---------:|
| `SETTINGS_VIEW` | ✓ | | |
| `SETTINGS_EDIT` | ✓ | | |

## Implementation

### Permission Constants

```typescript
// src/constants/permissions.ts

export const PERMISSIONS = {
  CASES_VIEW_ALL: 'cases:view:all',
  CASES_VIEW_ASSIGNED: 'cases:view:assigned',
  CASES_CREATE: 'cases:create',
  // ...
} as const;

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    PERMISSIONS.CASES_VIEW_ALL,
    PERMISSIONS.CASES_CREATE,
    PERMISSIONS.CASES_EDIT_ALL,
    PERMISSIONS.CASES_DELETE,
    // ...
  ],
  attorney: [
    PERMISSIONS.CASES_VIEW_ASSIGNED,
    PERMISSIONS.CASES_CREATE,
    PERMISSIONS.CASES_EDIT_ASSIGNED,
    // ...
  ],
  paralegal: [
    PERMISSIONS.CASES_VIEW_ASSIGNED,
    PERMISSIONS.CLIENTS_VIEW,
    PERMISSIONS.TASKS_VIEW_ASSIGNED,
    // ...
  ],
};
```

### useAuth Hook

The `useAuth` hook provides permission checking methods:

```typescript
const {
  hasPermission,      // Check single permission
  hasAnyPermission,   // Check if user has any of the permissions
  hasAllPermissions,  // Check if user has all permissions
  canViewAllCases,    // Convenience: can view all cases
  canCreateCase,      // Convenience: can create cases
  canEditCase,        // Convenience: can edit specific case
  canChangeCaseStatus,// Convenience: can change case status
  // ...
} = useAuth();
```

### Usage Examples

#### Check Single Permission

```typescript
function CaseActions({ caseData }) {
  const { hasPermission } = useAuth();

  return (
    <>
      {hasPermission(PERMISSIONS.CASES_DELETE) && (
        <Button onClick={handleDelete}>Delete</Button>
      )}
    </>
  );
}
```

#### Check Case-Specific Permission

```typescript
function CaseEditButton({ caseData }) {
  const { canEditCase } = useAuth();

  if (!canEditCase(caseData)) {
    return null;
  }

  return <Button>Edit Case</Button>;
}
```

#### Route Protection

```typescript
// Protect route with RoleGuard
<Route
  element={<RoleGuard allowedRoles={['admin']} />}
>
  <Route path="settings" element={<SettingsPage />} />
</Route>
```

#### Filter Data by Permission

```typescript
function useCases(filters) {
  const { user, canViewAllCases } = useAuth();

  const visibleCases = useMemo(() => {
    if (!user) return [];

    // Admin sees all, others see only assigned
    if (!canViewAllCases) {
      return cases.filter(c => c.assignedTo.includes(user.id));
    }

    return cases;
  }, [cases, user, canViewAllCases]);

  return { cases: visibleCases };
}
```

## Permission Logic

### Case Edit Permission

A user can edit a case if:
1. User has `CASES_EDIT_ALL` permission, OR
2. User has `CASES_EDIT_ASSIGNED` AND is assigned to the case

```typescript
const canEditCase = (caseData: Case): boolean => {
  if (!user) return false;
  if (hasPermission(PERMISSIONS.CASES_EDIT_ALL)) return true;
  if (hasPermission(PERMISSIONS.CASES_EDIT_ASSIGNED)) {
    return caseData.assignedTo.includes(user.id);
  }
  return false;
};
```

### Case Status Change Permission

A user can change case status if:
1. User has `CASES_CHANGE_STATUS` permission, AND
2. User has `CASES_EDIT_ALL` OR is assigned to the case

```typescript
const canChangeCaseStatus = (caseData: Case): boolean => {
  if (!user) return false;
  if (!hasPermission(PERMISSIONS.CASES_CHANGE_STATUS)) return false;
  if (hasPermission(PERMISSIONS.CASES_EDIT_ALL)) return true;
  return caseData.assignedTo.includes(user.id);
};
```

## Adding New Permissions

1. Add the permission constant to `PERMISSIONS` object
2. Add the permission to appropriate roles in `ROLE_PERMISSIONS`
3. Add convenience method to `useAuth` hook if needed
4. Use the permission in components/hooks
