'use client';

import { useState } from 'react';
import { BlockRenderer } from '@/components/BlockRenderer';
import styles from './preview.module.css';

export default function BlockPreviewPage() {
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState<Record<string, unknown> | null>(null);

    const handleComplete = (output: Record<string, unknown>) => {
        setResult(output);
        setShowResult(true);
    };

    // Sample input data - this would come from the card builder
    const sampleInput = {
        title: "Valentine's Surprise",
        subtitle: 'Spin the flower to reveal your gift!',
        petal1Text: 'Dinner Date',
        petal1Message: 'A romantic candlelight dinner tonight!',
        petal2Text: 'Massage',
        petal2Message: 'A relaxing 30-minute massage just for you.',
        petal3Text: 'Movie Night',
        petal3Message: 'You pick the movie, I bring the popcorn!',
        petal4Text: 'Breakfast in Bed',
        petal4Message: 'Sleep in, I\'ll handle breakfast.',
        petal5Text: 'Love Letter',
        petal5Message: 'A handwritten letter, from my heart to yours.',
        petal6Text: 'Sweet Treat',
        petal6Message: 'We\'re going out for dessert!',
        buttonText: 'Pick a Petal',
        acceptButtonText: 'Accept with Love 💕',
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <a href="/lab" className={styles.backLink}>← Back to Lab</a>
                <h1>Block Preview: Flower Wheel</h1>
            </header>

            {/* Block Preview */}
            <div className={styles.previewArea}>
                <BlockRenderer
                    blockId="flower-wheel"
                    input={sampleInput}
                    mode="preview"
                    onComplete={handleComplete}
                />
            </div>

            {/* Result Panel */}
            {showResult && result && (
                <div className={styles.resultPanel}>
                    <h3>Block Output:</h3>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                    <button onClick={() => setShowResult(false)}>Close</button>
                </div>
            )}
        </div>
    );
}
