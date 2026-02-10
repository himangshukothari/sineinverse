/**
 * SLOT MACHINE BLOCK - Schema & Manifest
 */
import type { BlockManifest, BlockSchema } from '@/types/blocks';

export const manifest: BlockManifest = {
    id: 'slot-machine',
    version: '1.0.0',
    name: 'Slot Machine',
    emoji: '🎰',
    description: 'Spin the love slot machine — every spin is a winner with romantic prizes!',
    category: 'game',
    occasions: ['valentine', 'anniversary', 'birthday', 'general'],
    tags: ['slot', 'machine', 'spin', 'game', 'fun'],
    duration: { min: 10, max: 30, unit: 'seconds' },
    assets: { needsImages: false, needsAudio: false },
    customization: { skins: ['vegas', 'cute', 'midnight'], defaultSkin: 'vegas' },
};

export const schema: BlockSchema = {
    inputFields: [
        { key: 'title', type: 'text', label: 'Title', default: 'Love Slots!', maxLength: 30 },
        { key: 'prize', type: 'text', label: 'Winning Message', default: 'You win infinite kisses! 💋', maxLength: 80 },
        {
            key: 'skin', type: 'select', label: 'Style', default: 'vegas', options: [
                { value: 'vegas', label: '🎰 Vegas' },
                { value: 'cute', label: '💕 Cute' },
                { value: 'midnight', label: '🌙 Midnight' },
            ]
        },
    ],
    outputFields: [
        { key: 'spun', label: 'Spun', type: 'boolean' },
        { key: 'spunAt', label: 'Spun At', type: 'datetime' },
    ],
};

export interface SlotMachineInput { title?: string; prize?: string; skin?: 'vegas' | 'cute' | 'midnight'; }
export interface SlotMachineOutput { spun: boolean; spunAt: string; }
