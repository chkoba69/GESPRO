/*
  # Add International Purchases Support

  1. New Tables
    - `purchase_orders`
      - Basic purchase order information
      - Support for both local and international purchases
      - Currency and exchange rate tracking
      - International shipping and customs details
    
    - `purchase_receipts`
      - Receipt information for purchases
      - Landed cost calculation for international purchases
      - Customs and shipping charges tracking
    
    - `purchase_returns`
      - Return management for both local and international purchases
      - Multi-currency support

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users

  3. Changes
    - Added currency and exchange rate tracking
    - Support for international purchase documentation
    - Landed cost calculation fields
*/

-- Purchase Orders Table
CREATE TABLE IF NOT EXISTS purchase_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES suppliers(id),
  type text NOT NULL CHECK (type IN ('local', 'international')),
  date timestamptz DEFAULT now(),
  currency text NOT NULL DEFAULT 'TND',
  exchange_rate decimal(10,3) NOT NULL DEFAULT 1,
  subtotal decimal(10,3) NOT NULL,
  vat decimal(10,3) NOT NULL,
  total decimal(10,3) NOT NULL,
  status text NOT NULL CHECK (status IN ('draft', 'sent', 'confirmed', 'received', 'cancelled')),
  notes text,
  expected_delivery_date timestamptz,
  -- International purchase fields
  proforma_invoice_number text,
  incoterm text,
  customs_declaration_number text,
  shipping_method text,
  estimated_arrival_date timestamptz,
  documents_received jsonb DEFAULT '{"proformaInvoice": false, "billOfLading": false, "certificate": false, "packingList": false}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Purchase Order Items Table
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id uuid NOT NULL REFERENCES purchase_orders(id),
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL,
  unit_price decimal(10,3) NOT NULL,
  currency text NOT NULL DEFAULT 'TND',
  exchange_rate decimal(10,3) NOT NULL DEFAULT 1,
  total decimal(10,3) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Purchase Receipts Table
CREATE TABLE IF NOT EXISTS purchase_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id uuid NOT NULL REFERENCES purchase_orders(id),
  supplier_id uuid NOT NULL REFERENCES suppliers(id),
  type text NOT NULL CHECK (type IN ('local', 'international')),
  date timestamptz DEFAULT now(),
  currency text NOT NULL DEFAULT 'TND',
  exchange_rate decimal(10,3) NOT NULL DEFAULT 1,
  subtotal decimal(10,3) NOT NULL,
  vat decimal(10,3) NOT NULL,
  total decimal(10,3) NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')),
  payment_method text NOT NULL CHECK (payment_method IN ('bank_transfer', 'check', 'cash')),
  notes text,
  -- International purchase fields
  customs_clearance_date timestamptz,
  customs_charges decimal(10,3),
  shipping_charges decimal(10,3),
  other_charges decimal(10,3),
  total_landed_cost decimal(10,3),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Purchase Receipt Items Table
CREATE TABLE IF NOT EXISTS purchase_receipt_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_receipt_id uuid NOT NULL REFERENCES purchase_receipts(id),
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL,
  unit_price decimal(10,3) NOT NULL,
  currency text NOT NULL DEFAULT 'TND',
  exchange_rate decimal(10,3) NOT NULL DEFAULT 1,
  total decimal(10,3) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Purchase Returns Table
CREATE TABLE IF NOT EXISTS purchase_returns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_receipt_id uuid NOT NULL REFERENCES purchase_receipts(id),
  supplier_id uuid NOT NULL REFERENCES suppliers(id),
  type text NOT NULL CHECK (type IN ('local', 'international')),
  date timestamptz DEFAULT now(),
  currency text NOT NULL DEFAULT 'TND',
  exchange_rate decimal(10,3) NOT NULL DEFAULT 1,
  subtotal decimal(10,3) NOT NULL,
  vat decimal(10,3) NOT NULL,
  total decimal(10,3) NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'processed', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Purchase Return Items Table
CREATE TABLE IF NOT EXISTS purchase_return_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_return_id uuid NOT NULL REFERENCES purchase_returns(id),
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL,
  unit_price decimal(10,3) NOT NULL,
  currency text NOT NULL DEFAULT 'TND',
  exchange_rate decimal(10,3) NOT NULL DEFAULT 1,
  total decimal(10,3) NOT NULL,
  reason text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_receipt_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_return_items ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Allow full access to authenticated users" ON purchase_orders
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON purchase_order_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON purchase_receipts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON purchase_receipt_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON purchase_returns
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON purchase_return_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_purchase_orders_supplier_id ON purchase_orders(supplier_id);
CREATE INDEX idx_purchase_orders_type ON purchase_orders(type);
CREATE INDEX idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX idx_purchase_receipts_purchase_order_id ON purchase_receipts(purchase_order_id);
CREATE INDEX idx_purchase_returns_original_receipt_id ON purchase_returns(original_receipt_id);

-- Add triggers for updated_at
CREATE TRIGGER update_purchase_orders_updated_at
  BEFORE UPDATE ON purchase_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_purchase_receipts_updated_at
  BEFORE UPDATE ON purchase_receipts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_purchase_returns_updated_at
  BEFORE UPDATE ON purchase_returns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();