'use client';

import { useState, useEffect } from 'react';
import styles from './styles.module.css';
import type { BlockProps } from '@/types/blocks';
import type { LoveMeterInput, LoveMeterOutput } from './schema';

export default function LoveMeterBlock({
    input = {} as LoveMeterInput,
    onComplete,
}: BlockProps<LoveMeterInput, LoveMeterOutput>) {
    const name1 = input?.name1 || 'You';
    const name2 = input?.name2 || 'Me';
    const targetPct = Math.min(100, Math.max(50, input?.percentage || 99));
    const message = input?.message || 'Made for each other! 💕';
    const skin = input?.skin || 'thermometer';

    const [started, setStarted] = useState(false);
    const [currentPct, setCurrentPct] = useState(0);
    const [done, setDone] = useState(false);
    const [burstHearts, setBurstHearts] = useState<number[]>([]);

    useEffect(() => {
        if (!started) return;

        const step = targetPct / 40; // Fill in ~40 frames
        const timer = setInterval(() => {
            setCurrentPct((prev) => {
                const next = prev + step;
                if (next >= targetPct) {
                    clearInterval(timer);
                    setTimeout(() => {
                        setDone(true);
                        setBurstHearts(Array.from({ length: 6 }, (_, i) => i));
                    }, 400);
                    return targetPct;
                }
                return next;
            });
        }, 50);

        return () => clearInterval(timer);
    }, [started, targetPct]);

    const handleContinue = () => {
        onComplete?.({ measured: true, percentage: targetPct });
    };

    return (
        <div className={styles.container} data-skin={skin}>
            {/* Hearts burst */}
            {burstHearts.map((i) => (
                <span key={i} className={styles.burstHeart} style={{
                    left: `${20 + Math.random() * 60}%`,
                    animationDelay: `${i * 0.15}s`,
                }}>❤️</span>
            ))}

            <div className={styles.names}>
                <span className={styles.name}>{name1}</span>
                <span className={styles.heart}>❤️</span>
                <span className={styles.name}>{name2}</span>
            </div>

            {!started ? (
                <button className={styles.calcBtn} onClick={() => setStarted(true)}>
                    Calculate Love 💕
                </button>
            ) : (
                <>
                    {/* Meter */}
                    <div className={styles.meter}>
                        <div className={styles.meterFill} style={{ height: `${currentPct}%` }}>
                            <div className={styles.meterBubbles}>
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className={styles.bubble} style={{ animationDelay: `${i * 0.3}s` }} />
                                ))}
                            </div>
                        </div>
                        <div className={styles.meterLabel}>{Math.round(currentPct)}%</div>
                    </div>

                    {done && (
                        <div className={styles.result}>
                            <p className={styles.resultMsg}>{message}</p>
                            <button className={styles.continueBtn} onClick={handleContinue}>
                                Continue ✨
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
