-- Add payment fields to orders table
-- Run this in your Supabase SQL editor

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20),
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS advance_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS remaining_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS advance_paid_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS full_payment_at TIMESTAMP;

-- Create index for payment queries
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON orders(payment_method);

-- Update existing orders to have default payment information
UPDATE orders 
SET 
  payment_method = 'razorpay',
  payment_status = 'fully_paid',
  advance_amount = total_price,
  remaining_amount = 0,
  full_payment_at = created_at
WHERE payment_method IS NULL;