-- Fix RLS Policy for Products Table
-- This allows anyone to view products without authentication

-- Drop the existing policy
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;

-- Create a new policy that works for both authenticated and anonymous users
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (true);

-- Verify products exist
SELECT * FROM public.products ORDER BY id;
