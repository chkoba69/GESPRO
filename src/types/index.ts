export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  barcode?: string;
  technical_specs: Record<string, any>;
  images: string[];
  equivalents: string[];
  purchase_price_local: number;
  purchase_price_foreign?: number;
  currency: string;
  exchange_rate: number;
  margin_percentage: number;
  max_discount: number;
  retail_price: number;
  wholesale_price: number;
  bulk_price: number;
  stock: number;
  min_stock: number;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  type: 'manufacturer' | 'distributor' | 'importer';
  email: string;
  phone: string;
  address: string;
  vat_number: string;
  registration_number: string;
  payment_days: number;
  payment_method: 'bank_transfer' | 'check' | 'cash';
  brands: string[];
  rating: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  last_order_at?: string;
}

export interface Client {
  id: string;
  name: string;
  type: 'retail' | 'wholesale' | 'bulk';
  email: string;
  phone: string;
  address: string;
  vat_number: string;
  registration_number: string;
  price_level: 'retail' | 'wholesale' | 'bulk';
  credit_limit: number;
  payment_terms: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  client_id: string;
  date: string;
  subtotal: number;
  vat: number;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface TransactionItem {
  id: string;
  transaction_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total: number;
  created_at: string;
}