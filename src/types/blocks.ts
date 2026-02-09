/**
 * BLOCK TYPES
 * Core type definitions for the block system
 */

// ============ BLOCK MANIFEST ============
export interface BlockManifest {
    id: string;
    version: string;
    name: string;
    emoji: string;
    description: string;

    category: BlockCategory;
    occasions: Occasion[];
    tags: string[];

    duration: {
        min: number;
        max: number;
        unit: 'seconds' | 'minutes';
    };

    assets: {
        needsImages: boolean;
        imageCount?: number;
        needsAudio: boolean;
    };

    customization: {
        skins: string[];
        defaultSkin: string;
    };
}

export type BlockCategory =
    | 'intro'      // Welcome/opening
    | 'puzzle'     // Interactive challenges
    | 'reveal'     // Scratch/unwrap
    | 'game'       // Spin/choose
    | 'message'    // Text/poetry
    | 'finale'     // Ending/proposal
    | 'gift';      // Gift code reveal

export type Occasion =
    | 'valentine'
    | 'anniversary'
    | 'birthday'
    | 'christmas'
    | 'wedding'
    | 'general';

// ============ BLOCK COMPONENT PROPS ============
export interface BlockProps<TInput = Record<string, unknown>, TOutput = Record<string, unknown>> {
    input: TInput;
    onComplete: (output: TOutput) => void;
    mode: 'preview' | 'play';
    recipientName?: string;
    senderName?: string;
}

// ============ BLOCK SCHEMA ============
export interface FormField {
    key: string;
    type: 'text' | 'textarea' | 'number' | 'image-upload' | 'select' | 'select-visual';
    label: string;
    hint?: string;
    placeholder?: string;
    required?: boolean;
    default?: unknown;

    // For image-upload
    count?: number;
    accept?: string;
    maxSize?: string;

    // For select
    options?: Array<{
        value: string;
        label: string;
        preview?: string;
    }>;

    // Validation
    maxLength?: number;
    min?: number;
    max?: number;
}

export interface BlockSchema {
    inputFields: FormField[];
    outputFields: Array<{
        key: string;
        label: string;
        type: 'string' | 'number' | 'boolean' | 'datetime';
    }>;
}

// ============ CARD TYPES ============
export interface Card {
    id: string;
    userId: string;
    slug: string;
    title: string;

    recipientName: string;
    senderName: string;

    games: CardGame[];

    status: 'draft' | 'paid' | 'sent';
    createdAt: string;
    paidAt?: string;
    sentAt?: string;
}

export interface CardGame {
    blockId: string;
    order: number;
    input: Record<string, unknown>;
    skin?: string;
}

// ============ GAME OUTPUT ============
export interface GameOutput {
    id: string;
    cardId: string;
    blockId: string;
    output: Record<string, unknown>;
    playedAt: string;
}
