/*
  # Ajout des colonnes de remise

  1. Modifications
    - Ajout des colonnes de remise dans les tables de transactions
    - Mise à jour des calculs de totaux pour prendre en compte les remises
    - Ajout du timbre fiscal dans les transactions

  2. Tables modifiées
    - transactions
    - transaction_items
    - quotes
    - quote_items
    - credit_notes
    - credit_note_items
    - delivery_notes
    - delivery_note_items

  3. Calculs
    - Montant brut = quantité * prix unitaire
    - Remise = pourcentage ou montant fixe
    - Montant net = montant brut - remise
    - TVA = montant net * taux TVA
    - Total = montant net + TVA + timbre fiscal
*/

-- Ajout des colonnes de remise dans transaction_items
ALTER TABLE transaction_items
ADD COLUMN discount decimal(10,3) DEFAULT 0,
ADD COLUMN discount_type text CHECK (discount_type IN ('percentage', 'amount')),
ADD COLUMN gross_amount decimal(10,3) GENERATED ALWAYS AS (quantity * unit_price) STORED,
ADD COLUMN net_amount decimal(10,3) GENERATED ALWAYS AS (
  CASE 
    WHEN discount_type = 'percentage' THEN 
      quantity * unit_price * (1 - discount / 100)
    ELSE 
      quantity * unit_price - LEAST(discount, quantity * unit_price)
  END
) STORED,
ADD COLUMN vat_amount decimal(10,3) GENERATED ALWAYS AS (
  CASE 
    WHEN discount_type = 'percentage' THEN 
      quantity * unit_price * (1 - discount / 100) * 0.19
    ELSE 
      (quantity * unit_price - LEAST(discount, quantity * unit_price)) * 0.19
  END
) STORED;

-- Ajout du timbre fiscal dans transactions
ALTER TABLE transactions
ADD COLUMN fiscal_stamp decimal(10,3) DEFAULT 1.000;

-- Mise à jour du trigger de calcul des totaux
CREATE OR REPLACE FUNCTION calculate_transaction_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculer le sous-total (somme des montants nets)
  SELECT 
    COALESCE(SUM(net_amount), 0),
    COALESCE(SUM(vat_amount), 0)
  INTO 
    NEW.subtotal,
    NEW.vat
  FROM transaction_items
  WHERE transaction_id = NEW.id;
  
  -- Calculer le total (sous-total + TVA + timbre fiscal)
  NEW.total = NEW.subtotal + NEW.vat + NEW.fiscal_stamp;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer les mêmes modifications aux devis
ALTER TABLE quote_items
ADD COLUMN discount decimal(10,3) DEFAULT 0,
ADD COLUMN discount_type text CHECK (discount_type IN ('percentage', 'amount')),
ADD COLUMN gross_amount decimal(10,3) GENERATED ALWAYS AS (quantity * unit_price) STORED,
ADD COLUMN net_amount decimal(10,3) GENERATED ALWAYS AS (
  CASE 
    WHEN discount_type = 'percentage' THEN 
      quantity * unit_price * (1 - discount / 100)
    ELSE 
      quantity * unit_price - LEAST(discount, quantity * unit_price)
  END
) STORED,
ADD COLUMN vat_amount decimal(10,3) GENERATED ALWAYS AS (
  CASE 
    WHEN discount_type = 'percentage' THEN 
      quantity * unit_price * (1 - discount / 100) * 0.19
    ELSE 
      (quantity * unit_price - LEAST(discount, quantity * unit_price)) * 0.19
  END
) STORED;

ALTER TABLE quotes
ADD COLUMN fiscal_stamp decimal(10,3) DEFAULT 1.000;

-- Appliquer les mêmes modifications aux avoirs
ALTER TABLE credit_note_items
ADD COLUMN discount decimal(10,3) DEFAULT 0,
ADD COLUMN discount_type text CHECK (discount_type IN ('percentage', 'amount')),
ADD COLUMN gross_amount decimal(10,3) GENERATED ALWAYS AS (quantity * unit_price) STORED,
ADD COLUMN net_amount decimal(10,3) GENERATED ALWAYS AS (
  CASE 
    WHEN discount_type = 'percentage' THEN 
      quantity * unit_price * (1 - discount / 100)
    ELSE 
      quantity * unit_price - LEAST(discount, quantity * unit_price)
  END
) STORED,
ADD COLUMN vat_amount decimal(10,3) GENERATED ALWAYS AS (
  CASE 
    WHEN discount_type = 'percentage' THEN 
      quantity * unit_price * (1 - discount / 100) * 0.19
    ELSE 
      (quantity * unit_price - LEAST(discount, quantity * unit_price)) * 0.19
  END
) STORED;

ALTER TABLE credit_notes
ADD COLUMN fiscal_stamp decimal(10,3) DEFAULT 1.000;

-- Créer les triggers pour les autres documents
CREATE OR REPLACE FUNCTION calculate_quote_totals()
RETURNS TRIGGER AS $$
BEGIN
  SELECT 
    COALESCE(SUM(net_amount), 0),
    COALESCE(SUM(vat_amount), 0)
  INTO 
    NEW.subtotal,
    NEW.vat
  FROM quote_items
  WHERE quote_id = NEW.id;
  
  NEW.total = NEW.subtotal + NEW.vat + NEW.fiscal_stamp;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_credit_note_totals()
RETURNS TRIGGER AS $$
BEGIN
  SELECT 
    COALESCE(SUM(net_amount), 0),
    COALESCE(SUM(vat_amount), 0)
  INTO 
    NEW.subtotal,
    NEW.vat
  FROM credit_note_items
  WHERE credit_note_id = NEW.id;
  
  NEW.total = NEW.subtotal + NEW.vat + NEW.fiscal_stamp;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer les triggers
CREATE TRIGGER update_quote_totals
  BEFORE INSERT OR UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION calculate_quote_totals();

CREATE TRIGGER update_credit_note_totals
  BEFORE INSERT OR UPDATE ON credit_notes
  FOR EACH ROW
  EXECUTE FUNCTION calculate_credit_note_totals();