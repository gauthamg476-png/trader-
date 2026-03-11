-- Add shipping fields to orders table
-- Run this in your Supabase SQL editor

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS shipping_percentage DECIMAL(5,2);

-- Update existing orders to have shipping information
-- This will calculate shipping for existing orders based on current rules
UPDATE orders 
SET 
  subtotal = quantity * price_per_unit,
  shipping_cost = CASE 
    WHEN quantity <= 15 THEN ROUND((quantity * price_per_unit * 0.10), 2)
    WHEN quantity <= 100 THEN ROUND((quantity * price_per_unit * 0.10), 2)
    WHEN quantity <= 500 THEN ROUND((quantity * price_per_unit * 0.09), 2)
    ELSE ROUND((quantity * price_per_unit * 0.08), 2)
  END,
  shipping_percentage = CASE 
    WHEN quantity <= 15 THEN 10
    WHEN quantity <= 100 THEN 10
    WHEN quantity <= 500 THEN 9
    ELSE 8
  END
WHERE subtotal IS NULL;

-- Update total_price to include shipping for existing orders
UPDATE orders 
SET total_price = subtotal + shipping_cost
WHERE subtotal IS NOT NULL AND shipping_cost IS NOT NULL;