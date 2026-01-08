import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTimeTracking } from './useTimeTracking';
import { TimeEntry } from '../types';
import { PERMISSIONS } from '../constants/permissions';

// Fixed date for tests - June 15, 2024 (Saturday)
const FIXED_DATE = new Date(2024, 5, 15, 14, 0, 0);

const mockTimeEntries: TimeEntry[] = [
  {
    id: 'time-1',
    caseId: 'case-1',
    userId: 'user-1',
    description: 'Research',
    duration: 60, // 1 hour
    date: new Date(2024, 5, 15), // Today
    billable: true,
    createdAt: new Date(),
  },
  {
    id: 'time-2',
    caseId: 'case-1',
    userId: 'user-1',
    description: 'Documentation',
    duration: 30, // 30 min
    date: new Date(2024, 5, 14), // Yesterday
    billable: false,
    createdAt: new Date(),
  },
  {
    id: 'time-3',
    caseId: 'case-2',
    userId: 'user-2',
    description: 'Client meeting',
    duration: 90, // 1.5 hours
    date: new Date(2024, 5, 12), // This week (Wed)
    billable: true,
    createdAt: new Date(),
  },
  {
    id: 'time-4',
    caseId: 'case-1',
    userId: 'user-1',
    description: 'Court preparation',
    duration: 120, // 2 hours
    date: new Date(2024, 5, 1), // This month but earlier
    billable: true,
    createdAt: new Date(),
  },
  {
    id: 'time-5',
    caseId: 'case-2',
    userId: 'user-2',
    description: 'Old entry',
    duration: 45,
    date: new Date(2024, 4, 15), // Last month
    billable: false,
    createdAt: new Date(),
  },
];

