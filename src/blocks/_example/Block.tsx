/**
 * EXAMPLE BLOCK - React Component
 * 
 * Shows the basic structure of a block component
 */

'use client';

import { useState, useEffect } from 'react';
import type { BlockProps } from '@/types/blocks';
import styles from './styles.module.css';

// Input/Output types for this block
interface ExampleInput {
    title?: string;
    message?: string;
}

interface ExampleOutput {
    viewed: boolean;
    viewedAt: string;
}

export default function ExampleBlock({
    input,
    onComplete,
    mode,
    recipientName
}: BlockProps<ExampleInput, ExampleOutput>) {
    const [clicked, setClicked] = useState(false);

    const handleClick = () => {
        setClicked(true);

        // Report completion after animation
        setTimeout(() => {
            onComplete({
                viewed: true,
                viewedAt: new Date().toISOString(),
            });
        }, 1000);
    };

    const title = input.title || 'Hello!';
    const message = input.message || `Hey ${recipientName || 'there'}, something special awaits...`;

    return (
        <div className={styles.container} data-mode={mode}>
            <div className={styles.card}>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.message}>{message}</p>

                {!clicked ? (
                    <button className={styles.continueBtn} onClick={handleClick}>
                        Continue ✨
                    </button>
                ) : (
                    <div className={styles.loading}>Loading next...</div>
                )}
            </div>

            {mode === 'preview' && (
                <div className={styles.previewBadge}>Preview Mode</div>
            )}
        </div>
    );
}
