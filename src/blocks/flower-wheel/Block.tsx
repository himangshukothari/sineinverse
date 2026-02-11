/**
 * FLOWER WHEEL BLOCK — pixel-perfect match to reference images.
 *
 * Watercolor CSS hearts, cursive title, 8-segment pie wheel with
 * properly-oriented text + emojis, notch pointer, trapezoid stand,
 * coral TAP TO SPIN button, candy-stripe progress bar.
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import type { BlockProps } from '@/types/blocks';
import type { FlowerWheelInput, FlowerWheelOutput } from './schema';
import styles from './styles.module.css';

interface PetalData {
    text: string;
    message: string;
    emoji: string;
}

const DEFAULT_EMOJIS = ['🍽️', '🎬', '🌃', '🍗', '🎮', '🧺', '💆', '🍰'];

export default function FlowerWheelBlock({
    input = {} as FlowerWheelInput,
    onComplete,
    mode,
}: BlockProps<FlowerWheelInput, FlowerWheelOutput>) {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [progress, setProgress] = useState(0);

    const petals = useMemo(() => {
        const result: PetalData[] = [];
        for (let n = 1; n <= 8; n++) {
            const text = input?.[`petal${n}Text` as keyof FlowerWheelInput] as string | undefined;
            const msg = input?.[`petal${n}Message` as keyof FlowerWheelInput] as string | undefined;
            if (text?.trim()) {
                result.push({
                    text: text.trim(),
                    message: msg?.trim() || 'A special surprise awaits!',
                    emoji: DEFAULT_EMOJIS[n - 1] || '🎁',
                });
            }
        }
        if (result.length === 0) {
            return [
                { text: 'Dinner Date', message: 'A romantic candlelight dinner tonight!', emoji: '🍽️' },
                { text: 'Movie Night', message: 'You pick the movie, I bring the popcorn.', emoji: '🎬' },
                { text: 'Stargazing', message: 'A quiet night under the stars together.', emoji: '🌃' },
                { text: 'Home Cooked\nMeal', message: "I'll cook your favorite dish!", emoji: '🍗' },
                { text: 'Game Night', message: 'Board games, card games — you name it!', emoji: '🎮' },
                { text: 'Picnic', message: 'A beautiful picnic in the park.', emoji: '🧺' },
                { text: 'Massage', message: 'A relaxing massage, just for you.', emoji: '💆' },
                { text: 'Dessert', message: "We're going out for something sweet!", emoji: '🍰' },
            ];
        }
        return result;
    }, [input]);

    const n = petals.length;
    const slice = 360 / n;
    const title = input?.title || "Happy Valentine's Day,\nMy Love!";
    const subtitle = input?.subtitle || "SPIN FOR YOUR VALENTINE'S SURPRISE";
    const acceptBtn = input?.acceptButtonText || 'Accept with Love 💕';

    /* ─── spin ─── */
    const handleSpin = useCallback(() => {
        if (isSpinning) return;
        setIsSpinning(true);
        setSelectedIdx(null);
        setProgress(0);

        const offset = Math.random() * 360;
        const target = rotation + 360 * 7 + offset;
        setRotation(target);

        const dur = 4500;
        const t0 = Date.now();
        const tick = () => {
            const p = Math.min((Date.now() - t0) / dur, 1);
            setProgress(p * 100);
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);

        // pointer is at top (270° in standard math coords → 12 o'clock)
        const final360 = target % 360;
        const fromTop = (360 - final360 + 270) % 360;
        const winner = Math.floor(fromTop / slice) % n;

        setTimeout(() => {
            setIsSpinning(false);
            setSelectedIdx(winner);
            setShowModal(true);
        }, dur);
    }, [isSpinning, rotation, slice, n]);

    const closeModal = () => {
        setShowModal(false);
        if (selectedIdx !== null) {
            const w = petals[selectedIdx];
            onComplete({
                selectedPetal: w.text.replace('\n', ' '),
                selectedMessage: w.message,
                playedAt: new Date().toISOString(),
            });
        }
    };

    /* ─── SVG segments ─── */
    const cx = 200, cy = 200, r = 178;
    const segments = petals.map((p, i) => {
        const a0 = (i * slice - 90) * (Math.PI / 180);
        const a1 = ((i + 1) * slice - 90) * (Math.PI / 180);
        const mid = ((i + 0.5) * slice - 90) * (Math.PI / 180);
        const midDeg = (i + 0.5) * slice - 90;

        const x0 = cx + r * Math.cos(a0);
        const y0 = cy + r * Math.sin(a0);
        const x1 = cx + r * Math.cos(a1);
        const y1 = cy + r * Math.sin(a1);
        const lg = slice > 180 ? 1 : 0;
        const d = `M${cx},${cy} L${x0},${y0} A${r},${r} 0 ${lg} 1 ${x1},${y1} Z`;

        // emoji at ~72% radius from center
        const eR = r * 0.72;
        const eX = cx + eR * Math.cos(mid);
        const eY = cy + eR * Math.sin(mid);

        // text at ~46% radius
        const tR = r * 0.46;
        const tX = cx + tR * Math.cos(mid);
        const tY = cy + tR * Math.sin(mid);

        // flip text in bottom half so it's always readable
        const normDeg = ((midDeg % 360) + 360) % 360;
        const flip = normDeg > 0 && normDeg < 180;
        const textRot = flip ? midDeg + 180 : midDeg;

        // alternating colors matching reference
        const fills = ['#f9c8c8', '#f8b0b0', '#f9c8c8', '#f8b0b0', '#f9c8c8', '#f8b0b0', '#f9c8c8', '#f8b0b0'];

        // multi-line text support
        const lines = p.text.split('\n');

        return (
            <g key={i}>
                <path d={d} fill={fills[i % fills.length]} stroke="#d98a8a" strokeWidth="1" />
                {/* Divider line from center outward */}
                <line
                    x1={cx} y1={cy}
                    x2={cx + r * Math.cos(a0)} y2={cy + r * Math.sin(a0)}
                    stroke="#d98a8a" strokeWidth="1.5"
                />
                {/* Emoji */}
                <text
                    x={eX} y={eY}
                    textAnchor="middle" dominantBaseline="central"
                    fontSize="26"
                    transform={`rotate(${midDeg}, ${eX}, ${eY})`}
                >
                    {p.emoji}
                </text>
                {/* Label — rotated to read center-outward, flipped if in bottom half */}
                {lines.map((line, li) => (
                    <text
                        key={li}
                        x={tX} y={tY + (li - (lines.length - 1) / 2) * 12}
                        textAnchor="middle" dominantBaseline="central"
                        fontSize="10" fontWeight="700" fill="#5a2030"
                        fontFamily="sans-serif"
                        transform={`rotate(${textRot}, ${tX}, ${tY})`}
                    >
                        {line}
                    </text>
                ))}
            </g>
        );
    });

    /* ─── painted hearts (CSS, not emoji) ─── */
    const hearts = useMemo(() =>
        Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            x: 3 + Math.random() * 94,
            y: 3 + Math.random() * 94,
            size: 12 + Math.random() * 36,
            delay: Math.random() * 6,
            dur: 4 + Math.random() * 5,
            opacity: 0.12 + Math.random() * 0.3,
            rot: -30 + Math.random() * 60,
            hue: Math.random() > 0.5 ? 0 : 1, // 0=red, 1=pink
        }))
        , []);

    const selected = selectedIdx !== null ? petals[selectedIdx] : null;

    return (
        <div className={styles.container} data-mode={mode}>
            {/* ─── Floating CSS Hearts ─── */}
            <div className={styles.heartsLayer}>
                {hearts.map(h => (
                    <div
                        key={h.id}
                        className={`${styles.heart} ${h.hue === 0 ? styles.heartRed : styles.heartPink}`}
                        style={{
                            left: `${h.x}%`,
                            top: `${h.y}%`,
                            width: `${h.size}px`,
                            height: `${h.size}px`,
                            opacity: h.opacity,
                            transform: `rotate(${h.rot}deg)`,
                            animationDelay: `${h.delay}s`,
                            animationDuration: `${h.dur}s`,
                        }}
                    />
                ))}
            </div>

            {/* ─── Title ─── */}
            <header className={styles.header}>
                <h1 className={styles.title}>
                    {title.split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}
                </h1>
            </header>

            {/* ─── Curved Subtitle ─── */}
            <div className={styles.subtitleWrap}>
                <svg viewBox="0 0 320 55" className={styles.subtitleSvg}>
                    <defs>
                        <path id="arc" d="M 20 48 Q 160 -8 300 48" fill="none" />
                    </defs>
                    <text className={styles.subtitleText}>
                        <textPath href="#arc" startOffset="50%" textAnchor="middle">
                            {subtitle}
                        </textPath>
                    </text>
                </svg>
            </div>

            {/* ─── Wheel Assembly ─── */}
            <div className={styles.wheelAssembly}>
                {/* Pointer notch */}
                <div className={styles.pointer}>
                    <svg width="28" height="22" viewBox="0 0 28 22">
                        <path d="M14 22 L4 0 L24 0 Z" fill="#c05555" stroke="#a04040" strokeWidth="1" />
                    </svg>
                </div>

                {/* Outer ring */}
                <div className={styles.outerRing}>
                    <div
                        className={styles.wheel}
                        style={{
                            transform: `rotate(${rotation}deg)`,
                            transition: isSpinning
                                ? 'transform 4.5s cubic-bezier(0.15, 0, 0.15, 1)'
                                : 'none',
                        }}
                    >
                        <svg viewBox="0 0 400 400" className={styles.svg}>
                            {segments}
                            {/* Center hub */}
                            <circle cx={cx} cy={cy} r="30" fill="#c05555" stroke="#a04040" strokeWidth="2.5" />
                            {/* Up-arrow in center */}
                            <polygon points="200,180 208,196 192,196" fill="rgba(255,255,255,0.85)" />
                        </svg>
                    </div>
                </div>

                {/* Stand (trapezoid column + base) */}
                <div className={styles.standCol} />
                <div className={styles.standBase} />
            </div>

            {/* ─── TAP TO SPIN ─── */}
            <button
                onClick={handleSpin}
                disabled={isSpinning}
                className={`${styles.spinBtn} ${isSpinning ? styles.spinBtnActive : ''}`}
            >
                {isSpinning ? 'SPINNING...' : 'TAP TO SPIN'}
            </button>

            {/* ─── Progress bar ─── */}
            <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${isSpinning ? progress : 0}%` }} />
            </div>

            {/* ─── Result Modal ─── */}
            {showModal && selected && (
                <div className={styles.overlay} onClick={closeModal}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalEmoji}>{selected.emoji}</div>
                        <h2 className={styles.modalTitle}>{selected.text.replace('\n', ' ')}</h2>
                        <div className={styles.modalLine} />
                        <p className={styles.modalMsg}>{selected.message}</p>
                        <button onClick={closeModal} className={styles.modalBtn}>{acceptBtn}</button>
                    </div>
                </div>
            )}

            {mode === 'preview' && <div className={styles.badge}>Preview</div>}
        </div>
    );
}
