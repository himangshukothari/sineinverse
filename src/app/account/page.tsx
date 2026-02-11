'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './account.module.css';
import { useToast } from '@/components/Toast';

interface CardData {
    id: string;
    slug: string;
    title: string | null;
    recipient_name: string;
    sender_name: string;
    status: 'draft' | 'paid' | 'sent';
    created_at: string;
    paid_at: string | null;
    expires_at: string | null;
    transaction_id: string | null;
    blocks: Array<{ blockId: string; order: number; input: Record<string, unknown> }>;
}

interface GameOutputData {
    id: string;
    block_id: string;
    block_order: number;
    output: Record<string, unknown>;
    session_id: string | null;
    played_at: string;
}

interface CardAnalytics {
    totalViews: number;
    totalSessions: number;
    outputs: GameOutputData[];
}

export default function AccountPage() {
    const { data: session, status } = useSession();
    const [cards, setCards] = useState<CardData[]>([]);
    const [loadingCards, setLoadingCards] = useState(false);
    const [analytics, setAnalytics] = useState<Record<string, CardAnalytics>>({});
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    const [qrPaymentData, setQrPaymentData] = useState<{
        qrImageUrl: string;
        cardId: string;
        message: string;
        upiLink?: string;
        upiId?: string;
        amount?: string;
    } | null>(null);
    const { toast } = useToast();

    // Load user's cards
    useEffect(() => {
        if (session?.user) {
            loadCards();
        }
    }, [session]);

    const loadCards = async () => {
        setLoadingCards(true);
        try {
            const response = await fetch('/api/cards');
            if (response.ok) {
                const data = await response.json();
                setCards(data.cards || []);
            }
        } catch (error) {
            console.error('Failed to load cards:', error);
        } finally {
            setLoadingCards(false);
        }
    };

    // Load analytics for a specific card
    const loadAnalytics = async (slug: string) => {
        if (analytics[slug]) return; // Already loaded

        try {
            const response = await fetch(`/api/cards/${slug}/analytics`);
            if (response.ok) {
                const data = await response.json();
                setAnalytics(prev => ({ ...prev, [slug]: data }));
            }
        } catch (error) {
            console.error('Failed to load analytics:', error);
        }
    };

    const toggleCardExpand = (slug: string) => {
        if (expandedCard === slug) {
            setExpandedCard(null);
        } else {
            setExpandedCard(slug);
            loadAnalytics(slug);
        }
    };

    const handleSignIn = () => {
        signIn('google');
    };

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
    };

    const handleDeleteCard = async (slug: string) => {
        if (!confirm('Are you sure you want to delete this card?')) return;

        try {
            const response = await fetch(`/api/cards/${slug}`, { method: 'DELETE' });
            if (response.ok) {
                setCards(cards.filter(c => c.slug !== slug));
                toast('Card deleted', 'success');
            }
        } catch (error) {
            console.error('Failed to delete card:', error);
        }
    };

    const copyLink = (slug: string) => {
        const link = `${window.location.origin}/c/${slug}`;
        navigator.clipboard.writeText(link);
        toast('Link copied to clipboard!', 'success');
    };

    const handleEditCard = (card: CardData) => {
        // Save card data to localStorage so the lab picks it up
        const labDraft = {
            editingSlug: card.slug, // Pass slug so lab updates instead of creating new
            recipientName: card.recipient_name,
            senderName: card.sender_name,
            cardBlocks: (card.blocks || []).map(b => ({
                blockType: b.blockId,
                name: b.blockId, // Will be rehydrated by lab
                emoji: '🧩',
                configured: true,
                inputData: b.input || {},
            })),
        };
        localStorage.setItem('sineinverse_lab_draft', JSON.stringify(labDraft));
        window.location.href = '/lab';
    };

    const handlePayCard = async (cardId: string) => {
        try {
            toast('Initiating payment...', 'info');
            const response = await fetch('/api/payments/initiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cardId }),
            });

            const data = await response.json();

            if (data.free) {
                // Payments disabled — card auto-activated
                toast('Card activated for free! 🎉', 'success');
                loadCards(); // Refresh
                return;
            }

            if (data.mode === 'qr') {
                // QR mode — show QR popup with card ID + UPI link
                setQrPaymentData({
                    qrImageUrl: data.qrImageUrl,
                    cardId: data.cardId,
                    message: data.message,
                    upiLink: data.upiLink || '',
                    upiId: data.upiId || '',
                    amount: data.amount || '143',
                });
                return;
            }

            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
            } else {
                toast(data.error || 'Payment failed. Try again.', 'error');
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast('Payment initiation failed', 'error');
        }
    };

    // Format output data for display
    const formatOutputValue = (key: string, value: unknown): string => {
        if (typeof value === 'boolean') return value ? '✅ Yes' : '❌ No';
        if (typeof value === 'number') return String(value);
        if (typeof value === 'string') return value;
        return JSON.stringify(value);
    };

    return (
        <div className={styles.account}>

            <main className={styles.content}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Account</h1>
                    <p className={styles.subtitle}>Manage your cards and view analytics</p>

                    {status === 'loading' ? (
                        <div className={styles.loginPrompt}>
                            <div className={styles.loadingSpinner}></div>
                            <p>Loading...</p>
                        </div>
                    ) : session?.user ? (
                        <>
                            <div className={styles.userCard}>
                                <div className={styles.userAvatar}>
                                    {session.user.image ? (
                                        <img src={session.user.image} alt={session.user.name || 'User'} />
                                    ) : (
                                        <span>{session.user.name?.[0] || '👤'}</span>
                                    )}
                                </div>
                                <div className={styles.userInfo}>
                                    <h2>{session.user.name}</h2>
                                    <p>{session.user.email}</p>
                                </div>
                                <button className={styles.signOutBtn} onClick={handleSignOut}>
                                    Sign Out
                                </button>
                            </div>

                            {/* Library Section */}
                            <div className={styles.librarySection}>
                                <h3>Your Cards ({cards.length})</h3>

                                {loadingCards ? (
                                    <div className={styles.emptyLibrary}>
                                        <div className={styles.loadingSpinner}></div>
                                        <p>Loading your cards...</p>
                                    </div>
                                ) : cards.length === 0 ? (
                                    <div className={styles.emptyLibrary}>
                                        <span className={styles.emptyIcon}>📭</span>
                                        <p>No cards yet</p>
                                        <Link href="/lab" className={styles.createBtn}>
                                            Create Your First Card
                                        </Link>
                                    </div>
                                ) : (
                                    <div className={styles.cardGrid}>
                                        {cards.map(card => (
                                            <div key={card.id} className={styles.cardItem}>
                                                <div className={styles.cardHeader}>
                                                    <span className={styles.cardTitle}>
                                                        {card.title || `For ${card.recipient_name}`}
                                                    </span>
                                                    <span className={`${styles.cardStatus} ${styles[card.status]}`}>
                                                        {card.status}
                                                    </span>
                                                </div>
                                                <div className={styles.cardMeta}>
                                                    <p>To: {card.recipient_name}</p>
                                                    <p className={styles.cardId}>ID: {card.id.slice(0, 8).toUpperCase()}</p>
                                                    <p>Blocks: {card.blocks?.length || 0}</p>
                                                    <p>Created: {new Date(card.created_at).toLocaleDateString()}</p>
                                                </div>
                                                <div className={styles.cardActions}>
                                                    {card.status === 'paid' ? (
                                                        <>
                                                            <button className={styles.linkBtn} onClick={() => copyLink(card.slug)}>
                                                                📋 Copy Link
                                                            </button>
                                                            <Link href={`/c/${card.slug}`} className={styles.viewBtn}>
                                                                👁️ Preview
                                                            </Link>
                                                            {card.expires_at && (
                                                                <span className={styles.expiryInfo}>
                                                                    ⏰ Expires: {new Date(card.expires_at).toLocaleDateString()}
                                                                </span>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <button
                                                            className={styles.payBtn}
                                                            onClick={() => handlePayCard(card.id)}
                                                        >
                                                            🔒 Pay ₹143 to Activate
                                                        </button>
                                                    )}
                                                    <button className={styles.editBtn} onClick={() => handleEditCard(card)}>
                                                        ✏️ Edit
                                                    </button>
                                                    {card.status === 'paid' && (
                                                        <button
                                                            className={styles.analyticsBtn}
                                                            onClick={() => toggleCardExpand(card.slug)}
                                                        >
                                                            {expandedCard === card.slug ? '▲ Hide' : '📊 Analytics'}
                                                        </button>
                                                    )}
                                                    <button className={styles.deleteBtn} onClick={() => handleDeleteCard(card.slug)}>
                                                        🗑️
                                                    </button>
                                                </div>

                                                {/* Analytics Panel */}
                                                {expandedCard === card.slug && (
                                                    <div className={styles.analyticsPanel}>
                                                        {!analytics[card.slug] ? (
                                                            <p className={styles.analyticsLoading}>Loading analytics...</p>
                                                        ) : (
                                                            <>
                                                                <div className={styles.statsRow}>
                                                                    <div className={styles.stat}>
                                                                        <span className={styles.statValue}>
                                                                            {analytics[card.slug].totalViews}
                                                                        </span>
                                                                        <span className={styles.statLabel}>Views</span>
                                                                    </div>
                                                                    <div className={styles.stat}>
                                                                        <span className={styles.statValue}>
                                                                            {analytics[card.slug].totalSessions}
                                                                        </span>
                                                                        <span className={styles.statLabel}>Play Sessions</span>
                                                                    </div>
                                                                    <div className={styles.stat}>
                                                                        <span className={styles.statValue}>
                                                                            {analytics[card.slug].outputs.length}
                                                                        </span>
                                                                        <span className={styles.statLabel}>Interactions</span>
                                                                    </div>
                                                                </div>

                                                                {analytics[card.slug].outputs.length > 0 ? (
                                                                    <div className={styles.outputsList}>
                                                                        <h4>Block Responses</h4>
                                                                        {analytics[card.slug].outputs.map((out, idx) => (
                                                                            <div key={out.id || idx} className={styles.outputItem}>
                                                                                <div className={styles.outputHeader}>
                                                                                    <span className={styles.outputBlock}>
                                                                                        🧩 {out.block_id}
                                                                                    </span>
                                                                                    <span className={styles.outputTime}>
                                                                                        {new Date(out.played_at).toLocaleString()}
                                                                                    </span>
                                                                                </div>
                                                                                <div className={styles.outputData}>
                                                                                    {Object.entries(out.output).map(([key, value]) => (
                                                                                        <div key={key} className={styles.outputRow}>
                                                                                            <span className={styles.outputKey}>{key}:</span>
                                                                                            <span className={styles.outputVal}>
                                                                                                {formatOutputValue(key, value)}
                                                                                            </span>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <p className={styles.noInteractions}>
                                                                        No interactions yet. Share your card to see responses! 💌
                                                                    </p>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={styles.loginPrompt}>
                                <div className={styles.loginIcon}>👤</div>
                                <h2>Sign in to continue</h2>
                                <p>Create an account to save your cards and track analytics</p>

                                <div className={styles.loginButtons}>
                                    <button className={styles.googleBtn} onClick={handleSignIn}>
                                        <svg width="20" height="20" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        Sign in with Google
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* QR Payment Modal */}
            {qrPaymentData && (
                <div className={styles.qrOverlay} onClick={() => setQrPaymentData(null)}>
                    <div className={styles.qrModal} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.qrCloseBtn} onClick={() => setQrPaymentData(null)}>✕</button>
                        <h2 className={styles.qrTitle}>📱 Pay ₹{qrPaymentData.amount || '143'}</h2>
                        <p className={styles.qrInstruction}>
                            {qrPaymentData.upiLink
                                ? 'Tap the button below to pay via UPI, or scan the QR code.'
                                : 'Scan the QR code below to pay.'}
                            {' '}<strong>Include this Card ID in your payment remarks:</strong>
                        </p>
                        <div className={styles.qrCardId}>
                            <span className={styles.qrCardIdLabel}>Your Card ID</span>
                            <code className={styles.qrCardIdValue}>{qrPaymentData.cardId}</code>
                            <button
                                className={styles.qrCopyBtn}
                                onClick={() => {
                                    navigator.clipboard.writeText(qrPaymentData.cardId);
                                    toast('Card ID copied!', 'success');
                                }}
                            >
                                📋 Copy
                            </button>
                        </div>

                        {/* UPI Pay Button */}
                        {qrPaymentData.upiLink && (
                            <a
                                href={qrPaymentData.upiLink}
                                className={styles.upiPayBtn}
                            >
                                💳 Pay ₹{qrPaymentData.amount} via UPI App
                            </a>
                        )}

                        {/* UPI ID Display */}
                        {qrPaymentData.upiId && (
                            <div className={styles.upiIdSection}>
                                <span className={styles.upiIdLabel}>UPI ID</span>
                                <div className={styles.upiIdRow}>
                                    <code className={styles.upiIdValue}>{qrPaymentData.upiId}</code>
                                    <button
                                        className={styles.qrCopyBtn}
                                        onClick={() => {
                                            navigator.clipboard.writeText(qrPaymentData.upiId || '');
                                            toast('UPI ID copied!', 'success');
                                        }}
                                    >
                                        📋 Copy
                                    </button>
                                </div>
                                <span className={styles.upiIdHint}>
                                    You can also manually enter this UPI ID in any payment app
                                </span>
                            </div>
                        )}

                        {qrPaymentData.qrImageUrl ? (
                            <img
                                src={qrPaymentData.qrImageUrl}
                                alt="UPI QR Code"
                                className={styles.qrCodeImage}
                            />
                        ) : !qrPaymentData.upiLink ? (
                            <p className={styles.qrNoImage}>QR code not available. Contact admin.</p>
                        ) : null}
                        <p className={styles.qrNote}>
                            After payment, the admin will verify and activate your card within a few minutes.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
