/**
 * CARDS API ROUTE
 * POST: Create new card
 * GET: Get user's cards
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createCard, getUserCards } from '@/lib/api/cards';

// POST - Create new card
export async function POST(request: NextRequest) {
    try {
        // Check auth
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, recipientName, senderName, blocks } = body;

        // Validate
        if (!recipientName) {
            return NextResponse.json({ error: 'Recipient name is required' }, { status: 400 });
        }
        if (!blocks || blocks.length === 0) {
            return NextResponse.json({ error: 'At least one block is required' }, { status: 400 });
        }

        // Create card
        const { card, error } = await createCard({
            userId: session.user.id,
            userEmail: session.user.email || undefined,
            title,
            recipientName,
            senderName: senderName || session.user.name || 'Anonymous',
            blocks,
        });

        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json({ card, success: true });
    } catch (error) {
        console.error('Create card API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// GET - Get user's cards
export async function GET() {
    try {
        // Check auth
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { cards, error } = await getUserCards(session.user.id, session.user.email || undefined);

        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json({ cards });
    } catch (error) {
        console.error('Get cards API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
