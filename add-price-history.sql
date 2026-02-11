-- Add Price History Table for Balaji&Co Trader
-- Run this in Supabase SQL Editor

-- Create price_history table to track price changes over time
CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  price DECIMAL(10, 2) NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  changed_by UUID REFERENCES auth.users(id),
  notes TEXT
);

-- Create index for faster queries
CREATE INDEX idx_price_history_product ON price_history(product_id);
CREATE INDEX idx_price_history_date ON price_history(changed_at);

-- Enable RLS
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view price history"
  ON price_history FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert price history"
  ON price_history FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insert current prices as initial history
INSERT INTO price_history (product_id, price, notes)
SELECT id, price, 'Initial price'
FROM products
ON CONFLICT DO NOTHING;

-- Create function to automatically log price changes
CREATE OR REPLACE FUNCTION log_price_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.price IS DISTINCT FROM NEW.price THEN
    INSERT INTO price_history (product_id, price, changed_by, notes)
    VALUES (NEW.id, NEW.price, auth.uid(), 'Price updated');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to log price changes
DROP TRIGGER IF EXISTS trigger_log_price_change ON products;
CREATE TRIGGER trigger_log_price_change
  AFTER UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION log_price_change();

-- Verify
SELECT * FROM price_history ORDER BY changed_at DESC;
