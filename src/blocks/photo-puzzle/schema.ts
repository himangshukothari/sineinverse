import type { BlockManifest, BlockSchema } from '@/types/blocks';

export const manifest: BlockManifest = {
    id: 'photo-puzzle',
    version: '1.0.0',
    name: 'Photo Puzzle',
    emoji: '🧩',
    description: 'Unscramble the emoji tiles to reveal the hidden pattern!',
    category: 'puzzle',
    occasions: ['valentine', 'anniversary', 'birthday', 'general'],
    tags: ['puzzle', 'tiles', 'sliding', 'game', 'brain'],
    duration: { min: 30, max: 120, unit: 'seconds' },
    assets: { needsImages: false, needsAudio: false },
    customization: { skins: ['classic', 'neon', 'warm'], defaultSkin: 'classic' },
};

export const schema: BlockSchema = {
    inputFields: [
        { key: 'title', type: 'text', label: 'Title', default: 'Solve the Puzzle!', maxLength: 40 },
        { key: 'winMessage', type: 'text', label: 'Win Message', default: 'You solved it! 🎉', maxLength: 60 },
        {
            key: 'skin', type: 'select', label: 'Style', default: 'classic', options: [
                { value: 'classic', label: '🧩 Classic' },
                { value: 'neon', label: '💜 Neon' },
                { value: 'warm', label: '🌸 Warm' },
            ]
        },
    ],
    outputFields: [
        { key: 'solved', label: 'Solved', type: 'boolean' },
        { key: 'moves', label: 'Moves', type: 'number' },
    ],
};

export interface PhotoPuzzleInput { title?: string; winMessage?: string; skin?: 'classic' | 'neon' | 'warm'; }
export interface PhotoPuzzleOutput { solved: boolean; moves: number; }
