-- Insert Default Products for Thanvi Trader
-- Run this in Supabase SQL Editor

-- First, check if products already exist and delete if needed
DELETE FROM public.products WHERE id IN ('prod-001', 'prod-002', 'prod-003', 'prod-004');

-- Insert the 4 dal products
INSERT INTO public.products (id, name, description, price, stock, unit) VALUES
('prod-001', 'Toor Dal (Thuvaramparuppu)', 'Premium quality split pigeon peas, rich in protein and essential nutrients. Perfect for traditional Indian dishes like sambar and dal fry.', 120.00, 500, 'kg'),
('prod-002', 'Moong Dal (Pachaipayaru)', 'High-grade split mung beans, easy to digest and cook. Ideal for khichdi, dal tadka, and healthy soups.', 135.00, 350, 'kg'),
('prod-003', 'Chana Dal (Kadalaiparuppu)', 'Split chickpeas with a nutty flavor, excellent source of fiber and protein. Great for chana dal curry and snacks.', 95.00, 600, 'kg'),
('prod-004', 'Urad Dal (Uluthamparuppu)', 'Premium black gram lentils, essential for South Indian cuisine. Perfect for idli, dosa batter, and dal makhani.', 145.00, 250, 'kg');

-- Verify the insert
SELECT * FROM public.products ORDER BY id;
