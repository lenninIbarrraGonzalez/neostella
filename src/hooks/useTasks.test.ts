import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTasks } from './useTasks';
import { Task } from '../types';
import { PERMISSIONS } from '../constants/permissions';

// Fixed date for tests
const FIXED_DATE = new Date(2024, 5, 15, 10, 0, 0); // June 15, 2024

const mockTasks: Task[] = [
  {
    id: 'task-1',
    caseId: 'case-1',
    title: 'Urgent Task',
    description: 'Description 1',
    status: 'pending',
    priority: 'high',
    deadline: new Date(2024, 5, 10), // Past - overdue
    assignedTo: 'user-1',
    completedAt: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'task-2',
    caseId: 'case-1',
    title: 'Due Soon Task',
    description: 'Description 2',
    status: 'in_progress',
    priority: 'medium',
    deadline: new Date(2024, 5, 18), // 3 days from now - due soon
    assignedTo: 'user-2',
    completedAt: null,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: 'task-3',
    caseId: 'case-2',
    title: 'Completed Task',
    description: 'Description 3',
    status: 'completed',
    priority: 'low',
    deadline: new Date(2024, 5, 20),
    assignedTo: 'user-1',
    completedAt: new Date('2024-06-12'),
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
  {
    id: 'task-4',
    caseId: 'case-2',
    title: 'Future Task',
    description: 'Description 4',
    status: 'pending',
    priority: 'high',
    deadline: new Date(2024, 5, 30), // Far future
    assignedTo: 'user-1',
    completedAt: null,
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04'),
  },
  {
    id: 'task-5',
    caseId: 'case-1',
    title: 'No Deadline Task',
    description: 'Description 5',
    status: 'pending',
    priority: 'low',
    deadline: null as any,
    assignedTo: 'user-2',
    completedAt: null,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
];

const mockAppContext = {
  tasks: mockTasks,
  addTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
  completeTask: vi.fn(),
};

let mockHasPermission = vi.fn();

let mockAuthContext = {
  user: { id: 'user-1', role: 'admin' },
  hasPermission: mockHasPermission,
};

vi.mock('../contexts/AppContext', () => ({
  useApp: () => mockAppContext,
}));

vi.mock('./useAuth', () => ({
  useAuth: () => mockAuthContext,
}));

describe('useTasks hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_DATE);
    mockHasPermission = vi.fn().mockImplementation((perm) => {
      return perm === PERMISSIONS.TASKS_VIEW_ALL;
    });
    mockAuthContext = {
      user: { id: 'user-1', role: 'admin' },
      hasPermission: mockHasPermission,
    };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('with admin user (canViewAll)', () => {
    it('should return all tasks', () => {
      const { result } = renderHook(() => useTasks());

      expect(result.current.tasks).toHaveLength(5);
      expect(result.current.allTasks).toHaveLength(5);
    });

    it('should sort tasks by deadline (earliest first)', () => {
      const { result } = renderHook(() => useTasks());

      // Tasks with deadlines should come before those without
      const tasksWithDeadlines = result.current.tasks.filter(t => t.deadline);
      for (let i = 1; i < tasksWithDeadlines.length; i++) {
        const prev = new Date(tasksWithDeadlines[i - 1].deadline!).getTime();
        const curr = new Date(tasksWithDeadlines[i].deadline!).getTime();
        expect(prev).toBeLessThanOrEqual(curr);
      }
    });

    it('should put tasks without deadlines at the end', () => {
      const { result } = renderHook(() => useTasks());

      const noDeadlineTask = result.current.tasks.find(t => !t.deadline);
      const index = result.current.tasks.indexOf(noDeadlineTask!);
      expect(index).toBe(result.current.tasks.length - 1);
    });
  });

  describe('with non-admin user (limited view)', () => {
    beforeEach(() => {
      mockHasPermission = vi.fn().mockReturnValue(false);
      mockAuthContext = {
        user: { id: 'user-1', role: 'attorney' },
        hasPermission: mockHasPermission,
      };
    });

    it('should only return assigned tasks', () => {
      const { result } = renderHook(() => useTasks());

      expect(result.current.tasks.every(t => t.assignedTo === 'user-1')).toBe(true);
    });
  });

  describe('with no user', () => {
    it('should return empty array when user is null', () => {
      mockAuthContext = {
        user: null as any,
        hasPermission: mockHasPermission,
      };

      const { result } = renderHook(() => useTasks());

      expect(result.current.tasks).toHaveLength(0);
    });
  });

  describe('filtering', () => {
    it('should filter by status', () => {
      const { result } = renderHook(() => useTasks({ status: 'pending' }));

      expect(result.current.tasks.every(t => t.status === 'pending')).toBe(true);
    });

    it('should filter by priority', () => {
      const { result } = renderHook(() => useTasks({ priority: 'high' }));

      expect(result.current.tasks.every(t => t.priority === 'high')).toBe(true);
    });

    it('should filter by caseId', () => {
      const { result } = renderHook(() => useTasks({ caseId: 'case-1' }));

      expect(result.current.tasks.every(t => t.caseId === 'case-1')).toBe(true);
    });

    it('should filter by assignedTo', () => {
      const { result } = renderHook(() => useTasks({ assignedTo: 'user-2' }));

      expect(result.current.tasks.every(t => t.assignedTo === 'user-2')).toBe(true);
    });

    it('should filter overdueOnly', () => {
      const { result } = renderHook(() => useTasks({ overdueOnly: true }));

      expect(result.current.tasks).toHaveLength(1);
      expect(result.current.tasks[0].id).toBe('task-1');
    });

    it('should filter dueSoonOnly (within 7 days)', () => {
      const { result } = renderHook(() => useTasks({ dueSoonOnly: true }));

      // task-2 is due in 3 days, task-4 is due in 15 days
      expect(result.current.tasks.length).toBeGreaterThan(0);
      expect(result.current.tasks.every(t => t.status !== 'completed')).toBe(true);
    });

    it('should exclude completed tasks from overdueOnly', () => {
      const { result } = renderHook(() => useTasks({ overdueOnly: true }));

      expect(result.current.tasks.every(t => t.status !== 'completed')).toBe(true);
    });

    it('should exclude cancelled tasks from dueSoonOnly', () => {
      const taskWithCancelled = [...mockTasks, {
        ...mockTasks[0],
        id: 'task-cancelled',
        status: 'cancelled' as const,
      }];
      mockAppContext.tasks = taskWithCancelled;

      const { result } = renderHook(() => useTasks({ dueSoonOnly: true }));

      expect(result.current.tasks.every(t => t.status !== 'cancelled')).toBe(true);

      // Reset
      mockAppContext.tasks = mockTasks;
    });
  });

  describe('computed properties', () => {
    it('should return pending tasks', () => {
      const { result } = renderHook(() => useTasks());

      expect(result.current.pendingTasks.every(t => t.status === 'pending')).toBe(true);
    });

    it('should return in progress tasks', () => {
      const { result } = renderHook(() => useTasks());

      expect(result.current.inProgressTasks.every(t => t.status === 'in_progress')).toBe(true);
    });

    it('should return completed tasks', () => {
      const { result } = renderHook(() => useTasks());

      expect(result.current.completedTasks.every(t => t.status === 'completed')).toBe(true);
    });

    it('should return overdue tasks', () => {
      const { result } = renderHook(() => useTasks());

      expect(result.current.overdueTasks).toHaveLength(1);
      expect(result.current.overdueTasks[0].id).toBe('task-1');
    });
  });

  describe('tasksByCase', () => {
    it('should return tasks for a specific case', () => {
      const { result } = renderHook(() => useTasks());

      const case1Tasks = result.current.tasksByCase('case-1');
      expect(case1Tasks).toHaveLength(3);
      expect(case1Tasks.every(t => t.caseId === 'case-1')).toBe(true);
    });

    it('should return empty array for non-existent case', () => {
      const { result } = renderHook(() => useTasks());

      const tasks = result.current.tasksByCase('non-existent');
      expect(tasks).toHaveLength(0);
    });
  });

  describe('getTaskById', () => {
    it('should return task by id', () => {
      const { result } = renderHook(() => useTasks());

      const task = result.current.getTaskById('task-2');
      expect(task).toBeDefined();
      expect(task?.id).toBe('task-2');
    });

    it('should return undefined for non-existent id', () => {
      const { result } = renderHook(() => useTasks());

      const task = result.current.getTaskById('non-existent');
      expect(task).toBeUndefined();
    });
  });

  describe('exposed functions', () => {
    it('should expose addTask from context', () => {
      const { result } = renderHook(() => useTasks());

      expect(result.current.addTask).toBe(mockAppContext.addTask);
    });

    it('should expose updateTask from context', () => {
      const { result } = renderHook(() => useTasks());

      expect(result.current.updateTask).toBe(mockAppContext.updateTask);
    });

    it('should expose deleteTask from context', () => {
      const { result } = renderHook(() => useTasks());

      expect(result.current.deleteTask).toBe(mockAppContext.deleteTask);
    });

    it('should expose completeTask from context', () => {
      const { result } = renderHook(() => useTasks());

      expect(result.current.completeTask).toBe(mockAppContext.completeTask);
    });
  });
});
