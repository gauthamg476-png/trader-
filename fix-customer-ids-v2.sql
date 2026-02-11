-- Fix Customer IDs - Version 2
-- This uses your actual user ID from the console

-- Your user ID from console: c610844c-7888-4c80-855b-f2b8bfbe4790

-- Fix orders
UPDATE orders 
SET customer_id = 'c610844c-7888-4c80-855b-f2b8bfbe4790'
WHERE customer_name = 'gautham01';

-- Fix catering orders
UPDATE catering_orders 
SET customer_id = 'c610844c-7888-4c80-855b-f2b8bfbe4790'
WHERE customer_name = 'gautham01';

-- Verify the fix
SELECT id, customer_id, customer_name, product_name, cancelled_at, cancellation_reason 
FROM orders 
WHERE customer_name = 'gautham01'
ORDER BY created_at DESC;

SELECT id, customer_id, customer_name, event_name, cancelled_at, cancellation_reason 
FROM catering_orders 
WHERE customer_name = 'gautham01'
ORDER BY created_at DESC;
