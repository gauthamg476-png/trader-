-- CHECK AND FIX EXISTING ADMIN
-- The admin username already exists, just need to make sure it has admin role

-- Step 1: Check current admin profile
SELECT 'Current Admin Profile' as info, id, username, email, role FROM public.profiles WHERE username = 'admin';

-- Step 2: Update existing admin to have admin role (just in case)
UPDATE public.profiles 
SET 
    role = 'admin',
    email = 'admin@thanvitrader.local',
    updated_at = NOW()
WHERE username = 'admin';

-- Step 3: Verify admin is ready
SELECT 'Admin Profile Ready' as status, id, username, email, role FROM public.profiles WHERE username = 'admin';

-- The admin should now be ready for login!