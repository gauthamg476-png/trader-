-- Create Admin User in Supabase
-- Run this in your Supabase SQL Editor

-- First, create the admin user in Supabase Auth
-- Note: This creates the auth user with internal email format
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@thanvitrader.local',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Get the admin user ID
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Get the admin user ID
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'admin@thanvitrader.local';
    
    -- Create admin profile
    INSERT INTO public.profiles (
        id,
        username,
        email,
        role,
        business_type,
        created_at
    ) VALUES (
        admin_user_id,
        'admin',
        'admin@balajicotrader.com',
        'admin',
        NULL,
        now()
    ) ON CONFLICT (id) DO UPDATE SET
        username = 'admin',
        email = 'admin@balajicotrader.com',
        role = 'admin';
        
    RAISE NOTICE 'Admin user created with ID: %', admin_user_id;
END $$;