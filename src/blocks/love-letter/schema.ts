/**
 * LOVE LETTER BLOCK - Schema & Manifest
 * 
 * Animated typewriter letter on vintage paper.
 * Text appears letter by letter with ink effects.
 */

import type { BlockManifest, BlockSchema } from '@/types/blocks';

export const manifest: BlockManifest = {
    id: 'love-letter',
    version: '1.0.0',
    name: 'Love Letter',
    emoji: '💌',
    description: 'Send a beautiful animated love letter with typewriter effect on vintage paper.',
    category: 'message',
    occasions: ['valentine', 'anniversary', 'birthday', 'general'],
    tags: ['letter', 'message', 'typewriter', 'romantic', 'text'],
    duration: { min: 15, max: 60, unit: 'seconds' },
    assets: { needsImages: false, needsAudio: false },
    customization: { skins: ['vintage', 'modern', 'neon'], defaultSkin: 'vintage' },
};

export const schema: BlockSchema = {
    inputFields: [
        { key: 'greeting', type: 'text', label: 'Greeting', placeholder: 'My Dearest...', default: 'My Dearest...', maxLength: 50 },
        { key: 'message', type: 'textarea', label: 'Letter Message', placeholder: 'Write your love letter here...', required: true, default: 'Every moment with you is a treasure I hold close to my heart. You make my world brighter just by being in it.', maxLength: 500 },
        { key: 'closing', type: 'text', label: 'Closing', placeholder: 'Forever yours,', default: 'Forever yours,', maxLength: 50 },
        { key: 'signature', type: 'text', label: 'Signature', placeholder: 'Your name', default: '❤️', maxLength: 30 },
        {
            key: 'skin', type: 'select', label: 'Style', default: 'vintage', options: [
                { value: 'vintage', label: '📜 Vintage Paper' },
                { value: 'modern', label: '✨ Modern Minimal' },
                { value: 'neon', label: '💜 Neon Glow' },
            ]
        },
    ],
    outputFields: [
        { key: 'read', label: 'Read', type: 'boolean' },
        { key: 'readAt', label: 'Read At', type: 'datetime' },
    ],
};

export interface LoveLetterInput {
    greeting?: string;
    message?: string;
    closing?: string;
    signature?: string;
    skin?: 'vintage' | 'modern' | 'neon';
}

export interface LoveLetterOutput {
    read: boolean;
    readAt: string;
}
