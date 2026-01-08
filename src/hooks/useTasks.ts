import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from './useAuth';
import { Task, TaskStatus, Priority } from '../types';
import { isOverdue, isDueSoon } from '../utils/dateFormatters';
import { PERMISSIONS } from '../constants/permissions';

interface TaskFilters {
  status?: TaskStatus;
  priority?: Priority;
  caseId?: string;
  assignedTo?: string;
  overdueOnly?: boolean;
  dueSoonOnly?: boolean;
}

export function useTasks(filters?: TaskFilters) {
  const { tasks, addTask, updateTask, deleteTask, completeTask } = useApp();
  const { user, hasPermission } = useAuth();
  const canViewAll = hasPermission(PERMISSIONS.TASKS_VIEW_ALL);

  const visibleTasks = useMemo(() => {
    if (!user) return [];

    let filtered = tasks;

    if (!canViewAll) {
      filtered = filtered.filter(t => t.assignedTo === user.id);
    }

    if (filters?.status) {
      filtered = filtered.filter(t => t.status === filters.status);
    }

    if (filters?.priority) {
      filtered = filtered.filter(t => t.priority === filters.priority);
    }

    if (filters?.caseId) {
      filtered = filtered.filter(t => t.caseId === filters.caseId);
    }

    if (filters?.assignedTo) {
      filtered = filtered.filter(t => t.assignedTo === filters.assignedTo);
    }

    if (filters?.overdueOnly) {
      filtered = filtered.filter(t =>
        t.status !== 'completed' && t.status !== 'cancelled' && isOverdue(t.deadline)
      );
    }

    if (filters?.dueSoonOnly) {
      filtered = filtered.filter(t =>
        t.status !== 'completed' && t.status !== 'cancelled' && isDueSoon(t.deadline, 7)
      );
    }

    return [...filtered].sort((a, b) => {
      if (a.deadline && b.deadline) {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (a.deadline) return -1;
      if (b.deadline) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tasks, user, canViewAll, filters]);

  const pendingTasks = useMemo(() => {
    return visibleTasks.filter(t => t.status === 'pending');
  }, [visibleTasks]);

  const inProgressTasks = useMemo(() => {
    return visibleTasks.filter(t => t.status === 'in_progress');
  }, [visibleTasks]);

  const completedTasks = useMemo(() => {
    return visibleTasks.filter(t => t.status === 'completed');
  }, [visibleTasks]);

  const overdueTasks = useMemo(() => {
    return visibleTasks.filter(t =>
      t.status !== 'completed' && t.status !== 'cancelled' && isOverdue(t.deadline)
    );
  }, [visibleTasks]);

  const tasksByCase = (caseId: string): Task[] => {
    return tasks.filter(t => t.caseId === caseId);
  };

  const getTaskById = (id: string): Task | undefined => {
    return tasks.find(t => t.id === id);
  };

  return {
    tasks: visibleTasks,
    allTasks: tasks,
    pendingTasks,
    inProgressTasks,
    completedTasks,
    overdueTasks,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    tasksByCase,
    getTaskById,
  };
}

export default useTasks;
