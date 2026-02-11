-- Create Admin User for Thanvi Trader
-- Run this in Supabase SQL Editor after the main schema

-- Step 1: First, you need to create the admin user in Supabase Auth
-- Go to Authentication → Users → Add User
-- Email: admin@thanvitrader.local
-- Password: admin123
-- After creating, copy the user ID and replace 'YOUR_ADMIN_USER_ID' below

-- Step 2: Then run this SQL to create the admin profile
-- Replace 'YOUR_ADMIN_USER_ID' with the actual UUID from Step 1

INSERT INTO public.profiles (id, username, role)
VALUES ('YOUR_ADMIN_USER_ID', 'admin', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Note: You can find the user ID in Authentication → Users table
-- It looks like: 12345678-1234-1234-1234-123456789abc
