-- FINAL ADMIN FIX - Run this in Supabase SQL Editor
-- This will create a working admin user

-- Step 1: Clean up any existing admin entries
DELETE FROM public.profiles WHERE username = 'admin';

-- Step 2: Create admin profile with proper UUID
INSERT INTO public.profiles (
    id,
    username,
    email,
    role,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'admin',
    'admin@thanvitrader.local',
    'admin',
    now(),
    now()
);

-- Step 3: Verify admin was created
SELECT * FROM public.profiles WHERE username = 'admin';

-- Expected result: Should show one row with username='admin', role='admin'