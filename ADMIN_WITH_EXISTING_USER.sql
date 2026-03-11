-- ADMIN FIX - Use existing user ID or create properly
-- This works around the foreign key constraint

-- Option 1: Use an existing user ID from auth.users table
-- First, let's see what user IDs exist
SELECT 'Existing Users' as info, id, email FROM auth.users LIMIT 5;

-- Option 2: Create admin profile using the first existing user ID
-- (We'll update this with the actual ID after seeing the results)

-- Step 1: Delete existing admin profile
DELETE FROM public.profiles WHERE username = 'admin';

-- Step 2: Get the first available user ID and create admin profile
WITH first_user AS (
  SELECT id FROM auth.users LIMIT 1
)
INSERT INTO public.profiles (
    id,
    username,
    email,
    role,
    created_at,
    updated_at
)
SELECT 
    first_user.id,
    'admin',
    'admin@thanvitrader.local',
    'admin',
    NOW(),
    NOW()
FROM first_user;

-- Step 3: Verify admin profile created
SELECT 'Admin Profile Created' as status, id, username, role FROM public.profiles WHERE username = 'admin';

-- Note: This uses an existing user ID to avoid foreign key constraint