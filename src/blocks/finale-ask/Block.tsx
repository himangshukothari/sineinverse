/**
 * FINALE ASK BLOCK — The Big Moment 🎆
 * 
 * This is the CLIMAX of the card — the emotional peak.
 * Features:
 * - Dramatic spotlight entrance
 * - Question appears with typewriter effect
 * - "Yes" button pulses with a glow
 * - "No" button runs away, shrinks, wobbles, & eventually disappears
 * - Yes response triggers: screen shake, confetti rain, heart explosion,
 *   pulsing background, emoji fireworks — the works!
 * - 3 skins: spotlight (purple), roses (red), starry (gold)
 */

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import styles from './styles.module.css';
import type { BlockProps } from '@/types/blocks';
import type { FinaleAskInput, FinaleAskOutput } from './schema';

export default function FinaleAskBlock({
    input = {} as FinaleAskInput,
    onComplete,
    mode,
}: BlockProps<FinaleAskInput, FinaleAskOutput>) {
    const question = input?.question || 'Will you be my Valentine? 💕';
    const yesText = input?.yesText || 'Yes! 💕';
    const noText = input?.noText || 'Maybe later...';
    const yesMessage = input?.yesMessage || 'I knew it! You just made my entire world sparkle! 🎉💕✨';
    const skin = input?.skin || 'spotlight';

    const [answered, setAnswered] = useState(false);
    const [noAttempts, setNoAttempts] = useState(0);
    const [yesBtnScale, setYesBtnScale] = useState(1);
    const [shaking, setShaking] = useState(false);
    const [confetti, setConfetti] = useState<{ id: number; x: number; emoji: string; delay: number; size: number }[]>([]);
    const [fireworks, setFireworks] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
    const [heartsRain, setHeartsRain] = useState<{ id: number; x: number; delay: number; size: number }[]>([]);
    const noRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // No button messages that get increasingly desperate
    const noMessages = [
        noText,
        'Are you sure? 🥺',
        'Really?! Think about it... 💭',
        'Pretty please?? 🙏🥺',
        'I won\'t stop asking! 💕',
        'You\'re breaking my heart! 💔',
        'Okay fine... jk tap YES 😏',
    ];

    const handleYes = useCallback(() => {
        setAnswered(true);
        setShaking(true);

        // Screen shake
        setTimeout(() => setShaking(false), 600);

        // Massive confetti rain
        const emojis = ['🎉', '💕', '❤️', '✨', '🥳', '💃', '🎊', '💜', '🌟', '🦋', '🎆', '💖', '🌹', '💫', '🎇'];
        const confettiBurst = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            emoji: emojis[i % emojis.length],
            delay: Math.random() * 2,
            size: 1 + Math.random() * 1.5,
        }));
        setConfetti(confettiBurst);

        // Hearts rain continuously
        const hearts = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            delay: Math.random() * 3,
            size: 0.8 + Math.random() * 1.2,
        }));
        setHeartsRain(hearts);

        // Fireworks bursts at intervals
        let fwId = 0;
        const launchFirework = () => {
            const fw = Array.from({ length: 6 }, (_, i) => ({
                id: fwId++,
                x: 15 + Math.random() * 70,
                y: 10 + Math.random() * 40,
                emoji: ['🎆', '🎇', '✨', '💥', '🌟', '⭐'][i],
            }));
            setFireworks(prev => [...prev, ...fw]);
        };

        launchFirework();
        setTimeout(launchFirework, 800);
        setTimeout(launchFirework, 1600);

        // Complete after celebration
        setTimeout(() => {
            onComplete?.({ answer: 'yes', answeredAt: new Date().toISOString() });
        }, 5000);
    }, [onComplete]);

    const handleNo = useCallback(() => {
        const attempts = noAttempts + 1;
        setNoAttempts(attempts);

        // Yes button grows bigger each time
        setYesBtnScale(1 + attempts * 0.2);

        // No button runs away with increasing chaos
        if (noRef.current) {
            const maxDist = Math.min(window.innerWidth, window.innerHeight) * 0.3;
            const x = (Math.random() - 0.5) * maxDist * (1 + attempts * 0.3);
            const y = (Math.random() - 0.5) * maxDist * (1 + attempts * 0.3);
            const shrink = Math.max(0.3, 1 - attempts * 0.12);
            const rotate = (Math.random() - 0.5) * 30 * attempts;
            noRef.current.style.transform = `translate(${x}px, ${y}px) scale(${shrink}) rotate(${rotate}deg)`;
            noRef.current.style.opacity = `${Math.max(0.2, 1 - attempts * 0.15)}`;
        }

        // After too many attempts, remove the no button
        if (attempts >= 6 && noRef.current) {
            noRef.current.style.transition = 'all 0.5s ease';
            noRef.current.style.transform = `translate(0, 100px) scale(0)`;
            noRef.current.style.opacity = '0';
        }
    }, [noAttempts]);

    // Typewriter effect for question
    const [displayedQuestion, setDisplayedQuestion] = useState('');
    const [showButtons, setShowButtons] = useState(false);

    useEffect(() => {
        if (answered) return;
        let i = 0;
        setDisplayedQuestion('');
        setShowButtons(false);
        const interval = setInterval(() => {
            i++;
            setDisplayedQuestion(question.slice(0, i));
            if (i >= question.length) {
                clearInterval(interval);
                setTimeout(() => setShowButtons(true), 300);
            }
        }, 50);
        return () => clearInterval(interval);
    }, [question, answered]);

    return (
        <div
            ref={containerRef}
            className={`${styles.container} ${shaking ? styles.shake : ''} ${answered ? styles.celebrating : ''}`}
            data-skin={skin}
        >
            {/* Floating background stars */}
            <div className={styles.starsLayer}>
                {Array.from({ length: 15 }).map((_, i) => (
                    <span
                        key={i}
                        className={styles.star}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            fontSize: `${0.5 + Math.random() * 0.6}rem`,
                        }}
                    >
                        ✨
                    </span>
                ))}
            </div>

            {/* Background spotlight glow */}
            <div className={styles.spotlight} />

            {/* Hearts rain (on yes) */}
            {heartsRain.map(h => (
                <span
                    key={h.id}
                    className={styles.heartRain}
                    style={{
                        left: `${h.x}%`,
                        animationDelay: `${h.delay}s`,
                        fontSize: `${h.size}rem`,
                    }}
                >
                    ❤️
                </span>
            ))}

            {/* Confetti rain (on yes) */}
            {confetti.map(c => (
                <span
                    key={c.id}
                    className={styles.confettiDrop}
                    style={{
                        left: `${c.x}%`,
                        animationDelay: `${c.delay}s`,
                        fontSize: `${c.size}rem`,
                    }}
                >
                    {c.emoji}
                </span>
            ))}

            {/* Firework bursts */}
            {fireworks.map(fw => (
                <span
                    key={fw.id}
                    className={styles.firework}
                    style={{
                        left: `${fw.x}%`,
                        top: `${fw.y}%`,
                    }}
                >
                    {fw.emoji}
                </span>
            ))}

            {!answered ? (
                <div className={styles.askArea}>
                    {/* Question with typewriter */}
                    <h1 className={styles.question}>
                        {displayedQuestion}
                        <span className={styles.cursor}>|</span>
                    </h1>

                    {/* Buttons */}
                    {showButtons && (
                        <div className={styles.buttons}>
                            <button
                                className={styles.yesBtn}
                                onClick={handleYes}
                                style={{ transform: `scale(${yesBtnScale})` }}
                            >
                                {yesText}
                            </button>

                            <button
                                ref={noRef}
                                className={styles.noBtn}
                                onClick={handleNo}
                            >
                                {noMessages[Math.min(noAttempts, noMessages.length - 1)]}
                            </button>
                        </div>
                    )}

                    {noAttempts > 0 && (
                        <p className={styles.noHint}>
                            {noAttempts >= 5
                                ? 'The No button is giving up... just like your resistance 😏💕'
                                : noAttempts >= 3
                                    ? 'The answer is clearly yes! 😏'
                                    : 'Hmm, try harder to say no 😉'}
                        </p>
                    )}
                </div>
            ) : (
                <div className={styles.yesArea}>
                    <div className={styles.yesEmoji}>🎉</div>
                    <div className={styles.yesEmojiSecondary}>💕</div>
                    <h1 className={styles.yesTitle}>YAY!</h1>
                    <p className={styles.yesSubtitle}>It&apos;s official! 🥹</p>
                    <p className={styles.yesMsg}>{yesMessage}</p>
                    <div className={styles.heartbeat}>💖</div>
                </div>
            )}

            {mode === 'preview' && <div className={styles.badge}>Preview</div>}
        </div>
    );
}
