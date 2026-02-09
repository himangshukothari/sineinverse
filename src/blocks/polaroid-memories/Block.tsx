/**
 * POLAROID MEMORIES BLOCK - React Component
 * 
 * Memory matching with polaroid-style photo cards and captions.
 * Adapted from polaroid-memories gameblock.
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import type { BlockProps } from '@/types/blocks';
import type { PolaroidMemoriesInput, PolaroidMemoriesOutput } from './schema';
import styles from './styles.module.css';

// Default memories
const DEFAULT_MEMORIES = [
    { id: '1', imageUrl: 'https://picsum.photos/seed/rose/400/400', caption: 'For you' },
    { id: '2', imageUrl: 'https://picsum.photos/seed/beach/400/400', caption: 'Our getaway' },
    { id: '3', imageUrl: 'https://picsum.photos/seed/coffee/400/400', caption: 'Morning brew' },
    { id: '4', imageUrl: 'https://picsum.photos/seed/sunset/400/400', caption: 'Golden hour' },
    { id: '5', imageUrl: 'https://picsum.photos/seed/stars/400/400', caption: 'Starry night' },
    { id: '6', imageUrl: 'https://picsum.photos/seed/hands/400/400', caption: 'Holding on' },
];

interface MemoryItem {
    id: string;
    imageUrl: string;
    caption: string;
}

interface CardState {
    id: string;
    item: MemoryItem;
    isFlipped: boolean;
    isMatched: boolean;
    rotation: number;
}

export default function PolaroidMemoriesBlock({
    input,
    onComplete,
    mode,
}: BlockProps<PolaroidMemoriesInput, PolaroidMemoriesOutput>) {
    const [cards, setCards] = useState<CardState[]>([]);
    const [flippedIds, setFlippedIds] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [moves, setMoves] = useState(0);
    const [showWinModal, setShowWinModal] = useState(false);

    const title = input.title || 'Polaroid Memories';
    const subtitle = input.subtitle || 'Match the moments';
    const winMessage = input.winMessage || 'Beautifully Remembered!';

    // Build memories from input
    const memories = useMemo(() => {
        const result: MemoryItem[] = [];
        for (let i = 1; i <= 6; i++) {
            const imageUrl = input[`memory${i}Image` as keyof PolaroidMemoriesInput] as string | undefined;
            const caption = input[`memory${i}Caption` as keyof PolaroidMemoriesInput] as string | undefined;

            if (imageUrl && imageUrl.trim()) {
                result.push({
                    id: String(i),
                    imageUrl: imageUrl.trim(),
                    caption: caption?.trim() || `Memory ${i}`,
                });
            }
        }
        return result.length >= 4 ? result : DEFAULT_MEMORIES;
    }, [input]);

    // Initialize game
    useEffect(() => {
        initGame();
    }, [memories]);

    const initGame = () => {
        // Create pairs
        const gameItems = [...memories, ...memories];

        // Shuffle and create card state
        const newCards: CardState[] = gameItems
            .sort(() => Math.random() - 0.5)
            .map((item, index) => ({
                id: `card-${index}`,
                item,
                isFlipped: false,
                isMatched: false,
                rotation: Math.random() * 8 - 4,
            }));

        setCards(newCards);
        setFlippedIds([]);
        setMoves(0);
        setIsProcessing(false);
        setShowWinModal(false);
    };

    const handleCardClick = (id: string) => {
        if (isProcessing) return;
        if (flippedIds.includes(id)) return;

        const card = cards.find(c => c.id === id);
        if (!card || card.isFlipped || card.isMatched) return;

        // Flip the card
        setFlippedIds((prev) => [...prev, id]);
        setCards((prev) =>
            prev.map((c) =>
                c.id === id ? { ...c, isFlipped: true } : c
            )
        );

        // Check for match if second card
        if (flippedIds.length === 1) {
            setMoves((prev) => prev + 1);
            setIsProcessing(true);
            const firstId = flippedIds[0];
            const secondId = id;

            const firstCard = cards.find((c) => c.id === firstId);
            const secondCard = cards.find((c) => c.id === secondId);

            if (firstCard && secondCard && firstCard.item.id === secondCard.item.id) {
                // Match found
                setTimeout(() => {
                    setCards((prev) =>
                        prev.map((c) =>
                            c.id === firstId || c.id === secondId
                                ? { ...c, isMatched: true }
                                : c
                        )
                    );
                    setFlippedIds([]);
                    setIsProcessing(false);
                }, 800);
            } else {
                // No match
                setTimeout(() => {
                    setCards((prev) =>
                        prev.map((c) =>
                            c.id === firstId || c.id === secondId
                                ? { ...c, isFlipped: false }
                                : c
                        )
                    );
                    setFlippedIds([]);
                    setIsProcessing(false);
                }, 1500);
            }
        }
    };

    // Check for completion
    useEffect(() => {
        if (cards.length > 0 && cards.every((c) => c.isMatched)) {
            setTimeout(() => {
                setShowWinModal(true);
            }, 800);
        }
    }, [cards]);

    const handleContinue = () => {
        setShowWinModal(false);
        onComplete({
            completed: true,
            moves,
            playedAt: new Date().toISOString(),
        });
    };

    return (
        <div className={styles.container} data-mode={mode}>
            {/* Header */}
            <header className={styles.header}>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.subtitle}>{subtitle}</p>
            </header>

            {/* Stats */}
            <div className={styles.stats}>
                <span>Moves: {moves}</span>
                <button onClick={initGame} className={styles.restartBtn}>Restart</button>
            </div>

            {/* Card Grid */}
            <div className={styles.grid}>
                {cards.map((card) => (
                    <div
                        key={card.id}
                        className={`${styles.polaroidContainer} ${card.isMatched ? styles.matched : ''}`}
                        style={{
                            transform: `rotate(${card.rotation}deg) scale(${card.isMatched ? 1.05 : 1})`,
                            zIndex: card.isFlipped || card.isMatched ? 20 : 10,
                        }}
                        onClick={() => handleCardClick(card.id)}
                    >
                        <div className={`${styles.polaroid} ${card.isFlipped || card.isMatched ? styles.flipped : ''}`}>
                            {/* Card Back */}
                            <div className={styles.polaroidBack}>
                                <div className={styles.backPattern}>
                                    <span className={styles.backHeart}>♥</span>
                                </div>
                            </div>
                            {/* Card Front (Polaroid) */}
                            <div className={styles.polaroidFront}>
                                <div className={styles.photoArea}>
                                    {(card.isFlipped || card.isMatched) && (
                                        <img
                                            src={card.item.imageUrl}
                                            alt={card.item.caption}
                                            className={styles.photo}
                                        />
                                    )}
                                    <div className={styles.photoOverlay} />
                                </div>
                                <div className={styles.captionArea}>
                                    <p className={styles.caption}>{card.item.caption}</p>
                                </div>
                                {card.isMatched && (
                                    <div className={styles.matchHeart}>♥</div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Win Modal */}
            {showWinModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalEmoji}>💖</div>
                        <h2 className={styles.modalTitle}>{winMessage}</h2>
                        <p className={styles.modalSubtitle}>You've matched all the memories.</p>
                        <div className={styles.modalButtons}>
                            <button onClick={initGame} className={styles.playAgainBtn}>
                                Play Again
                            </button>
                            <button onClick={handleContinue} className={styles.continueBtn}>
                                Continue →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {mode === 'preview' && (
                <div className={styles.previewBadge}>Preview Mode</div>
            )}
        </div>
    );
}
