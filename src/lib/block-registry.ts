/**
 * BLOCK REGISTRY
 * Central registry for all available blocks
 * Blocks are dynamically loaded based on their manifest
 */

import type { BlockManifest, BlockSchema } from '@/types/blocks';
import type { ComponentType } from 'react';

// Block module interface - what each block exports
// Using 'any' for Block component to allow different input/output types
export interface BlockModule {
    manifest: BlockManifest;
    schema: BlockSchema;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Block: ComponentType<any>;
}

// Registry of all available blocks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blockRegistry = new Map<string, () => Promise<any>>();

/**
 * Register a block for lazy loading
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function registerBlock(id: string, loader: () => Promise<any>) {
    blockRegistry.set(id, loader);
}

/**
 * Get a block module by ID
 */
export async function getBlock(id: string): Promise<BlockModule | null> {
    const loader = blockRegistry.get(id);
    if (!loader) {
        console.warn(`Block not found: ${id}`);
        return null;
    }

    try {
        return await loader();
    } catch (error) {
        console.error(`Failed to load block: ${id}`, error);
        return null;
    }
}

/**
 * Get all registered block IDs
 */
export function getBlockIds(): string[] {
    return Array.from(blockRegistry.keys());
}

/**
 * Get manifests for all blocks (for gallery display)
 */
export async function getAllManifests(): Promise<BlockManifest[]> {
    const manifests: BlockManifest[] = [];

    for (const id of blockRegistry.keys()) {
        const block = await getBlock(id);
        if (block) {
            manifests.push(block.manifest);
        }
    }

    return manifests;
}

// ============ REGISTER BLOCKS ============
// Add blocks here as they are created

registerBlock('flower-wheel', () => import('@/blocks/flower-wheel'));
registerBlock('memory-match', () => import('@/blocks/memory-match'));
registerBlock('polaroid-memories', () => import('@/blocks/polaroid-memories'));
registerBlock('golden-ticket-reveal', () => import('@/blocks/golden-ticket-reveal'));

// Phase 2 blocks
registerBlock('love-letter', () => import('@/blocks/love-letter'));
registerBlock('envelope-opening', () => import('@/blocks/envelope-opening'));
registerBlock('love-quiz', () => import('@/blocks/love-quiz'));
registerBlock('gift-box-unwrap', () => import('@/blocks/gift-box-unwrap'));
registerBlock('fortune-cookie', () => import('@/blocks/fortune-cookie'));
registerBlock('countdown-timer', () => import('@/blocks/countdown-timer'));
registerBlock('promise-cards', () => import('@/blocks/promise-cards'));
registerBlock('slot-machine', () => import('@/blocks/slot-machine'));
registerBlock('confession-wall', () => import('@/blocks/confession-wall'));
registerBlock('love-meter', () => import('@/blocks/love-meter'));
registerBlock('finale-ask', () => import('@/blocks/finale-ask'));
registerBlock('photo-puzzle', () => import('@/blocks/photo-puzzle'));