const mockAppContext = {
  timeEntries: mockTimeEntries,
  addTimeEntry: vi.fn(),
  deleteTimeEntry: vi.fn(),
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

describe('useTimeTracking hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_DATE);
    mockHasPermission = vi.fn().mockImplementation((perm) => {
      return perm === PERMISSIONS.TIME_ENTRIES_VIEW_ALL;
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
    it('should return all time entries', () => {
      const { result } = renderHook(() => useTimeTracking());

      expect(result.current.timeEntries).toHaveLength(5);
      expect(result.current.allTimeEntries).toHaveLength(5);
    });

    it('should sort entries by date descending', () => {
      const { result } = renderHook(() => useTimeTracking());

      for (let i = 1; i < result.current.timeEntries.length; i++) {
        const prev = new Date(result.current.timeEntries[i - 1].date).getTime();
        const curr = new Date(result.current.timeEntries[i].date).getTime();
        expect(prev).toBeGreaterThanOrEqual(curr);
      }
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

    it('should only return own time entries', () => {
      const { result } = renderHook(() => useTimeTracking());

      expect(result.current.timeEntries.every(e => e.userId === 'user-1')).toBe(true);
    });
  });

  describe('with no user', () => {
    it('should return empty array when user is null', () => {
      mockAuthContext = {
        user: null as any,
        hasPermission: mockHasPermission,
      };

      const { result } = renderHook(() => useTimeTracking());

      expect(result.current.timeEntries).toHaveLength(0);
    });
  });

  describe('filtering', () => {
    it('should filter by caseId', () => {
      const { result } = renderHook(() => useTimeTracking({ caseId: 'case-1' }));

      expect(result.current.timeEntries.every(e => e.caseId === 'case-1')).toBe(true);
    });

    it('should filter by userId', () => {
      const { result } = renderHook(() => useTimeTracking({ userId: 'user-2' }));

      expect(result.current.timeEntries.every(e => e.userId === 'user-2')).toBe(true);
    });

    it('should filter billable only', () => {
      const { result } = renderHook(() => useTimeTracking({ billableOnly: true }));

      expect(result.current.timeEntries.every(e => e.billable === true)).toBe(true);
    });

    it('should filter non-billable only', () => {
      const { result } = renderHook(() => useTimeTracking({ billableOnly: false }));

      expect(result.current.timeEntries.every(e => e.billable === false)).toBe(true);
    });

    it('should filter by startDate', () => {
      const startDate = new Date(2024, 5, 10);
      const { result } = renderHook(() => useTimeTracking({ startDate }));

      expect(result.current.timeEntries.every(e => new Date(e.date) >= startDate)).toBe(true);
    });

    it('should filter by endDate', () => {
      const endDate = new Date(2024, 5, 14);
      const { result } = renderHook(() => useTimeTracking({ endDate }));

      // Entries on or before endDate
      expect(result.current.timeEntries.every(e => new Date(e.date) <= endDate)).toBe(true);
    });

    it('should filter by date range', () => {
      const startDate = new Date(2024, 5, 10);
      const endDate = new Date(2024, 5, 14);
      const { result } = renderHook(() => useTimeTracking({ startDate, endDate }));

      result.current.timeEntries.forEach(e => {
        const entryDate = new Date(e.date);
        expect(entryDate >= startDate && entryDate <= endDate).toBe(true);
      });
    });
  });

  describe('computed totals', () => {
    it('should calculate totalMinutes', () => {
      const { result } = renderHook(() => useTimeTracking());

      const expectedTotal = mockTimeEntries.reduce((sum, e) => sum + e.duration, 0);
      expect(result.current.totalMinutes).toBe(expectedTotal);
    });

    it('should calculate billableMinutes', () => {
      const { result } = renderHook(() => useTimeTracking());

      const expectedBillable = mockTimeEntries
        .filter(e => e.billable)
        .reduce((sum, e) => sum + e.duration, 0);
      expect(result.current.billableMinutes).toBe(expectedBillable);
    });

    it('should calculate todayMinutes', () => {
      const { result } = renderHook(() => useTimeTracking());

      // Only time-1 is from today (June 15)
      expect(result.current.todayMinutes).toBe(60);
    });

    it('should calculate thisWeekMinutes', () => {
      const { result } = renderHook(() => useTimeTracking());

      // Week starts Monday June 10, includes entries from June 12, 14, 15
      // time-1 (60) + time-2 (30) + time-3 (90) = 180
      expect(result.current.thisWeekMinutes).toBe(180);
    });

    it('should calculate thisMonthMinutes', () => {
      const { result } = renderHook(() => useTimeTracking());

      // June: time-1 (60) + time-2 (30) + time-3 (90) + time-4 (120) = 300
      expect(result.current.thisMonthMinutes).toBe(300);
    });
  });

  describe('entriesByCase', () => {
    it('should return entries for specific case', () => {
      const { result } = renderHook(() => useTimeTracking());

      const entries = result.current.entriesByCase('case-1');
      expect(entries).toHaveLength(3);
      expect(entries.every(e => e.caseId === 'case-1')).toBe(true);
    });

    it('should return empty array for case with no entries', () => {
      const { result } = renderHook(() => useTimeTracking());

      const entries = result.current.entriesByCase('case-3');
      expect(entries).toHaveLength(0);
    });
  });

  describe('totalMinutesByCase', () => {
    it('should calculate total minutes for specific case', () => {
      const { result } = renderHook(() => useTimeTracking());

      const total = result.current.totalMinutesByCase('case-1');
      expect(total).toBe(210); // 60 + 30 + 120
    });

    it('should return 0 for case with no entries', () => {
      const { result } = renderHook(() => useTimeTracking());

      const total = result.current.totalMinutesByCase('case-3');
      expect(total).toBe(0);
    });
  });

  describe('exposed functions', () => {
    it('should expose addTimeEntry from context', () => {
      const { result } = renderHook(() => useTimeTracking());

      expect(result.current.addTimeEntry).toBe(mockAppContext.addTimeEntry);
    });

    it('should expose deleteTimeEntry from context', () => {
      const { result } = renderHook(() => useTimeTracking());

      expect(result.current.deleteTimeEntry).toBe(mockAppContext.deleteTimeEntry);
    });
  });
});
