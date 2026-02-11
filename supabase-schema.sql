-- Thanvi Trader Database Schema for Supabase
-- This file contains all table definitions for the trading application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE (Supabase Auth handles authentication)
-- =====================================================
-- Note: Supabase Auth creates auth.users automatically
-- We create a public.profiles table for additional user data

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  business_type TEXT CHECK (business_type IN ('Individual Consumer', 'Business Owner', 'Trader', 'Retailer', 'Broker / Agent')),
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'kg',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ORDERS TABLE
-- =====================================================
CREATE TABLE public.orders (
  id TEXT PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) NOT NULL,
  customer_name TEXT NOT NULL,
  product_id TEXT REFERENCES public.products(id) NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price_per_unit DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'packed', 'delivered')),
  estimated_delivery DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CATERING ORDERS TABLE
-- =====================================================
CREATE TABLE public.catering_orders (
  id TEXT PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) NOT NULL,
  customer_name TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_date DATE NOT NULL,
  guest_count INTEGER NOT NULL,
  items JSONB NOT NULL, -- Array of {productId, productName, quantity, pricePerUnit}
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'in-preparation', 'ready', 'delivered')),
  special_requests TEXT,
  contact_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  order_deadline DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INQUIRIES TABLE
-- =====================================================
CREATE TABLE public.inquiries (
  id TEXT PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) NOT NULL,
  customer_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  reply TEXT,
  replied_at TIMESTAMP WITH TIME ZONE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE public.notifications (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('order', 'inquiry')),
  message TEXT NOT NULL,
  reference_id TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ID COUNTERS TABLE (for generating order IDs)
-- =====================================================
CREATE TABLE public.id_counters (
  counter_key TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES for better query performance
-- =====================================================
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_orders_status ON public.orders(status);

CREATE INDEX idx_catering_orders_customer_id ON public.catering_orders(customer_id);
CREATE INDEX idx_catering_orders_created_at ON public.catering_orders(created_at DESC);
CREATE INDEX idx_catering_orders_status ON public.catering_orders(status);

CREATE INDEX idx_inquiries_customer_id ON public.inquiries(customer_id);
CREATE INDEX idx_inquiries_is_read ON public.inquiries(is_read);

CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catering_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.id_counters ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own profile, admins can read all
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Products: Everyone can read, only admins can modify
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify products" ON public.products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Orders: Users can view their own orders, admins can view all
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (
    customer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Catering Orders: Same as regular orders
CREATE POLICY "Users can view own catering orders" ON public.catering_orders
  FOR SELECT USING (
    customer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can create catering orders" ON public.catering_orders
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Admins can update catering orders" ON public.catering_orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Inquiries: Users can view their own, admins can view all
CREATE POLICY "Users can view own inquiries" ON public.inquiries
  FOR SELECT USING (
    customer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can create inquiries" ON public.inquiries
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Admins can update inquiries" ON public.inquiries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Notifications: Only admins can view
CREATE POLICY "Admins can view notifications" ON public.notifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage notifications" ON public.notifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ID Counters: Everyone can read and update (for generating IDs)
CREATE POLICY "Anyone can manage id counters" ON public.id_counters
  FOR ALL USING (true);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for products
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INSERT DEFAULT PRODUCTS
-- =====================================================
INSERT INTO public.products (id, name, description, price, stock, unit) VALUES
('prod-001', 'Toor Dal (Thuvaramparuppu)', 'Premium quality split pigeon peas, rich in protein and essential nutrients. Perfect for traditional Indian dishes like sambar and dal fry.', 120.00, 500, 'kg'),
('prod-002', 'Moong Dal (Pachaipayaru)', 'High-grade split mung beans, easy to digest and cook. Ideal for khichdi, dal tadka, and healthy soups.', 135.00, 350, 'kg'),
('prod-003', 'Chana Dal (Kadalaiparuppu)', 'Split chickpeas with a nutty flavor, excellent source of fiber and protein. Great for chana dal curry and snacks.', 95.00, 600, 'kg'),
('prod-004', 'Urad Dal (Uluthamparuppu)', 'Premium black gram lentils, essential for South Indian cuisine. Perfect for idli, dosa batter, and dal makhani.', 145.00, 250, 'kg');

-- =====================================================
-- COMPLETED!
-- =====================================================
-- Run this SQL in your Supabase SQL Editor
-- Then configure your app with the Supabase credentials
