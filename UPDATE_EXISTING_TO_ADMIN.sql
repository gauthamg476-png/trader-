-- UPDATE EXISTING PROFILE TO ADMIN
-- Since the profile already exists, just update it to admin role

-- Step 1: Check what profiles exist
SELECT 'Existing Profiles' as info, id, username, email, role FROM public.profiles;

-- Step 2: Update existing profile to admin (using the ID from error)
UPDATE public.profiles 
SET 
    username = 'admin',
    email = 'admin@thanvitrader.local',
    role = 'admin',
    updated_at = NOW()
WHERE id = 'd5921166-0745-46fa-a865-4865a36a732e';

-- Step 3: Also update any profile with username 'admin' if it exists
UPDATE public.profiles 
SET 
    role = 'admin',
    email = 'admin@thanvitrader.local',
    updated_at = NOW()
WHERE username = 'admin';

-- Step 4: Verify admin profile exists
SELECT 'Admin Profile Updated' as status, id, username, email, role FROM public.profiles WHERE role = 'admin';

-- This should show the admin profile ready for login