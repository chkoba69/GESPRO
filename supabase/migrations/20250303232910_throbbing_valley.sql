/*
  # Ajout des remises par ligne et timbre fiscal

  1. Modifications des Tables
    - Ajout des colonnes de remise dans transaction_items
    - Ajout du timbre fiscal dans transactions
    - Ajout des colonnes de remise dans purchase_order_items
    - Ajout des colonnes de remise dans purchase_receipt_items
    - Ajout des colonnes de remise dans purchase_return_items

  2. Modifications des Calculs
    - Mise à jour des triggers pour calculer les montants nets
    - Ajout du timbre fiscal dans les calculs de totaux
*/

-- Ajout des colonnes de remise dans transaction_items
ALTER TABLE transaction_items
ADD COLUMN discount decimal(10,3) DEFAULT 0,
ADD COLUMN discount_type text CHECK (discount_type IN ('percentage', 'amount')),
ADD COLUMN net_amount decimal(10,3) GENERATED ALWAYS AS (
  CASE 
    WHEN discount_type = 'percentage' THEN 
      quantity * unit_price * (1 - discount / 100)
    ELSE 
      quantity * unit_price - discount
  END
) STORED;

-- Ajout du timbre fiscal dans transactions
ALTER TABLE transactions
ADD COLUMN fiscal_stamp decimal(10,3) DEFAULT 1.000;

-- Ajout des colonnes de remise dans purchase_order_items
ALTER TABLE purchase_order_items
ADD COLUMN discount decimal(10,3) DEFAULT 0,
ADD COLUMN discount_type text CHECK (discount_type IN ('percentage', 'amount')),
ADD COLUMN net_amount decimal(10,3) GENERATED ALWAYS AS (
  CASE 
    WHEN discount_type = 'percentage' THEN 
      quantity * unit_price * exchange_rate * (1 - discount / 100)
    ELSE 
      quantity * unit_price * exchange_rate - discount
  END
) STORED;

-- Ajout des colonnes de remise dans purchase_receipt_items
ALTER TABLE purchase_receipt_items
ADD COLUMN discount decimal(10,3) DEFAULT 0,
ADD COLUMN discount_type text CHECK (discount_type IN ('percentage', 'amount')),
ADD COLUMN net_amount decimal(10,3) GENERATED ALWAYS AS (
  CASE 
    WHEN discount_type = 'percentage' THEN 
      quantity * unit_price * exchange_rate * (1 - discount / 100)
    ELSE 
      quantity * unit_price * exchange_rate - discount
  END
) STORED;

-- Ajout des colonnes de remise dans purchase_return_items
ALTER TABLE purchase_return_items
ADD COLUMN discount decimal(10,3) DEFAULT 0,
ADD COLUMN discount_type text CHECK (discount_type IN ('percentage', 'amount')),
ADD COLUMN net_amount decimal(10,3) GENERATED ALWAYS AS (
  CASE 
    WHEN discount_type = 'percentage' THEN 
      quantity * unit_price * exchange_rate * (1 - discount / 100)
    ELSE 
      quantity * unit_price * exchange_rate - discount
  END
) STORED;

-- Mise à jour des triggers pour calculer les totaux avec remises
CREATE OR REPLACE FUNCTION calculate_transaction_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculer le sous-total (somme des montants nets)
  NEW.subtotal = (
    SELECT COALESCE(SUM(net_amount), 0)
    FROM transaction_items
    WHERE transaction_id = NEW.id
  );
  
  -- Calculer la TVA (19% du sous-total)
  NEW.vat = NEW.subtotal * 0.19;
  
  -- Calculer le total (sous-total + TVA + timbre fiscal)
  NEW.total = NEW.subtotal + NEW.vat + NEW.fiscal_stamp;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Mise à jour des triggers pour les bons de commande
CREATE OR REPLACE FUNCTION calculate_purchase_order_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculer le sous-total (somme des montants nets)
  NEW.subtotal = (
    SELECT COALESCE(SUM(net_amount), 0)
    FROM purchase_order_items
    WHERE purchase_order_id = NEW.id
  );
  
  -- Calculer la TVA (19% du sous-total pour les achats locaux)
  NEW.vat = CASE 
    WHEN NEW.type = 'local' THEN NEW.subtotal * 0.19
    ELSE 0
  END;
  
  -- Calculer le total (sous-total + TVA)
  NEW.total = NEW.subtotal + NEW.vat;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Mise à jour des triggers pour les bons de réception
CREATE OR REPLACE FUNCTION calculate_purchase_receipt_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculer le sous-total (somme des montants nets)
  NEW.subtotal = (
    SELECT COALESCE(SUM(net_amount), 0)
    FROM purchase_receipt_items
    WHERE purchase_receipt_id = NEW.id
  );
  
  -- Calculer la TVA (19% du sous-total pour les achats locaux)
  NEW.vat = CASE 
    WHEN NEW.type = 'local' THEN NEW.subtotal * 0.19
    ELSE 0
  END;
  
  -- Calculer le total (sous-total + TVA)
  NEW.total = NEW.subtotal + NEW.vat;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Mise à jour des triggers pour les retours
CREATE OR REPLACE FUNCTION calculate_purchase_return_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculer le sous-total (somme des montants nets)
  NEW.subtotal = (
    SELECT COALESCE(SUM(net_amount), 0)
    FROM purchase_return_items
    WHERE purchase_return_id = NEW.id
  );
  
  -- Calculer la TVA (19% du sous-total pour les achats locaux)
  NEW.vat = CASE 
    WHEN NEW.type = 'local' THEN NEW.subtotal * 0.19
    ELSE 0
  END;
  
  -- Calculer le total (sous-total + TVA)
  NEW.total = NEW.subtotal + NEW.vat;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer les triggers
DROP TRIGGER IF EXISTS update_transaction_totals ON transactions;
CREATE TRIGGER update_transaction_totals
  BEFORE INSERT OR UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION calculate_transaction_totals();

DROP TRIGGER IF EXISTS update_purchase_order_totals ON purchase_orders;
CREATE TRIGGER update_purchase_order_totals
  BEFORE INSERT OR UPDATE ON purchase_orders
  FOR EACH ROW
  EXECUTE FUNCTION calculate_purchase_order_totals();

DROP TRIGGER IF EXISTS update_purchase_receipt_totals ON purchase_receipts;
CREATE TRIGGER update_purchase_receipt_totals
  BEFORE INSERT OR UPDATE ON purchase_receipts
  FOR EACH ROW
  EXECUTE FUNCTION calculate_purchase_receipt_totals();

DROP TRIGGER IF EXISTS update_purchase_return_totals ON purchase_returns;
CREATE TRIGGER update_purchase_return_totals
  BEFORE INSERT OR UPDATE ON purchase_returns
  FOR EACH ROW
  EXECUTE FUNCTION calculate_purchase_return_totals();