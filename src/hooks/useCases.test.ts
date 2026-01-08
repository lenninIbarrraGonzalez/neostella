import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCases } from './useCases';
import { Case } from '../types';

const mockCases: Case[] = [
  {
    id: 'case-1',
    caseNumber: 'CASE-2024-001',
    title: 'Personal Injury Case',
    description: 'Description 1',
    type: 'personal_injury',
    status: 'new',
    priority: 'high',
    clientId: 'client-1',
    assignedTo: ['user-1'],
    deadline: new Date('2024-06-01'),
    createdBy: 'user-1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'case-2',
    caseNumber: 'CASE-2024-002',
    title: 'Auto Accident Case',
    description: 'Description 2',
    type: 'auto_accident',
    status: 'in_progress',
    priority: 'medium',
    clientId: 'client-2',
    assignedTo: ['user-2'],
    deadline: new Date('2024-07-01'),
    createdBy: 'user-1',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'case-3',
    caseNumber: 'CASE-2024-003',
    title: 'Immigration Case',
    description: 'Immigration description',
    type: 'immigration_visa',
    status: 'closed',
    priority: 'low',
    clientId: 'client-1',
    assignedTo: ['user-1', 'user-2'],
    deadline: new Date('2024-05-01'),
    createdBy: 'user-2',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-10'),
  },
];

const mockAppContext = {
  cases: mockCases,
  addCase: vi.fn(),
  updateCase: vi.fn(),
  deleteCase: vi.fn(),
  changeCaseStatus: vi.fn(),
};

let mockAuthContext = {
  user: { id: 'user-1', role: 'admin' },
  canViewAllCases: true,
};

vi.mock('../contexts/AppContext', () => ({
  useApp: () => mockAppContext,
}));

vi.mock('./useAuth', () => ({
  useAuth: () => mockAuthContext,
}));

describe('useCases hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthContext = {
      user: { id: 'user-1', role: 'admin' },
      canViewAllCases: true,
    };
  });

  describe('with admin user (canViewAllCases)', () => {
    it('should return all cases', () => {
      const { result } = renderHook(() => useCases());

      expect(result.current.cases).toHaveLength(3);
      expect(result.current.allCases).toHaveLength(3);
    });

    it('should sort cases by updatedAt descending', () => {
      const { result } = renderHook(() => useCases());

      expect(result.current.cases[0].id).toBe('case-2'); // Most recent update
      expect(result.current.cases[2].id).toBe('case-3'); // Oldest update
    });

    it('should return open cases (non-closed)', () => {
      const { result } = renderHook(() => useCases());

      expect(result.current.openCases).toHaveLength(2);
      expect(result.current.openCases.every(c => c.status !== 'closed')).toBe(true);
    });

    it('should return closed cases', () => {
      const { result } = renderHook(() => useCases());

      expect(result.current.closedCases).toHaveLength(1);
      expect(result.current.closedCases[0].status).toBe('closed');
    });

    it('should group cases by status', () => {
      const { result } = renderHook(() => useCases());

      expect(result.current.casesByStatus.new).toHaveLength(1);
      expect(result.current.casesByStatus.in_progress).toHaveLength(1);
      expect(result.current.casesByStatus.closed).toHaveLength(1);
      expect(result.current.casesByStatus.under_review).toHaveLength(0);
    });
  });

  describe('with non-admin user (limited view)', () => {
    beforeEach(() => {
      mockAuthContext = {
        user: { id: 'user-1', role: 'attorney' },
        canViewAllCases: false,
      };
    });

    it('should only return assigned cases', () => {
      const { result } = renderHook(() => useCases());

      expect(result.current.cases).toHaveLength(2);
      expect(result.current.cases.every(c => c.assignedTo.includes('user-1'))).toBe(true);
    });

    it('should include cases where user is one of multiple assignees', () => {
      const { result } = renderHook(() => useCases());

      const case3 = result.current.cases.find(c => c.id === 'case-3');
      expect(case3).toBeDefined();
    });
  });

  describe('with no user', () => {
    it('should return empty array when user is null', () => {
      mockAuthContext = {
        user: null as any,
        canViewAllCases: false,
      };

      const { result } = renderHook(() => useCases());

      expect(result.current.cases).toHaveLength(0);
    });
  });

  describe('filtering', () => {
    it('should filter by status', () => {
      const { result } = renderHook(() => useCases({ status: 'new' }));

      expect(result.current.cases).toHaveLength(1);
      expect(result.current.cases[0].status).toBe('new');
    });

    it('should filter by type', () => {
      const { result } = renderHook(() => useCases({ type: 'personal_injury' }));

      expect(result.current.cases).toHaveLength(1);
      expect(result.current.cases[0].type).toBe('personal_injury');
    });

    it('should filter by assignedTo', () => {
      const { result } = renderHook(() => useCases({ assignedTo: 'user-2' }));

      expect(result.current.cases).toHaveLength(2);
      expect(result.current.cases.every(c => c.assignedTo.includes('user-2'))).toBe(true);
    });

    it('should filter by clientId', () => {
      const { result } = renderHook(() => useCases({ clientId: 'client-1' }));

      expect(result.current.cases).toHaveLength(2);
      expect(result.current.cases.every(c => c.clientId === 'client-1')).toBe(true);
    });

    it('should filter by search term in title', () => {
      const { result } = renderHook(() => useCases({ searchTerm: 'personal' }));

      expect(result.current.cases).toHaveLength(1);
      expect(result.current.cases[0].title).toContain('Personal');
    });

    it('should filter by search term in caseNumber', () => {
      const { result } = renderHook(() => useCases({ searchTerm: '002' }));

      expect(result.current.cases).toHaveLength(1);
      expect(result.current.cases[0].caseNumber).toContain('002');
    });

    it('should filter by search term in description', () => {
      const { result } = renderHook(() => useCases({ searchTerm: 'immigration' }));

      expect(result.current.cases).toHaveLength(1);
      expect(result.current.cases[0].description.toLowerCase()).toContain('immigration');
    });

    it('should combine multiple filters', () => {
      const { result } = renderHook(() =>
        useCases({ status: 'new', clientId: 'client-1' })
      );

      expect(result.current.cases).toHaveLength(1);
      expect(result.current.cases[0].status).toBe('new');
      expect(result.current.cases[0].clientId).toBe('client-1');
    });
  });

  describe('getCaseById', () => {
    it('should return case by id', () => {
      const { result } = renderHook(() => useCases());

      const foundCase = result.current.getCaseById('case-2');
      expect(foundCase).toBeDefined();
      expect(foundCase?.id).toBe('case-2');
    });

    it('should return undefined for non-existent id', () => {
      const { result } = renderHook(() => useCases());

      const foundCase = result.current.getCaseById('non-existent');
      expect(foundCase).toBeUndefined();
    });
  });

  describe('exposed functions', () => {
    it('should expose addCase from context', () => {
      const { result } = renderHook(() => useCases());

      expect(result.current.addCase).toBe(mockAppContext.addCase);
    });

    it('should expose updateCase from context', () => {
      const { result } = renderHook(() => useCases());

      expect(result.current.updateCase).toBe(mockAppContext.updateCase);
    });

    it('should expose deleteCase from context', () => {
      const { result } = renderHook(() => useCases());

      expect(result.current.deleteCase).toBe(mockAppContext.deleteCase);
    });

    it('should expose changeCaseStatus from context', () => {
      const { result } = renderHook(() => useCases());

      expect(result.current.changeCaseStatus).toBe(mockAppContext.changeCaseStatus);
    });
  });
});
