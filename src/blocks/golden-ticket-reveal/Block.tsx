/**
 * GOLDEN TICKET REVEAL BLOCK — Premium Scratch Card
 * 
 * Scratch to reveal a hidden prize/message.
 * Fixed: DPR coordinate handling, stale closure bug,
 * optional onComplete, premium gold gradient overlay.
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { BlockProps } from '@/types/blocks';
import type { GoldenTicketInput, GoldenTicketOutput } from './schema';
import styles from './styles.module.css';

export default function GoldenTicketBlock({
    input = {} as GoldenTicketInput,
    onComplete,
    mode,
}: BlockProps<GoldenTicketInput, GoldenTicketOutput>) {
    const [isRevealed, setIsRevealed] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [scratchPercent, setScratchPercent] = useState(0);
    const [resetKey, setResetKey] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isRevealedRef = useRef(false);
    const dprRef = useRef(1);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const title = input?.title || 'Golden Ticket';
    const subtitle = input?.subtitle || "Scratch to reveal your Valentine's surprise";
    const prizeTitle = input?.prizeTitle || 'Romantic Dinner';
    const prizeDescription = input?.prizeDescription || 'Table for two @ Chez Amour';
    const prizeDetails = input?.prizeDetails || 'Valid: Feb 14th, 8:00 PM';
    const scratchText = input?.scratchText || 'Scratch Here ✨';
    const winBadgeText = input?.winBadgeText || 'You won a prize!';
    const tryAgainText = input?.tryAgainText || 'Try Again';

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const wrapper = wrapperRef.current;
        if (!canvas || !wrapper) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        // Use wrapper's actual size for canvas dimensions
        const rect = wrapper.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        const dpr = window.devicePixelRatio || 1;
        dprRef.current = dpr;

        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.scale(dpr, dpr);

        // Gold gradient
        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, '#B8860B');
        gradient.addColorStop(0.2, '#DAA520');
        gradient.addColorStop(0.4, '#FFD700');
        gradient.addColorStop(0.6, '#FDB931');
        gradient.addColorStop(0.8, '#DAA520');
        gradient.addColorStop(1, '#B8860B');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // Noise texture
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 25;
            data[i] = Math.min(255, Math.max(0, data[i] + noise));
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
        }
        ctx.putImageData(imageData, 0, 0);

        // Center text
        ctx.globalCompositeOperation = 'source-over';
        ctx.font = 'bold 17px Georgia, serif';
        ctx.fillStyle = '#5c3d10';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(scratchText, w / 2, h / 2 - 10);

        // Small hint below
        ctx.font = '12px Georgia, serif';
        ctx.fillStyle = '#7a5520';
        ctx.fillText('👆 Use your finger', w / 2, h / 2 + 15);

        // Decorative double border
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#5c3d10';
        ctx.strokeRect(8, 8, w - 16, h - 16);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(92, 61, 16, 0.4)';
        ctx.strokeRect(14, 14, w - 28, h - 28);

        // Reset state
        isRevealedRef.current = false;
        setScratchPercent(0);
    }, [resetKey, scratchText]);

    // Check reveal %
    const checkReveal = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || isRevealedRef.current) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let transparent = 0;
        const step = 40; // sample every 10th pixel (x4 channels)

        for (let i = 3; i < data.length; i += step) {
            if (data[i] === 0) transparent++;
        }

        const total = Math.ceil(data.length / step);
        const pct = transparent / total;
        setScratchPercent(Math.round(pct * 100));

        if (pct > 0.45) {
            finishReveal();
        }
    }, []);

    const finishReveal = useCallback(() => {
        if (isRevealedRef.current) return;
        isRevealedRef.current = true;
        setIsRevealed(true);
        setShowConfetti(true);

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }, []);

    // Scratch handler
    const handleScratch = useCallback((clientX: number, clientY: number) => {
        if (isRevealedRef.current) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 28 * dprRef.current, 0, Math.PI * 2);
        ctx.fill();

        checkReveal();
    }, [checkReveal]);

    // Mouse events
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDrawing(true);
        handleScratch(e.clientX, e.clientY);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing) return;
        handleScratch(e.clientX, e.clientY);
    };

    const handleMouseUp = () => setIsDrawing(false);

    // Touch events
    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        setIsDrawing(true);
        handleScratch(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        e.preventDefault();
        if (!isDrawing) return;
        handleScratch(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleTouchEnd = () => setIsDrawing(false);

    // Global mouse up
    useEffect(() => {
        const up = () => setIsDrawing(false);
        window.addEventListener('mouseup', up);
        return () => window.removeEventListener('mouseup', up);
    }, []);

    const handleReset = () => {
        setResetKey(prev => prev + 1);
        setIsRevealed(false);
        setShowConfetti(false);
    };

    const handleContinue = () => {
        onComplete?.({
            revealed: true,
            revealedAt: new Date().toISOString(),
        });
    };

    return (
        <div className={styles.container} data-mode={mode}>
            {/* Floating sparkles */}
            <div className={styles.sparkleLayer}>
                {Array.from({ length: 8 }).map((_, i) => (
                    <span
                        key={i}
                        className={styles.sparkle}
                        style={{
                            left: `${10 + Math.random() * 80}%`,
                            top: `${10 + Math.random() * 80}%`,
                            animationDelay: `${i * 0.5}s`,
                            fontSize: `${0.8 + Math.random() * 0.7}rem`,
                        }}
                    >
                        {['✨', '⭐', '💫', '🌟', '✦', '⚝', '💛', '🌟'][i]}
                    </span>
                ))}
            </div>

            {/* Header */}
            <header className={styles.header}>
                <div className={styles.hearts}>
                    <span className={styles.heartPulse}>❤️</span>
                    <span className={styles.heartSmall}>💕</span>
                    <span className={styles.heartPulse}>❤️</span>
                </div>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.subtitle}>{subtitle}</p>
            </header>

            {/* Scratch Card */}
            <div className={styles.cardWrapper}>
                <div className={styles.cardGlow} />
                <div className={styles.cardFrame} ref={wrapperRef}>
                    {/* Prize content underneath */}
                    <div className={styles.revealContent}>
                        <div className={styles.prizeBox}>
                            <span className={styles.prizeIcon}>🎁</span>
                            <h3 className={styles.prizeTitle}>{prizeTitle}</h3>
                            <p className={styles.prizeDescription}>{prizeDescription}</p>
                            <p className={styles.prizeDetails}>{prizeDetails}</p>
                        </div>
                    </div>

                    {/* Confetti */}
                    {showConfetti && (
                        <div className={styles.confetti}>
                            {Array.from({ length: 50 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={styles.confettiPiece}
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        backgroundColor: ['#f43f5e', '#fbbf24', '#10b981', '#60a5fa', '#a855f7'][i % 5],
                                        animationDelay: `${Math.random() * 0.5}s`,
                                        animationDuration: `${1 + Math.random()}s`,
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Canvas scratch layer */}
                    <canvas
                        key={resetKey}
                        ref={canvasRef}
                        className={`${styles.scratchCanvas} ${isRevealed ? styles.hidden : ''}`}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    />
                </div>
            </div>

            {/* Progress indicator */}
            {!isRevealed && scratchPercent > 0 && (
                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${Math.min(scratchPercent * 2.2, 100)}%` }} />
                </div>
            )}

            {/* Footer */}
            <div className={styles.footer}>
                {isRevealed && (
                    <div className={styles.revealedActions}>
                        <div className={styles.winBadge}>
                            <span>✨</span>
                            <span>{winBadgeText}</span>
                        </div>
                        <div className={styles.buttonRow}>
                            <button onClick={handleReset} className={styles.tryAgainBtn}>
                                🔄 {tryAgainText}
                            </button>
                            <button onClick={handleContinue} className={styles.continueBtn}>
                                Continue →
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {mode === 'preview' && (
                <div className={styles.previewBadge}>Preview Mode</div>
            )}
        </div>
    );
}
