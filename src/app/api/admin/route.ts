/**
 * ADMIN API
 * GET: Get settings + cards
 * POST: Set payment mode, manage QR image, manually mark cards paid/unpaid
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

function verifyAdmin(request: NextRequest): boolean {
    if (!ADMIN_PASSWORD) return false;
    const authHeader = request.headers.get('x-admin-password');
    return authHeader === ADMIN_PASSWORD;
}

// Helper: get a setting from app_settings
async function getSetting(supabase: ReturnType<typeof createAdminClient>, key: string): Promise<string | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
        .from('app_settings')
        .select('value')
        .eq('key', key)
        .single();
    return data?.value ?? null;
}

// Helper: upsert a setting
async function upsertSetting(supabase: ReturnType<typeof createAdminClient>, key: string, value: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (supabase as any)
        .from('app_settings')
        .upsert({
            key,
            value,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'key' });
}

// GET - Get settings and card list
export async function GET(request: NextRequest) {
    if (!verifyAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    // Get payment mode (disabled | qr | phonepe) — defaults to 'disabled'
    const paymentMode = (await getSetting(supabase, 'payment_mode')) || 'disabled';

    // Get QR image URL and UPI ID
    const qrImageUrl = (await getSetting(supabase, 'qr_image_url')) || '';
    const upiId = (await getSetting(supabase, 'upi_id')) || '';
    const paymentAmount = (await getSetting(supabase, 'payment_amount')) || '143';
    const contactEmail = (await getSetting(supabase, 'contact_email')) || '';

    // Get all cards with payment info
    const { data: cards } = await supabase
        .from('cards')
        .select('id, slug, recipient_name, sender_name, user_email, status, paid_at, expires_at, transaction_id, created_at')
        .order('created_at', { ascending: false })
        .limit(200);

    return NextResponse.json({
        paymentMode,
        qrImageUrl,
        upiId,
        paymentAmount,
        contactEmail,
        cards: cards || [],
    });
}

// POST - Admin actions
export async function POST(request: NextRequest) {
    if (!verifyAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, cardId } = body;
    const supabase = createAdminClient();

    switch (action) {
        // ── Set Payment Mode ──────────────────────────
        case 'set_payment_mode': {
            const mode = body.mode as string;
            if (!['disabled', 'qr', 'phonepe'].includes(mode)) {
                return NextResponse.json({ error: 'Invalid mode. Use: disabled, qr, phonepe' }, { status: 400 });
            }

            const { error } = await upsertSetting(supabase, 'payment_mode', mode);
            if (error) return NextResponse.json({ error: error.message }, { status: 500 });

            // Also update legacy flag for backward compat
            await upsertSetting(supabase, 'payments_enabled', mode !== 'disabled' ? 'true' : 'false');

            return NextResponse.json({ success: true, paymentMode: mode });
        }

        // ── Set QR Image URL ──────────────────────────
        case 'set_qr_image': {
            const url = body.url as string;
            if (!url || !url.trim()) {
                return NextResponse.json({ error: 'QR image URL required' }, { status: 400 });
            }

            const { error } = await upsertSetting(supabase, 'qr_image_url', url.trim());
            if (error) return NextResponse.json({ error: error.message }, { status: 500 });

            return NextResponse.json({ success: true, qrImageUrl: url.trim() });
        }

        // ── Set UPI ID ────────────────────────────────
        case 'set_upi_id': {
            const upiId = (body.upiId as string || '').trim();
            const { error } = await upsertSetting(supabase, 'upi_id', upiId);
            if (error) return NextResponse.json({ error: error.message }, { status: 500 });
            return NextResponse.json({ success: true, upiId });
        }

        // ── Set Payment Amount ─────────────────────────
        case 'set_payment_amount': {
            const amount = (body.amount as string || '143').trim();
            const { error } = await upsertSetting(supabase, 'payment_amount', amount);
            if (error) return NextResponse.json({ error: error.message }, { status: 500 });
            return NextResponse.json({ success: true, paymentAmount: amount });
        }

        // ── Set Contact Email ──────────────────────────
        case 'set_contact_email': {
            const email = (body.email as string || '').trim();
            const { error } = await upsertSetting(supabase, 'contact_email', email);
            if (error) return NextResponse.json({ error: error.message }, { status: 500 });
            return NextResponse.json({ success: true, contactEmail: email });
        }

        // ── Legacy: Toggle Payments ───────────────────
        case 'toggle_payments': {
            const current = await getSetting(supabase, 'payment_mode');
            const newMode = current === 'disabled' || !current ? 'qr' : 'disabled';
            await upsertSetting(supabase, 'payment_mode', newMode);
            await upsertSetting(supabase, 'payments_enabled', newMode !== 'disabled' ? 'true' : 'false');
            return NextResponse.json({ success: true, paymentsEnabled: newMode !== 'disabled', paymentMode: newMode });
        }

        // ── Mark Card Paid ────────────────────────────
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
                    transaction_id: 'ADMIN_MANUAL',
                })
                .eq('id', cardId);

            if (error) return NextResponse.json({ error: error.message }, { status: 500 });
            return NextResponse.json({ success: true });
        }

        // ── Mark Card Unpaid ──────────────────────────
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

            if (error) return NextResponse.json({ error: error.message }, { status: 500 });
            return NextResponse.json({ success: true });
        }

        default:
            return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
}
