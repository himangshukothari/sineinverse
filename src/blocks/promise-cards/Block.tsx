'use client';

import { useState, useMemo } from 'react';
import styles from './styles.module.css';
import type { BlockProps } from '@/types/blocks';
import type { PromiseCardsInput, PromiseCardsOutput } from './schema';

const cardEmojis = ['🌟', '💎', '🦋', '🌸', '🔥'];
const gradientColors = [
    'linear-gradient(135deg, #667eea, #764ba2)',
    'linear-gradient(135deg, #f093fb, #f5576c)',
    'linear-gradient(135deg, #4facfe, #00f2fe)',
    'linear-gradient(135deg, #43e97b, #38f9d7)',
    'linear-gradient(135deg, #fa709a, #fee140)',
];

export default function PromiseCardsBlock({
    input = {} as PromiseCardsInput,
    onComplete,
}: BlockProps<PromiseCardsInput, PromiseCardsOutput>) {
    const title = input?.title || 'My Promises to You';
    const skin = input?.skin || 'gradient';

    const promises = useMemo(() => {
        const list = [
            input?.promise1 || 'I promise to always make you laugh 😄',
            input?.promise2 || 'I promise to hold your hand through anything 🤝',
            input?.promise3 || 'I promise to surprise you with little things ✨',
            input?.promise4 || 'I promise to love you more each day 💕',
        ];
        if (input?.promise5) list.push(input.promise5);
        return list;
    }, [input]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState<'next' | 'prev' | null>(null);

    const isLast = currentIndex === promises.length - 1;

    const goNext = () => {
        if (isLast) {
            onComplete?.({ viewed: true, viewedAt: new Date().toISOString() });
            return;
        }
        setDirection('next');
        setTimeout(() => {
            setCurrentIndex((i) => i + 1);
            setDirection(null);
        }, 300);
    };

    const goPrev = () => {
        if (currentIndex === 0) return;
        setDirection('prev');
        setTimeout(() => {
            setCurrentIndex((i) => i - 1);
            setDirection(null);
        }, 300);
    };

    return (
        <div className={styles.container} data-skin={skin}>
            <h2 className={styles.title}>{title}</h2>

            <div className={styles.cardStack}>
                {/* Background cards for depth illusion */}
                {promises.length > 1 && currentIndex < promises.length - 1 && (
                    <div className={styles.backCard} style={skin === 'gradient' ? { background: gradientColors[(currentIndex + 1) % gradientColors.length] } : undefined} />
                )}

                {/* Current card */}
                <div
                    className={`${styles.card} ${direction === 'next' ? styles.slideOutLeft : ''} ${direction === 'prev' ? styles.slideOutRight : ''}`}
                    key={currentIndex}
                    style={skin === 'gradient' ? { background: gradientColors[currentIndex % gradientColors.length] } : undefined}
                >
                    <span className={styles.cardNum}>Promise #{currentIndex + 1}</span>
                    <span className={styles.cardEmoji}>{cardEmojis[currentIndex % cardEmojis.length]}</span>
                    <p className={styles.promiseText}>{promises[currentIndex]}</p>
                </div>
            </div>

            {/* Progress dots */}
            <div className={styles.dots}>
                {promises.map((_, i) => (
                    <div key={i} className={`${styles.dot} ${i === currentIndex ? styles.activeDot : ''} ${i < currentIndex ? styles.doneDot : ''}`} />
                ))}
            </div>

            {/* Navigation */}
            <div className={styles.nav}>
                <button className={styles.navBtn} onClick={goPrev} disabled={currentIndex === 0}>
                    ← Back
                </button>
                <button className={`${styles.navBtn} ${styles.navPrimary}`} onClick={goNext}>
                    {isLast ? 'Done ✨' : 'Next →'}
                </button>
            </div>
        </div>
    );
}
