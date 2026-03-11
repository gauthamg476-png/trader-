-- ADMIN BYPASS SOLUTION - No OTP Required
-- This creates admin directly in the database without going through signup

-- Step 1: Clean up any existing admin entries
DELETE FROM auth.users WHERE email = 'admin@thanvitrader.local';
DELETE FROM public.profiles WHERE username = 'admin';

-- Step 2: Create a simple profile-only admin (bypass auth)
-- This works because the app checks profiles table for role
INSERT INTO public.profiles (
    id,
    username,
    email,
    role,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin',
    'admin@thanvitrader.local',
    'admin',
    NOW(),
    NOW()
);

-- Step 3: Verify admin profile created
SELECT 'Admin Profile Created' as status, username, role FROM public.profiles WHERE username = 'admin';

-- Note: This creates admin profile without Supabase Auth
-- You'll need to modify login to bypass auth for admin user