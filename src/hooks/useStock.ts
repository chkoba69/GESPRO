import { useState, useCallback } from 'react';
import { db } from '../lib/supabase';

export interface StockMovement {
  id: string;
  productId: string;
  movementType: 'purchase' | 'sale' | 'adjustment' | 'return';
  quantity: number;
  referenceType: 'purchase_receipt' | 'transaction' | 'adjustment' | 'return';
  referenceId: string;
  unitCost?: number;
  notes?: string;
  createdAt: string;
}

export interface StockAdjustment {
  id: string;
  date: string;
  reason: 'damage' | 'loss' | 'correction' | 'expiry' | 'other';
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  items: {
    productId: string;
    quantity: number;
    reason?: string;
  }[];
}

export function useStock() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recordMovement = useCallback(async (movement: Omit<StockMovement, 'id' | 'createdAt'>) => {
    try {
      setLoading(true);
      const result = await db.insert('stock_movements', movement);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createAdjustment = useCallback(async (adjustment: Omit<StockAdjustment, 'id'>) => {
    try {
      setLoading(true);
      // Create adjustment
      const { id } = await db.insert('stock_adjustments', {
        date: adjustment.date,
        reason: adjustment.reason,
        notes: adjustment.notes,
        status: adjustment.status
      });

      // Create adjustment items
      for (const item of adjustment.items) {
        await db.insert('stock_adjustment_items', {
          adjustmentId: id,
          ...item
        });
      }

      // If approved, create stock movements
      if (adjustment.status === 'approved') {
        for (const item of adjustment.items) {
          await recordMovement({
            productId: item.productId,
            movementType: 'adjustment',
            quantity: item.quantity,
            referenceType: 'adjustment',
            referenceId: id,
            notes: item.reason
          });
        }
      }

      return id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setLoading(false);
    }
  }, [recordMovement]);

  const getProductMovements = useCallback(async (productId: string) => {
    try {
      setLoading(true);
      const movements = await db.select('stock_movements')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      return movements;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getStockValue = useCallback(async () => {
    try {
      setLoading(true);
      const products = await db.select('products');
      return products.reduce((total, product) => {
        const averageCost = product.stock > 0 ? product.price.bulk : 0;
        return total + (product.stock * averageCost);
      }, 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return 0;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    recordMovement,
    createAdjustment,
    getProductMovements,
    getStockValue
  };
}