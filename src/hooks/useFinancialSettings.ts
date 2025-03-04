import { useState, useCallback } from 'react';
import { db } from '../lib/supabase';

export interface ProductMargin {
  id: string;
  category: string;
  minMargin: number;
  targetMargin: number;
  maxMargin: number;
}

export interface DiscountRule {
  id: string;
  name: string;
  type: 'commercial' | 'quantity' | 'promotional';
  clientType: ('retail' | 'wholesale' | 'bulk')[];
  minAmount?: number;
  minQuantity?: number;
  discountPercent?: number;
  discountAmount?: number;
  startDate?: string;
  endDate?: string;
  active: boolean;
}

export interface VatRate {
  id: string;
  name: string;
  rate: number;
  description?: string;
  active: boolean;
}

export interface FiscalStamp {
  id: string;
  amount: number;
  effectiveDate: string;
  endDate?: string;
  description?: string;
  active: boolean;
}

export function useFinancialSettings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Product Margins
  const getProductMargins = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await db.from('product_margins').select('*');
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProductMargin = useCallback(async (margin: Omit<ProductMargin, 'id'>) => {
    try {
      setLoading(true);
      const { data } = await db.from('product_margins').insert(margin).select().single();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Discount Rules
  const getDiscountRules = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await db.from('discount_rules').select('*');
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const saveDiscountRule = useCallback(async (rule: Omit<DiscountRule, 'id'>) => {
    try {
      setLoading(true);
      const { data } = await db.from('discount_rules').insert(rule).select().single();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // VAT Rates
  const getVatRates = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await db.from('vat_rates').select('*');
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const saveVatRate = useCallback(async (rate: Omit<VatRate, 'id'>) => {
    try {
      setLoading(true);
      const { data } = await db.from('vat_rates').insert(rate).select().single();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fiscal Stamps
  const getFiscalStamps = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await db.from('fiscal_stamps').select('*');
      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const saveFiscalStamp = useCallback(async (stamp: Omit<FiscalStamp, 'id'>) => {
    try {
      setLoading(true);
      const { data } = await db.from('fiscal_stamps').insert(stamp).select().single();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getProductMargins,
    saveProductMargin,
    getDiscountRules,
    saveDiscountRule,
    getVatRates,
    saveVatRate,
    getFiscalStamps,
    saveFiscalStamp
  };
}