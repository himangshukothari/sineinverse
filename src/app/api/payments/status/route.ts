/**
 * PAYMENT STATUS CHECK API
 * GET: Check if a card's payment went through (used by redirect page)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    const txnId = request.nextUrl.searchParams.get('txnId');

    if (!txnId) {
        return NextResponse.json({ paid: false, error: 'Missing txnId' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
        .from('cards')
        .select('status, paid_at')
        .eq('transaction_id', txnId)
        .single();

    return NextResponse.json({
        paid: data?.status === 'paid',
        paidAt: data?.paid_at || null,
    });
}
