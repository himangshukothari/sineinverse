/**
 * POLAROID MEMORIES BLOCK - Schema & Manifest
 * 
 * Memory matching game with polaroid-style photo cards.
 * Includes captions for each memory.
 */

import type { BlockManifest, BlockSchema } from '@/types/blocks';

// ============ MANIFEST ============
export const manifest: BlockManifest = {
    id: 'polaroid-memories',
    version: '1.0.0',
    name: 'Polaroid Memories',
    emoji: '📸',
    description: 'Match polaroid photos to reveal shared memories! Each card shows a caption when matched.',

    category: 'puzzle',
    occasions: ['valentine', 'anniversary', 'birthday', 'general'],
    tags: ['memory', 'photos', 'polaroid', 'nostalgia', 'matching'],

    duration: {
        min: 30,
        max: 90,
        unit: 'seconds',
    },

    assets: {
        needsImages: true,
        needsAudio: false,
    },

    customization: {
        skins: ['vintage', 'modern', 'romantic'],
        defaultSkin: 'vintage',
    },
};

// ============ SCHEMA ============
export const schema: BlockSchema = {
    inputFields: [
        {
            key: 'title',
            type: 'text',
            label: 'Title',
            placeholder: 'Polaroid Memories',
            required: true,
            default: 'Polaroid Memories',
            maxLength: 40,
        },
        {
            key: 'subtitle',
            type: 'text',
            label: 'Subtitle',
            placeholder: 'Match the moments',
            default: 'Match the moments',
            maxLength: 60,
        },
        {
            key: 'memory1Image',
            type: 'text',
            label: 'Memory 1 - Image URL',
            placeholder: 'https://picsum.photos/...',
        },
        {
            key: 'memory1Caption',
            type: 'text',
            label: 'Memory 1 - Caption',
            placeholder: 'For you',
            maxLength: 30,
        },
        {
            key: 'memory2Image',
            type: 'text',
            label: 'Memory 2 - Image URL',
            placeholder: 'https://picsum.photos/...',
        },
        {
            key: 'memory2Caption',
            type: 'text',
            label: 'Memory 2 - Caption',
            placeholder: 'Our getaway',
            maxLength: 30,
        },
        {
            key: 'memory3Image',
            type: 'text',
            label: 'Memory 3 - Image URL',
            placeholder: 'https://picsum.photos/...',
        },
        {
            key: 'memory3Caption',
            type: 'text',
            label: 'Memory 3 - Caption',
            placeholder: 'Morning brew',
            maxLength: 30,
        },
        {
            key: 'memory4Image',
            type: 'text',
            label: 'Memory 4 - Image URL',
            placeholder: 'https://picsum.photos/...',
        },
        {
            key: 'memory4Caption',
            type: 'text',
            label: 'Memory 4 - Caption',
            placeholder: 'Golden hour',
            maxLength: 30,
        },
        {
            key: 'memory5Image',
            type: 'text',
            label: 'Memory 5 - Image URL',
            placeholder: 'https://picsum.photos/...',
        },
        {
            key: 'memory5Caption',
            type: 'text',
            label: 'Memory 5 - Caption',
            placeholder: 'Starry night',
            maxLength: 30,
        },
        {
            key: 'memory6Image',
            type: 'text',
            label: 'Memory 6 - Image URL',
            placeholder: 'https://picsum.photos/...',
        },
        {
            key: 'memory6Caption',
            type: 'text',
            label: 'Memory 6 - Caption',
            placeholder: 'Holding on',
            maxLength: 30,
        },
        {
            key: 'winMessage',
            type: 'text',
            label: 'Win Message',
            default: 'Beautifully Remembered!',
            maxLength: 40,
        },
    ],

    outputFields: [
        { key: 'completed', label: 'Completed', type: 'boolean' },
        { key: 'moves', label: 'Moves', type: 'number' },
        { key: 'playedAt', label: 'Played At', type: 'datetime' },
    ],
};

// ============ INPUT TYPE ============
export interface PolaroidMemoriesInput {
    title?: string;
    subtitle?: string;
    memory1Image?: string;
    memory1Caption?: string;
    memory2Image?: string;
    memory2Caption?: string;
    memory3Image?: string;
    memory3Caption?: string;
    memory4Image?: string;
    memory4Caption?: string;
    memory5Image?: string;
    memory5Caption?: string;
    memory6Image?: string;
    memory6Caption?: string;
    winMessage?: string;
}

export interface PolaroidMemoriesOutput {
    completed: boolean;
    moves: number;
    playedAt: string;
}
