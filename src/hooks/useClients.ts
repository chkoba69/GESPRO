import { useState, useCallback } from 'react';
import { Client } from '../types';

const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'TechnoPlus SARL',
    type: 'wholesale',
    contact: {
      email: 'contact@technoplus.tn',
      phone: '+216 71 123 456',
      address: 'Rue de l\'Usine, 2035 Tunis'
    },
    taxInfo: {
      vatNumber: '1234567/A/P/000',
      registrationNumber: 'B0987654321'
    },
    priceLevel: 'wholesale',
    creditLimit: 50000,
    paymentTerms: 45
  }
];

export function useClients() {
  const [clients] = useState<Client[]>(MOCK_CLIENTS);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const getClient = useCallback((id: string) => {
    return clients.find(client => client.id === id);
  }, [clients]);

  return {
    clients,
    loading,
    error,
    getClient
  };
}