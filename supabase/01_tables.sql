-- =============================================================
-- SINEINVERSE DATABASE SCHEMA
-- Run this FIRST in Supabase SQL Editor
-- =============================================================

-- 1. CARDS TABLE
-- Stores all card data with blocks as JSONB array
CREATE TABLE IF NOT EXISTS cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Owner (linked to NextAuth user via email or provider ID)
    user_id TEXT NOT NULL,
    user_email TEXT,
    
    -- Unique slug for sharing (e.g., abc123xyz)
    slug TEXT UNIQUE NOT NULL,
    
    -- Card info
    title TEXT,
    recipient_name TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    
    -- All blocks stored as JSON array
    -- Example: [{"blockId": "flower-wheel", "order": 0, "input": {...}}, ...]
    blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'paid', 'sent')),
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    paid_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ
);

-- Index for faster slug lookups (public card viewing)
CREATE INDEX IF NOT EXISTS idx_cards_slug ON cards(slug);

-- Index for user's cards (library page)
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_cards_status ON cards(status);


-- 2. GAME OUTPUTS TABLE
-- Records when recipients play games on the card
CREATE TABLE IF NOT EXISTS game_outputs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Link to card
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    
    -- Which block was played
    block_id TEXT NOT NULL,
    block_order INTEGER NOT NULL DEFAULT 0,
    
    -- Game result data
    -- Example: {"chosenSegment": "Dinner Date", "moves": 12, "time": 45}
    output JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Session tracking (anonymous recipient)
    session_id TEXT,
    
    -- Timestamp
    played_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fetching all outputs for a card
CREATE INDEX IF NOT EXISTS idx_game_outputs_card_id ON game_outputs(card_id);


-- 3. CARD VIEWS TABLE (Optional - for analytics)
CREATE TABLE IF NOT EXISTS card_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_hash TEXT,
    user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_card_views_card_id ON card_views(card_id);


-- 4. UPDATE TRIGGER
-- Automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cards_updated_at
    BEFORE UPDATE ON cards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
