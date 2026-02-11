/**
 * BLOCK RENDERER - Dynamic Block Loading & Rendering
 * 
 * Dynamically loads and renders block components with live input updates.
 * Used in Lab page for live preview and in card player for final rendering.
 */

'use client';

import { useState, useEffect, ComponentType, Suspense } from 'react';
import { getBlock, BlockModule } from '@/lib/block-registry';
import type { BlockProps } from '@/types/blocks';
import styles from './BlockRenderer.module.css';

interface BlockRendererProps {
    blockId: string;           // Block type ID (e.g., 'flower-wheel')
    input: Record<string, unknown>;
    mode?: 'edit' | 'preview' | 'play';
    scale?: number;            // Scale for mini preview (0-1)
    onComplete?: (output: Record<string, unknown>) => void;
    className?: string;
}

// Loading placeholder
function BlockLoading() {
    return (
        <div className={styles.loading}>
            <div className={styles.spinner} />
            <span>Loading block...</span>
        </div>
    );
}

// Error placeholder
function BlockError({ message }: { message: string }) {
    return (
        <div className={styles.error}>
            <span className={styles.errorIcon}>⚠️</span>
            <span>{message}</span>
        </div>
    );
}

// Coming soon placeholder
function BlockComingSoon({ name }: { name: string }) {
    return (
        <div className={styles.comingSoon}>
            <span className={styles.comingSoonIcon}>🚧</span>
            <h3>{name}</h3>
            <p>Coming soon!</p>
        </div>
    );
}

export default function BlockRenderer({
    blockId,
    input,
    mode = 'edit',
    scale = 1,
    onComplete,
    className = '',
}: BlockRendererProps) {
    const [blockModule, setBlockModule] = useState<BlockModule | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load block module
    useEffect(() => {
        let mounted = true;

        async function loadBlockModule() {
            setLoading(true);
            setError(null);

            try {
                const mod = await getBlock(blockId);
                if (mounted) {
                    if (mod) {
                        setBlockModule(mod);
                    } else {
                        setError(`Block not found: ${blockId}`);
                    }
                }
            } catch (err) {
                if (mounted) {
                    console.error(`Failed to load block ${blockId}:`, err);
                    setError(`Failed to load block`);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        loadBlockModule();

        return () => {
            mounted = false;
        };
    }, [blockId]);

    // Handle block completion
    const handleComplete = (output: Record<string, unknown>) => {
        if (onComplete) {
            onComplete(output);
        }
    };

    // Render loading state
    if (loading) {
        return (
            <div className={`${styles.wrapper} ${className}`} style={{ transform: `scale(${scale})` }}>
                <BlockLoading />
            </div>
        );
    }

    // Render error state
    if (error || !blockModule) {
        // Check if it's a known "coming soon" block
        const comingSoonBlocks = ['intro-envelope'];
        if (comingSoonBlocks.includes(blockId)) {
            return (
                <div className={`${styles.wrapper} ${className}`} style={{ transform: `scale(${scale})` }}>
                    <BlockComingSoon name={blockId.replace('-', ' ')} />
                </div>
            );
        }

        return (
            <div className={`${styles.wrapper} ${className}`} style={{ transform: `scale(${scale})` }}>
                <BlockError message={error || 'Unknown error'} />
            </div>
        );
    }

    // Get the Block component
    const BlockComponent = blockModule.Block as ComponentType<BlockProps>;

    return (
        <div
            className={`${styles.wrapper} ${styles[mode]} ${className}`}
            style={{
                transform: scale < 1 ? `scale(${scale})` : undefined,
                transformOrigin: 'top center',
            }}
        >
            <Suspense fallback={<BlockLoading />}>
                <BlockComponent
                    input={input}
                    mode={mode}
                    onComplete={handleComplete}
                />
            </Suspense>
        </div>
    );
}
