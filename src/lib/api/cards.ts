/**
 * CARD API - CRUD Operations for Cards
 */

import { createAdminClient } from '@/lib/supabase/server';
import type { Card, CardBlockData } from '@/types/database';
import { nanoid } from 'nanoid';

// Generate unique slug for card URL
function generateSlug(): string {
    return nanoid(10); // e.g., "V1StGXR8_Z"
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
    const slug = generateSlug();

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
