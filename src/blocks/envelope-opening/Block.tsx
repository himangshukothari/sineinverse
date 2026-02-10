'use client';

import { useState, useEffect } from 'react';
import styles from './styles.module.css';
import type { BlockProps } from '@/types/blocks';
import type { EnvelopeOpeningInput, EnvelopeOpeningOutput } from './schema';

export default function EnvelopeOpeningBlock({
    input = {} as EnvelopeOpeningInput,
    onComplete,
}: BlockProps<EnvelopeOpeningInput, EnvelopeOpeningOutput>) {
    const toName = input?.toName || 'My Love';
    const fromName = input?.fromName || 'Your Secret Admirer';
    const message = input?.message || 'A special surprise awaits you inside! 💕';
    const skin = input?.skin || 'wax-seal';

    const [phase, setPhase] = useState<'closed' | 'opening' | 'opened' | 'reading'>('closed');
    const [particles, setParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);

    const sealEmojis: Record<string, string> = {
        'wax-seal': '❤️',
        'hearts': '💕',
        'elegant': '✨',
    };

    const handleOpen = () => {
        setPhase('opening');

        // Spawn particles on seal break
        const newParticles = Array.from({ length: 8 }, (_, i) => ({
            id: i,
            x: 50 + (Math.random() - 0.5) * 40,
            y: 40 + (Math.random() - 0.5) * 30,
            emoji: ['✨', '💫', '⭐', '💕', '❤️'][Math.floor(Math.random() * 5)],
        }));
        setParticles(newParticles);

        setTimeout(() => setPhase('opened'), 800);
        setTimeout(() => setPhase('reading'), 1600);
    };

    const handleContinue = () => {
        onComplete?.({
            opened: true,
            openedAt: new Date().toISOString(),
        });
    };

    return (
        <div className={styles.container} data-skin={skin}>
            {/* Floating background particles */}
            <div className={styles.bgParticles}>
                {[...Array(6)].map((_, i) => (
                    <span key={i} className={styles.bgDot} style={{
                        left: `${10 + Math.random() * 80}%`,
                        top: `${10 + Math.random() * 80}%`,
                        animationDelay: `${i * 0.7}s`,
                        fontSize: `${0.8 + Math.random() * 0.8}rem`,
                    }}>
                        {['💕', '✨', '🌟', '💗', '⭐', '💜'][i]}
                    </span>
                ))}
            </div>

            {/* Burst particles on seal break */}
            {particles.map((p) => (
                <span key={p.id} className={styles.burstParticle} style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                }}>
                    {p.emoji}
                </span>
            ))}

            <div className={`${styles.envelope} ${styles[phase]}`}>
                {/* Envelope flap (top triangle) */}
                <div className={styles.flap}>
                    <div className={styles.flapInner} />
                </div>

                {/* Envelope body */}
                <div className={styles.body}>
                    {/* Front: To/From & Seal */}
                    <div className={styles.front}>
                        <p className={styles.toLabel}>To: <strong>{toName}</strong></p>
                        <p className={styles.fromLabel}>From: <strong>{fromName}</strong></p>

                        {phase === 'closed' && (
                            <button className={styles.seal} onClick={handleOpen}>
                                <span className={styles.sealEmoji}>{sealEmojis[skin]}</span>
                                <span className={styles.sealText}>Tap to Open</span>
                            </button>
                        )}
                    </div>

                    {/* Letter inside */}
                    <div className={`${styles.letter} ${phase === 'reading' ? styles.letterOut : ''}`}>
                        <div className={styles.letterContent}>
                            <p className={styles.letterMessage}>{message}</p>
                            <button className={styles.continueBtn} onClick={handleContinue}>
                                Continue ✨
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {phase === 'closed' && (
                <p className={styles.hint}>Tap the seal to open your envelope</p>
            )}
        </div>
    );
}
