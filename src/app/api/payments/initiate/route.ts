/**
 * PAYMENT INITIATE API
 * POST: Start PhonePe payment for a card
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCardById } from '@/lib/api/cards';
import {
    PHONEPE_CONFIG,
    buildPaymentPayload,
    generateChecksum,
    generateTransactionId,
    isPhonePeConfigured,
} from '@/lib/phonepe';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        // 1. Auth check
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { cardId } = await request.json();
        if (!cardId) {
            return NextResponse.json({ error: 'Card ID required' }, { status: 400 });
        }

        // 2. Check payment mode
        const supabase = createAdminClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: modeData } = await (supabase as any)
            .from('app_settings')
            .select('value')
            .eq('key', 'payment_mode')
            .single();

        const paymentMode = modeData?.value || 'disabled';

        if (paymentMode === 'disabled') {
            // Payments disabled — auto-mark as paid
            const now = new Date();
            const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabase as any)
                .from('cards')
                .update({
                    status: 'paid',
                    paid_at: now.toISOString(),
                    expires_at: expiresAt.toISOString(),
                    transaction_id: 'FREE_BYPASS',
                })
                .eq('id', cardId)
                .eq('user_id', session.user.id);

            return NextResponse.json({
                success: true,
                free: true,
                message: 'Card activated for free (payments disabled)',
            });
        }

        if (paymentMode === 'qr') {
            // QR mode — return QR image + UPI link + card ID
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: qrData } = await (supabase as any)
                .from('app_settings')
                .select('key, value')
                .in('key', ['qr_image_url', 'upi_id', 'payment_amount']);

            const settings: Record<string, string> = {};
            for (const row of qrData || []) {
                settings[row.key] = row.value;
            }

            const qrImageUrl = settings['qr_image_url'] || '';
            const upiId = settings['upi_id'] || '';
            const amount = settings['payment_amount'] || '143';
            const shortCardId = cardId.slice(0, 8).toUpperCase();

            // Generate UPI deep link if UPI ID is set
            const upiLink = upiId
                ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=SineInverse&am=${amount}&tn=${shortCardId}`
                : '';

            return NextResponse.json({
                success: true,
                mode: 'qr',
                qrImageUrl,
                upiId,
                upiLink,
                amount,
                cardId: shortCardId,
                fullCardId: cardId,
                message: `Pay ₹${amount} via QR/UPI and include "${shortCardId}" in your payment remarks`,
            });
        }

        // 3. Verify card ownership and unpaid status
        const { card, error: cardError } = await getCardById(cardId);
        if (cardError || !card) {
            return NextResponse.json({ error: 'Card not found' }, { status: 404 });
        }
        if (card.user_id !== session.user.id) {
            return NextResponse.json({ error: 'Not your card' }, { status: 403 });
        }
        if (card.status === 'paid') {
            return NextResponse.json({ error: 'Card already paid' }, { status: 400 });
        }

        // 4. Check if PhonePe is configured
        if (!isPhonePeConfigured()) {
            return NextResponse.json(
                { error: 'Payment gateway not configured. Contact admin.' },
                { status: 503 }
            );
        }

        // 5. Build PhonePe payment
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
        const merchantTransactionId = generateTransactionId(cardId);
        const callbackUrl = `${baseUrl}/api/payments/callback`;
        const redirectUrl = `${baseUrl}/payment/status?txnId=${merchantTransactionId}&cardId=${cardId}`;

        const base64Payload = buildPaymentPayload(
            merchantTransactionId,
            session.user.id,
            callbackUrl,
            redirectUrl
        );

        const endpoint = '/pg/v1/pay';
        const checksum = generateChecksum(base64Payload, endpoint);

        // 6. Save transaction ID on card before redirecting
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
            .from('cards')
            .update({ transaction_id: merchantTransactionId })
            .eq('id', cardId);

        // 7. Call PhonePe API
        const response = await fetch(`${PHONEPE_CONFIG.apiUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
            },
            body: JSON.stringify({ request: base64Payload }),
        });

        const data = await response.json();

        if (data.success && data.data?.instrumentResponse?.redirectInfo?.url) {
            return NextResponse.json({
                success: true,
                redirectUrl: data.data.instrumentResponse.redirectInfo.url,
            });
        }

        console.error('PhonePe initiation failed:', data);
        return NextResponse.json(
            { error: 'Payment initiation failed', details: data.message },
            { status: 500 }
        );
    } catch (error) {
        console.error('Payment initiate error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
