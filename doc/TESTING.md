# Testing Guide

## Overview

The project uses **Vitest** with **React Testing Library** for unit and integration testing. Tests are colocated with source files using the `.test.ts` or `.test.tsx` extension.

## Test Commands

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI dashboard
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npx vitest run src/hooks/useCases.test.ts

# Run tests matching a pattern
npx vitest run --testNamePattern="should filter"
```

## Coverage Requirements

The project enforces minimum coverage thresholds:

| Metric | Threshold |
|--------|-----------|
| Statements | 90% |
| Branches | 85% |
| Functions | 90% |
| Lines | 90% |

Coverage reports are generated in the `./coverage` directory.

## Test Structure

```
src/
├── components/
│   └── common/
│       ├── StatusChip.tsx
│       └── StatusChip.test.tsx      # Component test
├── hooks/
│   ├── useCases.ts
│   └── useCases.test.ts             # Hook test
├── contexts/
│   ├── AuthContext.tsx
│   └── AuthContext.test.tsx         # Context test
├── utils/
│   ├── validators.ts
│   └── validators.test.ts           # Utility test
└── test/
    ├── setup.ts                     # Global test setup
    ├── test-utils.tsx               # Custom render functions
    └── mocks/
        └── index.ts                 # Mock data factories
```

## Test Setup

### Global Setup (`src/test/setup.ts`)

Configures global mocks required for tests:

```typescript
// localStorage mock
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// matchMedia mock (required for Material-UI)
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    // ...
  })),
});

// ResizeObserver mock
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
```

### Custom Render (`src/test/test-utils.tsx`)

Provides render functions with required providers:

```typescript
// Full application providers
function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <SnackbarProvider>
          <MemoryRouter>
            <AuthProvider>
              <AppProvider>
                {children}
              </AppProvider>
            </AuthProvider>
          </MemoryRouter>
        </SnackbarProvider>
      </I18nextProvider>
    </ThemeProvider>
  );
}

// Custom render with all providers
function renderWithProviders(ui: React.ReactElement) {
  return render(ui, { wrapper: AllProviders });
}
```

### Mock Data (`src/test/mocks/index.ts`)

Provides mock data factories:

```typescript
export const mockAdminUser: User = {
  id: 'user-admin-1',
  email: 'admin@test.com',
  name: 'Admin User',
  role: 'admin',
  isActive: true,
};

export const mockCase: Case = {
  id: 'case-1',
  caseNumber: 'CASE-2024-001',
  title: 'Test Case',
  // ...
};

export function createMockCases(count: number): Case[] {
  // Factory function
}
```

## Testing Patterns

### Testing Hooks

Use `renderHook` from React Testing Library:

```typescript
import { renderHook } from '@testing-library/react';
import { useCases } from './useCases';

// Mock dependencies
vi.mock('../contexts/AppContext', () => ({
  useApp: () => mockAppContext,
}));

vi.mock('./useAuth', () => ({
  useAuth: () => mockAuthContext,
}));

describe('useCases', () => {
  it('should filter cases by status', () => {
    const { result } = renderHook(() =>
      useCases({ status: 'new' })
    );

    expect(result.current.cases.every(c => c.status === 'new')).toBe(true);
  });
});
```

### Testing Contexts

Test context providers with `renderHook`:

```typescript
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

describe('AuthContext', () => {
  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    let loginResult: boolean;
    await act(async () => {
      loginResult = await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    expect(loginResult).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

### Testing Components

Use `render` and query methods:

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StatusChip } from './StatusChip';

describe('StatusChip', () => {
  it('should render status label', () => {
    render(<StatusChip status="new" type="case" />);

    expect(screen.getByText(/new/i)).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<StatusChip status="new" type="case" onClick={onClick} />);

    await user.click(screen.getByText(/new/i));

    expect(onClick).toHaveBeenCalled();
  });
});
```

### Testing with Dates

Use `vi.useFakeTimers` for date-dependent tests:

```typescript
describe('dateFormatters', () => {
  const FIXED_DATE = new Date(2024, 5, 15, 10, 0, 0);

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_DATE);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return overdue for past dates', () => {
    const pastDate = new Date(2024, 5, 10);
    expect(getDeadlineStatus(pastDate)).toBe('overdue');
  });
});
```

### Mocking Modules

```typescript
// Mock entire module
vi.mock('../services/storage', () => ({
  getStorageItem: vi.fn(),
  setStorageItem: vi.fn(),
  removeStorageItem: vi.fn(),
}));

// Mock specific implementation
vi.mocked(storage.getStorageItem).mockImplementation((key) => {
  if (key === STORAGE_KEYS.USERS) return mockUsers;
  return null;
});
```

## Test Categories

### Unit Tests

Test isolated functions and utilities:

- `src/utils/validators.test.ts`
- `src/utils/formatters.test.ts`
- `src/utils/dateFormatters.test.ts`
- `src/constants/*.test.ts`

### Integration Tests

Test hooks and contexts with their dependencies:

- `src/hooks/*.test.ts`
- `src/contexts/*.test.tsx`

### Component Tests

Test UI components:

- `src/components/common/*.test.tsx`
- `src/guards/*.test.tsx`

## Best Practices

### DO

- Write descriptive test names that explain the expected behavior
- Test edge cases and error conditions
- Use `screen` queries from Testing Library
- Mock external dependencies (localStorage, APIs)
- Clean up mocks in `beforeEach`/`afterEach`

### DON'T

- Test implementation details
- Use hardcoded timeouts (use `waitFor` instead)
- Share state between tests
- Test third-party library internals

## Running Tests in CI

```yaml
# Example GitHub Actions step
- name: Run tests
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```
