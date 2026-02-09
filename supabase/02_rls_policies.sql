-- =============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Run this AFTER 01_tables.sql in Supabase SQL Editor
-- =============================================================

-- Enable RLS on all tables
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_views ENABLE ROW LEVEL SECURITY;


-- =============================================================
-- CARDS POLICIES
-- =============================================================

-- Policy: Anyone can read cards that are 'paid' or 'sent' (public sharing)
CREATE POLICY "Public can view paid/sent cards"
ON cards
FOR SELECT
USING (status IN ('paid', 'sent'));

-- Policy: Card owner can read all their own cards (including drafts)
CREATE POLICY "Owner can view own cards"
ON cards
FOR SELECT
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Policy: Authenticated users can create cards
CREATE POLICY "Authenticated can create cards"
ON cards
FOR INSERT
WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Policy: Owner can update their own cards
CREATE POLICY "Owner can update own cards"
ON cards
FOR UPDATE
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Policy: Owner can delete their own cards
CREATE POLICY "Owner can delete own cards"
ON cards
FOR DELETE
USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');


-- =============================================================
-- GAME OUTPUTS POLICIES
-- =============================================================

-- Policy: Anyone can insert game outputs (recipients playing)
CREATE POLICY "Anyone can record game output"
ON game_outputs
FOR INSERT
WITH CHECK (true);

-- Policy: Card owner can view outputs for their cards
CREATE POLICY "Owner can view outputs for own cards"
ON game_outputs
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM cards 
        WHERE cards.id = game_outputs.card_id 
        AND cards.user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
);


-- =============================================================
-- CARD VIEWS POLICIES
-- =============================================================

-- Policy: Anyone can record a view
CREATE POLICY "Anyone can record view"
ON card_views
FOR INSERT
WITH CHECK (true);

-- Policy: Card owner can view analytics
CREATE POLICY "Owner can view analytics"
ON card_views
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM cards 
        WHERE cards.id = card_views.card_id 
        AND cards.user_id = current_setting('request.jwt.claims', true)::json->>'sub'
    )
);


-- =============================================================
-- SERVICE ROLE BYPASS (for API routes)
-- =============================================================
-- Note: When using service_role key from API routes, 
-- RLS is bypassed automatically. This is useful for:
-- - Creating cards for users
-- - Admin operations
-- - Public card fetching by slug
