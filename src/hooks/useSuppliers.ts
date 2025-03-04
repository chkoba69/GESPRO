import { useState, useCallback, useEffect } from 'react';
import { Supplier } from '../types';
import { db } from '../lib/supabase';

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await db.from('suppliers').select('*');
      if (error) throw error;
      setSuppliers(data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch suppliers');
      console.error('Error fetching suppliers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSupplier = useCallback(async (supplierData: Partial<Supplier>) => {
    setLoading(true);
    try {
      // Ensure required fields are present
      if (!supplierData.name || !supplierData.email || !supplierData.phone || !supplierData.address || !supplierData.vat_number || !supplierData.registration_number) {
        throw new Error('Required fields are missing');
      }

      const { data, error } = await db.from('suppliers').insert([
        {
          name: supplierData.name,
          type: supplierData.type || 'distributor',
          email: supplierData.email,
          phone: supplierData.phone,
          address: supplierData.address,
          vat_number: supplierData.vat_number,
          registration_number: supplierData.registration_number,
          payment_days: supplierData.payment_days || 0,
          payment_method: supplierData.payment_method || 'bank_transfer',
          brands: supplierData.brands || [],
          rating: supplierData.rating || 0,
          status: supplierData.status || 'active'
        }
      ]).select().single();

      if (error) throw error;
      
      if (data) {
        setSuppliers(prev => [...prev, data]);
        setError(null);
        return data;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create supplier';
      setError(message);
      console.error('Error creating supplier:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const getSupplier = useCallback((id: string) => {
    return suppliers.find(supplier => supplier.id === id);
  }, [suppliers]);

  return {
    suppliers,
    loading,
    error,
    getSupplier,
    createSupplier,
    fetchSuppliers
  };
}