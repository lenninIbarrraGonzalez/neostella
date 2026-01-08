import { vi } from 'vitest';
import { User, Case, Client, Task, TimeEntry, Activity, Note } from '../../types';

// Mock admin user
export const mockAdminUser: User = {
  id: 'user-admin-1',
  email: 'admin@test.com',
  password: 'password123',
  name: 'Admin User',
  role: 'admin',
  preferences: { language: 'en', theme: 'light' },
  isActive: true,
  createdAt: new Date('2024-01-01'),
};

// Mock attorney user
export const mockAttorneyUser: User = {
  id: 'user-attorney-1',
  email: 'attorney@test.com',
  password: 'password123',
  name: 'Attorney User',
  role: 'attorney',
  preferences: { language: 'en', theme: 'light' },
  isActive: true,
  createdAt: new Date('2024-01-01'),
};

// Mock paralegal user
export const mockParalegalUser: User = {
  id: 'user-paralegal-1',
  email: 'paralegal@test.com',
  password: 'password123',
  name: 'Paralegal User',
  role: 'paralegal',
  preferences: { language: 'en', theme: 'light' },
  isActive: true,
  createdAt: new Date('2024-01-01'),
};

// Mock inactive user
export const mockInactiveUser: User = {
  id: 'user-inactive-1',
  email: 'inactive@test.com',
  password: 'password123',
  name: 'Inactive User',
  role: 'paralegal',
  preferences: { language: 'en', theme: 'light' },
  isActive: false,
  createdAt: new Date('2024-01-01'),
};

// Mock case
export const mockCase: Case = {
  id: 'case-1',
  caseNumber: 'CASE-2024-001',
  title: 'Test Case',
  description: 'Test case description',
  clientId: 'client-1',
  type: 'personal_injury',
  status: 'new',
  priority: 'medium',
  assignedTo: ['user-attorney-1'],
  deadline: new Date('2024-12-31'),
  createdBy: 'user-admin-1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

// Mock case assigned to admin
export const mockCaseAssignedToAdmin: Case = {
  ...mockCase,
  id: 'case-2',
  caseNumber: 'CASE-2024-002',
  title: 'Admin Assigned Case',
  assignedTo: ['user-admin-1'],
};

// Mock case with multiple assignees
export const mockCaseMultipleAssignees: Case = {
  ...mockCase,
  id: 'case-3',
  caseNumber: 'CASE-2024-003',
  title: 'Multiple Assignees Case',
  assignedTo: ['user-attorney-1', 'user-paralegal-1'],
};

// Mock client
export const mockClient: Client = {
  id: 'client-1',
  name: 'Test Client',
  email: 'client@test.com',
  phone: '1234567890',
  address: '123 Test Street',
  type: 'individual',
  notes: 'Test notes',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

// Mock business client
export const mockBusinessClient: Client = {
  id: 'client-2',
  name: 'Test Business',
  email: 'business@test.com',
  phone: '0987654321',
  address: '456 Business Ave',
  type: 'business',
  notes: 'Business client notes',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

// Mock task
export const mockTask: Task = {
  id: 'task-1',
  caseId: 'case-1',
  title: 'Test Task',
  description: 'Test task description',
  status: 'pending',
  priority: 'high',
  assignedTo: 'user-attorney-1',
  deadline: new Date('2024-06-30'),
  completedAt: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

// Mock completed task
export const mockCompletedTask: Task = {
  ...mockTask,
  id: 'task-2',
  title: 'Completed Task',
  status: 'completed',
  completedAt: new Date('2024-03-15'),
};

// Mock overdue task
export const mockOverdueTask: Task = {
  ...mockTask,
  id: 'task-3',
  title: 'Overdue Task',
  deadline: new Date('2024-01-01'),
};

// Mock time entry
export const mockTimeEntry: TimeEntry = {
  id: 'time-1',
  caseId: 'case-1',
  userId: 'user-attorney-1',
  description: 'Research work',
  duration: 120,
  date: new Date('2024-01-15'),
  billable: true,
  createdAt: new Date('2024-01-15'),
};

// Mock non-billable time entry
export const mockNonBillableTimeEntry: TimeEntry = {
  id: 'time-2',
  caseId: 'case-1',
  userId: 'user-attorney-1',
  description: 'Internal meeting',
  duration: 60,
  date: new Date('2024-01-15'),
  billable: false,
  createdAt: new Date('2024-01-15'),
};

// Mock activity
export const mockActivity: Activity = {
  id: 'activity-1',
  caseId: 'case-1',
  userId: 'user-attorney-1',
  action: 'created',
  details: 'Case created',
  timestamp: new Date('2024-01-01'),
};

// Mock note
export const mockNote: Note = {
  id: 'note-1',
  caseId: 'case-1',
  userId: 'user-attorney-1',
  content: 'Test note content',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

// Factory functions
export const createMockCases = (count: number): Case[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...mockCase,
    id: `case-${i + 1}`,
    caseNumber: `CASE-2024-${String(i + 1).padStart(3, '0')}`,
    title: `Test Case ${i + 1}`,
  }));
};

export const createMockTasks = (count: number, caseId = 'case-1'): Task[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...mockTask,
    id: `task-${i + 1}`,
    caseId,
    title: `Test Task ${i + 1}`,
  }));
};

export const createMockClients = (count: number): Client[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...mockClient,
    id: `client-${i + 1}`,
    name: `Test Client ${i + 1}`,
    email: `client${i + 1}@test.com`,
  }));
};

export const createMockTimeEntries = (count: number, userId = 'user-attorney-1'): TimeEntry[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...mockTimeEntry,
    id: `time-${i + 1}`,
    userId,
    duration: 30 * (i + 1),
    date: new Date(`2024-01-${String(i + 1).padStart(2, '0')}`),
  }));
};

// Mock i18n translation function
export const mockT = vi.fn((key: string) => key);

// Mock useNavigate
export const mockNavigate = vi.fn();

// Mock useLocation
export const mockLocation = {
  pathname: '/app/dashboard',
  search: '',
  hash: '',
  state: null,
  key: 'default',
};
