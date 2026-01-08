# Hooks & Contexts API

This document describes the internal API provided by React contexts and custom hooks.

## Contexts

### AuthContext

Manages user authentication state.

**Location:** `src/contexts/AuthContext.tsx`

#### Provider

```tsx
<AuthProvider>
  {children}
</AuthProvider>
```

#### Hook: useAuth (from context)

```typescript
import { useAuth } from '../contexts/AuthContext';

const {
  user,            // User | null - Current logged-in user
  isAuthenticated, // boolean - Whether user is logged in
  isLoading,       // boolean - Loading state during initialization
  login,           // (credentials: LoginCredentials) => Promise<boolean>
  logout,          // () => void
  register,        // (data: RegisterData) => Promise<boolean>
  updateUser,      // (data: Partial<User>) => void
} = useAuth();
```

#### Types

```typescript
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: Role;
}
```

---

### AppContext

Manages application data (cases, clients, tasks, etc.).

**Location:** `src/contexts/AppContext.tsx`

#### Provider

```tsx
<AppProvider>
  {children}
</AppProvider>
```

#### Hook: useApp

```typescript
import { useApp } from '../contexts/AppContext';

const {
  // State
  cases,           // Case[]
  clients,         // Client[]
  tasks,           // Task[]
  timeEntries,     // TimeEntry[]
  activities,      // Activity[]
  notes,           // Note[]
  notifications,   // Notification[]
  isLoading,       // boolean

  // Case operations
  addCase,         // (data: CreateCaseData) => Case
  updateCase,      // (id: string, data: Partial<Case>) => void
  deleteCase,      // (id: string) => void
  changeCaseStatus,// (id: string, status: CaseStatus) => void

  // Client operations
  addClient,       // (data: CreateClientData) => Client
  updateClient,    // (id: string, data: Partial<Client>) => void
  deleteClient,    // (id: string) => void

  // Task operations
  addTask,         // (data: CreateTaskData) => Task
  updateTask,      // (id: string, data: Partial<Task>) => void
  deleteTask,      // (id: string) => void
  completeTask,    // (id: string) => void

  // Time entry operations
  addTimeEntry,    // (data: CreateTimeEntryData) => TimeEntry
  deleteTimeEntry, // (id: string) => void

  // Note operations
  addNote,         // (data: CreateNoteData) => Note
  updateNote,      // (id: string, content: string) => void
  deleteNote,      // (id: string) => void

  // Other
  addActivity,     // (caseId: string, action: string, details: string) => void
  markNotificationRead, // (id: string) => void
  refreshData,     // () => void
} = useApp();
```

---

## Custom Hooks

### useAuth (extended)

Extended authentication hook with permission checking.

**Location:** `src/hooks/useAuth.ts`

```typescript
import { useAuth } from '../hooks/useAuth';

const {
  // From AuthContext
  user,
  isAuthenticated,
  isLoading,
  login,
  logout,
  register,
  updateUser,

  // Permission methods
  hasPermission,      // (permission: Permission) => boolean
  hasAnyPermission,   // (permissions: Permission[]) => boolean
  hasAllPermissions,  // (permissions: Permission[]) => boolean

  // Convenience booleans
  canViewAllCases,    // boolean
  canCreateCase,      // boolean
  canDeleteCase,      // boolean
  canAssignCases,     // boolean
  canCreateClient,    // boolean
  canEditClient,      // boolean
  canDeleteClient,    // boolean
  canCreateTask,      // boolean
  canViewSettings,    // boolean
  canManageUsers,     // boolean

  // Case-specific checks
  canEditCase,        // (caseData: Case) => boolean
  canChangeCaseStatus,// (caseData: Case) => boolean
  canViewCase,        // (caseData: Case) => boolean
} = useAuth();
```

---

### useCases

Case management with filtering and permissions.

**Location:** `src/hooks/useCases.ts`

```typescript
import { useCases } from '../hooks/useCases';

const {
  cases,           // Case[] - Filtered and visible cases
  allCases,        // Case[] - All cases (unfiltered)
  openCases,       // Case[] - Non-closed cases
  closedCases,     // Case[] - Closed cases only
  casesByStatus,   // Record<CaseStatus, Case[]> - Grouped by status

  // Operations (from AppContext)
  addCase,
  updateCase,
  deleteCase,
  changeCaseStatus,

  // Utility
  getCaseById,     // (id: string) => Case | undefined
} = useCases(filters?: CaseFilters);
```

#### Filters

