/**
 * CARD ANALYTICS API
 * POST: Save a game output or record a view (public - no auth)
 * GET:  Get analytics for a card (auth - owner only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCardBySlug } from '@/lib/api/cards';
import { recordCardView, saveGameOutput, getCardAnalytics } from '@/lib/api/analytics';

interface RouteParams {
    params: Promise<{ slug: string }>;
}

// POST - Save interaction data (public, no auth needed)
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const { slug } = await params;
        const body = await request.json();
        const { type } = body; // 'view' | 'output'

        // Look up the card
        const { card, error: cardError } = await getCardBySlug(slug);
        if (cardError || !card) {
            return NextResponse.json({ error: 'Card not found' }, { status: 404 });
        }

        if (type === 'view') {
            // Record a card view
            const ipHash = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
            const userAgent = request.headers.get('user-agent') || undefined;

            const { error } = await recordCardView(card.id, ipHash, userAgent);
            if (error) {
                return NextResponse.json({ error }, { status: 500 });
            }

            return NextResponse.json({ success: true });
        }

        if (type === 'output') {
            // Save a block output
            const { blockId, blockOrder, output, sessionId } = body;

            if (!blockId || output === undefined) {
                return NextResponse.json({ error: 'blockId and output are required' }, { status: 400 });
            }

            const { error } = await saveGameOutput(
                card.id,
                blockId,
                blockOrder ?? 0,
                output,
                sessionId
            );

            if (error) {
                return NextResponse.json({ error }, { status: 500 });
            }

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid type. Use "view" or "output".' }, { status: 400 });
    } catch (error) {
        console.error('Analytics POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// GET - Get analytics for a card (owner only)
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        // Auth required
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { slug } = await params;

        // Get card and verify ownership
        const { card, error: cardError } = await getCardBySlug(slug);
        if (cardError || !card) {
            return NextResponse.json({ error: 'Card not found' }, { status: 404 });
        }

        // Check ownership by email or user_id
        const isOwner =
            (session.user.email && card.user_email === session.user.email) ||
            (session.user.id && card.user_id === session.user.id);

        if (!isOwner) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const analytics = await getCardAnalytics(card.id);

        if (analytics.error) {
            return NextResponse.json({ error: analytics.error }, { status: 500 });
        }

        return NextResponse.json({
            totalViews: analytics.totalViews,
            totalSessions: analytics.totalSessions,
            views: analytics.views,
            outputs: analytics.outputs,
        });
    } catch (error) {
        console.error('Analytics GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
