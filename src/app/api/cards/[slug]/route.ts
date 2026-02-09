/**
 * SINGLE CARD API ROUTE
 * GET: Get card by slug (public)
 * PUT: Update card
 * DELETE: Delete card
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCardBySlug, updateCard, deleteCard } from '@/lib/api/cards';

interface RouteParams {
    params: Promise<{ slug: string }>;
}

// GET - Get card by slug (public)
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { slug } = await params;
        const { card, error } = await getCardBySlug(slug);

        if (error || !card) {
            return NextResponse.json({ error: 'Card not found' }, { status: 404 });
        }

        return NextResponse.json({ card });
    } catch (error) {
        console.error('Get card API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT - Update card (owner only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        // Check auth
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { slug } = await params;
        const body = await request.json();

        // First get the card to get its ID
        const { card: existingCard, error: getError } = await getCardBySlug(slug);
        if (getError || !existingCard) {
            return NextResponse.json({ error: 'Card not found' }, { status: 404 });
        }

        // Check ownership
        if (existingCard.user_id !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { card, error } = await updateCard(existingCard.id, session.user.id, body);

        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json({ card, success: true });
    } catch (error) {
        console.error('Update card API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Delete card (owner only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        // Check auth
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { slug } = await params;

        // First get the card to get its ID
        const { card: existingCard, error: getError } = await getCardBySlug(slug);
        if (getError || !existingCard) {
            return NextResponse.json({ error: 'Card not found' }, { status: 404 });
        }

        // Check ownership
        if (existingCard.user_id !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { success, error } = await deleteCard(existingCard.id, session.user.id);

        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json({ success });
    } catch (error) {
        console.error('Delete card API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
