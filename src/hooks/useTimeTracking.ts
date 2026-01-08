import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from './useAuth';
import { TimeEntry } from '../types';
import { startOfDay, startOfWeek, startOfMonth, isAfter } from 'date-fns';
import { PERMISSIONS } from '../constants/permissions';

interface TimeFilters {
  caseId?: string;
  userId?: string;
  billableOnly?: boolean;
  startDate?: Date;
  endDate?: Date;
}

export function useTimeTracking(filters?: TimeFilters) {
  const { timeEntries, addTimeEntry, deleteTimeEntry } = useApp();
  const { user, hasPermission } = useAuth();
  const canViewAll = hasPermission(PERMISSIONS.TIME_ENTRIES_VIEW_ALL);

  const visibleEntries = useMemo(() => {
    if (!user) return [];

    let filtered = timeEntries;

    if (!canViewAll) {
      filtered = filtered.filter(e => e.userId === user.id);
    }

    if (filters?.caseId) {
      filtered = filtered.filter(e => e.caseId === filters.caseId);
    }

    if (filters?.userId) {
      filtered = filtered.filter(e => e.userId === filters.userId);
    }

    if (filters?.billableOnly !== undefined) {
      filtered = filtered.filter(e => e.billable === filters.billableOnly);
    }

    if (filters?.startDate) {
      filtered = filtered.filter(e => isAfter(new Date(e.date), filters.startDate!));
    }

    if (filters?.endDate) {
      filtered = filtered.filter(e => !isAfter(new Date(e.date), filters.endDate!));
    }

    return [...filtered].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [timeEntries, user, canViewAll, filters]);

  const totalMinutes = useMemo(() => {
    return visibleEntries.reduce((sum, e) => sum + e.duration, 0);
  }, [visibleEntries]);

  const billableMinutes = useMemo(() => {
    return visibleEntries.filter(e => e.billable).reduce((sum, e) => sum + e.duration, 0);
  }, [visibleEntries]);

  const todayMinutes = useMemo(() => {
    const today = startOfDay(new Date());
    return visibleEntries
      .filter(e => isAfter(new Date(e.date), today) || startOfDay(new Date(e.date)).getTime() === today.getTime())
      .reduce((sum, e) => sum + e.duration, 0);
  }, [visibleEntries]);

  const thisWeekMinutes = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    return visibleEntries
      .filter(e => isAfter(new Date(e.date), weekStart) || new Date(e.date).getTime() >= weekStart.getTime())
      .reduce((sum, e) => sum + e.duration, 0);
  }, [visibleEntries]);

  const thisMonthMinutes = useMemo(() => {
    const monthStart = startOfMonth(new Date());
    return visibleEntries
      .filter(e => isAfter(new Date(e.date), monthStart) || new Date(e.date).getTime() >= monthStart.getTime())
      .reduce((sum, e) => sum + e.duration, 0);
  }, [visibleEntries]);

  const entriesByCase = (caseId: string): TimeEntry[] => {
    return timeEntries.filter(e => e.caseId === caseId);
  };

  const totalMinutesByCase = (caseId: string): number => {
    return entriesByCase(caseId).reduce((sum, e) => sum + e.duration, 0);
  };

  return {
    timeEntries: visibleEntries,
    allTimeEntries: timeEntries,
    addTimeEntry,
    deleteTimeEntry,
    totalMinutes,
    billableMinutes,
    todayMinutes,
    thisWeekMinutes,
    thisMonthMinutes,
    entriesByCase,
    totalMinutesByCase,
  };
}

export default useTimeTracking;