```typescript
interface CaseFilters {
  status?: CaseStatus;
  type?: CaseType;
  assignedTo?: string;
  clientId?: string;
  searchTerm?: string;
}
```

---

### useClients

Client management with filtering.

**Location:** `src/hooks/useClients.ts`

```typescript
import { useClients } from '../hooks/useClients';

const {
  clients,         // Client[] - Filtered clients
  allClients,      // Client[] - All clients

  // Operations
  addClient,
  updateClient,
  deleteClient,

  // Utility
  getClientById,      // (id: string) => Client | undefined
  getClientCases,     // (clientId: string) => Case[]
  getActiveCasesCount,// (clientId: string) => number
} = useClients(filters?: ClientFilters);
```

#### Filters

```typescript
interface ClientFilters {
  type?: ClientType;
  searchTerm?: string;
}
```

---

### useTasks

Task management with filtering and permissions.

**Location:** `src/hooks/useTasks.ts`

```typescript
import { useTasks } from '../hooks/useTasks';

const {
  tasks,           // Task[] - Filtered and visible tasks
  allTasks,        // Task[] - All tasks
  pendingTasks,    // Task[] - Pending tasks
  inProgressTasks, // Task[] - In-progress tasks
  completedTasks,  // Task[] - Completed tasks
  overdueTasks,    // Task[] - Overdue tasks

  // Operations
  addTask,
  updateTask,
  deleteTask,
  completeTask,

  // Utility
  tasksByCase,     // (caseId: string) => Task[]
  getTaskById,     // (id: string) => Task | undefined
} = useTasks(filters?: TaskFilters);
```

#### Filters

```typescript
interface TaskFilters {
  status?: TaskStatus;
  priority?: Priority;
  caseId?: string;
  assignedTo?: string;
  overdueOnly?: boolean;
  dueSoonOnly?: boolean;
}
```

---

### useTimeTracking

Time entry management with filtering and calculations.

**Location:** `src/hooks/useTimeTracking.ts`

```typescript
import { useTimeTracking } from '../hooks/useTimeTracking';

const {
  timeEntries,      // TimeEntry[] - Filtered entries
  allTimeEntries,   // TimeEntry[] - All entries

  // Operations
  addTimeEntry,
  deleteTimeEntry,

  // Calculated values
  totalMinutes,     // number - Total minutes (visible entries)
  billableMinutes,  // number - Billable minutes only
  todayMinutes,     // number - Today's minutes
  thisWeekMinutes,  // number - This week's minutes
  thisMonthMinutes, // number - This month's minutes

  // Utility
  entriesByCase,    // (caseId: string) => TimeEntry[]
  totalMinutesByCase,// (caseId: string) => number
} = useTimeTracking(filters?: TimeFilters);
```

#### Filters

```typescript
interface TimeFilters {
  caseId?: string;
  userId?: string;
  billableOnly?: boolean;
  startDate?: Date;
  endDate?: Date;
}
```

---

## Data Types

### User

```typescript
interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  preferences?: {
    language: 'en' | 'es';
    theme: 'light' | 'dark';
  };
  isActive: boolean;
  createdAt: Date;
}

type Role = 'admin' | 'attorney' | 'paralegal';
```

### Case

```typescript
interface Case {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  type: CaseType;
  status: CaseStatus;
  priority?: Priority;
  clientId: string;
  assignedTo: string[];
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

type CaseType =
  | 'personal_injury'
  | 'auto_accident'
  | 'immigration_visa'
  | 'immigration_citizenship'
  | 'family_divorce'
  | 'family_custody';

type CaseStatus =
  | 'new'
  | 'under_review'
  | 'in_progress'
  | 'pending_client'
  | 'resolved'
  | 'closed';
```

### Client

```typescript
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  type: ClientType;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

type ClientType = 'individual' | 'organization';
```

### Task

```typescript
interface Task {
  id: string;
  caseId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  deadline: Date | null;
  assignedTo: string;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
type Priority = 'low' | 'medium' | 'high' | 'urgent';
```

### TimeEntry

```typescript
interface TimeEntry {
  id: string;
  caseId: string;
  userId: string;
  description: string;
  duration: number; // minutes
  date: Date;
  billable: boolean;
  createdAt: Date;
}
```

### Activity

```typescript
interface Activity {
  id: string;
  caseId: string;
  userId: string;
  action: string;
  details: string;
  timestamp: Date;
}
```

### Note

```typescript
interface Note {
  id: string;
  caseId: string;
  userId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Notification

```typescript
interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  relatedCaseId?: string;
  read: boolean;
  createdAt: Date;
}
```
