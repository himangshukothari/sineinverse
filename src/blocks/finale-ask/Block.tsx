'use client';

import { useState, useRef } from 'react';
import styles from './styles.module.css';
import type { BlockProps } from '@/types/blocks';
import type { FinaleAskInput, FinaleAskOutput } from './schema';

export default function FinaleAskBlock({
    input = {} as FinaleAskInput,
    onComplete,
}: BlockProps<FinaleAskInput, FinaleAskOutput>) {
    const question = input?.question || 'Will you be my Valentine? 💕';
    const yesText = input?.yesText || 'Yes! 💕';
    const noText = input?.noText || 'Maybe later...';
    const yesMessage = input?.yesMessage || 'I knew it! You just made my day! 🎉💕';
    const skin = input?.skin || 'spotlight';

    const [answered, setAnswered] = useState(false);
    const [noAttempts, setNoAttempts] = useState(0);
    const [yesBtnScale, setYesBtnScale] = useState(1);
    const [celebration, setCelebration] = useState<{ id: number; x: number; emoji: string }[]>([]);
    const noRef = useRef<HTMLButtonElement>(null);

    const handleYes = () => {
        setAnswered(true);

        // Celebration burst
        const emojis = ['🎉', '💕', '❤️', '✨', '🥳', '💃', '🎊', '💜', '🌟', '🦋'];
        const burst = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            x: 10 + Math.random() * 80,
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
        }));
        setCelebration(burst);

        setTimeout(() => {
            onComplete?.({ answer: 'yes', answeredAt: new Date().toISOString() });
        }, 3000);
    };

    const handleNo = () => {
        const attempts = noAttempts + 1;
        setNoAttempts(attempts);

        // Yes button grows
        setYesBtnScale(1 + attempts * 0.15);

        // No button runs away
        if (noRef.current) {
            const x = (Math.random() - 0.5) * 200;
            const y = (Math.random() - 0.5) * 200;
            noRef.current.style.transform = `translate(${x}px, ${y}px) scale(${Math.max(0.5, 1 - attempts * 0.1)})`;
        }
    };

    const noMessages = [
        noText,
        'Are you sure? 🥺',
        'Think again... 💭',
        'Pretty please? 🙏',
        'Last chance! 💕',
    ];

    return (
        <div className={styles.container} data-skin={skin}>
            {/* Celebration burst */}
            {celebration.map((c) => (
                <span key={c.id} className={styles.celebEmoji} style={{
                    left: `${c.x}%`,
                    animationDelay: `${Math.random() * 0.5}s`,
                }}>
                    {c.emoji}
                </span>
            ))}

            {/* Background glow */}
            <div className={styles.spotlight} />

            {!answered ? (
                <div className={styles.askArea}>
                    <h1 className={styles.question}>{question}</h1>

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

                    {noAttempts > 0 && (
                        <p className={styles.noHint}>
                            {noAttempts >= 3 ? 'The answer is clearly yes! 😏' : `Hmm, try harder to say no 😉`}
                        </p>
                    )}
                </div>
            ) : (
                <div className={styles.yesArea}>
                    <div className={styles.yesEmoji}>🎉</div>
                    <h1 className={styles.yesTitle}>Yay!</h1>
                    <p className={styles.yesMsg}>{yesMessage}</p>
                </div>
            )}
        </div>
    );
}
