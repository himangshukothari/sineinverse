/**
 * EXAMPLE BLOCK - Template for new blocks
 * 
 * This is a minimal example showing the structure every block should follow.
 * Copy this folder to create a new block.
 */

import type { BlockManifest, BlockSchema } from '@/types/blocks';

// ============ MANIFEST ============
export const manifest: BlockManifest = {
    id: '_example',
    version: '1.0.0',
    name: 'Example Block',
    emoji: '✨',
    description: 'A template block showing the required structure',

    category: 'message',
    occasions: ['general'],
    tags: ['template', 'example'],

    duration: {
        min: 5,
        max: 10,
        unit: 'seconds',
    },

    assets: {
        needsImages: false,
        needsAudio: false,
    },

    customization: {
        skins: ['default'],
        defaultSkin: 'default',
    },
};

// ============ SCHEMA ============
export const schema: BlockSchema = {
    inputFields: [
        {
            key: 'title',
            type: 'text',
            label: 'Title',
            required: true,
            default: 'Hello!',
            maxLength: 50,
        },
        {
            key: 'message',
            type: 'textarea',
            label: 'Message',
            placeholder: 'Write something nice...',
            maxLength: 200,
        },
    ],

    outputFields: [
        { key: 'viewed', label: 'Viewed', type: 'boolean' },
        { key: 'viewedAt', label: 'Viewed At', type: 'datetime' },
    ],
};
