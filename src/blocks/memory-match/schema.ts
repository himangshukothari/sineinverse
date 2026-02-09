/**
 * MEMORY MATCH BLOCK - Schema & Manifest
 * 
 * Classic memory matching game with heart-shaped cards.
 * Players flip cards to find matching pairs.
 */

import type { BlockManifest, BlockSchema } from '@/types/blocks';

// ============ MANIFEST ============
export const manifest: BlockManifest = {
    id: 'memory-match',
    version: '1.0.0',
    name: 'Memory Match',
    emoji: '🃏',
    description: 'Match heart-shaped cards to find all pairs! A classic memory game with romantic themes.',

    category: 'puzzle',
    occasions: ['valentine', 'anniversary', 'birthday', 'general'],
    tags: ['memory', 'cards', 'game', 'hearts', 'matching'],

    duration: {
        min: 30,
        max: 120,
        unit: 'seconds',
    },

    assets: {
        needsImages: true,
        needsAudio: false,
    },

    customization: {
        skins: ['romantic', 'classic', 'gold'],
        defaultSkin: 'romantic',
    },
};

// ============ SCHEMA ============
export const schema: BlockSchema = {
    inputFields: [
        {
            key: 'title',
            type: 'text',
            label: 'Title',
            placeholder: "Valentine's Memory",
            required: true,
            default: "Valentine's Memory",
            maxLength: 40,
        },
        {
            key: 'subtitle',
            type: 'text',
            label: 'Subtitle',
            placeholder: 'Match the hearts to reveal love',
            default: 'Match the hearts to reveal love',
            maxLength: 60,
        },
        {
            key: 'image1',
            type: 'text',
            label: 'Image 1 URL',
            placeholder: 'https://images.unsplash.com/...',
            hint: 'Romantic themed image',
        },
        {
            key: 'image2',
            type: 'text',
            label: 'Image 2 URL',
            placeholder: 'https://images.unsplash.com/...',
        },
        {
            key: 'image3',
            type: 'text',
            label: 'Image 3 URL',
            placeholder: 'https://images.unsplash.com/...',
        },
        {
            key: 'image4',
            type: 'text',
            label: 'Image 4 URL',
            placeholder: 'https://images.unsplash.com/...',
        },
        {
            key: 'image5',
            type: 'text',
            label: 'Image 5 URL',
            placeholder: 'https://images.unsplash.com/...',
        },
        {
            key: 'image6',
            type: 'text',
            label: 'Image 6 URL',
            placeholder: 'https://images.unsplash.com/...',
        },
        {
            key: 'winTitle',
            type: 'text',
            label: 'Win Message Title',
            default: 'You Won!',
            maxLength: 30,
        },
        {
            key: 'playAgainText',
            type: 'text',
            label: 'Play Again Button',
            default: 'Play Again',
            maxLength: 20,
        },
    ],

    outputFields: [
        { key: 'completed', label: 'Completed', type: 'boolean' },
        { key: 'moves', label: 'Moves', type: 'number' },
        { key: 'timeSeconds', label: 'Time (seconds)', type: 'number' },
        { key: 'playedAt', label: 'Played At', type: 'datetime' },
    ],
};

// ============ INPUT TYPE ============
export interface MemoryMatchInput {
    title?: string;
    subtitle?: string;
    image1?: string;
    image2?: string;
    image3?: string;
    image4?: string;
    image5?: string;
    image6?: string;
    winTitle?: string;
    playAgainText?: string;
}

export interface MemoryMatchOutput {
    completed: boolean;
    moves: number;
    timeSeconds: number;
    playedAt: string;
}
