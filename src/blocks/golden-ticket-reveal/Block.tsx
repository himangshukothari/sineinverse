/**
 * GOLDEN TICKET REVEAL BLOCK - React Component
 * 
 * Scratch card to reveal a hidden prize/message.
 * Adapted from golden-ticket-reveal gameblock.
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { BlockProps } from '@/types/blocks';
import type { GoldenTicketInput, GoldenTicketOutput } from './schema';
import styles from './styles.module.css';

export default function GoldenTicketBlock({
    input,
    onComplete,
    mode,
}: BlockProps<GoldenTicketInput, GoldenTicketOutput>) {
    const [isRevealed, setIsRevealed] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [resetKey, setResetKey] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const title = input.title || 'Golden Ticket';
    const subtitle = input.subtitle || "Scratch to reveal your Valentine's surprise";
    const prizeTitle = input.prizeTitle || 'Romantic Dinner';
    const prizeDescription = input.prizeDescription || 'Table for two @ Chez Amour';
    const prizeDetails = input.prizeDetails || 'Valid: Feb 14th, 8:00 PM';
    const scratchText = input.scratchText || 'Scratch to Reveal';
    const winBadgeText = input.winBadgeText || 'You won a prize!';
    const tryAgainText = input.tryAgainText || 'Try Again';

    const width = 340;
    const height = 220;

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        // High DPI support
        const dpr = window.devicePixelRatio || 1;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        // Draw gold gradient
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#C69C3A');
        gradient.addColorStop(0.3, '#FFD700');
        gradient.addColorStop(0.5, '#FDB931');
        gradient.addColorStop(0.8, '#FFD700');
        gradient.addColorStop(1, '#C69C3A');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Add noise texture
        addNoise(ctx, width, height);

        // Draw overlay text
        ctx.globalCompositeOperation = 'source-over';
        ctx.font = 'bold 18px Georgia';
        ctx.fillStyle = '#684503';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(scratchText, width / 2, height / 2);

        // Decorative border
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#684503';
        ctx.strokeRect(10, 10, width - 20, height - 20);
    }, [resetKey, scratchText]);

    const addNoise = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
        const dpr = window.devicePixelRatio || 1;
        const imageData = ctx.getImageData(0, 0, w * dpr, h * dpr);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 20;
            data[i] = Math.min(255, Math.max(0, data[i] + noise));
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
        }
        ctx.putImageData(imageData, 0, 0);
    };

    const checkRevealProgress = () => {
        const canvas = canvasRef.current;
        if (!canvas || isRevealed) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;

        let transparentPixels = 0;
        const step = 4 * 10;

        for (let i = 0; i < data.length; i += step) {
            if (data[i + 3] === 0) {
                transparentPixels++;
            }
        }

        const totalPixelsChecked = data.length / step;
        const percentage = transparentPixels / totalPixelsChecked;

        if (percentage > 0.5) {
            finishReveal();
        }
    };

    const finishReveal = () => {
        if (isRevealed) return;
        setIsRevealed(true);
        setShowConfetti(true);

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const handleScratch = useCallback((clientX: number, clientY: number) => {
        if (isRevealed) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.fill();

        checkRevealProgress();
    }, [isRevealed]);

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
        const touch = e.touches[0];
        handleScratch(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        e.preventDefault();
        if (!isDrawing) return;
        const touch = e.touches[0];
        handleScratch(touch.clientX, touch.clientY);
    };

    const handleTouchEnd = () => setIsDrawing(false);

    // Global mouse up
    useEffect(() => {
        const handleGlobalMouseUp = () => setIsDrawing(false);
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, []);

    const handleReset = () => {
        setResetKey(prev => prev + 1);
        setIsRevealed(false);
        setShowConfetti(false);
    };

    const handleContinue = () => {
        onComplete({
            revealed: true,
            revealedAt: new Date().toISOString(),
        });
    };

    return (
        <div className={styles.container} data-mode={mode}>
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
                <div className={styles.cardFrame}>
                    {/* Reveal Content (Background) */}
                    <div className={styles.revealContent}>
                        <div className={styles.prizeBox}>
                            <span className={styles.prizeIcon}>🎁</span>
                            <h3 className={styles.prizeTitle}>{prizeTitle}</h3>
                            <p className={styles.prizeDescription}>{prizeDescription}</p>
                            <p className={styles.prizeDetails}>{prizeDetails}</p>
                        </div>
                    </div>

                    {/* Confetti Effect */}
                    {showConfetti && (
                        <div className={styles.confetti}>
                            {Array.from({ length: 50 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={styles.confettiPiece}
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        backgroundColor: ['#f43f5e', '#fbbf24', '#10b981', '#60a5fa', '#a855f7'][Math.floor(Math.random() * 5)],
                                        animationDelay: `${Math.random() * 0.5}s`,
                                        animationDuration: `${1 + Math.random()}s`,
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Scratch Layer (Canvas) */}
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

            {/* Footer Controls */}
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
