/**
 * WAX SEAL REVEAL BLOCK - Schema & Manifest
 * Tap/break a wax seal to reveal a hidden message beneath.
 */
import type { BlockManifest, BlockSchema } from '@/types/blocks';

export const manifest: BlockManifest = {
    id: 'wax-seal-reveal',
    version: '1.0.0',
    name: 'Wax Seal Reveal',
    emoji: '🔮',
    description: 'Break open a beautiful wax seal to reveal a hidden message underneath.',
    category: 'reveal',
    occasions: ['valentine', 'anniversary', 'birthday', 'general'],
    tags: ['wax', 'seal', 'reveal', 'mystery', 'romantic'],
    duration: { min: 5, max: 15, unit: 'seconds' },
    assets: { needsImages: false, needsAudio: false },
    customization: { skins: ['classic', 'royal', 'rose'], defaultSkin: 'classic' },
};

export const schema: BlockSchema = {
    inputFields: [
        { key: 'title', type: 'text', label: 'Title', placeholder: 'A Sealed Promise', default: 'A Sealed Promise', maxLength: 40 },
        { key: 'message', type: 'textarea', label: 'Hidden Message', placeholder: 'Your secret message...', default: 'You hold the key to my heart. Every day with you is a gift I cherish. 💕', maxLength: 200 },
        { key: 'fromName', type: 'text', label: 'From', placeholder: 'With love', default: 'With all my love', maxLength: 30 },
        {
            key: 'skin', type: 'select', label: 'Style', default: 'classic', options: [
                { value: 'classic', label: '🔴 Classic Red' },
                { value: 'royal', label: '👑 Royal Gold' },
                { value: 'rose', label: '🌹 Rose Pink' },
            ]
        },
    ],
    outputFields: [
        { key: 'revealed', label: 'Revealed', type: 'boolean' },
        { key: 'revealedAt', label: 'Revealed At', type: 'datetime' },
    ],
};

export interface WaxSealRevealInput { title?: string; message?: string; fromName?: string; skin?: 'classic' | 'royal' | 'rose'; }
export interface WaxSealRevealOutput { revealed: boolean; revealedAt: string; }
