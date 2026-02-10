import type { BlockManifest, BlockSchema } from '@/types/blocks';

export const manifest: BlockManifest = {
    id: 'love-meter',
    version: '1.0.0',
    name: 'Love Meter',
    emoji: '💓',
    description: 'Watch the love meter fill up with hearts as it measures the love between you two!',
    category: 'game',
    occasions: ['valentine', 'anniversary', 'birthday', 'general'],
    tags: ['love', 'meter', 'hearts', 'measure', 'fun'],
    duration: { min: 5, max: 15, unit: 'seconds' },
    assets: { needsImages: false, needsAudio: false },
    customization: { skins: ['thermometer', 'hearts', 'neon'], defaultSkin: 'thermometer' },
};

export const schema: BlockSchema = {
    inputFields: [
        { key: 'name1', type: 'text', label: 'Name 1', default: 'You', maxLength: 20 },
        { key: 'name2', type: 'text', label: 'Name 2', default: 'Me', maxLength: 20 },
        { key: 'percentage', type: 'number', label: 'Love % (50-100)', default: 99 },
        { key: 'message', type: 'text', label: 'Result Message', default: 'Made for each other! 💕', maxLength: 60 },
        {
            key: 'skin', type: 'select', label: 'Style', default: 'thermometer', options: [
                { value: 'thermometer', label: '🌡️ Thermometer' },
                { value: 'hearts', label: '💕 Hearts' },
                { value: 'neon', label: '💜 Neon' },
            ]
        },
    ],
    outputFields: [
        { key: 'measured', label: 'Measured', type: 'boolean' },
        { key: 'percentage', label: 'Percentage', type: 'number' },
    ],
};

export interface LoveMeterInput { name1?: string; name2?: string; percentage?: number; message?: string; skin?: 'thermometer' | 'hearts' | 'neon'; }
export interface LoveMeterOutput { measured: boolean; percentage: number; }
