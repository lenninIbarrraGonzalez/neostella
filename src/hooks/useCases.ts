import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from './useAuth';
import { Case, CaseStatus, CaseType } from '../types';

interface CaseFilters {
  status?: CaseStatus;
  type?: CaseType;
  assignedTo?: string;
  clientId?: string;
  searchTerm?: string;
}

export function useCases(filters?: CaseFilters) {
  const {
    cases,
    addCase,
    updateCase,
    deleteCase,
    changeCaseStatus,
  } = useApp();
  const { user, canViewAllCases } = useAuth();

  const visibleCases = useMemo(() => {
    if (!user) return [];

    let filtered = cases;

    if (!canViewAllCases) {
      filtered = filtered.filter(c => c.assignedTo?.includes(user.id));
    }

    if (filters?.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }

    if (filters?.type) {
      filtered = filtered.filter(c => c.type === filters.type);
    }

    if (filters?.assignedTo) {
      filtered = filtered.filter(c => c.assignedTo.includes(filters.assignedTo!));
    }

    if (filters?.clientId) {
      filtered = filtered.filter(c => c.clientId === filters.clientId);
    }

    if (filters?.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(term) ||
        c.caseNumber.toLowerCase().includes(term) ||
        c.description.toLowerCase().includes(term)
      );
    }

    return [...filtered].sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [cases, user, canViewAllCases, filters]);

  const openCases = useMemo(() => {
    return visibleCases.filter(c => c.status !== 'closed');
  }, [visibleCases]);

  const closedCases = useMemo(() => {
    return visibleCases.filter(c => c.status === 'closed');
  }, [visibleCases]);

  const casesByStatus = useMemo(() => {
    const grouped: Record<CaseStatus, Case[]> = {
      new: [],
      under_review: [],
      in_progress: [],
      pending_client: [],
      resolved: [],
      closed: [],
    };

    visibleCases.forEach(c => {
      grouped[c.status].push(c);
    });

    return grouped;
  }, [visibleCases]);

  const getCaseById = (id: string): Case | undefined => {
    return cases.find(c => c.id === id);
  };

  return {
    cases: visibleCases,
    allCases: cases,
    openCases,
    closedCases,
    casesByStatus,
    addCase,
    updateCase,
    deleteCase,
    changeCaseStatus,
    getCaseById,
  };
}

export default useCases;
