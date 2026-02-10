'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import styles from './card.module.css';
import { BlockRenderer } from '@/components/BlockRenderer';

interface CardBlockData {
    blockId: string;
    order: number;
    input: Record<string, unknown>;
}

interface CardData {
    id: string;
    slug: string;
    title: string | null;
    recipient_name: string;
    sender_name: string;
    blocks: CardBlockData[];
    status: string;
}

// Generate a unique session ID for this card visit
function getSessionId(): string {
    const key = 'sineinverse_session_id';
    let sid = sessionStorage.getItem(key);
    if (!sid) {
        sid = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        sessionStorage.setItem(key, sid);
    }
    return sid;
}

export default function CardViewPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [card, setCard] = useState<CardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    const viewRecorded = useRef(false);
    const sessionId = useRef<string>('');

    // Generate session ID on mount
    useEffect(() => {
        sessionId.current = getSessionId();
    }, []);

    // Load card data
    useEffect(() => {
        if (slug) {
            loadCard();
        }
    }, [slug]);

    const loadCard = async () => {
        try {
            const response = await fetch(`/api/cards/${slug}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Card not found');
            }

            setCard(data.card);

            // Record the card view (once per page load)
            if (!viewRecorded.current) {
                viewRecorded.current = true;
                fetch(`/api/cards/${slug}/analytics`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'view' }),
                }).catch(() => { /* silent fail */ });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load card');
        } finally {
            setLoading(false);
        }
    };

    // Handle block completion — save output to backend
    const handleBlockComplete = useCallback((output: Record<string, unknown>) => {
        if (!card) return;

        const sortedBlocks = [...card.blocks].sort((a, b) => a.order - b.order);
        const currentBlock = sortedBlocks[currentBlockIndex];

        // Save block output to backend
        if (currentBlock) {
            fetch(`/api/cards/${slug}/analytics`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'output',
                    blockId: currentBlock.blockId,
                    blockOrder: currentBlock.order,
                    output,
                    sessionId: sessionId.current,
                }),
            }).catch(() => { /* silent fail - don't break UX */ });
        }

        if (currentBlockIndex < card.blocks.length - 1) {
            setCurrentBlockIndex(prev => prev + 1);
        } else {
            // All blocks complete
            setIsPlaying(false);
            setIsComplete(true);
        }
    }, [card, currentBlockIndex, slug]);

    // Start playing the card
    const startPlaying = () => {
        setCurrentBlockIndex(0);
        setIsPlaying(true);
        setIsComplete(false);
    };

    // Copy share link
    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        } catch {
            // Fallback
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading your card...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !card) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <span className={styles.errorEmoji}>💔</span>
                    <h2>Oops!</h2>
                    <p>{error || 'Card not found'}</p>
                    <a href="/" className={styles.homeLink}>Go to Homepage</a>
                </div>
            </div>
        );
    }

    // Sort blocks by order
    const sortedBlocks = [...card.blocks].sort((a, b) => a.order - b.order);
    const currentBlock = sortedBlocks[currentBlockIndex];

    return (
        <div className={styles.container}>
            {!isPlaying && !isComplete ? (
                /* ===== Start Screen ===== */
                <div className={styles.startScreen}>
                    <div className={styles.startDecor}>
                        <div className={styles.sparkle} style={{ '--d': '0s', '--x': '20%', '--y': '15%' } as React.CSSProperties}>✨</div>
                        <div className={styles.sparkle} style={{ '--d': '1s', '--x': '80%', '--y': '25%' } as React.CSSProperties}>💕</div>
                        <div className={styles.sparkle} style={{ '--d': '2s', '--x': '65%', '--y': '70%' } as React.CSSProperties}>🌟</div>
                    </div>

                    <div className={styles.envelope}>💌</div>
                    <h1>You have a card!</h1>
                    <p className={styles.from}>From: <strong>{card.sender_name}</strong></p>
                    <p className={styles.to}>To: <strong>{card.recipient_name}</strong></p>
                    <button className={styles.openBtn} onClick={startPlaying}>
                        Open Card ✨
                    </button>
                    <p className={styles.blockHint}>{sortedBlocks.length} interactive surprise{sortedBlocks.length !== 1 ? 's' : ''} inside</p>
                </div>
            ) : isComplete ? (
                /* ===== Completion Screen ===== */
                <div className={styles.completeScreen}>
                    <div className={styles.confettiBurst}>🎉</div>
                    <h1>All Done!</h1>
                    <p className={styles.completeMessage}>
                        Hope you enjoyed this card from <strong>{card.sender_name}</strong> 💜
                    </p>

                    <div className={styles.completeActions}>
                        <button className={styles.replayBtn} onClick={startPlaying}>
                            Play Again 🔄
                        </button>
                        <button className={styles.shareBtn} onClick={copyLink}>
                            {linkCopied ? 'Copied! ✓' : 'Share This Card 📤'}
                        </button>
                    </div>

                    <a href="/" className={styles.createOwn}>
                        Create your own card →
                    </a>
                </div>
            ) : (
                /* ===== Playing Blocks ===== */
                <div className={styles.player}>
                    <div className={styles.progress}>
                        {sortedBlocks.map((_, i) => (
                            <div
                                key={i}
                                className={`${styles.progressDot} ${i < currentBlockIndex ? styles.done : ''} ${i === currentBlockIndex ? styles.active : ''}`}
                            />
                        ))}
                    </div>

                    <div className={styles.blockContainer}>
                        {currentBlock && (
                            <BlockRenderer
                                blockId={currentBlock.blockId}
                                input={currentBlock.input || {}}
                                mode="play"
                                onComplete={handleBlockComplete}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
