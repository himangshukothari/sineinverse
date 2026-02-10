'use client';

import { useState, useMemo } from 'react';
import styles from './styles.module.css';
import type { BlockProps } from '@/types/blocks';
import type { ConfessionWallInput, ConfessionWallOutput } from './schema';

const ROTATIONS = [-4, 3, -2, 5, -3, 2];
const COLORS_CORK = ['#fef3c7', '#fee2e2', '#dbeafe', '#d1fae5', '#fce7f3', '#ede9fe'];
const COLORS_PASTEL = ['#fce7f3', '#ede9fe', '#dbeafe', '#d1fae5', '#fef3c7', '#fce4ec'];
const COLORS_DARK = ['rgba(139,92,246,0.15)', 'rgba(236,72,153,0.15)', 'rgba(59,130,246,0.15)', 'rgba(16,185,129,0.15)', 'rgba(245,158,11,0.15)', 'rgba(168,85,247,0.15)'];
const PINS = ['📌', '📍', '💗', '⭐', '🦋', '💎'];

export default function ConfessionWallBlock({
    input = {} as ConfessionWallInput,
    onComplete,
}: BlockProps<ConfessionWallInput, ConfessionWallOutput>) {
    const title = input?.title || 'Things I Love About You';
    const skin = input?.skin || 'cork';

    const notes = useMemo(() => {
        const list = [
            input?.note1 || 'Your smile lights up my world ☀️',
            input?.note2 || 'The way you laugh at my jokes 😄',
            input?.note3 || 'How you always know what to say 💬',
            input?.note4 || 'Your kindness to everyone 💕',
            input?.note5 || 'The way you hold my hand 🤝',
        ];
        if (input?.note6) list.push(input.note6);
        return list;
    }, [input]);

    const [revealedCount, setRevealedCount] = useState(0);
    const [flippedNotes, setFlippedNotes] = useState<Set<number>>(new Set());
    const allRevealed = revealedCount >= notes.length;

    const colors = skin === 'dark' ? COLORS_DARK : skin === 'pastel' ? COLORS_PASTEL : COLORS_CORK;

    const handleNoteClick = (index: number) => {
        if (flippedNotes.has(index)) return;
        const newFlipped = new Set(flippedNotes);
        newFlipped.add(index);
        setFlippedNotes(newFlipped);
        setRevealedCount(newFlipped.size);
    };

    const handleContinue = () => {
        onComplete?.({ viewed: true, viewedAt: new Date().toISOString() });
    };

    return (
        <div className={styles.container} data-skin={skin}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.subtitle}>Tap each note to reveal 💕</p>

            <div className={styles.wall}>
                {notes.map((note, i) => (
                    <div
                        key={i}
                        className={`${styles.note} ${flippedNotes.has(i) ? styles.revealed : ''}`}
                        style={{
                            '--rot': `${ROTATIONS[i % ROTATIONS.length]}deg`,
                            '--bg': colors[i % colors.length],
                            animationDelay: `${i * 0.1}s`,
                        } as React.CSSProperties}
                        onClick={() => handleNoteClick(i)}
                    >
                        <div className={styles.noteFront}>
                            <span className={styles.pin}>{PINS[i % PINS.length]}</span>
                            <span className={styles.noteQ}>?</span>
                        </div>
                        <div className={styles.noteBack}>
                            <span className={styles.pin}>{PINS[i % PINS.length]}</span>
                            <p className={styles.noteText}>{note}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Progress */}
            <p className={styles.progress}>{revealedCount}/{notes.length} revealed</p>

            {allRevealed && (
                <button className={styles.continueBtn} onClick={handleContinue}>
                    Continue ✨
                </button>
            )}
        </div>
    );
}
