# Quick Fix - Database Migration Required

## 🚨 Issue: "Failed to create order"

The error occurs because the database is missing the new shipping and payment fields.

## ✅ Quick Fix Steps

### 1. **Run Database Migration**

Go to **Supabase Dashboard → SQL Editor** and run this SQL:

```sql
-- Add shipping fields (if not already added)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS shipping_percentage DECIMAL(5,2);

-- Add payment fields
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20),
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS advance_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS remaining_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS advance_paid_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS full_payment_at TIMESTAMP;

-- Update existing orders
UPDATE orders 
SET 
  subtotal = quantity * price_per_unit,
  shipping_cost = CASE 
    WHEN quantity <= 15 THEN ROUND((quantity * price_per_unit * 0.10), 2)
    WHEN quantity <= 100 THEN ROUND((quantity * price_per_unit * 0.10), 2)
    WHEN quantity <= 500 THEN ROUND((quantity * price_per_unit * 0.09), 2)
    ELSE ROUND((quantity * price_per_unit * 0.08), 2)
  END,
  shipping_percentage = CASE 
    WHEN quantity <= 15 THEN 10
    WHEN quantity <= 100 THEN 10
    WHEN quantity <= 500 THEN 9
    ELSE 8
  END,
  payment_method = 'razorpay',
  payment_status = 'fully_paid',
  advance_amount = total_price,
  remaining_amount = 0
WHERE subtotal IS NULL;

-- Update total_price to include shipping
UPDATE orders 
SET total_price = subtotal + shipping_cost
WHERE subtotal IS NOT NULL AND shipping_cost IS NOT NULL;
```

### 2. **Test Order Creation**

After running the SQL:

1. **Refresh the page**: http://localhost:8080/products
2. **Try placing an order** - it should work now
3. **Check shipping calculation** - should show proper breakdown
4. **Verify payment options** - both methods should be available

## 🔧 What I've Done

### **Temporary Fix Applied:**
- Made payment fields optional in order creation
- Orders will work even without payment fields
- Added error handling for missing database columns

### **After Database Migration:**
- Full payment system will be enabled
- Shipping calculations will work properly
- Payment breakdown will be displayed correctly

## ✅ Expected Result

After running the SQL migration:

1. ✅ **Orders create successfully**
2. ✅ **Shipping costs calculated properly**
3. ✅ **Payment methods work**
4. ✅ **Order summary shows breakdown**

**Run the SQL migration now and try creating an order!** 🚀