/*
  # Update VAT handling for international purchases

  1. Changes
    - Add `vat_applicable` column to purchase_orders, purchase_receipts, and purchase_returns tables
    - Set default value to true for local purchases and false for international purchases
    - Add check constraints to ensure VAT is 0 for international purchases

  2. Security
    - Maintain existing RLS policies
*/

-- Add vat_applicable column to purchase_orders
ALTER TABLE purchase_orders 
ADD COLUMN vat_applicable boolean GENERATED ALWAYS AS (type = 'local') STORED;

-- Add vat_applicable column to purchase_receipts
ALTER TABLE purchase_receipts 
ADD COLUMN vat_applicable boolean GENERATED ALWAYS AS (type = 'local') STORED;

-- Add vat_applicable column to purchase_returns
ALTER TABLE purchase_returns 
ADD COLUMN vat_applicable boolean GENERATED ALWAYS AS (type = 'local') STORED;

-- Add check constraints to ensure VAT is 0 for international purchases
ALTER TABLE purchase_orders 
ADD CONSTRAINT check_vat_international 
CHECK (
  (type = 'international' AND vat = 0) OR 
  type = 'local'
);

ALTER TABLE purchase_receipts 
ADD CONSTRAINT check_vat_international 
CHECK (
  (type = 'international' AND vat = 0) OR 
  type = 'local'
);

ALTER TABLE purchase_returns 
ADD CONSTRAINT check_vat_international 
CHECK (
  (type = 'international' AND vat = 0) OR 
  type = 'local'
);

-- Add indexes for the new columns
CREATE INDEX idx_purchase_orders_vat_applicable ON purchase_orders(vat_applicable);
CREATE INDEX idx_purchase_receipts_vat_applicable ON purchase_receipts(vat_applicable);
CREATE INDEX idx_purchase_returns_vat_applicable ON purchase_returns(vat_applicable);