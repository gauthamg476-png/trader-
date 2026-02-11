-- Add cancellation fields to orders table
-- Run this in Supabase SQL Editor

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;

-- Add cancellation fields to catering_orders table
ALTER TABLE public.catering_orders 
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' AND column_name IN ('cancelled_at', 'cancellation_reason');

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'catering_orders' AND column_name IN ('cancelled_at', 'cancellation_reason');
