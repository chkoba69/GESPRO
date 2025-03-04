import { useState, useCallback } from 'react';
import { Product } from '../types';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Roulement à billes SKF 6205',
    description: 'Roulement à billes à une rangée, étanche',
    brand: 'SKF',
    category: 'Roulements',
    barcode: '7316572605825',
    technicalSpecs: {
      'Diamètre intérieur': '25mm',
      'Diamètre extérieur': '52mm',
      'Largeur': '15mm',
      'Charge dynamique': '14.8kN',
      'Vitesse limite': '32000 tr/min'
    },
    images: [
      'https://images.unsplash.com/photo-1589042573123-655c0de761fe?auto=format&fit=crop&w=300&q=80'
    ],
    equivalents: ['FAG 6205-2RSR', 'NSK 6205DDU', 'NTN 6205LLU'],
    price: {
      retail: 45.500,
      wholesale: 38.750,
      bulk: 35.000
    },
    stock: 5,
    minStock: 10,
    lastUpdated: new Date().toISOString()
  }
];

export function useProducts() {
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const getProduct = useCallback((id: string) => {
    return products.find(product => product.id === id);
  }, [products]);

  const getProductPrice = useCallback((id: string, priceLevel: 'retail' | 'wholesale' | 'bulk') => {
    const product = getProduct(id);
    return product?.price[priceLevel] || 0;
  }, [getProduct]);

  return {
    products,
    loading,
    error,
    getProduct,
    getProductPrice
  };
}