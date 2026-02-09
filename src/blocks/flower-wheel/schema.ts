/**
 * FLOWER WHEEL BLOCK - Schema & Manifest
 * 
 * A spinning flower petal wheel game where each petal reveals a surprise message.
 * User can configure up to 8 petals with custom text and messages.
 */

import type { BlockManifest, BlockSchema } from '@/types/blocks';

// ============ MANIFEST ============
export const manifest: BlockManifest = {
    id: 'flower-wheel',
    version: '1.0.0',
    name: 'Flower Wheel',
    emoji: '🌸',
    description: 'A spinning flower where each petal holds a surprise! Spin to reveal a special message.',

    category: 'game',
    occasions: ['valentine', 'anniversary', 'birthday', 'general'],
    tags: ['spin', 'wheel', 'flower', 'surprise', 'romantic'],

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
        skins: ['rose', 'spring', 'sunset'],
        defaultSkin: 'rose',
    },
};

// ============ SCHEMA ============
export const schema: BlockSchema = {
    inputFields: [
        {
            key: 'title',
            type: 'text',
            label: 'Title',
            placeholder: "Valentine's Surprise",
            required: true,
            default: "Valentine's Surprise",
            maxLength: 40,
        },
        {
            key: 'subtitle',
            type: 'text',
            label: 'Subtitle',
            placeholder: 'Spin the flower to reveal your gift',
            default: 'Spin the flower to reveal your gift',
            maxLength: 60,
        },
        {
            key: 'petal1Text',
            type: 'text',
            label: 'Petal 1 - Label',
            placeholder: 'Dinner Date',
            required: true,
            maxLength: 20,
        },
        {
            key: 'petal1Message',
            type: 'textarea',
            label: 'Petal 1 - Message',
            placeholder: 'A romantic candlelight dinner tonight!',
            maxLength: 100,
        },
        {
            key: 'petal2Text',
            type: 'text',
            label: 'Petal 2 - Label',
            placeholder: 'Massage',
            required: true,
            maxLength: 20,
        },
        {
            key: 'petal2Message',
            type: 'textarea',
            label: 'Petal 2 - Message',
            placeholder: 'A relaxing 30-minute massage.',
            maxLength: 100,
        },
        {
            key: 'petal3Text',
            type: 'text',
            label: 'Petal 3 - Label',
            placeholder: 'Movie Night',
            required: true,
            maxLength: 20,
        },
        {
            key: 'petal3Message',
            type: 'textarea',
            label: 'Petal 3 - Message',
            placeholder: 'You pick the movie, I bring the popcorn.',
            maxLength: 100,
        },
        {
            key: 'petal4Text',
            type: 'text',
            label: 'Petal 4 - Label',
            placeholder: 'Breakfast in Bed',
            required: true,
            maxLength: 20,
        },
        {
            key: 'petal4Message',
            type: 'textarea',
            label: 'Petal 4 - Message',
            placeholder: 'Sleep in, I\'ll handle breakfast.',
            maxLength: 100,
        },
        {
            key: 'petal5Text',
            type: 'text',
            label: 'Petal 5 - Label',
            placeholder: 'Love Letter',
            maxLength: 20,
        },
        {
            key: 'petal5Message',
            type: 'textarea',
            label: 'Petal 5 - Message',
            placeholder: 'A handwritten letter, just for you.',
            maxLength: 100,
        },
        {
            key: 'petal6Text',
            type: 'text',
            label: 'Petal 6 - Label',
            placeholder: 'Sweet Treat',
            maxLength: 20,
        },
        {
            key: 'petal6Message',
            type: 'textarea',
            label: 'Petal 6 - Message',
            placeholder: 'We\'re going out for dessert!',
            maxLength: 100,
        },
        {
            key: 'petal7Text',
            type: 'text',
            label: 'Petal 7 - Label',
            placeholder: 'Stargazing',
            maxLength: 20,
        },
        {
            key: 'petal7Message',
            type: 'textarea',
            label: 'Petal 7 - Message',
            placeholder: 'A quiet night under the stars.',
            maxLength: 100,
        },
        {
            key: 'petal8Text',
            type: 'text',
            label: 'Petal 8 - Label',
            placeholder: 'Wildcard',
            maxLength: 20,
        },
        {
            key: 'petal8Message',
            type: 'textarea',
            label: 'Petal 8 - Message',
            placeholder: 'Your wish is my command!',
            maxLength: 100,
        },
        {
            key: 'buttonText',
            type: 'text',
            label: 'Button Text',
            default: 'Pick a Petal',
            maxLength: 20,
        },
        {
            key: 'acceptButtonText',
            type: 'text',
            label: 'Accept Button Text',
            default: 'Accept with Love',
            maxLength: 25,
        },
    ],

    outputFields: [
        { key: 'selectedPetal', label: 'Selected Petal', type: 'string' },
        { key: 'selectedMessage', label: 'Selected Message', type: 'string' },
        { key: 'playedAt', label: 'Played At', type: 'datetime' },
    ],
};

// ============ INPUT TYPE ============
export interface FlowerWheelInput {
    title?: string;
    subtitle?: string;
    petal1Text?: string;
    petal1Message?: string;
    petal2Text?: string;
    petal2Message?: string;
    petal3Text?: string;
    petal3Message?: string;
    petal4Text?: string;
    petal4Message?: string;
    petal5Text?: string;
    petal5Message?: string;
    petal6Text?: string;
    petal6Message?: string;
    petal7Text?: string;
    petal7Message?: string;
    petal8Text?: string;
    petal8Message?: string;
    buttonText?: string;
    acceptButtonText?: string;
}

export interface FlowerWheelOutput {
    selectedPetal: string;
    selectedMessage: string;
    playedAt: string;
}
