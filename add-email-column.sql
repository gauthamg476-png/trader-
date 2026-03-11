-- Add email column to profiles table for OTP verification
ALTER TABLE profiles 
ADD COLUMN email TEXT;

-- Add index for email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Update existing profiles to have email field (optional)
-- UPDATE profiles SET email = username || '@thanvitrader.local' WHERE email IS NULL;