/**
 * ADMIN API
 * GET: Get settings
 * POST: Toggle payments, manually mark cards paid
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function verifyAdmin(request: NextRequest): boolean {
    if (!ADMIN_PASSWORD) return false; // No password configured = admin disabled
    const authHeader = request.headers.get('x-admin-password');
    return authHeader === ADMIN_PASSWORD;
}

// GET - Get settings and card list
export async function GET(request: NextRequest) {
    if (!verifyAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    // Get payment toggle setting
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: settings } = await (supabase as any)
        .from('app_settings')
        .select('*')
        .eq('key', 'payments_enabled')
        .single();

    // Get all cards with payment info
    const { data: cards } = await supabase
        .from('cards')
        .select('id, slug, recipient_name, sender_name, user_email, status, paid_at, expires_at, transaction_id, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

    return NextResponse.json({
        paymentsEnabled: settings?.value !== 'false',
        cards: cards || [],
    });
}

// POST - Admin actions
export async function POST(request: NextRequest) {
    if (!verifyAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, cardId } = await request.json();
    const supabase = createAdminClient();

    switch (action) {
        case 'toggle_payments': {
            // Get current value
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: current } = await (supabase as any)
                .from('app_settings')
                .select('value')
                .eq('key', 'payments_enabled')
                .single();

            const newValue = current?.value === 'false' ? 'true' : 'false';

            // Upsert setting
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error } = await (supabase as any)
                .from('app_settings')
                .upsert({
                    key: 'payments_enabled',
                    value: newValue,
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'key' });

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }

            return NextResponse.json({
                success: true,
                paymentsEnabled: newValue === 'true',
            });
        }

        case 'mark_paid': {
            if (!cardId) {
                return NextResponse.json({ error: 'Card ID required' }, { status: 400 });
            }

            const now = new Date();
            const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error } = await (supabase as any)
                .from('cards')
                .update({
                    status: 'paid',
                    paid_at: now.toISOString(),
                    expires_at: expiresAt.toISOString(),
                    transaction_id: 'ADMIN_BYPASS',
                })
                .eq('id', cardId);

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }

            return NextResponse.json({ success: true });
        }

        case 'mark_unpaid': {
            if (!cardId) {
                return NextResponse.json({ error: 'Card ID required' }, { status: 400 });
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error } = await (supabase as any)
                .from('cards')
                .update({
                    status: 'draft',
                    paid_at: null,
                    expires_at: null,
                    transaction_id: null,
                })
                .eq('id', cardId);

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }

            return NextResponse.json({ success: true });
        }

        default:
            return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
}
