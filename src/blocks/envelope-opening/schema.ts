/**
 * ENVELOPE OPENING BLOCK - Schema & Manifest
 * Animated envelope that opens to reveal a card inside.
 */
import type { BlockManifest, BlockSchema } from '@/types/blocks';

export const manifest: BlockManifest = {
    id: 'envelope-opening',
    version: '1.0.0',
    name: 'Envelope Opening',
    emoji: '✉️',
    description: 'A beautiful animated envelope that opens to reveal your message inside.',
    category: 'intro',
    occasions: ['valentine', 'anniversary', 'birthday', 'wedding', 'general'],
    tags: ['envelope', 'intro', 'opening', 'reveal', 'letter'],
    duration: { min: 5, max: 15, unit: 'seconds' },
    assets: { needsImages: false, needsAudio: false },
    customization: { skins: ['wax-seal', 'hearts', 'elegant'], defaultSkin: 'wax-seal' },
};

export const schema: BlockSchema = {
    inputFields: [
        { key: 'toName', type: 'text', label: 'To', placeholder: 'My Love', default: 'My Love', maxLength: 30 },
        { key: 'fromName', type: 'text', label: 'From', placeholder: 'Your Secret Admirer', default: 'Your Secret Admirer', maxLength: 30 },
        { key: 'message', type: 'textarea', label: 'Card Message', placeholder: 'A special surprise awaits you...', default: 'A special surprise awaits you inside! 💕', maxLength: 150 },
        {
            key: 'skin', type: 'select', label: 'Style', default: 'wax-seal', options: [
                { value: 'wax-seal', label: '🔴 Wax Seal' },
                { value: 'hearts', label: '💕 Hearts' },
                { value: 'elegant', label: '✨ Elegant Gold' },
            ]
        },
    ],
    outputFields: [
        { key: 'opened', label: 'Opened', type: 'boolean' },
        { key: 'openedAt', label: 'Opened At', type: 'datetime' },
    ],
};

export interface EnvelopeOpeningInput { toName?: string; fromName?: string; message?: string; skin?: 'wax-seal' | 'hearts' | 'elegant'; }
export interface EnvelopeOpeningOutput { opened: boolean; openedAt: string; }
