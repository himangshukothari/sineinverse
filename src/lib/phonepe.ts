/**
 * PHONEPE PAYMENT GATEWAY HELPER
 * Configuration, checksum generation, and status verification
 */

import crypto from 'crypto';

// ─── CONFIG ─────────────────────────────────────────
const PHONEPE_ENV = process.env.PHONEPE_ENV || 'UAT';

const API_URLS = {
    UAT: 'https://api-preprod.phonepe.com/apis/pg-sandbox',
    PRODUCTION: 'https://api.phonepe.com/apis/hermes',
};

export const PHONEPE_CONFIG = {
    merchantId: process.env.PHONEPE_MERCHANT_ID || '',
    saltKey: process.env.PHONEPE_SALT_KEY || '',
    saltIndex: parseInt(process.env.PHONEPE_SALT_INDEX || '1', 10),
    apiUrl: API_URLS[PHONEPE_ENV as keyof typeof API_URLS] || API_URLS.UAT,
    amount: 14300, // ₹143 in paise
    currency: 'INR',
};

// ─── CHECKSUM ───────────────────────────────────────
/**
 * Generate SHA-256 checksum for PhonePe API
 */
export function generateChecksum(payload: string, endpoint: string): string {
    const { saltKey, saltIndex } = PHONEPE_CONFIG;
    const data = payload + endpoint + saltKey;
    const sha256 = crypto.createHash('sha256').update(data).digest('hex');
    return `${sha256}###${saltIndex}`;
}

// ─── PAYLOAD ────────────────────────────────────────
/**
 * Build PhonePe payment initiation payload
 */
export function buildPaymentPayload(
    merchantTransactionId: string,
    userId: string,
    callbackUrl: string,
    redirectUrl: string
) {
    const payload = {
        merchantId: PHONEPE_CONFIG.merchantId,
        merchantTransactionId,
        merchantUserId: userId,
        amount: PHONEPE_CONFIG.amount,
        redirectUrl,
        redirectMode: 'REDIRECT',
        callbackUrl,
        paymentInstrument: {
            type: 'PAY_PAGE',
        },
    };

    return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// ─── STATUS CHECK ───────────────────────────────────
/**
 * Verify payment status with PhonePe
 */
export async function checkPaymentStatus(merchantTransactionId: string): Promise<{
    success: boolean;
    code: string;
    transactionId?: string;
}> {
    const endpoint = `/pg/v1/status/${PHONEPE_CONFIG.merchantId}/${merchantTransactionId}`;
    const checksum = generateChecksum('', endpoint);

    try {
        const response = await fetch(`${PHONEPE_CONFIG.apiUrl}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'X-MERCHANT-ID': PHONEPE_CONFIG.merchantId,
            },
        });

        const data = await response.json();

        return {
            success: data.code === 'PAYMENT_SUCCESS',
            code: data.code || 'UNKNOWN',
            transactionId: data.data?.transactionId,
        };
    } catch (error) {
        console.error('PhonePe status check error:', error);
        return { success: false, code: 'ERROR' };
    }
}

// ─── HELPERS ────────────────────────────────────────
/**
 * Generate unique merchant transaction ID
 */
export function generateTransactionId(cardId: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `SI_${cardId.substring(0, 8)}_${timestamp}_${random}`;
}

/**
 * Check if PhonePe is configured (credentials present)
 */
export function isPhonePeConfigured(): boolean {
    return !!(PHONEPE_CONFIG.merchantId && PHONEPE_CONFIG.saltKey);
}
