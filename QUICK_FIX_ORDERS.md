# Quick Fix for Orders Not Showing

## The Problem
Your orders are in the database but with wrong customer IDs, so they don't show up in "My Orders".

## The Solution
Run this SQL in Supabase to fix the customer IDs:

### Step 1: Go to Supabase SQL Editor
1. Open https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor" in left sidebar
4. Click "New query"

### Step 2: Run This SQL

```sql
-- Fix customer IDs for all orders by gautham01
UPDATE orders 
SET customer_id = (SELECT auth.uid())
WHERE customer_name = 'gautham01';

UPDATE catering_orders 
SET customer_id = (SELECT auth.uid())
WHERE customer_name = 'gautham01';
```

### Step 3: Verify It Worked

```sql
-- Check orders
SELECT id, customer_id, customer_name, product_name, cancelled_at, cancellation_reason 
FROM orders 
WHERE customer_name = 'gautham01';

-- Check catering orders
SELECT id, customer_id, customer_name, event_name, cancelled_at, cancellation_reason 
FROM catering_orders 
WHERE customer_name = 'gautham01';
```

You should see:
- `cancelled_at`: timestamp (if order was cancelled)
- `cancellation_reason`: text (if order was cancelled)

### Step 4: Refresh Your Browser
1. Go back to http://localhost:8081/my-orders
2. Press **Ctrl + Shift + R** (hard refresh)
3. Your orders should now appear!

## Why This Happened
When orders were created, the customer_id was stored incorrectly (truncated UUID). This SQL fixes it by matching the customer_name instead.

## After the Fix
- All your orders will show in "My Orders"
- Cancelled orders will show RED "CANCELLED" badge
- You'll see cancellation reasons
- Everything will work correctly
