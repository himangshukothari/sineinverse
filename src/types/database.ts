/**
 * DATABASE TYPES
 * Types matching the Supabase tables from 01_tables.sql
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

// Block data stored in card
export interface CardBlockData {
    blockId: string;
    order: number;
    input: Record<string, unknown>;
}

export interface Database {
    public: {
        Tables: {
            // Cards table with JSONB blocks
            cards: {
                Row: {
                    id: string;
                    user_id: string;
                    user_email: string | null;
                    slug: string;
                    title: string | null;
                    recipient_name: string;
                    sender_name: string;
                    blocks: CardBlockData[];
                    status: 'draft' | 'paid' | 'sent';
                    created_at: string;
                    updated_at: string;
                    paid_at: string | null;
                    sent_at: string | null;
                    expires_at: string | null;
                    transaction_id: string | null;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    user_email?: string | null;
                    slug: string;
                    title?: string | null;
                    recipient_name: string;
                    sender_name: string;
                    blocks?: CardBlockData[];
                    status?: 'draft' | 'paid' | 'sent';
                    created_at?: string;
                    updated_at?: string;
                    paid_at?: string | null;
                    sent_at?: string | null;
                    expires_at?: string | null;
                    transaction_id?: string | null;
                };
                Update: {
                    title?: string | null;
                    recipient_name?: string;
                    sender_name?: string;
                    blocks?: CardBlockData[];
                    status?: 'draft' | 'paid' | 'sent';
                    updated_at?: string;
                    paid_at?: string | null;
                    sent_at?: string | null;
                    expires_at?: string | null;
                    transaction_id?: string | null;
                };
            };

            // Game outputs when recipient plays
            game_outputs: {
                Row: {
                    id: string;
                    card_id: string;
                    block_id: string;
                    block_order: number;
                    output: Record<string, unknown>;
                    session_id: string | null;
                    played_at: string;
                };
                Insert: {
                    id?: string;
                    card_id: string;
                    block_id: string;
                    block_order?: number;
                    output: Record<string, unknown>;
                    session_id?: string | null;
                    played_at?: string;
                };
                Update: {
                    output?: Record<string, unknown>;
                };
            };

            // Card views for analytics
            card_views: {
                Row: {
                    id: string;
                    card_id: string;
                    viewed_at: string;
                    ip_hash: string | null;
                    user_agent: string | null;
                };
                Insert: {
                    id?: string;
                    card_id: string;
                    viewed_at?: string;
                    ip_hash?: string | null;
                    user_agent?: string | null;
                };
                Update: {};
            };

            // App settings (key-value store for toggles)
            app_settings: {
                Row: {
                    key: string;
                    value: string;
                    updated_at: string;
                };
                Insert: {
                    key: string;
                    value: string;
                    updated_at?: string;
                };
                Update: {
                    value?: string;
                    updated_at?: string;
                };
            };
        };
        Views: {};
        Functions: {};
        Enums: {
            card_status: 'draft' | 'paid' | 'sent';
        };
    };
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Row'];

export type InsertTables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Insert'];

export type UpdateTables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Update'];

// Convenience aliases
export type Card = Tables<'cards'>;
export type GameOutput = Tables<'game_outputs'>;
export type CardView = Tables<'card_views'>;
