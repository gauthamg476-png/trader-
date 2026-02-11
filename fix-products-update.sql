-- Fix Products Update Policy
-- Run this in Supabase SQL Editor

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Only admins can modify products" ON public.products;

-- Create policies for products
CREATE POLICY "Enable read for all" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Enable update for authenticated users" ON public.products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for admins" ON public.products
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Enable delete for admins" ON public.products
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Verify
SELECT * FROM public.products ORDER BY name;
