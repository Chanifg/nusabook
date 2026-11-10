-- =============================================================================
-- Migration: 0003_customer_accounts.sql
-- Purpose: Add customer role, bookings.customer_id foreign key, saved_passengers
--          table, and Row-Level Security (RLS) policies for customer accounts.
-- =============================================================================

-- 1. Extend user_role enum with 'customer'
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'customer';

-- 2. Add customer_id to bookings table (nullable to preserve Guest Checkout & Walk-In)
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);

-- 3. Create saved_passengers table for 1-click manifest auto-fill
CREATE TABLE IF NOT EXISTS saved_passengers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  full_name VARCHAR(150) NOT NULL,
  id_card_number VARCHAR(30),
  gender VARCHAR(10) CHECK (gender IN ('MALE', 'FEMALE')),
  phone_number VARCHAR(25),
  emergency_contact VARCHAR(50),
  special_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_passengers_customer_id ON saved_passengers(customer_id);

ALTER TABLE saved_passengers ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for Customer Accounts
DROP POLICY IF EXISTS "Customers can view their own bookings" ON bookings;
CREATE POLICY "Customers can view their own bookings"
  ON bookings
  FOR SELECT
  USING (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Customers can claim or update their own bookings" ON bookings;
CREATE POLICY "Customers can claim or update their own bookings"
  ON bookings
  FOR UPDATE
  USING (auth.uid() = customer_id OR customer_id IS NULL);

DROP POLICY IF EXISTS "Customers can manage their saved passengers" ON saved_passengers;
CREATE POLICY "Customers can manage their saved passengers"
  ON saved_passengers
  FOR ALL
  USING (auth.uid() = customer_id)
  WITH CHECK (auth.uid() = customer_id);
