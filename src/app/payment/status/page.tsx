'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function PaymentStatusContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');

    const txnId = searchParams.get('txnId');
    const cardId = searchParams.get('cardId');

    useEffect(() => {
        // Check payment status
        const checkStatus = async () => {
            if (!txnId) {
                setStatus('failed');
                return;
            }

            try {
                const res = await fetch(`/api/payments/status?txnId=${txnId}`);
                const data = await res.json();
                setStatus(data.paid ? 'success' : 'failed');
            } catch {
                setStatus('failed');
            }
        };

        // Small delay to let callback process
        const timer = setTimeout(checkStatus, 2000);
        return () => clearTimeout(timer);
    }, [txnId]);

    useEffect(() => {
        if (status === 'success') {
            const timer = setTimeout(() => router.push('/account'), 4000);
            return () => clearTimeout(timer);
        }
    }, [status, router]);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f8f6ff 0%, #ede9fe 100%)',
            fontFamily: 'var(--font-body)',
        }}>
            <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '3rem',
                maxWidth: '420px',
                width: '90%',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)',
            }}>
                {status === 'loading' && (
                    <>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                        <h2 style={{ color: '#1e1b4b', marginBottom: '0.5rem' }}>Processing Payment</h2>
                        <p style={{ color: '#64748b' }}>Please wait while we confirm your payment...</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                        <h2 style={{ color: '#059669', marginBottom: '0.5rem' }}>Payment Successful!</h2>
                        <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                            Your card link is now active for 7 days.
                        </p>
                        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                            Redirecting to your account...
                        </p>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😔</div>
                        <h2 style={{ color: '#dc2626', marginBottom: '0.5rem' }}>Payment Failed</h2>
                        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                            Something went wrong. Your card is still saved as a draft.
                        </p>
                        <button
                            onClick={() => router.push('/account')}
                            style={{
                                padding: '0.75rem 2rem',
                                background: '#7c3aed',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                            }}
                        >
                            Go to Account
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default function PaymentStatusPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
            <PaymentStatusContent />
        </Suspense>
    );
}
