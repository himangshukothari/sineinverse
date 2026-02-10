'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './styles.module.css';
import type { BlockProps } from '@/types/blocks';
import type { LoveLetterInput, LoveLetterOutput } from './schema';

export default function LoveLetterBlock({
    input = {} as LoveLetterInput,
    onComplete,
}: BlockProps<LoveLetterInput, LoveLetterOutput>) {
    const greeting = input?.greeting || 'My Dearest...';
    const message = input?.message || 'Every moment with you is a treasure I hold close to my heart. You make my world brighter just by being in it.';
    const closing = input?.closing || 'Forever yours,';
    const signature = input?.signature || '❤️';
    const skin = input?.skin || 'vintage';

    const [displayedText, setDisplayedText] = useState('');
    const [typingDone, setTypingDone] = useState(false);
    const [showClosing, setShowClosing] = useState(false);
    const [showSeal, setShowSeal] = useState(false);
    const [done, setDone] = useState(false);
    const [hearts, setHearts] = useState<{ id: number; x: number; emoji: string }[]>([]);
    const charIndex = useRef(0);
    const heartId = useRef(0);

    // Typewriter effect
    useEffect(() => {
        if (typingDone) return;

        const speed = 35 + Math.random() * 25; // Variable typing speed for realism
        const timer = setTimeout(() => {
            if (charIndex.current < message.length) {
                setDisplayedText(message.slice(0, charIndex.current + 1));
                charIndex.current++;

                // Spawn a heart occasionally
                if (Math.random() < 0.03) {
                    spawnHeart();
                }
            } else {
                setTypingDone(true);
                setTimeout(() => setShowClosing(true), 400);
                setTimeout(() => setShowSeal(true), 1000);
            }
        }, speed);

        return () => clearTimeout(timer);
    }, [displayedText, typingDone, message]);

    const spawnHeart = useCallback(() => {
        const emojis = ['❤️', '💕', '💗', '✨', '💜'];
        const newHeart = {
            id: ++heartId.current,
            x: 10 + Math.random() * 80,
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
        };
        setHearts((prev) => [...prev.slice(-6), newHeart]);
    }, []);

    const handleFinish = () => {
        setDone(true);
        // Burst of hearts
        for (let i = 0; i < 5; i++) {
            setTimeout(() => spawnHeart(), i * 200);
        }
        setTimeout(() => {
            onComplete?.({
                read: true,
                readAt: new Date().toISOString(),
            });
        }, 2000);
    };

    return (
        <div className={styles.container} data-skin={skin}>
            {/* Floating hearts */}
            {hearts.map((h) => (
                <span
                    key={h.id}
                    className={styles.heart}
                    style={{ left: `${h.x}%`, bottom: '10%' }}
                >
                    {h.emoji}
                </span>
            ))}

            <div className={styles.paper}>
                {/* Decorative faint lines */}
                {skin === 'vintage' && (
                    <>
                        <div className={styles.paperLine} />
                        <div className={styles.paperLine} />
                        <div className={styles.paperLine} />
                        <div className={styles.paperLine} />
                        <div className={styles.paperLine} />
                    </>
                )}

                <p className={styles.greeting}>{greeting}</p>

                <div className={styles.messageWrap}>
                    <p className={styles.messageText}>
                        {displayedText}
                        {!typingDone && <span className={styles.cursor} />}
                    </p>
                </div>

                <p className={`${styles.closing} ${showClosing ? styles.show : ''}`}>
                    {closing}
                </p>
                <p className={`${styles.signature} ${showClosing ? styles.show : ''}`}>
                    {signature}
                </p>

                {!done && (
                    <button
                        className={`${styles.sealBtn} ${showSeal ? styles.show : ''}`}
                        onClick={handleFinish}
                        disabled={!showSeal}
                    >
                        I Love It 💕
                    </button>
                )}

                {done && (
                    <p className={`${styles.doneText} ${styles.show}`}>
                        Letter read with love ✨
                    </p>
                )}
            </div>
        </div>
    );
}
