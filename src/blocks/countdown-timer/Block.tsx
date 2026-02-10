'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';
import type { BlockProps } from '@/types/blocks';
import type { CountdownTimerInput, CountdownTimerOutput } from './schema';

export default function CountdownTimerBlock({
    input = {} as CountdownTimerInput,
    onComplete,
}: BlockProps<CountdownTimerInput, CountdownTimerOutput>) {
    const title = input?.title || 'Something Special is Coming...';
    const countFrom = Math.min(Math.max(input?.countFrom || 5, 3), 10);
    const revealText = input?.revealText || '🎉 Surprise! 🎉';
    const skin = input?.skin || 'digital';

    const [count, setCount] = useState(countFrom);
    const [started, setStarted] = useState(false);
    const [revealed, setRevealed] = useState(false);
    const [ringProgress, setRingProgress] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startCountdown = () => {
        setStarted(true);
    };

    useEffect(() => {
        if (!started || revealed) return;

        intervalRef.current = setInterval(() => {
            setCount((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current!);
                    setTimeout(() => setRevealed(true), 300);
                    return 0;
                }
                return prev - 1;
            });
            setRingProgress((prev) => prev + (1 / countFrom));
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [started, revealed, countFrom]);

    const handleContinue = () => {
        onComplete?.({
            completed: true,
            completedAt: new Date().toISOString(),
        });
    };

    // Ring SVG params
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - ringProgress);

    return (
        <div className={styles.container} data-skin={skin}>
            <h2 className={styles.title}>{title}</h2>

            {!started ? (
                <div className={styles.startArea}>
                    <button className={styles.startBtn} onClick={startCountdown}>
                        Start Countdown ⏳
                    </button>
                </div>
            ) : !revealed ? (
                <div className={styles.countdownArea}>
                    {/* Ring progress */}
                    <svg className={styles.ring} viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r={radius} className={styles.ringTrack} />
                        <circle
                            cx="100" cy="100" r={radius}
                            className={styles.ringProgress}
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                        />
                    </svg>

                    {/* Number */}
                    <div className={styles.numberWrap} key={count}>
                        <span className={styles.number}>{count}</span>
                    </div>

                    {/* Pulse rings */}
                    <div className={styles.pulseRing} />
                    <div className={styles.pulseRing} style={{ animationDelay: '0.5s' }} />
                </div>
            ) : (
                <div className={styles.revealArea}>
                    <div className={styles.revealBurst}>
                        {[...Array(8)].map((_, i) => (
                            <span key={i} className={styles.burstDot} style={{
                                transform: `rotate(${i * 45}deg) translateY(-60px)`,
                                animationDelay: `${i * 0.05}s`,
                            }} />
                        ))}
                    </div>

                    <h1 className={styles.revealText}>{revealText}</h1>

                    <button className={styles.continueBtn} onClick={handleContinue}>
                        Continue ✨
                    </button>
                </div>
            )}
        </div>
    );
}
