'use client';

import { useState } from 'react';
import styles from './styles.module.css';
import type { BlockProps } from '@/types/blocks';
import type { FortuneCookieInput, FortuneCookieOutput } from './schema';

export default function FortuneCookieBlock({
    input = {} as FortuneCookieInput,
    onComplete,
}: BlockProps<FortuneCookieInput, FortuneCookieOutput>) {
    const fortune = input?.fortune || 'A beautiful love story awaits you — and you are its main character. 💕';
    const luckyNumbers = input?.luckyNumbers || '7, 14, 21, 42';
    const skin = input?.skin || 'golden';

    const [phase, setPhase] = useState<'whole' | 'cracking' | 'cracked'>('whole');
    const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

    const handleCrack = () => {
        if (phase !== 'whole') return;

        setPhase('cracking');

        // Sparkle burst
        const newSparkles = Array.from({ length: 12 }, (_, i) => ({
            id: i,
            x: 40 + Math.random() * 20,
            y: 35 + Math.random() * 30,
        }));
        setSparkles(newSparkles);

        setTimeout(() => setPhase('cracked'), 600);
    };

    const handleContinue = () => {
        onComplete?.({
            cracked: true,
            crackedAt: new Date().toISOString(),
        });
    };

    return (
        <div className={styles.container} data-skin={skin}>
            {/* Sparkle burst */}
            {sparkles.map((s) => (
                <span key={s.id} className={styles.sparkle} style={{ left: `${s.x}%`, top: `${s.y}%` }}>✨</span>
            ))}

            {/* Background glow */}
            <div className={styles.bgGlow} />

            {phase !== 'cracked' ? (
                <div className={styles.cookieArea}>
                    <div
                        className={`${styles.cookie} ${phase === 'cracking' ? styles.cracking : ''}`}
                        onClick={handleCrack}
                    >
                        {/* Cookie SVG shape */}
                        <svg viewBox="0 0 200 120" className={styles.cookieSvg}>
                            {/* Left half */}
                            <path
                                className={styles.cookieLeft}
                                d="M100,10 Q60,10 40,30 Q10,60 30,90 Q50,115 100,110 Z"
                            />
                            {/* Right half */}
                            <path
                                className={styles.cookieRight}
                                d="M100,10 Q140,10 160,30 Q190,60 170,90 Q150,115 100,110 Z"
                            />
                        </svg>

                        {/* Paper strip peeking out */}
                        <div className={styles.paperStrip}>
                            <span className={styles.paperText}>🔮</span>
                        </div>
                    </div>

                    <p className={styles.instruction}>
                        {phase === 'whole' ? 'Tap to crack the cookie!' : 'Cracking...'}
                    </p>
                </div>
            ) : (
                <div className={styles.fortuneReveal}>
                    {/* Two cookie halves */}
                    <div className={styles.cookieHalves}>
                        <svg viewBox="0 0 100 120" className={styles.halfLeft}>
                            <path d="M95,10 Q55,10 35,30 Q5,60 25,90 Q45,115 95,110 Z" />
                        </svg>
                        <svg viewBox="0 0 100 120" className={styles.halfRight}>
                            <path d="M5,10 Q45,10 65,30 Q95,60 75,90 Q55,115 5,110 Z" />
                        </svg>
                    </div>

                    {/* Fortune paper */}
                    <div className={styles.fortunePaper}>
                        <p className={styles.fortuneText}>{fortune}</p>
                        {luckyNumbers && (
                            <p className={styles.luckyNums}>Lucky numbers: {luckyNumbers}</p>
                        )}
                    </div>

                    <button className={styles.continueBtn} onClick={handleContinue}>
                        Continue ✨
                    </button>
                </div>
            )}
        </div>
    );
}
