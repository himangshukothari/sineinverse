/**
 * COUNTDOWN TIMER BLOCK - Schema & Manifest
 */
import type { BlockManifest, BlockSchema } from '@/types/blocks';

export const manifest: BlockManifest = {
    id: 'countdown-timer',
    version: '1.0.0',
    name: 'Countdown Timer',
    emoji: '⏳',
    description: 'A dramatic countdown that builds anticipation before the big reveal!',
    category: 'intro',
    occasions: ['valentine', 'anniversary', 'birthday', 'general'],
    tags: ['countdown', 'timer', 'anticipation', 'dramatic', 'intro'],
    duration: { min: 5, max: 15, unit: 'seconds' },
    assets: { needsImages: false, needsAudio: false },
    customization: { skins: ['digital', 'elegant', 'neon'], defaultSkin: 'digital' },
};

export const schema: BlockSchema = {
    inputFields: [
        { key: 'title', type: 'text', label: 'Title', placeholder: 'Get Ready...', default: 'Something Special is Coming...', maxLength: 50 },
        { key: 'countFrom', type: 'number', label: 'Count From', default: 5 },
        { key: 'revealText', type: 'text', label: 'Reveal Text', default: '🎉 Surprise! 🎉', maxLength: 50 },
        {
            key: 'skin', type: 'select', label: 'Style', default: 'digital', options: [
                { value: 'digital', label: '🔢 Digital' },
                { value: 'elegant', label: '✨ Elegant' },
                { value: 'neon', label: '💜 Neon' },
            ]
        },
    ],
    outputFields: [
        { key: 'completed', label: 'Completed', type: 'boolean' },
        { key: 'completedAt', label: 'Completed At', type: 'datetime' },
    ],
};

export interface CountdownTimerInput { title?: string; countFrom?: number; revealText?: string; skin?: 'digital' | 'elegant' | 'neon'; }
export interface CountdownTimerOutput { completed: boolean; completedAt: string; }
