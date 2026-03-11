# Recreate Admin User - FINAL SOLUTION

## 🚨 Issue: Admin user deleted from Supabase

You accidentally deleted the admin user and can't access the admin panel.

## ✅ WORKING SOLUTION: Complete Auth + Profile Creation

The login system requires BOTH a Supabase Auth user AND a profile. Run this complete solution:

Go to **Supabase Dashboard → SQL Editor** and run the script from `CREATE_ADMIN_COMPLETE.sql`:

```sql
-- COMPLETE ADMIN CREATION - Creates both auth user and profile

-- Step 1: Clean up any existing admin entries
DELETE FROM auth.users WHERE email = 'admin@thanvitrader.local';
DELETE FROM public.profiles WHERE username = 'admin';

-- Step 2: Create auth user with encrypted password
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

-- Step 3: Create identity
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

-- Step 4: Create profile
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
```

## 🔑 Admin Login Credentials

After running the SQL:

- **URL**: http://localhost:8080/login
- **Username**: `admin`
- **Password**: `admin123`

## 🧪 Test Admin Access

1. **Go to login page**: http://localhost:8080/login
2. **Enter credentials**:
   - Username: `admin`
   - Password: `admin123`
3. **Should redirect to**: Admin dashboard
4. **Check admin features**: Orders, products, customers, analytics

## 🔧 Alternative: Simple Method (If Above Fails)

If the complete method doesn't work, try this simpler approach:

1. **Go to signup**: http://localhost:8080/signup
2. **Create new user**:
   - Username: `admin`
   - Password: `admin123`
3. **Then run this SQL** to make them admin:

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE username = 'admin';
```

## ✅ Verification

After creating admin:

1. ✅ **Login works** with admin/admin123
2. ✅ **Admin dashboard** is accessible
3. ✅ **Admin menu** shows all options
4. ✅ **Can manage** orders, products, customers

## 🚀 Why This Works

The authentication system requires:
1. **Supabase Auth User** - for login authentication
2. **Profile Entry** - for role and user data
3. **Matching IDs** - both must have the same UUID

The complete SQL creates all three components properly.

**Run the complete SQL script first - it should work!** 🚀