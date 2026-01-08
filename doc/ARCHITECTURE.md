# Architecture

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components
│   ├── features/        # Feature-specific components
│   └── layout/          # Layout components
├── constants/           # Constants and configuration
├── contexts/            # React Context providers
├── guards/              # Route protection components
├── hooks/               # Custom React hooks
├── locales/             # i18n translation files
│   ├── en/             # English translations
│   └── es/             # Spanish translations
├── pages/               # Page components (routes)
│   ├── public/         # Public pages (landing, login)
│   ├── cases/          # Case pages
│   ├── clients/        # Client pages
│   ├── dashboard/      # Dashboard
│   ├── tasks/          # Task pages
│   ├── calendar/       # Calendar
│   ├── timeTracking/   # Time tracking
│   └── settings/       # Settings & user management
├── services/            # Business logic & storage
├── test/                # Test utilities
├── theme/               # Material-UI theme
├── types/               # TypeScript types
└── utils/               # Utility functions
```

## Component Architecture

### Layers

```
┌─────────────────────────────────────────────┐
│                   Pages                      │
│         (Route-level components)             │
├─────────────────────────────────────────────┤
│              Feature Components              │
│      (Feature-specific UI components)        │
├─────────────────────────────────────────────┤
│              Common Components               │
│         (Reusable UI components)             │
├─────────────────────────────────────────────┤
│                Custom Hooks                  │
│    (Data access, filtering, permissions)     │
├─────────────────────────────────────────────┤
│                  Contexts                    │
│         (Global state management)            │
├─────────────────────────────────────────────┤
│                  Services                    │
│        (Storage, business logic)             │
└─────────────────────────────────────────────┘
```

### Component Types

| Type | Location | Purpose |
|------|----------|---------|
| Pages | `src/pages/` | Route endpoints, page layout |
| Feature Components | `src/components/features/` | Feature-specific reusable components |
| Common Components | `src/components/common/` | Generic reusable components |
| Layout Components | `src/components/layout/` | Application layout structure |

## State Management

### Context Architecture

```
┌─────────────────────────────────────────────┐
│                    App                       │
├─────────────────────────────────────────────┤
│               AuthProvider                   │
│    (user, isAuthenticated, login, logout)    │
├─────────────────────────────────────────────┤
│                AppProvider                   │
│  (cases, clients, tasks, timeEntries, etc.)  │
├─────────────────────────────────────────────┤
│              Route Components                │
└─────────────────────────────────────────────┘
```

### AuthContext

Manages user authentication state:

```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  register: (data: RegisterData) => Promise<boolean>;
  updateUser: (data: Partial<User>) => void;
}
```

### AppContext

Manages application data using useReducer pattern:

```typescript
interface AppState {
  cases: Case[];
  clients: Client[];
  tasks: Task[];
  timeEntries: TimeEntry[];
  activities: Activity[];
  notes: Note[];
  notifications: Notification[];
  isLoading: boolean;
}
```

Actions include: `ADD_CASE`, `UPDATE_CASE`, `DELETE_CASE`, `SET_CASES`, etc.

## Data Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Component   │────▶│    Hook      │────▶│   Context    │
│              │◀────│              │◀────│              │
└──────────────┘     └──────────────┘     └──────────────┘
                                                 │
                                                 ▼
                                          ┌──────────────┐
                                          │  Reducer     │
                                          └──────────────┘
                                                 │
                                                 ▼
                                          ┌──────────────┐
                                          │ localStorage │
                                          └──────────────┘
```

1. **Component** calls hook method (e.g., `addCase`)
2. **Hook** may apply permission checks, then calls context method
3. **Context** dispatches action to reducer
4. **Reducer** updates state
5. **useEffect** persists state to localStorage

## Routing Structure

```
/                          # Landing page (public)
/login                     # Login page (public)
/register                  # Registration page (public)
/app                       # Protected application routes
  /dashboard               # Main dashboard
  /cases                   # Case list
    /new                   # New case form
    /:id                   # Case detail
    /:id/edit              # Edit case form
  /clients                 # Client list
    /new                   # New client form
    /:id                   # Client detail
    /:id/edit              # Edit client form
  /tasks                   # Task list
  /calendar                # Calendar view
  /time-tracking           # Time tracking
  /settings                # Settings (admin only)
    /users                 # User management (admin only)
```

## Route Protection

### Guards

| Guard | Purpose |
|-------|---------|
| `AuthGuard` | Requires user to be authenticated |
| `RoleGuard` | Requires specific role(s) |

### Usage

```tsx
<Route element={<AuthGuard />}>
  <Route element={<RoleGuard allowedRoles={['admin']} />}>
    <Route path="settings" element={<SettingsPage />} />
  </Route>
</Route>
```

## Hooks Pattern

Custom hooks encapsulate data access with filtering and permissions:

```typescript
// Example: useCases hook
function useCases(filters?: CaseFilters) {
  const { cases, addCase, updateCase } = useApp();
  const { user, canViewAllCases } = useAuth();

  const visibleCases = useMemo(() => {
    // Apply permission-based filtering
    // Apply user filters
    // Sort by date
  }, [cases, user, canViewAllCases, filters]);

  return {
    cases: visibleCases,
    addCase,
    updateCase,
    // ...
  };
}
```

## Theme Configuration

Material-UI theme defined in `src/theme/index.ts`:

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | #1976d2 | Main actions, links |
| Secondary | #dc004e | Accents |
| Success | #4caf50 | Success states |
| Warning | #ff9800 | Warnings |
| Error | #f44336 | Errors, destructive actions |

## Internationalization

### Structure

```
src/locales/
├── en/
│   ├── common.json
│   ├── auth.json
│   ├── dashboard.json
│   ├── cases.json
│   ├── clients.json
│   ├── tasks.json
│   ├── calendar.json
│   ├── timeTracking.json
│   └── settings.json
└── es/
    └── (same structure)
```

### Usage

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation('cases');
  return <h1>{t('title')}</h1>;
}
```

## Error Handling

### ErrorBoundary

Wraps the application to catch React errors:

```tsx
<ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</ErrorBoundary>
```

### Storage Errors

Storage service includes try-catch for localStorage operations with console logging.

### User Feedback

notistack provides toast notifications for user feedback on operations.
