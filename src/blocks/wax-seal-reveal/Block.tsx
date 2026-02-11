/**
 * WAX SEAL REVEAL BLOCK — Premium Component
 * 
 * A beautiful wax seal that users tap to crack open.
 * The seal shatters with particle effects, revealing a
 * parchment scroll with a hidden message underneath.
 * 
 * Three skins: classic (red), royal (gold), rose (pink)
 */

'use client';

import { useState, useMemo } from 'react';
import styles from './styles.module.css';
import type { BlockProps } from '@/types/blocks';
import type { WaxSealRevealInput, WaxSealRevealOutput } from './schema';

export default function WaxSealRevealBlock({
    input = {} as WaxSealRevealInput,
    onComplete,
    mode,
}: BlockProps<WaxSealRevealInput, WaxSealRevealOutput>) {
    const title = input?.title || 'A Sealed Promise';
    const message = input?.message || 'You hold the key to my heart. Every day with you is a gift I cherish. 💕';
    const fromName = input?.fromName || 'With all my love';
    const skin = input?.skin || 'classic';

    const [phase, setPhase] = useState<'sealed' | 'cracking' | 'revealed'>('sealed');
    const [tapCount, setTapCount] = useState(0);
    const [cracks, setCracks] = useState<{ id: number; angle: number; length: number }[]>([]);
    const [shards, setShards] = useState<{ id: number; x: number; y: number; rot: number; emoji: string }[]>([]);

    // Floating background elements
    const floats = useMemo(() =>
        Array.from({ length: 10 }, (_, i) => ({
            id: i,
            emoji: ['✨', '💫', '⭐', '🌟', '✦', '🔮', '💎', '✧', '🌸', '💕'][i],
            x: 5 + Math.random() * 90,
            y: 5 + Math.random() * 90,
            size: 0.7 + Math.random() * 0.9,
            delay: Math.random() * 5,
            dur: 3 + Math.random() * 4,
        }))
        , []);

    // Crack data for SVG visualization
    const crackPaths = useMemo(() => {
        return cracks.map(c => {
            const rad = (c.angle * Math.PI) / 180;
            const x1 = 50 + Math.cos(rad) * 10;
            const y1 = 50 + Math.sin(rad) * 10;
            const x2 = 50 + Math.cos(rad) * c.length;
            const y2 = 50 + Math.sin(rad) * c.length;
            const cx = 50 + Math.cos(rad + 0.3) * (c.length * 0.6);
            const cy = 50 + Math.sin(rad + 0.3) * (c.length * 0.6);
            return { id: c.id, d: `M${x1},${y1} Q${cx},${cy} ${x2},${y2}` };
        });
    }, [cracks]);

    const handleTap = () => {
        if (phase === 'revealed') return;

        const newCount = tapCount + 1;
        setTapCount(newCount);

        // Add crack lines per tap
        const newCracks = Array.from({ length: 2 + Math.floor(Math.random() * 2) }, (_, i) => ({
            id: cracks.length + i,
            angle: Math.random() * 360,
            length: 20 + Math.random() * 30,
        }));
        setCracks(prev => [...prev, ...newCracks]);

        if (newCount < 3) {
            setPhase('cracking');
        } else {
            // Break the seal!
            setPhase('revealed');

            // Shard particles burst out
            const burstEmojis = ['✨', '💫', '⭐', '🔥', '💥', '🌟', '✦', '💎', '🔮', '💖', '⚡', '🎇'];
            const newShards = Array.from({ length: 12 }, (_, i) => ({
                id: i,
                x: 50 + (Math.random() - 0.5) * 60,
                y: 45 + (Math.random() - 0.5) * 50,
                rot: Math.random() * 360,
                emoji: burstEmojis[i],
            }));
            setShards(newShards);
        }
    };

    const handleContinue = () => {
        onComplete?.({
            revealed: true,
            revealedAt: new Date().toISOString(),
        });
    };

    // Skin colors
    const sealColors: Record<string, { emoji: string; symbol: string }> = {
        'classic': { emoji: '❤️', symbol: '♥' },
        'royal': { emoji: '👑', symbol: '♛' },
        'rose': { emoji: '🌹', symbol: '✿' },
    };

    const { emoji: sealCenterEmoji, symbol: sealSymbol } = sealColors[skin] || sealColors['classic'];

    return (
        <div className={styles.container} data-skin={skin}>
            {/* Floating particles */}
            <div className={styles.floatLayer}>
                {floats.map(f => (
                    <span
                        key={f.id}
                        className={styles.floatEmoji}
                        style={{
                            left: `${f.x}%`,
                            top: `${f.y}%`,
                            fontSize: `${f.size}rem`,
                            animationDelay: `${f.delay}s`,
                            animationDuration: `${f.dur}s`,
                        }}
                    >
                        {f.emoji}
                    </span>
                ))}
            </div>

            {/* Burst shards */}
            {shards.map(s => (
                <span
                    key={s.id}
                    className={styles.shard}
                    style={{
                        left: `${s.x}%`,
                        top: `${s.y}%`,
                        transform: `rotate(${s.rot}deg)`,
                    }}
                >
                    {s.emoji}
                </span>
            ))}

            {/* Title */}
            <h1 className={styles.title}>{title}</h1>

            {/* Main seal area */}
            <div className={styles.sealArea}>
                {/* Parchment scroll (revealed message) */}
                <div className={`${styles.parchment} ${phase === 'revealed' ? styles.parchmentVisible : ''}`}>
                    <div className={styles.parchmentInner}>
                        <div className={styles.parchmentDecor}>💌</div>
                        <p className={styles.parchmentMsg}>{message}</p>
                        <p className={styles.parchmentFrom}>— {fromName}</p>
                        {phase === 'revealed' && (
                            <button className={styles.continueBtn} onClick={handleContinue}>
                                Continue ✨
                            </button>
                        )}
                    </div>
                </div>

                {/* Wax seal (on top) */}
                {phase !== 'revealed' && (
                    <button
                        className={`${styles.seal} ${phase === 'cracking' ? styles.sealCracking : ''}`}
                        onClick={handleTap}
                    >
                        {/* Crack overlay SVG */}
                        <svg className={styles.crackSvg} viewBox="0 0 100 100">
                            {crackPaths.map(c => (
                                <path
                                    key={c.id}
                                    d={c.d}
                                    fill="none"
                                    stroke="rgba(0,0,0,0.4)"
                                    strokeWidth="1.5"
                                    className={styles.crackLine}
                                />
                            ))}
                        </svg>

                        {/* Seal decoration */}
                        <div className={styles.sealRim}>
                            <div className={styles.sealCenter}>
                                <span className={styles.sealEmoji}>{sealCenterEmoji}</span>
                            </div>
                            <div className={styles.sealRing}>
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <span
                                        key={i}
                                        className={styles.sealDot}
                                        style={{ transform: `rotate(${i * 45}deg) translateY(-42px)` }}
                                    >
                                        {sealSymbol}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <span className={styles.sealLabel}>TAP TO BREAK</span>
                    </button>
                )}
            </div>

            {/* Hint */}
            {phase === 'sealed' && (
                <p className={styles.hint}>Tap the seal to crack it open</p>
            )}
            {phase === 'cracking' && (
                <p className={styles.hint}>Keep tapping! ({3 - tapCount} more)</p>
            )}

            {mode === 'preview' && <div className={styles.badge}>Preview</div>}
        </div>
    );
}
