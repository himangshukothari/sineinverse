/**
 * BLOCK REGISTRY
 * Central registry for all available blocks
 * Blocks are dynamically loaded based on their manifest
 */

import type { BlockManifest, BlockProps, BlockSchema } from '@/types/blocks';
import type { ComponentType } from 'react';

// Block module interface - what each block exports
export interface BlockModule {
    manifest: BlockManifest;
    schema: BlockSchema;
    Block: ComponentType<BlockProps>;
}

// Registry of all available blocks
const blockRegistry = new Map<string, () => Promise<BlockModule>>();

/**
 * Register a block for lazy loading
 */
export function registerBlock(id: string, loader: () => Promise<BlockModule>) {
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

// Future blocks:
// registerBlock('intro-block', () => import('@/blocks/intro-block'));
// registerBlock('wax-seal-reveal', () => import('@/blocks/wax-seal-reveal'));
// registerBlock('finale-ask', () => import('@/blocks/finale-ask'));

