/*
  # Système de Gestion Financière

  1. Nouvelles Tables
    - `product_margins`: Configuration des marges par catégorie
    - `discount_rules`: Règles de remises
    - `discount_history`: Historique des remises accordées
    - `vat_rates`: Taux de TVA
    - `vat_history`: Historique des changements de TVA
    - `fiscal_stamps`: Configuration des timbres fiscaux
    - `fiscal_stamps_history`: Historique des modifications

  2. Sécurité
    - Enable RLS sur toutes les tables
    - Policies pour accès authentifié

  3. Fonctionnalités
    - Triggers pour historisation
    - Fonctions pour calcul automatique des prix
    - Validation des marges minimales
*/

-- Product Margins Configuration
CREATE TABLE IF NOT EXISTS product_margins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  min_margin decimal(5,2) NOT NULL CHECK (min_margin >= 0),
  target_margin decimal(5,2) NOT NULL CHECK (target_margin >= min_margin),
  max_margin decimal(5,2) NOT NULL CHECK (max_margin >= target_margin),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(category)
);

-- Discount Rules
CREATE TABLE IF NOT EXISTS discount_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('commercial', 'quantity', 'promotional')),
  client_type text[] CHECK (client_type <@ ARRAY['retail', 'wholesale', 'bulk']),
  min_amount decimal(10,3),
  min_quantity integer,
  discount_percent decimal(5,2) CHECK (discount_percent BETWEEN 0 AND 100),
  discount_amount decimal(10,3),
  start_date timestamptz,
  end_date timestamptz,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  CHECK (
    (discount_percent IS NOT NULL AND discount_amount IS NULL) OR
    (discount_amount IS NOT NULL AND discount_percent IS NULL)
  ),
  CHECK (
    (min_amount IS NOT NULL AND min_quantity IS NULL) OR
    (min_quantity IS NOT NULL AND min_amount IS NULL) OR
    (min_amount IS NULL AND min_quantity IS NULL)
  )
);

-- Discount History
CREATE TABLE IF NOT EXISTS discount_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id uuid REFERENCES discount_rules(id),
  transaction_id uuid,
  client_id uuid REFERENCES clients(id),
  original_amount decimal(10,3) NOT NULL,
  discount_amount decimal(10,3) NOT NULL,
  final_amount decimal(10,3) NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- VAT Rates
CREATE TABLE IF NOT EXISTS vat_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rate decimal(5,2) NOT NULL CHECK (rate >= 0),
  description text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- VAT History
CREATE TABLE IF NOT EXISTS vat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vat_id uuid REFERENCES vat_rates(id),
  old_rate decimal(5,2),
  new_rate decimal(5,2) NOT NULL,
  change_date timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Product Category VAT
CREATE TABLE IF NOT EXISTS product_category_vat (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  vat_id uuid REFERENCES vat_rates(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  UNIQUE(category)
);

-- Fiscal Stamps
CREATE TABLE IF NOT EXISTS fiscal_stamps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount decimal(10,3) NOT NULL,
  effective_date timestamptz NOT NULL,
  end_date timestamptz,
  description text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Fiscal Stamps History
CREATE TABLE IF NOT EXISTS fiscal_stamps_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  old_amount decimal(10,3),
  new_amount decimal(10,3) NOT NULL,
  change_date timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE product_margins ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE vat_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE vat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_category_vat ENABLE ROW LEVEL SECURITY;
ALTER TABLE fiscal_stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE fiscal_stamps_history ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Allow full access to authenticated users" ON product_margins
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON discount_rules
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON discount_history
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON vat_rates
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON vat_history
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON product_category_vat
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON fiscal_stamps
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow full access to authenticated users" ON fiscal_stamps_history
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create Indexes
CREATE INDEX idx_product_margins_category ON product_margins(category);
CREATE INDEX idx_discount_rules_type ON discount_rules(type);
CREATE INDEX idx_discount_rules_active ON discount_rules(active);
CREATE INDEX idx_discount_history_client ON discount_history(client_id);
CREATE INDEX idx_vat_rates_active ON vat_rates(active);
CREATE INDEX idx_product_category_vat_category ON product_category_vat(category);
CREATE INDEX idx_fiscal_stamps_active ON fiscal_stamps(active);

-- Create Functions and Triggers
CREATE OR REPLACE FUNCTION update_product_prices()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate prices based on margins
  SELECT 
    pm.min_margin,
    pm.target_margin,
    pm.max_margin
  INTO 
    NEW.min_margin,
    NEW.target_margin,
    NEW.max_margin
  FROM product_margins pm
  WHERE pm.category = NEW.category;

  -- Calculate retail price with target margin
  NEW.retail_price = NEW.bulk_price * (1 + NEW.target_margin);
  
  -- Calculate wholesale price between min and target margin
  NEW.wholesale_price = NEW.bulk_price * (1 + ((NEW.min_margin + NEW.target_margin) / 2));

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_product_prices
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_product_prices();

-- Track VAT changes
CREATE OR REPLACE FUNCTION track_vat_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.rate != NEW.rate THEN
    INSERT INTO vat_history (vat_id, old_rate, new_rate, created_by)
    VALUES (NEW.id, OLD.rate, NEW.rate, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_vat_rate_changes
  AFTER UPDATE ON vat_rates
  FOR EACH ROW
  EXECUTE FUNCTION track_vat_changes();

-- Track Fiscal Stamp changes
CREATE OR REPLACE FUNCTION track_fiscal_stamp_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.amount != NEW.amount THEN
    INSERT INTO fiscal_stamps_history (old_amount, new_amount, created_by)
    VALUES (OLD.amount, NEW.amount, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER track_fiscal_stamp_changes
  AFTER UPDATE ON fiscal_stamps
  FOR EACH ROW
  EXECUTE FUNCTION track_fiscal_stamp_changes();

-- Insert default VAT rates
INSERT INTO vat_rates (name, rate, description, active)
VALUES 
  ('Standard', 19, 'Taux standard', true),
  ('Réduit', 7, 'Taux réduit', true),
  ('Minimum', 3, 'Taux minimum', true);

-- Insert default fiscal stamp
INSERT INTO fiscal_stamps (amount, effective_date, description, active)
VALUES (1.000, now(), 'Timbre fiscal standard', true);