-- Find the correct user ID for gautham01

-- Step 1: Check profiles table
SELECT id, username, business_type, created_at 
FROM profiles 
WHERE username = 'gautham01';

-- Step 2: Check auth.users table
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC;

-- Step 3: See all profiles
SELECT id, username, business_type 
FROM profiles 
ORDER BY created_at DESC;

-- Step 4: Check what customer_ids are currently in orders
SELECT DISTINCT customer_id, customer_name 
FROM orders;

-- Step 5: Check what customer_ids are in catering_orders
SELECT DISTINCT customer_id, customer_name 
FROM catering_orders;
