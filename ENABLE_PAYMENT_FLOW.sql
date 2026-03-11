-- ENABLE PAYMENT FLOW - Add missing payment fields to orders table
-- Run this in Supabase SQL Editor to enable the payment system

-- Add payment fields to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20),
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS advance_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS remaining_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS advance_paid_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS full_payment_at TIMESTAMP;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name IN ('payment_method', 'payment_status', 'advance_amount', 'remaining_amount', 'razorpay_order_id', 'razorpay_payment_id');

-- Expected result: Should show all 6 payment columns