-- ============================================
-- SINEINVERSE DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profile automatically when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- CARDS
-- ============================================
CREATE TABLE IF NOT EXISTS public.cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL DEFAULT 'My Valentine Card',
  recipient_name TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'paid', 'sent')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  open_count INTEGER DEFAULT 0
);

CREATE INDEX idx_cards_user_id ON public.cards(user_id);
CREATE INDEX idx_cards_slug ON public.cards(slug);

-- ============================================
-- CARD BLOCKS (blocks within a card)
-- ============================================
CREATE TABLE IF NOT EXISTS public.card_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  block_id TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  input_json JSONB NOT NULL DEFAULT '{}',
  skin TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_card_blocks_card_id ON public.card_blocks(card_id);

-- ============================================
-- PLAY RESULTS (when recipient plays)
-- ============================================
CREATE TABLE IF NOT EXISTS public.play_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  block_id TEXT NOT NULL,
  output_json JSONB NOT NULL DEFAULT '{}',
  played_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_play_results_card_id ON public.play_results(card_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.play_results ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Cards: Users can manage their own cards
CREATE POLICY "Users can view own cards" ON public.cards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create cards" ON public.cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cards" ON public.cards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cards" ON public.cards
  FOR DELETE USING (auth.uid() = user_id);

-- Public can view cards by slug (for recipients)
CREATE POLICY "Public can view cards by slug" ON public.cards
  FOR SELECT USING (status = 'sent');

-- Card Blocks: Users can manage blocks in their cards
CREATE POLICY "Users can view own card blocks" ON public.card_blocks
  FOR SELECT USING (
    card_id IN (SELECT id FROM public.cards WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create card blocks" ON public.card_blocks
  FOR INSERT WITH CHECK (
    card_id IN (SELECT id FROM public.cards WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own card blocks" ON public.card_blocks
  FOR UPDATE USING (
    card_id IN (SELECT id FROM public.cards WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete own card blocks" ON public.card_blocks
  FOR DELETE USING (
    card_id IN (SELECT id FROM public.cards WHERE user_id = auth.uid())
  );

-- Public can view blocks of sent cards (for recipients)
CREATE POLICY "Public can view sent card blocks" ON public.card_blocks
  FOR SELECT USING (
    card_id IN (SELECT id FROM public.cards WHERE status = 'sent')
  );

-- Play Results: Anyone can insert (recipient playing)
CREATE POLICY "Anyone can create play results" ON public.play_results
  FOR INSERT WITH CHECK (
    card_id IN (SELECT id FROM public.cards WHERE status = 'sent')
  );

-- Card owners can view their card's play results
CREATE POLICY "Owners can view play results" ON public.play_results
  FOR SELECT USING (
    card_id IN (SELECT id FROM public.cards WHERE user_id = auth.uid())
  );

-- ============================================
-- STORAGE BUCKET (for images)
-- ============================================
-- Run this in Supabase Dashboard > Storage > Create bucket
-- Name: card-assets
-- Public: No (we'll use signed URLs)

-- Storage policies (run in SQL editor after creating bucket):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('card-assets', 'card-assets', false);

-- ============================================
-- DONE!
-- ============================================
