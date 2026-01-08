import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { Client, ClientType } from '../types';

interface ClientFilters {
  type?: ClientType;
  searchTerm?: string;
}

export function useClients(filters?: ClientFilters) {
  const { clients, cases, addClient, updateClient, deleteClient } = useApp();

  const filteredClients = useMemo(() => {
    let filtered = [...clients];

    if (filters?.type) {
      filtered = filtered.filter(c => c.type === filters.type);
    }

    if (filters?.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.phone.includes(term)
      );
    }

    return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  }, [clients, filters]);

  const getClientById = (id: string): Client | undefined => {
    return clients.find(c => c.id === id);
  };

  const getClientCases = (clientId: string) => {
    return cases.filter(c => c.clientId === clientId);
  };

  const getActiveCasesCount = (clientId: string): number => {
    return cases.filter(c => c.clientId === clientId && c.status !== 'closed').length;
  };

  return {
    clients: filteredClients,
    allClients: clients,
    addClient,
    updateClient,
    deleteClient,
    getClientById,
    getClientCases,
    getActiveCasesCount,
  };
}

export default useClients;
