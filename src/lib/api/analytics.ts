/**
 * ANALYTICS API - Card views & game outputs
 */

import { createAdminClient } from '@/lib/supabase/server';
import type { GameOutput, CardView } from '@/types/database';

/**
 * Record a card view
 */
export async function recordCardView(
    cardId: string,
    ipHash?: string,
    userAgent?: string
): Promise<{ success: boolean; error: string | null }> {
    const supabase = createAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase
        .from('card_views')
        .insert({
            card_id: cardId,
            ip_hash: ipHash || null,
            user_agent: userAgent || null,
        } as any);

    if (error) {
        console.error('Record view error:', error);
        return { success: false, error: error.message };
    }

    return { success: true, error: null };
}

/**
 * Save a game/block output when recipient interacts
 */
export async function saveGameOutput(
    cardId: string,
    blockId: string,
    blockOrder: number,
    output: Record<string, unknown>,
    sessionId?: string
): Promise<{ success: boolean; error: string | null }> {
    const supabase = createAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase
        .from('game_outputs')
        .insert({
            card_id: cardId,
            block_id: blockId,
            block_order: blockOrder,
            output,
            session_id: sessionId || null,
        } as any);

    if (error) {
        console.error('Save game output error:', error);
        return { success: false, error: error.message };
    }

    return { success: true, error: null };
}

/**
 * Get analytics for a card (views + game outputs)
 */
export async function getCardAnalytics(cardId: string): Promise<{
    views: CardView[];
    outputs: GameOutput[];
    totalViews: number;
    totalSessions: number;
    error: string | null;
}> {
    const supabase = createAdminClient();

    // Fetch views
    const { data: viewsData, error: viewsError } = await supabase
        .from('card_views')
        .select('*')
        .eq('card_id', cardId)
        .order('viewed_at', { ascending: false })
        .limit(100);

    if (viewsError) {
        console.error('Get views error:', viewsError);
        return { views: [], outputs: [], totalViews: 0, totalSessions: 0, error: viewsError.message };
    }

    // Fetch game outputs
    const { data: outputsData, error: outputsError } = await supabase
        .from('game_outputs')
        .select('*')
        .eq('card_id', cardId)
        .order('played_at', { ascending: false })
        .limit(200);

    if (outputsError) {
        console.error('Get outputs error:', outputsError);
        return { views: (viewsData || []) as CardView[], outputs: [], totalViews: 0, totalSessions: 0, error: outputsError.message };
    }

    const views = (viewsData || []) as CardView[];
    const outputs = (outputsData || []) as GameOutput[];

    // Count unique sessions
    const uniqueSessions = new Set(outputs.map(o => o.session_id).filter(Boolean));

    return {
        views,
        outputs,
        totalViews: views.length,
        totalSessions: uniqueSessions.size,
        error: null,
    };
}
