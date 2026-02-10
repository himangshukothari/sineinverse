/**
 * PROMISE CARDS BLOCK - Schema & Manifest
 */
import type { BlockManifest, BlockSchema } from '@/types/blocks';

export const manifest: BlockManifest = {
    id: 'promise-cards',
    version: '1.0.0',
    name: 'Promise Cards',
    emoji: '🤞',
    description: 'Swipe through beautiful promise cards — personal commitments to your loved one.',
    category: 'message',
    occasions: ['valentine', 'anniversary', 'wedding', 'general'],
    tags: ['promise', 'swipe', 'cards', 'commitment', 'love'],
    duration: { min: 15, max: 60, unit: 'seconds' },
    assets: { needsImages: false, needsAudio: false },
    customization: { skins: ['gradient', 'minimal', 'dark'], defaultSkin: 'gradient' },
};

export const schema: BlockSchema = {
    inputFields: [
        { key: 'title', type: 'text', label: 'Title', default: 'My Promises to You', maxLength: 40 },
        { key: 'promise1', type: 'text', label: 'Promise 1', default: 'I promise to always make you laugh 😄', maxLength: 80 },
        { key: 'promise2', type: 'text', label: 'Promise 2', default: 'I promise to hold your hand through anything 🤝', maxLength: 80 },
        { key: 'promise3', type: 'text', label: 'Promise 3', default: 'I promise to surprise you with little things ✨', maxLength: 80 },
        { key: 'promise4', type: 'text', label: 'Promise 4', default: 'I promise to love you more each day 💕', maxLength: 80 },
        { key: 'promise5', type: 'text', label: 'Promise 5 (optional)', default: '', maxLength: 80 },
        {
            key: 'skin', type: 'select', label: 'Style', default: 'gradient', options: [
                { value: 'gradient', label: '🌈 Gradient' },
                { value: 'minimal', label: '⬜ Minimal' },
                { value: 'dark', label: '🌙 Dark' },
            ]
        },
    ],
    outputFields: [
        { key: 'viewed', label: 'Viewed', type: 'boolean' },
        { key: 'viewedAt', label: 'Viewed At', type: 'datetime' },
    ],
};

export interface PromiseCardsInput { title?: string; promise1?: string; promise2?: string; promise3?: string; promise4?: string; promise5?: string; skin?: 'gradient' | 'minimal' | 'dark'; }
export interface PromiseCardsOutput { viewed: boolean; viewedAt: string; }
