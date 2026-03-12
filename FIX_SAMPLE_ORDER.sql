-- Fix Sample Order with Correct Customer ID
-- Run this in Supabase SQL Editor

-- Step 1: Get the admin profile ID to use as customer
SELECT 
  '🔍 ADMIN PROFILE ID' as info,
  id as admin_id,
  username,
  email
FROM public.profiles 
WHERE role = 'admin';

-- Step 2: Create sample order using admin profile ID
WITH admin_profile AS (
  SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1
)
INSERT INTO public.orders (
  id, 
  customer_id, 
  customer_name, 
  product_id, 
  product_name, 
  quantity, 
  price_per_unit, 
  total_price,
  subtotal,
  shipping_cost,
  shipping_percentage,
  status, 
  estimated_delivery,
  contact_phone,
  delivery_address,
  created_at
) 
SELECT 
  'OR-240312-00001',
  admin_profile.id,
  'Test Customer',
  'prod-001',
  'Toor Dal (Thuvaramparuppu)',
  10,
  120.00,
  1320.00,
  1200.00,
  120.00,
  10.0,
  'pending',
  CURRENT_DATE + INTERVAL '3 days',
  '+91 98765 43210',
  '123 Test Street, Test City, Test State 123456',
  NOW()
FROM admin_profile
ON CONFLICT (id) DO NOTHING;

-- Step 3: Create another sample order
WITH admin_profile AS (
  SELECT id FROM public.profiles WHERE role = 'admin' LIMIT 1
)
INSERT INTO public.orders (
  id, 
  customer_id, 
  customer_name, 
  product_id, 
  product_name, 
  quantity, 
  price_per_unit, 
  total_price,
  subtotal,
  shipping_cost,
  shipping_percentage,
  status, 
  estimated_delivery,
  contact_phone,
  delivery_address,
  created_at
) 
SELECT 
  'OR-240312-00002',
  admin_profile.id,
  'Another Customer',
  'prod-002',
  'Moong Dal (Pachaipayaru)',
  25,
  135.00,
  3712.50,
  3375.00,
  337.50,
  10.0,
  'confirmed',
  CURRENT_DATE + INTERVAL '3 days',
  '+91 98765 43211',
  '456 Another Street, Another City, Another State 654321',
  NOW() - INTERVAL '1 day'
FROM admin_profile
ON CONFLICT (id) DO NOTHING;

-- Step 4: Verify orders were created
SELECT 
  '✅ ORDERS CREATED' as status,
  COUNT(*) as order_count
FROM public.orders;

-- Step 5: Show all orders
SELECT 
  '📋 ALL ORDERS' as info,
  id,
  customer_name,
  product_name,
  quantity,
  total_price,
  status,
  created_at
FROM public.orders
ORDER BY created_at DESC;

-- Step 6: Final success message
SELECT 
  '🎉 SAMPLE ORDERS READY' as status,
  'Refresh your admin dashboard now' as instruction;