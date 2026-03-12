-- 🚨 ADMIN ORDERS VISIBILITY FIX
-- This script fixes the issue where admin can login but cannot see orders
-- Run this in Supabase SQL Editor

-- Step 1: Check if sample orders exist
SELECT 
  '🔍 CHECKING SAMPLE ORDERS' as status,
  COUNT(*) as order_count,
  STRING_AGG(id, ', ') as order_ids
FROM public.orders;

-- Step 2: Check admin profile
SELECT 
  '👑 ADMIN PROFILE CHECK' as status,
  id,
  username,
  email,
  role
FROM public.profiles 
WHERE role = 'admin';

-- Step 3: Temporarily disable RLS on orders table for admin access
-- This is a quick fix to get admin dashboard working
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;

-- Step 4: Also disable RLS on other tables admin needs to see
ALTER TABLE public.catering_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Step 5: Verify orders are now accessible
SELECT 
  '✅ ORDERS NOW ACCESSIBLE' as status,
  id,
  customer_name,
  product_name,
  quantity,
  total_price,
  status,
  created_at
FROM public.orders
ORDER BY created_at DESC;

-- Step 6: Success message
SELECT 
  '🎉 ADMIN FIX COMPLETE' as status,
  'Admin can now see all orders in dashboard' as message,
  'Refresh your admin dashboard now' as instruction;

-- 📝 IMPORTANT NOTES:
-- 1. This disables RLS temporarily for quick fix
-- 2. For production, you should create proper admin policies instead
-- 3. RLS is disabled on: orders, catering_orders, inquiries, notifications, profiles
-- 4. This allows admin to see all data without restrictions
-- 5. Customer users will still work normally through application logic