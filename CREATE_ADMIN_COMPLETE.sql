-- COMPLETE ADMIN CREATION - Run this in Supabase SQL Editor
-- This creates both auth user and profile for admin access

-- Step 1: Clean up any existing admin entries
DELETE FROM auth.users WHERE email = 'admin@thanvitrader.local';
DELETE FROM public.profiles WHERE username = 'admin';

-- Step 2: Create auth user in Supabase Auth
-- Note: This creates the user with encrypted password
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000001',
    'authenticated',
    'authenticated',
    'admin@thanvitrader.local',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);

-- Step 3: Create identity for the auth user
INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '{"sub":"00000000-0000-0000-0000-000000000001","email":"admin@thanvitrader.local"}',
    'email',
    NOW(),
    NOW(),
    NOW()
);

-- Step 4: Create profile for the admin user
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

-- Step 5: Verify creation
SELECT 'Auth User Created' as status, email FROM auth.users WHERE email = 'admin@thanvitrader.local'
UNION ALL
SELECT 'Profile Created' as status, username FROM public.profiles WHERE username = 'admin';

-- Expected result: Should show both "Auth User Created" and "Profile Created"