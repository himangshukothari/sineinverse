/**
 * GOLDEN TICKET REVEAL BLOCK - Schema & Manifest
 * 
 * Scratch card style reveal with golden ticket theme.
 * User scratches to reveal a hidden prize/message.
 */

import type { BlockManifest, BlockSchema } from '@/types/blocks';

// ============ MANIFEST ============
export const manifest: BlockManifest = {
    id: 'golden-ticket-reveal',
    version: '1.0.0',
    name: 'Golden Ticket',
    emoji: '🎫',
    description: 'Scratch to reveal a special surprise! Like a golden ticket scratch card.',

    category: 'reveal',
    occasions: ['valentine', 'anniversary', 'birthday', 'general'],
    tags: ['scratch', 'reveal', 'ticket', 'prize', 'surprise'],

    duration: {
        min: 10,
        max: 30,
        unit: 'seconds',
    },

    assets: {
        needsImages: false,
        needsAudio: false,
    },

    customization: {
        skins: ['gold', 'rose', 'silver'],
        defaultSkin: 'gold',
    },
};

// ============ SCHEMA ============
export const schema: BlockSchema = {
    inputFields: [
        {
            key: 'title',
            type: 'text',
            label: 'Header Title',
            placeholder: 'Golden Ticket',
            required: true,
            default: 'Golden Ticket',
            maxLength: 40,
        },
        {
            key: 'subtitle',
            type: 'text',
            label: 'Header Subtitle',
            placeholder: "Scratch to reveal your Valentine's surprise",
            default: "Scratch to reveal your Valentine's surprise",
            maxLength: 60,
        },
        {
            key: 'prizeTitle',
            type: 'text',
            label: 'Prize Title',
            placeholder: 'Romantic Dinner',
            required: true,
            maxLength: 40,
        },
        {
            key: 'prizeDescription',
            type: 'text',
            label: 'Prize Description',
            placeholder: 'Table for two @ Chez Amour',
            maxLength: 60,
        },
        {
            key: 'prizeDetails',
            type: 'text',
            label: 'Prize Details',
            placeholder: 'Valid: Feb 14th, 8:00 PM',
            maxLength: 40,
        },
        {
            key: 'scratchText',
            type: 'text',
            label: 'Scratch Layer Text',
            default: 'Scratch to Reveal',
            maxLength: 25,
        },
        {
            key: 'winBadgeText',
            type: 'text',
            label: 'Win Badge Text',
            default: 'You won a prize!',
            maxLength: 30,
        },
        {
            key: 'tryAgainText',
            type: 'text',
            label: 'Try Again Button',
            default: 'Try Again',
            maxLength: 20,
        },
    ],

    outputFields: [
        { key: 'revealed', label: 'Revealed', type: 'boolean' },
        { key: 'revealedAt', label: 'Revealed At', type: 'datetime' },
    ],
};

// ============ INPUT TYPE ============
export interface GoldenTicketInput {
    title?: string;
    subtitle?: string;
    prizeTitle?: string;
    prizeDescription?: string;
    prizeDetails?: string;
    scratchText?: string;
    winBadgeText?: string;
    tryAgainText?: string;
}

export interface GoldenTicketOutput {
    revealed: boolean;
    revealedAt: string;
}
