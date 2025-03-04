/*
  # Stock Management Implementation

  1. New Tables
    - `stock_movements`
      - Tracks all stock changes (purchases, sales, adjustments)
      - Records movement type, quantity, and reason
    - `stock_adjustments`
      - Records manual stock adjustments with reasons
    - `stock_counts`
      - Tracks physical inventory counts
    
  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users
    
  3. Functions
    - Add triggers to update product stock
    - Add validation functions for stock movements
*/

-- Stock Movements Table
CREATE TABLE IF NOT EXISTS stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id),
  movement_type text NOT NULL CHECK (movement_type IN ('purchase', 'sale', 'adjustment', 'return')),
  quantity integer NOT NULL,
  reference_type text NOT NULL CHECK (reference_type IN ('purchase_receipt', 'transaction', 'adjustment', 'return')),
  reference_id uuid NOT NULL,
  unit_cost decimal(10,3),
  notes text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Stock Adjustments Table
CREATE TABLE IF NOT EXISTS stock_adjustments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date timestamptz DEFAULT now(),
  reason text NOT NULL CHECK (reason IN ('damage', 'loss', 'correction', 'expiry', 'other')),
  notes text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  approved_at timestamptz,
  approved_by uuid REFERENCES auth.users(id)
);

-- Stock Adjustment Items Table
CREATE TABLE IF NOT EXISTS stock_adjustment_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  adjustment_id uuid NOT NULL REFERENCES stock_adjustments(id),
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL,
  reason text,
  created_at timestamptz DEFAULT now()
);

-- Stock Counts Table
CREATE TABLE IF NOT EXISTS stock_counts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  completed_at timestamptz,
  completed_by uuid REFERENCES auth.users(id)
);

-- Stock Count Items Table
CREATE TABLE IF NOT EXISTS stock_count_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  count_id uuid NOT NULL REFERENCES stock_counts(id),
  product_id uuid NOT NULL REFERENCES products(id),
  expected_quantity integer NOT NULL,
  actual_quantity integer,
  difference integer GENERATED ALWAYS AS (actual_quantity - expected_quantity) STORED,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_adjustment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_count_items ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Allow full access to authenticated users" ON stock_movements
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON stock_adjustments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON stock_adjustment_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON stock_counts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON stock_count_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX idx_stock_movements_reference ON stock_movements(reference_type, reference_id);
CREATE INDEX idx_stock_adjustments_status ON stock_adjustments(status);
CREATE INDEX idx_stock_counts_status ON stock_counts(status);

-- Create function to update product stock
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE products
    SET 
      stock = stock + NEW.quantity,
      updated_at = now()
    WHERE id = NEW.product_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE products
    SET 
      stock = stock - OLD.quantity,
      updated_at = now()
    WHERE id = OLD.product_id;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE products
    SET 
      stock = stock - OLD.quantity + NEW.quantity,
      updated_at = now()
    WHERE id = NEW.product_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for stock movements
CREATE TRIGGER update_stock_after_movement
  AFTER INSERT OR UPDATE OR DELETE ON stock_movements
  FOR EACH ROW
  EXECUTE FUNCTION update_product_stock();