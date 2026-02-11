# Admin User Setup Guide

## Create Admin Account in Supabase

Follow these steps to create your admin account:

### Step 1: Create Admin User in Supabase Auth

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your "Thanvi Trader" project
3. Click on **Authentication** in the left sidebar
4. Click on **Users** tab
5. Click the **Add User** button (top right)
6. Fill in the form:
   - **Email**: `admin@thanvitrader.local`
   - **Password**: `admin123` (or choose your own secure password)
   - **Auto Confirm User**: ✅ Check this box (important!)
7. Click **Create User**
8. **IMPORTANT**: Copy the User ID (UUID) that appears in the users table
   - It looks like: `12345678-1234-1234-1234-123456789abc`

### Step 2: Create Admin Profile

1. Go to **SQL Editor** in the left sidebar
2. Click **New query**
3. Paste this SQL (replace `YOUR_ADMIN_USER_ID` with the UUID from Step 1):

```sql
INSERT INTO public.profiles (id, username, role)
VALUES ('YOUR_ADMIN_USER_ID', 'admin', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

4. Click **Run**
5. You should see "Success. 1 rows affected"

### Step 3: Verify Admin Account

1. Go to **Table Editor** → **profiles**
2. You should see your admin user with:
   - username: `admin`
   - role: `admin`

### Step 4: Test Login

1. Start your application: `npm run dev`
2. Go to the login page
3. Login with:
   - **Username**: `admin`
   - **Password**: `admin123` (or the password you chose)

## Important Notes

- The username is `admin` (not the email)
- The app converts usernames to email format internally: `admin@thanvitrader.local`
- You can change the admin password later in Supabase Auth → Users
- For security, change the default password after first login

## Troubleshooting

**Problem**: Can't login with admin credentials
- **Solution**: Make sure you checked "Auto Confirm User" when creating the user
- Go to Authentication → Users → Find admin user → Click on it → Check if "Email Confirmed" is true

**Problem**: "User not found" error
- **Solution**: Make sure you created the profile in Step 2 with the correct user ID

**Problem**: Login works but shows as customer, not admin
- **Solution**: Check the profiles table - the role should be 'admin', not 'customer'
