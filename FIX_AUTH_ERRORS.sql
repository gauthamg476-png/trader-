-- FIX AUTH ERRORS - Create admin profile and check existing users
-- Run this in Supabase SQL Editor to fix the authentication issues

-- Step 1: Check if admin profile exists
SELECT 'Current Admin Check' as info, id, username, role FROM public.profiles WHERE username = 'admin';

-- Step 2: Create admin profile if it doesn't exist
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
)
ON CONFLICT (username) DO UPDATE SET
    role = 'admin',
    email = 'admin@thanvitrader.local',
    updated_at = NOW();

-- Step 3: Check all existing profiles
SELECT 'All Profiles' as info, id, username, email, role FROM public.profiles ORDER BY created_at;

-- Step 4: Check if there are any auth users causing the 400 errors
-- This will help identify if there are orphaned auth attempts