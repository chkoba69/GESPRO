/*
  # Add Product Pricing Fields

  1. Changes
    - Add purchase price fields (local and foreign currency)
    - Add margin percentage field
    - Add maximum discount field
    - Add currency field
    - Add exchange rate field

  2. Constraints
    - Ensure margin percentage is between 0 and 100
    - Ensure maximum discount is between 0 and 100
    - Ensure exchange rate is positive
*/

-- Add new columns to products table
ALTER TABLE products
ADD COLUMN purchase_price_local decimal(10,3) NOT NULL DEFAULT 0,
ADD COLUMN purchase_price_foreign decimal(10,3),
ADD COLUMN currency text DEFAULT 'TND',
ADD COLUMN exchange_rate decimal(10,3) DEFAULT 1,
ADD COLUMN margin_percentage decimal(5,2) CHECK (margin_percentage BETWEEN 0 AND 100),
ADD COLUMN max_discount decimal(5,2) CHECK (max_discount BETWEEN 0 AND 100),
ADD CONSTRAINT check_exchange_rate CHECK (exchange_rate > 0);

-- Create trigger to update retail, wholesale and bulk prices based on margin
CREATE OR REPLACE FUNCTION update_product_prices()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate the base purchase price in local currency
  NEW.purchase_price_local = CASE
    WHEN NEW.purchase_price_foreign IS NOT NULL THEN
      NEW.purchase_price_foreign * NEW.exchange_rate
    ELSE
      NEW.purchase_price_local
  END;

  -- Update prices based on margin if margin_percentage is set
  IF NEW.margin_percentage IS NOT NULL THEN
    NEW.retail_price = ROUND(NEW.purchase_price_local * (1 + NEW.margin_percentage / 100), 3);
    NEW.wholesale_price = ROUND(NEW.purchase_price_local * (1 + (NEW.margin_percentage * 0.8) / 100), 3);
    NEW.bulk_price = ROUND(NEW.purchase_price_local * (1 + (NEW.margin_percentage * 0.6) / 100), 3);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_update_product_prices
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_product_prices();