/**
 * CARD API - CRUD Operations for Cards
 */

import { createAdminClient } from '@/lib/supabase/server';
import type { Card, CardBlockData } from '@/types/database';
// Generate unique slug for card URL using recipient name + 4 random chars
function generateSlug(recipientName: string): string {
    // Clean the name: lowercase, replace spaces/special chars with hyphens, trim
    const clean = recipientName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')  // remove special chars
        .replace(/\s+/g, '-')           // spaces to hyphens
        .replace(/-+/g, '-')            // collapse multiple hyphens
        .replace(/^-|-$/g, '')          // trim leading/trailing hyphens
        .slice(0, 20);                  // max 20 chars from name

    // Generate 4 random alphanumeric chars
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let suffix = '';
    for (let i = 0; i < 4; i++) {
        suffix += chars[Math.floor(Math.random() * chars.length)];
    }

    return `${clean || 'card'}-${suffix}`; // e.g., "priya-x8mq"
}

export interface CreateCardInput {
    userId: string;
    userEmail?: string;
    title?: string;
    recipientName: string;
    senderName: string;
    blocks: CardBlockData[];
}

export interface UpdateCardInput {
    title?: string;
    recipientName?: string;
    senderName?: string;
    blocks?: CardBlockData[];
    status?: 'draft' | 'paid' | 'sent';
}

/**
 * Create a new card
 */
export async function createCard(input: CreateCardInput): Promise<{ card: Card | null; error: string | null }> {
    const supabase = createAdminClient();
    const slug = generateSlug(input.recipientName);

    const insertData = {
        user_id: input.userId,
        user_email: input.userEmail || null,
        slug,
        title: input.title || null,
        recipient_name: input.recipientName,
        sender_name: input.senderName,
        blocks: input.blocks,
        status: 'draft',
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await supabase
        .from('cards')
        .insert(insertData as any)
        .select()
        .single();

    if (error) {
        console.error('Create card error:', error);
        return { card: null, error: error.message };
    }

    return { card: data as Card, error: null };
}

/**
 * Get card by slug (public - for viewing)
 */
export async function getCardBySlug(slug: string): Promise<{ card: Card | null; error: string | null }> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Get card error:', error);
        return { card: null, error: error.message };
    }

    return { card: data as Card, error: null };
}

/**
 * Get card by ID
 */
export async function getCardById(id: string): Promise<{ card: Card | null; error: string | null }> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Get card error:', error);
        return { card: null, error: error.message };
    }

    return { card: data as Card, error: null };
}

/**
 * Get all cards for a user
 */
export async function getUserCards(userId: string, userEmail?: string): Promise<{ cards: Card[]; error: string | null }> {
    const supabase = createAdminClient();

    // Query by email (more reliable across sessions) with fallback to user_id
    let query = supabase
        .from('cards')
        .select('*');

    if (userEmail) {
        query = query.eq('user_email', userEmail);
    } else {
        query = query.eq('user_id', userId);
    }

    const { data, error } = await query
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Get user cards error:', error);
        return { cards: [], error: error.message };
    }

    return { cards: (data || []) as Card[], error: null };
}

/**
 * Update a card
 */
export async function updateCard(
    cardId: string,
    userId: string,
    input: UpdateCardInput
): Promise<{ card: Card | null; error: string | null }> {
    const supabase = createAdminClient();

    // Build update object with snake_case keys for database
    const updateData: {
        title?: string;
        recipient_name?: string;
        sender_name?: string;
        blocks?: CardBlockData[];
        status?: string;
    } = {};

    if (input.title !== undefined) updateData.title = input.title;
    if (input.recipientName !== undefined) updateData.recipient_name = input.recipientName;
    if (input.senderName !== undefined) updateData.sender_name = input.senderName;
    if (input.blocks !== undefined) updateData.blocks = input.blocks;
    if (input.status !== undefined) updateData.status = input.status;

    const { data, error } = await supabase
        .from('cards')
        // @ts-ignore - Supabase types don't match our schema
        .update(updateData)
        .eq('id', cardId)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) {
        console.error('Update card error:', error);
        return { card: null, error: error.message };
    }

    return { card: data as Card, error: null };
}

/**
 * Delete a card
 */
export async function deleteCard(cardId: string, userId: string): Promise<{ success: boolean; error: string | null }> {
    const supabase = createAdminClient();

    const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', cardId)
        .eq('user_id', userId); // Ensure ownership

    if (error) {
        console.error('Delete card error:', error);
        return { success: false, error: error.message };
    }

    return { success: true, error: null };
}
