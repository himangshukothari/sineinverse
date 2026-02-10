-- SineInverse Payment Gateway Migration
-- Run this in Supabase SQL editor

-- 1. Add payment columns to cards table
ALTER TABLE cards ADD COLUMN IF NOT EXISTS expires_at timestamptz;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS transaction_id text;

-- 2. Create app_settings table for payment toggle
CREATE TABLE IF NOT EXISTS app_settings (
    key text PRIMARY KEY,
    value text NOT NULL DEFAULT 'true',
    updated_at timestamptz DEFAULT now()
);

-- 3. Insert default payment toggle (enabled)
INSERT INTO app_settings (key, value) 
VALUES ('payments_enabled', 'true')
ON CONFLICT (key) DO NOTHING;

-- 4. Index for faster transaction lookups
CREATE INDEX IF NOT EXISTS idx_cards_transaction_id ON cards(transaction_id);
