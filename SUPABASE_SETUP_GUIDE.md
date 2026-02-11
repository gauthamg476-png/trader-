# Supabase Migration Setup Guide

## 🎯 Overview
This guide will help you migrate your Thanvi Trader application from localStorage to Supabase database.

---

## ✅ Step 1: Create Supabase Account

1. **Go to**: https://supabase.com
2. **Click**: "Start your project"
3. **Sign up** with GitHub or Email
4. **Create Organization**: 
   - Name: `Thanvi Trader` or your company name
   - Click "Create organization"

---

## ✅ Step 2: Create New Project

1. **Click**: "New Project"
2. **Fill in details**:
   - **Name**: `thanvi-trader` (or `tradewise-dashboard`)
   - **Database Password**: Create a strong password
     - ⚠️ **IMPORTANT**: Save this password securely! You'll need it for database access
     - Example: `MySecurePass123!@#`
   - **Region**: Choose closest to your location
     - India: `ap-south-1` (Mumbai)
     - Singapore: `ap-southeast-1`
     - US: `us-east-1`
   - **Pricing Plan**: Select **Free** (500MB database, 2GB bandwidth)
3. **Click**: "Create new project"
4. **Wait**: 2-3 minutes for project setup

---

## ✅ Step 3: Get Your Supabase Credentials

Once your project is ready:

1. **Go to**: Project Settings (gear icon in sidebar)
2. **Click**: "API" in the left menu
3. **Copy these two values**:

   **A. Project URL**
   ```
   Example: https://abcdefghijklmnop.supabase.co
   ```
   
   **B. Anon/Public Key** (under "Project API keys")
   ```
   Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## ✅ Step 4: Run Database Schema

1. **In Supabase Dashboard**, click "SQL Editor" in the sidebar
2. **Click**: "New query"
3. **Open the file**: `supabase-schema.sql` (in your project root)
4. **Copy ALL the SQL code** from that file
5. **Paste** it into the Supabase SQL Editor
6. **Click**: "Run" button (or press Ctrl+Enter)
7. **Wait** for success message: "Success. No rows returned"

This creates all your database tables:
- ✅ profiles (users)
- ✅ products (with default dal products)
- ✅ orders
- ✅ catering_orders
- ✅ inquiries
- ✅ notifications
- ✅ id_counters

---

## ✅ Step 5: Update Environment Variables

1. **Open**: `.env` file in your project
2. **Find these lines**:
   ```env
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```
3. **Replace** with your actual values from Step 3:
   ```env
   VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. **Save** the file

---

## ✅ Step 6: Create Admin User

You need to create an admin account in Supabase:

### Option A: Using Supabase Dashboard (Recommended)

1. **Go to**: Authentication → Users (in Supabase dashboard)
2. **Click**: "Add user" → "Create new user"
3. **Fill in**:
   - Email: `admin@thanvitrader.com` (or your email)
   - Password: Create a strong password
   - Auto Confirm User: ✅ **Check this box**
4. **Click**: "Create user"
5. **Copy the User ID** (UUID like: `123e4567-e89b-12d3-a456-426614174000`)

### Option B: Using SQL Editor

Run this SQL in Supabase SQL Editor:

```sql
-- Insert admin profile (replace the UUID with your user ID from auth.users)
INSERT INTO public.profiles (id, username, role, business_type)
VALUES (
  'YOUR_USER_ID_HERE',  -- Replace with actual UUID from auth.users
  'admin',
  'admin',
  NULL
);
```

---

## ✅ Step 7: Restart Your Application

1. **Stop** the dev server (Ctrl+C in terminal)
2. **Start** it again:
   ```bash
   npm run dev
   ```
3. **Open**: http://localhost:8081

---

## ✅ Step 8: Test the Migration

### Test Authentication:
1. **Sign up** a new customer account
2. **Select** business type
3. **Login** with the account
4. **Verify** you can access the dashboard

### Test Orders:
1. **Place** a regular order
2. **Check** if it appears in "My Orders"
3. **Login as admin** (use the admin account you created)
4. **Verify** order appears in admin panel

### Test Catering:
1. **Place** a catering order
2. **Check** if it appears in "My Orders"
3. **As admin**, update the catering order status
4. **Verify** status updates in customer view

---

## 🔍 Troubleshooting

### Error: "Missing Supabase credentials"
- ✅ Check `.env` file has correct URL and key
- ✅ Restart dev server after updating `.env`
- ✅ Make sure keys don't have extra spaces

### Error: "relation does not exist"
- ✅ Run the `supabase-schema.sql` in SQL Editor
- ✅ Check all tables were created in Database → Tables

### Can't login as admin:
- ✅ Create admin user in Authentication → Users
- ✅ Insert admin profile in `profiles` table
- ✅ Make sure `role` is set to `'admin'`

### Orders not showing:
- ✅ Check Row Level Security policies are enabled
- ✅ Verify user is authenticated
- ✅ Check browser console for errors

---

## 📊 Verify Database Setup

In Supabase Dashboard → Database → Tables, you should see:

- ✅ profiles
- ✅ products (with 4 dal products)
- ✅ orders (empty initially)
- ✅ catering_orders (empty initially)
- ✅ inquiries (empty initially)
- ✅ notifications (empty initially)
- ✅ id_counters (empty initially)

---

## 🎉 Success!

Once everything is working:
- ✅ Data persists across browser sessions
- ✅ Multiple users can use the app simultaneously
- ✅ Data is secure and backed up
- ✅ Ready for production deployment!

---

## 📝 Next Steps

After migration is complete, you can:
1. Deploy to production (Vercel, Netlify, etc.)
2. Set up custom domain
3. Configure email notifications
4. Add more features!

---

## 🆘 Need Help?

If you encounter any issues:
1. Check Supabase logs: Project → Logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Make sure database schema was run successfully

---

**Created by**: Kiro AI Assistant
**Date**: February 10, 2026
**Project**: Thanvi Trader - Supabase Migration
