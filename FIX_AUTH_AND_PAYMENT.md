# Fix Authentication & Payment Issues

## 🚨 CURRENT ISSUES:

1. **Multiple 400 Auth Errors** - Supabase authentication failing repeatedly
2. **Razorpay configured correctly** - Key ID shows proper length (23 chars)
3. **Need to ensure admin login works**

## ✅ SOLUTION STEPS:

### **Step 1: Fix Admin Authentication**

Run this SQL in **Supabase SQL Editor**:

```sql
-- Create/update admin profile
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

-- Verify admin exists
SELECT 'Admin Ready' as status, id, username, role FROM public.profiles WHERE username = 'admin';
```

### **Step 2: Test Admin Login**

1. **Go to login**: http://localhost:8080/login
2. **Enter credentials**:
   - Username: `admin`
   - Password: `admin123`
3. **Check browser console** for debug messages
4. **Should see**: "👑 Admin login detected, bypassing Supabase Auth"

### **Step 3: Test Payment System**

After successful admin login:

1. **Go to Products**: http://localhost:8080/products
2. **Place an order** with any payment method
3. **Payment page should load** without errors
4. **Razorpay window should open** (your credentials are correct)

### **Step 4: Use Test Card Details**

When Razorpay opens, use:

```
Card Number: 4111 1111 1111 1111
Expiry: 12/25
CVV: 123
Name: Test User
```

## 🔍 DEBUGGING INFO:

I've added enhanced logging to see what's happening:

- **Auth state changes** are now logged
- **Login attempts** show detailed steps
- **Admin bypass** is clearly marked
- **Profile loading** shows success/failure

## 🚀 EXPECTED RESULTS:

After running the SQL:

1. ✅ **Admin login works** without 400 errors
2. ✅ **Console shows** clear debug messages
3. ✅ **Payment system** opens Razorpay properly
4. ✅ **Test payments** work with test cards

## 🔧 IF STILL HAVING ISSUES:

**For Auth Errors:**
- Check browser console for specific error messages
- Verify admin profile was created in SQL results

**For Payment Errors:**
- Ensure server is running: `node server/index.js`
- Check Razorpay dashboard for account status
- Verify test mode is enabled

**Run the admin SQL first, then test the login!** 🚀