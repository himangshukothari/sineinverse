/**
 * FLOWER WHEEL BLOCK - React Component
 * 
 * A spinning flower petal wheel game. Spin to reveal a surprise message!
 * Adapted from valentine-flower-wheel gameblock.
 */

'use client';

import { useState, useMemo } from 'react';
import type { BlockProps } from '@/types/blocks';
import type { FlowerWheelInput, FlowerWheelOutput } from './schema';
import styles from './styles.module.css';

interface PetalData {
    text: string;
    message: string;
}

export default function FlowerWheelBlock({
    input = {} as FlowerWheelInput,
    onComplete,
    mode,
}: BlockProps<FlowerWheelInput, FlowerWheelOutput>) {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [selectedPetalIndex, setSelectedPetalIndex] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Build petals array from input
    const petals = useMemo(() => {
        const result: PetalData[] = [];

        // Add petals that have text defined
        const petalKeys = [1, 2, 3, 4, 5, 6, 7, 8] as const;
        for (const n of petalKeys) {
            const text = input?.[`petal${n}Text` as keyof FlowerWheelInput] as string | undefined;
            const message = input?.[`petal${n}Message` as keyof FlowerWheelInput] as string | undefined;
            if (text && text.trim()) {
                result.push({
                    text: text.trim(),
                    message: message?.trim() || 'A special surprise awaits!',
                });
            }
        }

        // Default petals if none provided
        if (result.length === 0) {
            return [
                { text: 'Dinner Date', message: 'A romantic candlelight dinner tonight!' },
                { text: 'Massage', message: 'A relaxing 30-minute massage.' },
                { text: 'Movie Night', message: 'You pick the movie, I bring the popcorn.' },
                { text: 'Breakfast in Bed', message: 'Sleep in, I\'ll handle breakfast.' },
            ];
        }

        return result;
    }, [input]);

    const numPetals = petals.length;
    const anglePerPetal = 360 / numPetals;

    const title = input?.title || "Valentine's Surprise";
    const subtitle = input?.subtitle || 'Spin the flower to reveal your gift';
    const buttonText = input?.buttonText || 'Pick a Petal';
    const acceptButtonText = input?.acceptButtonText || 'Accept with Love';

    // Spin logic
    const handleSpin = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        setSelectedPetalIndex(null);

        const randomOffset = Math.floor(Math.random() * 360);
        const extraSpins = 360 * 8;
        const targetRotation = rotation + extraSpins + randomOffset;

        setRotation(targetRotation);

        // Determine winner
        const finalAngle = targetRotation % 360;
        const angleFromTop = (360 - finalAngle) % 360;
        const winningIndex = Math.floor(angleFromTop / anglePerPetal);

        setTimeout(() => {
            setIsSpinning(false);
            setSelectedPetalIndex(winningIndex);
            setShowModal(true);
        }, 4500);
    };

    const closeModal = () => {
        setShowModal(false);

        if (selectedPetalIndex !== null) {
            const winner = petals[selectedPetalIndex];
            onComplete({
                selectedPetal: winner.text,
                selectedMessage: winner.message,
                playedAt: new Date().toISOString(),
            });
        }
    };

    // Generate petal path
    const radius = 200;
    const getPetalPath = () => {
        const angleRad = (anglePerPetal * Math.PI) / 180;
        const halfAngle = angleRad / 2;
        const paddingAngle = 2 * (Math.PI / 180);
        const effectiveHalfAngle = Math.max(halfAngle - paddingAngle, halfAngle * 0.8);

        const r1 = radius * 0.3;
        const r2 = radius * 0.75;
        const rTip = radius;

        const w1 = r1 * Math.tan(effectiveHalfAngle * 0.6);
        const w2 = r2 * Math.tan(effectiveHalfAngle);

        return `
            M 0 0
            Q ${r1 * 0.5} ${w1 * 0.2} ${r1} ${w1}
            T ${r2} ${w2}
            Q ${radius * 0.9} ${w2 * 0.8} ${rTip} 0
            Q ${radius * 0.9} ${-w2 * 0.8} ${r2} ${-w2}
            T ${r1} ${-w1}
            Q ${r1 * 0.5} ${-w1 * 0.2} 0 0
            Z
        `;
    };

    const selectedPetal = selectedPetalIndex !== null ? petals[selectedPetalIndex] : null;

    return (
        <div className={styles.container} data-mode={mode}>
            {/* Ambient particles */}
            <div className={styles.particles}>
                {Array.from({ length: 15 }).map((_, i) => (
                    <div
                        key={i}
                        className={styles.particle}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 4 + 2}px`,
                            height: `${Math.random() * 4 + 2}px`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${Math.random() * 3 + 3}s`,
                        }}
                    />
                ))}
            </div>

            {/* Header */}
            <header className={styles.header}>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.subtitle}>{subtitle}</p>
            </header>

            {/* Wheel Container */}
            <div className={styles.wheelWrapper}>
                {/* Pointer */}
                <div className={styles.pointer}>
                    <svg width="50" height="50" viewBox="0 0 24 24" fill="#fbbf24">
                        <path d="M12 2L13 7C13 7 16 8 16 11C16 11 13 12 12 15C11 12 8 11 8 11C8 8 11 7 12 2Z" />
                        <path d="M12 15L11 18C11 18 9 19 9 21C9 21 11 22 12 20C13 22 15 21 15 21C15 19 13 18 12 15Z" opacity="0.8" />
                    </svg>
                </div>

                {/* The Wheel */}
                <div className={styles.wheelContainer}>
                    <div
                        className={styles.wheel}
                        style={{
                            transform: `rotate(${rotation}deg)`,
                            transition: isSpinning
                                ? 'transform 4.5s cubic-bezier(0.15, 0, 0.15, 1)'
                                : 'none'
                        }}
                    >
                        <svg viewBox="-220 -220 440 440" className={styles.wheelSvg}>
                            <defs>
                                <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#fecdd3" />
                                    <stop offset="100%" stopColor="#e11d48" />
                                </linearGradient>
                                <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#fbcfe8" />
                                    <stop offset="100%" stopColor="#db2777" />
                                </linearGradient>
                                <linearGradient id="gradSelected" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#fcd34d" />
                                    <stop offset="100%" stopColor="#d97706" />
                                </linearGradient>
                            </defs>

                            <g transform="rotate(-90)">
                                {petals.map((petal, index) => {
                                    const isWinner = !isSpinning && selectedPetalIndex === index;
                                    const isEven = index % 2 === 0;

                                    return (
                                        <g
                                            key={index}
                                            transform={`rotate(${index * anglePerPetal})`}
                                            className={isWinner ? styles.winnerPetal : styles.petal}
                                        >
                                            <path
                                                d={getPetalPath()}
                                                fill={isWinner ? "url(#gradSelected)" : (isEven ? "url(#grad1)" : "url(#grad2)")}
                                                stroke="white"
                                                strokeWidth="2"
                                            />
                                            <path
                                                d={`M 20 0 L ${radius * 0.8} 0`}
                                                stroke="white"
                                                strokeWidth="1"
                                                strokeOpacity="0.4"
                                                fill="none"
                                            />
                                            <text
                                                x={radius * 0.6}
                                                y={4}
                                                fill="white"
                                                fontSize={numPetals > 6 ? "11" : "13"}
                                                fontWeight="bold"
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                className={styles.petalText}
                                            >
                                                {petal.text}
                                            </text>
                                        </g>
                                    );
                                })}
                            </g>
                        </svg>
                    </div>

                    {/* Center Rose */}
                    <div className={styles.centerRose}>
                        <div className={styles.roseOuter}>
                            <div className={styles.roseInner}>
                                <svg width="40" height="40" viewBox="0 0 100 100" className={styles.roseCore}>
                                    <g fill="#be123c" opacity="0.9">
                                        <circle cx="50" cy="50" r="40" opacity="0.2" />
                                        <path d="M50 20 Q80 20 80 50 Q80 80 50 80 Q20 80 20 50 Q20 20 50 20" />
                                        <path d="M50 25 Q75 25 75 50 Q75 75 50 75 Q25 75 25 50 Q25 25 50 25" transform="rotate(45 50 50)" fill="#e11d48" />
                                        <path d="M50 30 Q70 30 70 50 Q70 70 50 70 Q30 70 30 50 Q30 30 50 30" transform="rotate(90 50 50)" fill="#f43f5e" />
                                        <path d="M50 35 Q65 35 65 50 Q65 65 50 65 Q35 65 35 50 Q35 35 50 35" transform="rotate(135 50 50)" fill="#fb7185" />
                                    </g>
                                    <circle cx="50" cy="50" r="8" fill="#fcd34d" />
                                    <circle cx="45" cy="45" r="2" fill="#fff" fillOpacity="0.8" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spin Button */}
            <button
                onClick={handleSpin}
                disabled={isSpinning}
                className={`${styles.spinButton} ${isSpinning ? styles.spinning : ''}`}
            >
                {isSpinning ? (
                    <>
                        <svg className={styles.spinIcon} viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Blooming...
                    </>
                ) : (
                    <>
                        {buttonText}
                        <span className={styles.spinEmoji}>🌸</span>
                    </>
                )}
            </button>

            {/* Result Modal */}
            {showModal && selectedPetal && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalDecor1} />
                        <div className={styles.modalDecor2} />

                        <div className={styles.modalContent}>
                            <div className={styles.modalIcon}>🌹</div>
                            <h2 className={styles.modalTitle}>{selectedPetal.text}</h2>
                            <div className={styles.modalDivider} />
                            <p className={styles.modalMessage}>{selectedPetal.message}</p>

                            <button onClick={closeModal} className={styles.acceptButton}>
                                {acceptButtonText}
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
