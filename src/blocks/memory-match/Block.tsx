/**
 * MEMORY MATCH BLOCK - React Component
 * 
 * Heart-shaped memory card matching game.
 * Adapted from valentine's-memory-match gameblock.
 */

'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import type { BlockProps } from '@/types/blocks';
import type { MemoryMatchInput, MemoryMatchOutput } from './schema';
import styles from './styles.module.css';

// Default romantic images
const DEFAULT_IMAGES = [
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80",
    "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&q=80",
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80",
    "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=400&q=80",
    "https://images.unsplash.com/photo-1605152276897-4f618f831968?w=400&q=80",
    "https://images.unsplash.com/photo-1490960938638-8f09d9166013?w=400&q=80",
];

// Heart path for SVG clipping
const HEART_PATH = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

interface Card {
    id: number;
    imageId: number;
    imageUrl: string;
    isFlipped: boolean;
    isMatched: boolean;
}

export default function MemoryMatchBlock({
    input = {} as MemoryMatchInput,
    onComplete,
    mode,
}: BlockProps<MemoryMatchInput, MemoryMatchOutput>) {
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [timer, setTimer] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showWinModal, setShowWinModal] = useState(false);
    const timerRef = useRef<number | null>(null);

    const title = input?.title || "Valentine's Memory";
    const subtitle = input?.subtitle || 'Match the hearts to reveal love';
    const winTitle = input?.winTitle || 'You Won!';
    const playAgainText = input?.playAgainText || 'Play Again';

    // Build images array from input
    const images = useMemo(() => {
        const result: string[] = [];
        for (let i = 1; i <= 6; i++) {
            const url = input[`image${i}` as keyof MemoryMatchInput] as string | undefined;
            if (url && url.trim()) {
                result.push(url.trim());
            } else if (DEFAULT_IMAGES[i - 1]) {
                result.push(DEFAULT_IMAGES[i - 1]);
            }
        }
        return result.length >= 6 ? result.slice(0, 6) : DEFAULT_IMAGES;
    }, [input]);

    // Initialize game
    useEffect(() => {
        startNewGame();
        return () => stopTimer();
    }, [images]);

    const stopTimer = () => {
        if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const startNewGame = () => {
        stopTimer();
        setMoves(0);
        setTimer(0);
        setIsPlaying(false);
        setIsCompleted(false);
        setFlippedIndices([]);
        setShowWinModal(false);

        // Create pairs
        const initialCards: Card[] = [];
        for (let i = 0; i < images.length; i++) {
            initialCards.push({
                id: i * 2,
                imageId: i,
                imageUrl: images[i],
                isFlipped: false,
                isMatched: false,
            });
            initialCards.push({
                id: i * 2 + 1,
                imageId: i,
                imageUrl: images[i],
                isFlipped: false,
                isMatched: false,
            });
        }

        // Shuffle
        setCards(initialCards.sort(() => Math.random() - 0.5));
    };

    // Timer logic
    useEffect(() => {
        if (isPlaying && !isCompleted) {
            timerRef.current = window.setInterval(() => {
                setTimer((t) => t + 1);
            }, 1000);
        }
        return () => stopTimer();
    }, [isPlaying, isCompleted]);

    // Check for completion
    useEffect(() => {
        if (cards.length > 0 && cards.every((c) => c.isMatched)) {
            setIsCompleted(true);
            stopTimer();
            setTimeout(() => {
                setShowWinModal(true);
            }, 500);
        }
    }, [cards]);

    const handleCardClick = (index: number) => {
        if (
            cards[index].isFlipped ||
            cards[index].isMatched ||
            flippedIndices.length >= 2 ||
            isCompleted
        ) {
            return;
        }

        if (!isPlaying) {
            setIsPlaying(true);
        }

        const newCards = [...cards];
        newCards[index].isFlipped = true;
        setCards(newCards);

        const newFlippedIndices = [...flippedIndices, index];
        setFlippedIndices(newFlippedIndices);

        if (newFlippedIndices.length === 2) {
            setMoves((m) => m + 1);
            const [firstIndex, secondIndex] = newFlippedIndices;

            if (newCards[firstIndex].imageId === newCards[secondIndex].imageId) {
                // Match found
                setTimeout(() => {
                    setCards((prev) =>
                        prev.map((c, i) =>
                            i === firstIndex || i === secondIndex
                                ? { ...c, isMatched: true }
                                : c
                        )
                    );
                    setFlippedIndices([]);
                }, 500);
            } else {
                // No match
                setTimeout(() => {
                    setCards((prev) =>
                        prev.map((c, i) =>
                            i === firstIndex || i === secondIndex
                                ? { ...c, isFlipped: false }
                                : c
                        )
                    );
                    setFlippedIndices([]);
                }, 1000);
            }
        }
    };

    const handleContinue = () => {
        setShowWinModal(false);
        onComplete({
            completed: true,
            moves,
            timeSeconds: timer,
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
                <div className={styles.stat}>
                    <span className={styles.statLabel}>Moves</span>
                    <span className={styles.statValue}>{moves}</span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statLabel}>Time</span>
                    <span className={styles.statValue}>{timer}s</span>
                </div>
            </div>

            {/* Card Grid */}
            <div className={styles.grid}>
                {cards.map((card, index) => (
                    <div
                        key={card.id}
                        className={`${styles.cardContainer} ${card.isMatched ? styles.matched : ''}`}
                        onClick={() => handleCardClick(index)}
                    >
                        <div className={`${styles.card} ${card.isFlipped ? styles.flipped : ''}`}>
                            {/* Front (Image) */}
                            <div className={styles.cardFront}>
                                <svg viewBox="0 0 24 24" className={styles.heartSvg}>
                                    <defs>
                                        <clipPath id={`heartClip-${card.id}`}>
                                            <path d={HEART_PATH} />
                                        </clipPath>
                                    </defs>
                                    <path d={HEART_PATH} fill="#d4af37" className={styles.heartShadow} />
                                    <foreignObject x="0" y="0" width="24" height="24" clipPath={`url(#heartClip-${card.id})`}>
                                        <div className={styles.imageWrapper}>
                                            <img src={card.imageUrl} alt="" />
                                        </div>
                                    </foreignObject>
                                    <path d={HEART_PATH} fill="none" stroke="#d4af37" strokeWidth="0.5" />
                                </svg>
                            </div>
                            {/* Back (Pattern) */}
                            <div className={styles.cardBack}>
                                <svg viewBox="0 0 24 24" className={styles.heartSvg}>
                                    <path d={HEART_PATH} className={styles.heartBack} />
                                    <circle cx="12" cy="10" r="3" fill="none" stroke="#d4af37" strokeWidth="0.3" opacity="0.6" />
                                </svg>
                            </div>
                        </div>
                        {card.isMatched && <div className={styles.matchPing} />}
                    </div>
                ))}
            </div>

            {/* Win Modal */}
            {showWinModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalBar} />
                        <h2 className={styles.modalTitle}>{winTitle}</h2>
                        <div className={styles.modalStats}>
                            <p>Moves: <strong>{moves}</strong></p>
                            <p>Time: <strong>{timer}s</strong></p>
                        </div>
                        <div className={styles.modalButtons}>
                            <button onClick={startNewGame} className={styles.playAgainBtn}>
                                {playAgainText}
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
