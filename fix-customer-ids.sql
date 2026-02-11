-- Fix Customer IDs in Orders
-- This updates all orders to use the correct full UUID

-- First, let's see what user IDs we have
-- Run this in Supabase SQL Editor to see your actual user ID:
-- SELECT id, email FROM auth.users;

-- Then update orders with the correct customer_id
-- Replace 'YOUR_CORRECT_USER_ID' with your actual UUID from above query

-- Example: If your user ID is c610844c-7888-4c80-855b-f2b8bfbe4790
-- UPDATE orders 
-- SET customer_id = 'c610844c-7888-4c80-855b-f2b8bfbe4790'
-- WHERE customer_id LIKE '%7888-4c80-855b%';

-- UPDATE catering_orders 
-- SET customer_id = 'c610844c-7888-4c80-855b-f2b8bfbe4790'
-- WHERE customer_id LIKE '%7888-4c80-855b%';

-- OR if you want to update ALL orders to your current user:
-- First get your user ID by running: SELECT auth.uid();
-- Then run:

UPDATE orders 
SET customer_id = (SELECT auth.uid())
WHERE customer_name = 'gautham01';

UPDATE catering_orders 
SET customer_id = (SELECT auth.uid())
WHERE customer_name = 'gautham01';

-- Verify the update:
SELECT id, customer_id, customer_name, product_name, cancelled_at, cancellation_reason 
FROM orders 
WHERE customer_name = 'gautham01';

SELECT id, customer_id, customer_name, event_name, cancelled_at, cancellation_reason 
FROM catering_orders 
WHERE customer_name = 'gautham01';
