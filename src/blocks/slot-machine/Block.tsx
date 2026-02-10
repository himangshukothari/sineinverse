'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';
import type { BlockProps } from '@/types/blocks';
import type { SlotMachineInput, SlotMachineOutput } from './schema';

const SYMBOLS = ['❤️', '💕', '💋', '🌹', '💎', '⭐', '🦋', '🔥'];
const WIN_SYMBOL = '❤️';

export default function SlotMachineBlock({
    input = {} as SlotMachineInput,
    onComplete,
}: BlockProps<SlotMachineInput, SlotMachineOutput>) {
    const title = input?.title || 'Love Slots!';
    const prize = input?.prize || 'You win infinite kisses! 💋';
    const skin = input?.skin || 'vegas';

    const [spinning, setSpinning] = useState(false);
    const [reels, setReels] = useState([WIN_SYMBOL, WIN_SYMBOL, WIN_SYMBOL]);
    const [reelPositions, setReelPositions] = useState([0, 0, 0]);
    const [won, setWon] = useState(false);
    const [showPrize, setShowPrize] = useState(false);
    const spinCount = useRef(0);

    const handleSpin = () => {
        if (spinning) return;
        setSpinning(true);
        setWon(false);
        setShowPrize(false);
        spinCount.current++;

        // Animate reels with staggered stops
        const newPositions = [
            Math.floor(Math.random() * 20) + 20,
            Math.floor(Math.random() * 20) + 30,
            Math.floor(Math.random() * 20) + 40,
        ];
        setReelPositions(newPositions);

        // After 2nd spin, always win
        const shouldWin = spinCount.current >= 2;

        // Stop reels one by one
        const finalSymbols = shouldWin
            ? [WIN_SYMBOL, WIN_SYMBOL, WIN_SYMBOL]
            : [
                SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
                SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
                SYMBOLS[Math.floor(Math.random() * (SYMBOLS.length - 1)) + 1], // Ensure not all same
            ];

        setTimeout(() => setReels((r) => [finalSymbols[0], r[1], r[2]]), 1200);
        setTimeout(() => setReels((r) => [r[0], finalSymbols[1], r[2]]), 1800);
        setTimeout(() => {
            setReels(finalSymbols);
            setSpinning(false);
            if (shouldWin) {
                setWon(true);
                setTimeout(() => setShowPrize(true), 600);
            }
        }, 2400);
    };

    const handleContinue = () => {
        onComplete?.({ spun: true, spunAt: new Date().toISOString() });
    };

    return (
        <div className={styles.container} data-skin={skin}>
            <h2 className={styles.title}>{title}</h2>

            {/* Machine frame */}
            <div className={styles.machine}>
                <div className={styles.display}>
                    {reels.map((symbol, i) => (
                        <div key={i} className={`${styles.reelWindow} ${spinning ? styles.spinning : ''} ${won ? styles.winning : ''}`}
                            style={{ animationDelay: `${i * 0.15}s` }}>
                            <div className={styles.reelInner} style={spinning ? { animationDuration: `${0.15 + i * 0.05}s` } : undefined}>
                                <span className={styles.symbol}>{symbol}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Win line */}
                <div className={`${styles.winLine} ${won ? styles.winLineActive : ''}`} />

                {/* Lever / Spin button */}
                <button
                    className={styles.spinBtn}
                    onClick={handleSpin}
                    disabled={spinning || showPrize}
                >
                    {spinning ? '🔄' : 'SPIN'}
                </button>
            </div>

            {/* Lights row */}
            <div className={styles.lights}>
                {[...Array(7)].map((_, i) => (
                    <div key={i} className={`${styles.light} ${won ? styles.lightFlash : ''}`} style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
            </div>

            {showPrize && (
                <div className={styles.prizeCard}>
                    <h3 className={styles.prizeTitle}>🎉 JACKPOT! 🎉</h3>
                    <p className={styles.prizeText}>{prize}</p>
                    <button className={styles.continueBtn} onClick={handleContinue}>
                        Claim Prize ✨
                    </button>
                </div>
            )}

            {!showPrize && !spinning && !won && (
                <p className={styles.hint}>
                    {spinCount.current === 0 ? 'Pull the lever!' : 'Try again — feeling lucky? 🍀'}
                </p>
            )}
        </div>
    );
}
