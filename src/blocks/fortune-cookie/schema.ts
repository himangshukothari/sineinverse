/**
 * FORTUNE COOKIE BLOCK - Schema & Manifest
 */
import type { BlockManifest, BlockSchema } from '@/types/blocks';

export const manifest: BlockManifest = {
    id: 'fortune-cookie',
    version: '1.0.0',
    name: 'Fortune Cookie',
    emoji: '🥠',
    description: 'Crack open a fortune cookie to reveal a special message!',
    category: 'reveal',
    occasions: ['valentine', 'anniversary', 'birthday', 'general'],
    tags: ['fortune', 'cookie', 'message', 'reveal', 'interactive'],
    duration: { min: 5, max: 15, unit: 'seconds' },
    assets: { needsImages: false, needsAudio: false },
    customization: { skins: ['golden', 'rose', 'cosmic'], defaultSkin: 'golden' },
};

export const schema: BlockSchema = {
    inputFields: [
        { key: 'fortune', type: 'textarea', label: 'Fortune Message', placeholder: 'Your fortune awaits...', default: 'A beautiful love story awaits you — and you are its main character. 💕', required: true, maxLength: 200 },
        { key: 'luckyNumbers', type: 'text', label: 'Lucky Numbers', placeholder: '7, 14, 21', default: '7, 14, 21, 42', maxLength: 30 },
        {
            key: 'skin', type: 'select', label: 'Style', default: 'golden', options: [
                { value: 'golden', label: '🥠 Golden' },
                { value: 'rose', label: '🌹 Rose' },
                { value: 'cosmic', label: '🌌 Cosmic' },
            ]
        },
    ],
    outputFields: [
        { key: 'cracked', label: 'Cracked', type: 'boolean' },
        { key: 'crackedAt', label: 'Cracked At', type: 'datetime' },
    ],
};

export interface FortuneCookieInput { fortune?: string; luckyNumbers?: string; skin?: 'golden' | 'rose' | 'cosmic'; }
export interface FortuneCookieOutput { cracked: boolean; crackedAt: string; }
