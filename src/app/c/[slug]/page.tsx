'use client';

import { useState, useEffect, useCallback } from 'react';
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

export default function CardViewPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [card, setCard] = useState<CardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

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
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load card');
        } finally {
            setLoading(false);
        }
    };

    // Handle block completion
    const handleBlockComplete = useCallback((output: Record<string, unknown>) => {
        console.log('Block output:', output);

        // Move to next block
        if (card && currentBlockIndex < card.blocks.length - 1) {
            setCurrentBlockIndex(prev => prev + 1);
        } else {
            // All blocks complete
            setIsPlaying(false);
        }
    }, [card, currentBlockIndex]);

    // Start playing the card
    const startPlaying = () => {
        setCurrentBlockIndex(0);
        setIsPlaying(true);
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
                    <h1>💔</h1>
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
            {!isPlaying ? (
                /* Start Screen */
                <div className={styles.startScreen}>
                    <div className={styles.envelope}>💌</div>
                    <h1>You have a card!</h1>
                    <p className={styles.from}>From: {card.sender_name}</p>
                    <p className={styles.to}>To: {card.recipient_name}</p>
                    <button
                        className={styles.openBtn}
                        onClick={startPlaying}
                    >
                        Open Card ✨
                    </button>
                </div>
            ) : (
                /* Playing blocks */
                <div className={styles.player}>
                    <div className={styles.progress}>
                        {sortedBlocks.map((_, i) => (
                            <div
                                key={i}
                                className={`${styles.progressDot} ${i <= currentBlockIndex ? styles.active : ''}`}
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
