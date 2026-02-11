-- Fix RLS Policy to Allow Cancellation Updates
-- This allows users to update their own orders' cancelled_at and cancellation_reason fields

-- Drop existing update policy for orders
DROP POLICY IF EXISTS "Users can update their own orders" ON orders;

-- Create new update policy that allows cancellation
CREATE POLICY "Users can update their own orders"
ON orders
FOR UPDATE
TO authenticated
USING (customer_id = auth.uid())
WITH CHECK (customer_id = auth.uid());

-- Same for catering orders
DROP POLICY IF EXISTS "Users can update their own catering orders" ON catering_orders;

CREATE POLICY "Users can update their own catering orders"
ON catering_orders
FOR UPDATE
TO authenticated
USING (customer_id = auth.uid())
WITH CHECK (customer_id = auth.uid());

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('orders', 'catering_orders')
ORDER BY tablename, policyname;
