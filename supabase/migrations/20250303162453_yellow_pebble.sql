/*
  # Initial Schema Setup

  1. New Tables
    - `products`
      - Product catalog with technical specifications and pricing
    - `clients`
      - Client information and commercial terms
    - `suppliers`
      - Supplier details and ratings
    - `transactions`
      - Sales transactions and invoices
    - `transaction_items`
      - Individual items in transactions
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  brand text NOT NULL,
  category text NOT NULL,
  barcode text,
  technical_specs jsonb DEFAULT '{}',
  images text[] DEFAULT '{}',
  equivalents text[] DEFAULT '{}',
  retail_price decimal(10,3) NOT NULL,
  wholesale_price decimal(10,3) NOT NULL,
  bulk_price decimal(10,3) NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  min_stock integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Clients Table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('retail', 'wholesale', 'bulk')),
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  vat_number text NOT NULL,
  registration_number text NOT NULL,
  price_level text NOT NULL CHECK (price_level IN ('retail', 'wholesale', 'bulk')),
  credit_limit decimal(10,3) NOT NULL DEFAULT 0,
  payment_terms integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('manufacturer', 'distributor', 'importer')),
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  vat_number text NOT NULL,
  registration_number text NOT NULL,
  payment_days integer NOT NULL DEFAULT 0,
  payment_method text NOT NULL CHECK (payment_method IN ('bank_transfer', 'check', 'cash')),
  brands text[] DEFAULT '{}',
  rating integer CHECK (rating BETWEEN 0 AND 5),
  status text NOT NULL CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_order_at timestamptz
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id),
  date timestamptz DEFAULT now(),
  subtotal decimal(10,3) NOT NULL,
  vat decimal(10,3) NOT NULL,
  total decimal(10,3) NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')),
  payment_method text NOT NULL CHECK (payment_method IN ('cib', 'edinar', 'cash', 'credit')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Transaction Items Table
CREATE TABLE IF NOT EXISTS transaction_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES transactions(id),
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL,
  unit_price decimal(10,3) NOT NULL,
  total decimal(10,3) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Allow full access to authenticated users" ON products
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON clients
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON suppliers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON transactions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON transaction_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
CREATE INDEX IF NOT EXISTS idx_transactions_client_id ON transactions(client_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transaction_items_transaction_id ON transaction_items(transaction_id);

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON suppliers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();