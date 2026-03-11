-- SIMPLE ADMIN FIX - Just create/update profile
-- This avoids foreign key constraint issues

-- Step 1: Delete existing admin profile only
DELETE FROM public.profiles WHERE username = 'admin';

-- Step 2: Create new admin profile with unique UUID
INSERT INTO public.profiles (
    id,
    username,
    email,
    role,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'admin',
    'admin@thanvitrader.local',
    'admin',
    NOW(),
    NOW()
);

-- Step 3: Verify admin profile created
SELECT 'Admin Profile Created' as status, id, username, role FROM public.profiles WHERE username = 'admin';

-- This creates admin profile that works with the bypass login