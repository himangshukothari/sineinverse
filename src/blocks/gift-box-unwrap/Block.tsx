'use client';

import { useState } from 'react';
import styles from './styles.module.css';
import type { BlockProps } from '@/types/blocks';
import type { GiftBoxInput, GiftBoxOutput } from './schema';

export default function GiftBoxUnwrapBlock({
    input = {} as GiftBoxInput,
    onComplete,
}: BlockProps<GiftBoxInput, GiftBoxOutput>) {
    const title = input?.title || 'You have a gift!';
    const giftMessage = input?.giftMessage || 'Something special just for you! 💕';
    const giftEmoji = input?.giftEmoji || '💝';
    const skin = input?.skin || 'classic';

    const [phase, setPhase] = useState<'wrapped' | 'shaking' | 'opening' | 'revealed'>('wrapped');
    const [tapCount, setTapCount] = useState(0);
    const [confetti, setConfetti] = useState<{ id: number; x: number; color: string; delay: number }[]>([]);

    const handleTap = () => {
        if (phase === 'revealed') return;

        const newCount = tapCount + 1;
        setTapCount(newCount);

        if (newCount === 1) {
            setPhase('shaking');
        }

        if (newCount >= 3) {
            setPhase('opening');

            // Spawn confetti
            const colors = ['#f43f5e', '#8b5cf6', '#eab308', '#ec4899', '#10b981', '#3b82f6'];
            const pieces = Array.from({ length: 20 }, (_, i) => ({
                id: i,
                x: 20 + Math.random() * 60,
                color: colors[Math.floor(Math.random() * colors.length)],
                delay: Math.random() * 0.5,
            }));
            setConfetti(pieces);

            setTimeout(() => setPhase('revealed'), 800);
        }
    };

    const handleContinue = () => {
        onComplete?.({
            unwrapped: true,
            unwrappedAt: new Date().toISOString(),
        });
    };

    return (
        <div className={styles.container} data-skin={skin}>
            {/* Confetti */}
            {confetti.map((c) => (
                <div
                    key={c.id}
                    className={styles.confettiPiece}
                    style={{
                        left: `${c.x}%`,
                        backgroundColor: c.color,
                        animationDelay: `${c.delay}s`,
                    }}
                />
            ))}

            <h2 className={styles.title}>{title}</h2>

            <div className={`${styles.giftBox} ${styles[phase]}`} onClick={handleTap}>
                {/* Ribbon */}
                <div className={styles.ribbonV} />
                <div className={styles.ribbonH} />

                {/* Lid */}
                <div className={styles.lid}>
                    <div className={styles.bow}>
                        <div className={styles.bowLoop} />
                        <div className={styles.bowLoop} />
                        <div className={styles.bowKnot} />
                    </div>
                </div>

                {/* Box body */}
                <div className={styles.boxBody}>
                    {/* Gift inside */}
                    <div className={styles.giftInside}>
                        <span className={styles.giftEmoji}>{giftEmoji}</span>
                    </div>
                </div>
            </div>

            {phase !== 'revealed' && (
                <p className={styles.hint}>
                    {phase === 'wrapped' ? 'Tap the gift to unwrap! 🎁' :
                        phase === 'shaking' ? 'Keep tapping! 👆' : 'Opening...'}
                </p>
            )}

            {phase === 'revealed' && (
                <div className={styles.revealCard}>
                    <p className={styles.giftMessage}>{giftMessage}</p>
                    <button className={styles.continueBtn} onClick={handleContinue}>
                        Continue ✨
                    </button>
                </div>
            )}
        </div>
    );
}
