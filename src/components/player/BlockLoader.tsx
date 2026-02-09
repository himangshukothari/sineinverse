/**
 * BLOCK LOADER COMPONENT
 * Dynamically loads and renders a block based on its ID
 */

'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { getBlock, type BlockModule } from '@/lib/block-registry';
import type { BlockProps } from '@/types/blocks';

interface BlockLoaderProps {
    blockId: string;
    input: Record<string, unknown>;
    onComplete: (output: Record<string, unknown>) => void;
    mode: 'preview' | 'play';
    recipientName?: string;
    senderName?: string;
    fallback?: ReactNode;
}

export function BlockLoader({
    blockId,
    input,
    onComplete,
    mode,
    recipientName,
    senderName,
    fallback,
}: BlockLoaderProps) {
    const [blockModule, setBlockModule] = useState<BlockModule | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function loadBlock() {
            setLoading(true);
            setError(null);

            const module = await getBlock(blockId);

            if (!mounted) return;

            if (module) {
                setBlockModule(module);
            } else {
                setError(`Block "${blockId}" not found`);
            }

            setLoading(false);
        }

        loadBlock();

        return () => {
            mounted = false;
        };
    }, [blockId]);

    if (loading) {
        return fallback ?? <BlockLoadingState />;
    }

    if (error) {
        return <BlockErrorState message={error} />;
    }

    if (!blockModule) {
        return <BlockErrorState message="Failed to load block" />;
    }

    const { Block } = blockModule;

    return (
        <Block
            input={input}
            onComplete={onComplete}
            mode={mode}
            recipientName={recipientName}
            senderName={senderName}
        />
    );
}

// ============ LOADING STATE ============
function BlockLoadingState() {
    return (
        <div className="flex items-center justify-center min-h-[300px] bg-gradient-to-br from-pink-50 to-rose-100 rounded-2xl">
            <div className="text-center space-y-4">
                <div className="animate-pulse text-5xl">💝</div>
                <p className="text-rose-600 font-medium">Loading something special...</p>
            </div>
        </div>
    );
}

// ============ ERROR STATE ============
function BlockErrorState({ message }: { message: string }) {
    return (
        <div className="flex items-center justify-center min-h-[300px] bg-red-50 rounded-2xl border border-red-200">
            <div className="text-center space-y-4 p-8">
                <div className="text-5xl">😢</div>
                <p className="text-red-600 font-medium">{message}</p>
                <p className="text-red-400 text-sm">Please try again later</p>
            </div>
        </div>
    );
}
