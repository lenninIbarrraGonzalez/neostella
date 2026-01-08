import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useClients } from './useClients';
import { Client, Case } from '../types';

const mockClients: Client[] = [
  {
    id: 'client-1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '555-111-1111',
    address: '123 Main St',
    type: 'individual',
    notes: 'Notes for Alice',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'client-2',
    name: 'Bob Smith Corp',
    email: 'bob@company.com',
    phone: '555-222-2222',
    address: '456 Business Ave',
    type: 'business',
    notes: 'Business client',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'client-3',
    name: 'Charlie Brown',
    email: 'charlie@email.com',
    phone: '555-333-3333',
    address: '789 Oak St',
    type: 'individual',
    notes: 'Notes for Charlie',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockCases: Case[] = [
  {
    id: 'case-1',
    caseNumber: 'CASE-2024-001',
    title: 'Case 1',
    description: 'Description',
    type: 'personal_injury',
    status: 'new',
    priority: 'high',
    clientId: 'client-1',
    assignedTo: ['user-1'],
    deadline: new Date(),
    createdBy: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'case-2',
    caseNumber: 'CASE-2024-002',
    title: 'Case 2',
    description: 'Description',
    type: 'auto_accident',
    status: 'in_progress',
    priority: 'medium',
    clientId: 'client-1',
    assignedTo: ['user-1'],
    deadline: new Date(),
    createdBy: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'case-3',
    caseNumber: 'CASE-2024-003',
    title: 'Case 3',
    description: 'Description',
    type: 'family_divorce',
    status: 'closed',
    priority: 'low',
    clientId: 'client-1',
    assignedTo: ['user-1'],
    deadline: new Date(),
    createdBy: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'case-4',
    caseNumber: 'CASE-2024-004',
    title: 'Case 4',
    description: 'Description',
    type: 'immigration_visa',
    status: 'new',
    priority: 'urgent',
    clientId: 'client-2',
    assignedTo: ['user-2'],
    deadline: new Date(),
    createdBy: 'user-2',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const mockAppContext = {
  clients: mockClients,
  cases: mockCases,
  addClient: vi.fn(),
  updateClient: vi.fn(),
  deleteClient: vi.fn(),
};

vi.mock('../contexts/AppContext', () => ({
  useApp: () => mockAppContext,
}));

describe('useClients hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic functionality', () => {
    it('should return all clients', () => {
      const { result } = renderHook(() => useClients());

      expect(result.current.clients).toHaveLength(3);
      expect(result.current.allClients).toHaveLength(3);
    });

    it('should sort clients by name alphabetically', () => {
      const { result } = renderHook(() => useClients());

      expect(result.current.clients[0].name).toBe('Alice Johnson');
      expect(result.current.clients[1].name).toBe('Bob Smith Corp');
      expect(result.current.clients[2].name).toBe('Charlie Brown');
    });
  });

  describe('filtering', () => {
    it('should filter by type individual', () => {
      const { result } = renderHook(() => useClients({ type: 'individual' }));

      expect(result.current.clients).toHaveLength(2);
      expect(result.current.clients.every(c => c.type === 'individual')).toBe(true);
    });

    it('should filter by type business', () => {
      const { result } = renderHook(() => useClients({ type: 'business' }));

      expect(result.current.clients).toHaveLength(1);
      expect(result.current.clients[0].type).toBe('business');
    });

    it('should filter by search term in name', () => {
      const { result } = renderHook(() => useClients({ searchTerm: 'alice' }));

      expect(result.current.clients).toHaveLength(1);
      expect(result.current.clients[0].name).toBe('Alice Johnson');
    });

    it('should filter by search term in email', () => {
      const { result } = renderHook(() => useClients({ searchTerm: 'company.com' }));

      expect(result.current.clients).toHaveLength(1);
      expect(result.current.clients[0].email).toBe('bob@company.com');
    });

    it('should filter by search term in phone', () => {
      const { result } = renderHook(() => useClients({ searchTerm: '333' }));

      expect(result.current.clients).toHaveLength(1);
      expect(result.current.clients[0].phone).toBe('555-333-3333');
    });

    it('should combine type and search filters', () => {
      const { result } = renderHook(() =>
        useClients({ type: 'individual', searchTerm: 'charlie' })
      );

      expect(result.current.clients).toHaveLength(1);
      expect(result.current.clients[0].name).toBe('Charlie Brown');
    });

    it('should return empty array when no matches', () => {
      const { result } = renderHook(() => useClients({ searchTerm: 'xyz' }));

      expect(result.current.clients).toHaveLength(0);
    });
  });

  describe('getClientById', () => {
    it('should return client by id', () => {
      const { result } = renderHook(() => useClients());

      const client = result.current.getClientById('client-2');
      expect(client).toBeDefined();
      expect(client?.id).toBe('client-2');
      expect(client?.name).toBe('Bob Smith Corp');
    });

    it('should return undefined for non-existent id', () => {
      const { result } = renderHook(() => useClients());

      const client = result.current.getClientById('non-existent');
      expect(client).toBeUndefined();
    });
  });

  describe('getClientCases', () => {
    it('should return all cases for a client', () => {
      const { result } = renderHook(() => useClients());

      const cases = result.current.getClientCases('client-1');
      expect(cases).toHaveLength(3);
      expect(cases.every(c => c.clientId === 'client-1')).toBe(true);
    });

    it('should return single case for client with one case', () => {
      const { result } = renderHook(() => useClients());

      const cases = result.current.getClientCases('client-2');
      expect(cases).toHaveLength(1);
      expect(cases[0].clientId).toBe('client-2');
    });

    it('should return empty array for client with no cases', () => {
      const { result } = renderHook(() => useClients());

      const cases = result.current.getClientCases('client-3');
      expect(cases).toHaveLength(0);
    });
  });

  describe('getActiveCasesCount', () => {
    it('should return count of active cases (non-closed)', () => {
      const { result } = renderHook(() => useClients());

      const count = result.current.getActiveCasesCount('client-1');
      expect(count).toBe(2); // 3 cases, 1 closed
    });

    it('should return correct count for client with all active cases', () => {
      const { result } = renderHook(() => useClients());

      const count = result.current.getActiveCasesCount('client-2');
      expect(count).toBe(1);
    });

    it('should return 0 for client with no cases', () => {
      const { result } = renderHook(() => useClients());

      const count = result.current.getActiveCasesCount('client-3');
      expect(count).toBe(0);
    });

    it('should return 0 for non-existent client', () => {
      const { result } = renderHook(() => useClients());

      const count = result.current.getActiveCasesCount('non-existent');
      expect(count).toBe(0);
    });
  });

  describe('exposed functions', () => {
    it('should expose addClient from context', () => {
      const { result } = renderHook(() => useClients());

      expect(result.current.addClient).toBe(mockAppContext.addClient);
    });

    it('should expose updateClient from context', () => {
      const { result } = renderHook(() => useClients());

      expect(result.current.updateClient).toBe(mockAppContext.updateClient);
    });

    it('should expose deleteClient from context', () => {
      const { result } = renderHook(() => useClients());

      expect(result.current.deleteClient).toBe(mockAppContext.deleteClient);
    });
  });
});
