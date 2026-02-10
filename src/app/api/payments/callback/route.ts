/**
 * PAYMENT CALLBACK API
 * POST: PhonePe server-to-server callback after payment
 */

import { NextRequest, NextResponse } from 'next/server';
import { checkPaymentStatus } from '@/lib/phonepe';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // PhonePe sends base64 encoded response
        const responseData = body.response
            ? JSON.parse(Buffer.from(body.response, 'base64').toString())
            : body;

        const merchantTransactionId = responseData.data?.merchantTransactionId;

        if (!merchantTransactionId) {
            console.error('No merchantTransactionId in callback:', responseData);
            return NextResponse.json({ success: false }, { status: 400 });
        }

        // Verify payment status with PhonePe
        const status = await checkPaymentStatus(merchantTransactionId);

        if (status.success) {
            // Mark card as paid in database
            const supabase = createAdminClient();
            const now = new Date();
            const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error } = await (supabase as any)
                .from('cards')
                .update({
                    status: 'paid',
                    paid_at: now.toISOString(),
                    expires_at: expiresAt.toISOString(),
                })
                .eq('transaction_id', merchantTransactionId);

            if (error) {
                console.error('Failed to update card after payment:', error);
            } else {
                console.log(`✅ Card paid: txn=${merchantTransactionId}`);
            }
        } else {
            console.log(`❌ Payment failed: txn=${merchantTransactionId}, code=${status.code}`);
        }

        // Always return 200 to PhonePe
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Payment callback error:', error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
