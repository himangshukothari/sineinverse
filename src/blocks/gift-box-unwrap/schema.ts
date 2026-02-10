/**
 * GIFT BOX UNWRAP BLOCK - Schema & Manifest
 */
import type { BlockManifest, BlockSchema } from '@/types/blocks';

export const manifest: BlockManifest = {
    id: 'gift-box-unwrap',
    version: '1.0.0',
    name: 'Gift Box Unwrap',
    emoji: '🎁',
    description: 'Tap to unwrap a beautiful gift box and reveal the surprise inside!',
    category: 'reveal',
    occasions: ['valentine', 'anniversary', 'birthday', 'christmas', 'general'],
    tags: ['gift', 'unwrap', 'reveal', 'surprise', 'present'],
    duration: { min: 5, max: 20, unit: 'seconds' },
    assets: { needsImages: false, needsAudio: false },
    customization: { skins: ['classic', 'luxury', 'cute'], defaultSkin: 'classic' },
};

export const schema: BlockSchema = {
    inputFields: [
        { key: 'title', type: 'text', label: 'Title', default: 'You have a gift!', maxLength: 40 },
        { key: 'giftMessage', type: 'textarea', label: 'Gift Message', default: 'Something special just for you! 💕', maxLength: 200 },
        { key: 'giftEmoji', type: 'text', label: 'Gift Emoji/Icon', default: '💝', maxLength: 4 },
        {
            key: 'skin', type: 'select', label: 'Style', default: 'classic', options: [
                { value: 'classic', label: '🎁 Classic Red' },
                { value: 'luxury', label: '✨ Luxury Gold' },
                { value: 'cute', label: '🌸 Cute Pink' },
            ]
        },
    ],
    outputFields: [
        { key: 'unwrapped', label: 'Unwrapped', type: 'boolean' },
        { key: 'unwrappedAt', label: 'Unwrapped At', type: 'datetime' },
    ],
};

export interface GiftBoxInput { title?: string; giftMessage?: string; giftEmoji?: string; skin?: 'classic' | 'luxury' | 'cute'; }
export interface GiftBoxOutput { unwrapped: boolean; unwrappedAt: string; }
