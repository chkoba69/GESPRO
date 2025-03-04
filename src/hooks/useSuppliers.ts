import { useState, useCallback } from 'react';
import { Supplier } from '../types';

const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: '1',
    name: 'SKF Tunisie',
    type: 'manufacturer',
    contact: {
      email: 'contact@skf.tn',
      phone: '+216 71 234 567',
      address: 'Zone Industrielle, Tunis'
    },
    taxInfo: {
      vatNumber: '1234567/A/M/000',
      registrationNumber: 'B0123456789'
    },
    paymentTerms: {
      days: 60,
      method: 'bank_transfer'
    },
    brands: ['SKF', 'SKF Bearing', 'SKF Maintenance'],
    rating: 5,
    status: 'active',
    lastOrder: new Date().toISOString()
  }
];

export function useSuppliers() {
  const [suppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const getSupplier = useCallback((id: string) => {
    return suppliers.find(supplier => supplier.id === id);
  }, [suppliers]);

  return {
    suppliers,
    loading,
    error,
    getSupplier
  };
}