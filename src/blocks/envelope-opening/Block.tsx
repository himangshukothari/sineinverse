/**
 * ENVELOPE OPENING BLOCK — Premium 3D Envelope
 * 
 * Beautiful envelope with:
 * - Floating particles background
 * - 3D flap opening animation (SVG envelope, not CSS triangles)
 * - Wax seal that breaks with particle burst
 * - Letter slides up out of envelope
 * - Skin variants: wax-seal, hearts, elegant
 */

'use client';

import { useState, useMemo } from 'react';
import styles from './styles.module.css';
import type { BlockProps } from '@/types/blocks';
import type { EnvelopeOpeningInput, EnvelopeOpeningOutput } from './schema';

export default function EnvelopeOpeningBlock({
    input = {} as EnvelopeOpeningInput,
    onComplete,
    mode,
}: BlockProps<EnvelopeOpeningInput, EnvelopeOpeningOutput>) {
    const toName = input?.toName || 'My Love';
    const fromName = input?.fromName || 'Your Secret Admirer';
    const message = input?.message || 'Every moment with you feels like a beautiful dream I never want to wake up from. You make my world brighter just by being in it. 💕';
    const skin = input?.skin || 'wax-seal';

    const [phase, setPhase] = useState<'closed' | 'opening' | 'opened' | 'reading'>('closed');
    const [bursts, setBursts] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);

    // Floating background elements
    const floats = useMemo(() => {
        const skins: Record<string, string[]> = {
            'wax-seal': ['💕', '✨', '🌟', '💗', '⭐', '❤️', '💫', '🌸'],
            'hearts': ['💖', '💗', '💓', '💞', '💕', '💘', '♥️', '💝'],
            'elegant': ['✨', '⭐', '🌟', '💫', '✦', '✧', '⚝', '❋'],
        };
        const emojis = skins[skin] || skins['wax-seal'];
        return Array.from({ length: 12 }, (_, i) => ({
            id: i,
            emoji: emojis[i % emojis.length],
            x: 5 + Math.random() * 90,
            y: 5 + Math.random() * 90,
            size: 0.7 + Math.random() * 1,
            delay: Math.random() * 5,
            dur: 3 + Math.random() * 4,
        }));
    }, [skin]);

    const handleOpen = () => {
        if (phase !== 'closed') return;
        setPhase('opening');

        // Burst particles from seal position
        const sealBurst = Array.from({ length: 12 }, (_, i) => ({
            id: i,
            x: 50 + (Math.random() - 0.5) * 30,
            y: 60 + (Math.random() - 0.5) * 20,
            emoji: ['✨', '💫', '⭐', '💕', '❤️', '🌟', '💖', '✦', '🎉', '💗', '🌸', '💜'][i],
        }));
        setBursts(sealBurst);

        // Phase transitions
        setTimeout(() => setPhase('opened'), 900);
        setTimeout(() => setPhase('reading'), 1800);
    };

    const handleContinue = () => {
        onComplete?.({
            opened: true,
            openedAt: new Date().toISOString(),
        });
    };

    const sealEmojis: Record<string, string> = {
        'wax-seal': '❤️',
        'hearts': '💕',
        'elegant': '✨',
    };

    return (
        <div className={styles.container} data-skin={skin}>
            {/* Floating background */}
            <div className={styles.floatLayer}>
                {floats.map(f => (
                    <span
                        key={f.id}
                        className={styles.floatEmoji}
                        style={{
                            left: `${f.x}%`,
                            top: `${f.y}%`,
                            fontSize: `${f.size}rem`,
                            animationDelay: `${f.delay}s`,
                            animationDuration: `${f.dur}s`,
                        }}
                    >
                        {f.emoji}
                    </span>
                ))}
            </div>

            {/* Burst particles */}
            {bursts.map(b => (
                <span
                    key={b.id}
                    className={styles.burst}
                    style={{
                        left: `${b.x}%`,
                        top: `${b.y}%`,
                    }}
                >
                    {b.emoji}
                </span>
            ))}

            {/* Title */}
            <div className={styles.header}>
                <p className={styles.toLabel}>To: <strong>{toName}</strong></p>
            </div>

            {/* Envelope */}
            <div className={styles.envelopeScene}>
                <div className={`${styles.envelope} ${styles[phase]}`}>
                    {/* Back of envelope (visible behind letter) */}
                    <div className={styles.envBack} />

                    {/* Letter card */}
                    <div className={`${styles.letter} ${phase === 'reading' ? styles.letterSlideUp : ''}`}>
                        <div className={styles.letterInner}>
                            <div className={styles.letterDecor}>💌</div>
                            <p className={styles.letterMsg}>{message}</p>
                            <p className={styles.letterFrom}>— {fromName}</p>
                            {phase === 'reading' && (
                                <button className={styles.continueBtn} onClick={handleContinue}>
                                    Continue ✨
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Front of envelope (covers letter bottom half) */}
                    <div className={styles.envFront}>
                        <div className={styles.envFrontInner}>
                            {phase === 'closed' && (
                                <p className={styles.fromLabel}>From: <strong>{fromName}</strong></p>
                            )}
                        </div>
                    </div>

                    {/* Flap (top triangle) */}
                    <div className={styles.flap}>
                        <div className={styles.flapFront} />
                        <div className={styles.flapBack} />
                    </div>

                    {/* Wax seal */}
                    {phase === 'closed' && (
                        <button className={styles.seal} onClick={handleOpen}>
                            <span className={styles.sealEmoji}>{sealEmojis[skin] || '❤️'}</span>
                            <span className={styles.sealLabel}>TAP</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Hint */}
            {phase === 'closed' && (
                <p className={styles.hint}>Tap the seal to open 💌</p>
            )}

            {mode === 'preview' && <div className={styles.badge}>Preview</div>}
        </div>
    );
}
