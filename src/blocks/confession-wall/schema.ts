/**
 * CONFESSION WALL BLOCK - Schema & Manifest
 */
import type { BlockManifest, BlockSchema } from '@/types/blocks';

export const manifest: BlockManifest = {
    id: 'confession-wall',
    version: '1.0.0',
    name: 'Confession Wall',
    emoji: '📌',
    description: 'A wall of floating sticky notes with sweet confessions and reasons you love them.',
    category: 'message',
    occasions: ['valentine', 'anniversary', 'birthday', 'general'],
    tags: ['confession', 'wall', 'notes', 'sticky', 'reasons'],
    duration: { min: 15, max: 60, unit: 'seconds' },
    assets: { needsImages: false, needsAudio: false },
    customization: { skins: ['cork', 'pastel', 'dark'], defaultSkin: 'cork' },
};

export const schema: BlockSchema = {
    inputFields: [
        { key: 'title', type: 'text', label: 'Title', default: 'Things I Love About You', maxLength: 40 },
        { key: 'note1', type: 'text', label: 'Note 1', default: 'Your smile lights up my world ☀️', maxLength: 60 },
        { key: 'note2', type: 'text', label: 'Note 2', default: 'The way you laugh at my jokes 😄', maxLength: 60 },
        { key: 'note3', type: 'text', label: 'Note 3', default: 'How you always know what to say 💬', maxLength: 60 },
        { key: 'note4', type: 'text', label: 'Note 4', default: 'Your kindness to everyone 💕', maxLength: 60 },
        { key: 'note5', type: 'text', label: 'Note 5', default: 'The way you hold my hand 🤝', maxLength: 60 },
        { key: 'note6', type: 'text', label: 'Note 6 (optional)', maxLength: 60 },
        {
            key: 'skin', type: 'select', label: 'Style', default: 'cork', options: [
                { value: 'cork', label: '📋 Cork Board' },
                { value: 'pastel', label: '🌸 Pastel' },
                { value: 'dark', label: '🌙 Dark' },
            ]
        },
    ],
    outputFields: [
        { key: 'viewed', label: 'Viewed All', type: 'boolean' },
        { key: 'viewedAt', label: 'Viewed At', type: 'datetime' },
    ],
};

export interface ConfessionWallInput { title?: string; note1?: string; note2?: string; note3?: string; note4?: string; note5?: string; note6?: string; skin?: 'cork' | 'pastel' | 'dark'; }
export interface ConfessionWallOutput { viewed: boolean; viewedAt: string; }
