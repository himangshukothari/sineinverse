/**
 * ADMIN UPLOAD API
 * POST: Upload QR image (converts to base64 data URL and stores in app_settings)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export async function POST(request: NextRequest) {
    // Verify admin
    const authHeader = request.headers.get('x-admin-password');
    if (!ADMIN_PASSWORD || authHeader !== ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: 'File too large. Max 2MB.' }, { status: 400 });
        }

        // Convert to base64 data URL
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;

        // Store in app_settings
        const supabase = createAdminClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('app_settings')
            .upsert({
                key: 'qr_image_url',
                value: dataUrl,
                updated_at: new Date().toISOString(),
            }, { onConflict: 'key' });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            qrImageUrl: dataUrl,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
