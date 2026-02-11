-- Fix All RLS Policies for Thanvi Trader
-- Run this in Supabase SQL Editor

-- =====================================================
-- ORDERS POLICIES
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;

-- Create new policies
CREATE POLICY "Enable read for users and admins" ON public.orders
  FOR SELECT USING (
    auth.uid() = customer_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Enable insert for authenticated users" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Enable update for admins" ON public.orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- CATERING ORDERS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Users can view own catering orders" ON public.catering_orders;
DROP POLICY IF EXISTS "Users can create catering orders" ON public.catering_orders;
DROP POLICY IF EXISTS "Admins can update catering orders" ON public.catering_orders;

CREATE POLICY "Enable read for users and admins" ON public.catering_orders
  FOR SELECT USING (
    auth.uid() = customer_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Enable insert for authenticated users" ON public.catering_orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Enable update for admins" ON public.catering_orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- INQUIRIES POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Users can view own inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Users can create inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Admins can update inquiries" ON public.inquiries;

CREATE POLICY "Enable read for users and admins" ON public.inquiries
  FOR SELECT USING (
    auth.uid() = customer_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Enable insert for authenticated users" ON public.inquiries
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Enable update for admins" ON public.inquiries
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- NOTIFICATIONS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Admins can view notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can manage notifications" ON public.notifications;

CREATE POLICY "Enable all for admins" ON public.notifications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Enable insert for all authenticated" ON public.notifications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- =====================================================
-- ID COUNTERS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Anyone can manage id counters" ON public.id_counters;

CREATE POLICY "Enable all for authenticated users" ON public.id_counters
  FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- VERIFY POLICIES
-- =====================================================

SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
