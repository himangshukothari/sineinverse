import type { BlockManifest, BlockSchema } from '@/types/blocks';

export const manifest: BlockManifest = {
    id: 'finale-ask',
    version: '1.0.0',
    name: 'The Big Ask',
    emoji: '💍',
    description: 'The dramatic finale — pop the big question with a spotlight reveal and celebration!',
    category: 'finale',
    occasions: ['valentine', 'anniversary', 'wedding', 'general'],
    tags: ['finale', 'ask', 'question', 'proposal', 'ending'],
    duration: { min: 10, max: 30, unit: 'seconds' },
    assets: { needsImages: false, needsAudio: false },
    customization: { skins: ['spotlight', 'roses', 'starry'], defaultSkin: 'spotlight' },
};

export const schema: BlockSchema = {
    inputFields: [
        { key: 'question', type: 'textarea', label: 'The Big Question', default: 'Will you be my Valentine? 💕', required: true, maxLength: 150 },
        { key: 'yesText', type: 'text', label: 'Yes Button Text', default: 'Yes! 💕', maxLength: 20 },
        { key: 'noText', type: 'text', label: 'No Button Text', default: 'Maybe later...', maxLength: 20 },
        { key: 'yesMessage', type: 'text', label: 'Yes Response', default: 'I knew it! You just made my day! 🎉💕', maxLength: 100 },
        {
            key: 'skin', type: 'select', label: 'Style', default: 'spotlight', options: [
                { value: 'spotlight', label: '🔦 Spotlight' },
                { value: 'roses', label: '🌹 Roses' },
                { value: 'starry', label: '✨ Starry Night' },
            ]
        },
    ],
    outputFields: [
        { key: 'answer', label: 'Answer', type: 'string' },
        { key: 'answeredAt', label: 'Answered At', type: 'datetime' },
    ],
};

export interface FinaleAskInput { question?: string; yesText?: string; noText?: string; yesMessage?: string; skin?: 'spotlight' | 'roses' | 'starry'; }
export interface FinaleAskOutput { answer: string; answeredAt: string; }
