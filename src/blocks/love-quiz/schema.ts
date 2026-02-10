/**
 * LOVE QUIZ BLOCK - Schema & Manifest
 */
import type { BlockManifest, BlockSchema } from '@/types/blocks';

export const manifest: BlockManifest = {
    id: 'love-quiz',
    version: '1.0.0',
    name: 'Love Quiz',
    emoji: '❓',
    description: 'How well do they know you? A fun interactive quiz about your relationship.',
    category: 'game',
    occasions: ['valentine', 'anniversary', 'birthday', 'general'],
    tags: ['quiz', 'trivia', 'couples', 'questions', 'game'],
    duration: { min: 30, max: 120, unit: 'seconds' },
    assets: { needsImages: false, needsAudio: false },
    customization: { skins: ['romantic', 'neon', 'pastel'], defaultSkin: 'romantic' },
};

export const schema: BlockSchema = {
    inputFields: [
        { key: 'title', type: 'text', label: 'Quiz Title', default: 'How Well Do You Know Me?', maxLength: 50 },
        { key: 'q1', type: 'text', label: 'Question 1', default: 'What is my favorite food?', maxLength: 100 },
        { key: 'q1a', type: 'text', label: 'Q1 - Correct Answer', default: 'Pizza', maxLength: 40 },
        { key: 'q1b', type: 'text', label: 'Q1 - Wrong Answer 1', default: 'Sushi', maxLength: 40 },
        { key: 'q1c', type: 'text', label: 'Q1 - Wrong Answer 2', default: 'Tacos', maxLength: 40 },
        { key: 'q2', type: 'text', label: 'Question 2', default: 'What is my dream vacation?', maxLength: 100 },
        { key: 'q2a', type: 'text', label: 'Q2 - Correct Answer', default: 'Paris', maxLength: 40 },
        { key: 'q2b', type: 'text', label: 'Q2 - Wrong Answer 1', default: 'Tokyo', maxLength: 40 },
        { key: 'q2c', type: 'text', label: 'Q2 - Wrong Answer 2', default: 'Maldives', maxLength: 40 },
        { key: 'q3', type: 'text', label: 'Question 3', default: 'What makes me laugh the most?', maxLength: 100 },
        { key: 'q3a', type: 'text', label: 'Q3 - Correct Answer', default: 'Dad jokes', maxLength: 40 },
        { key: 'q3b', type: 'text', label: 'Q3 - Wrong Answer 1', default: 'Cat videos', maxLength: 40 },
        { key: 'q3c', type: 'text', label: 'Q3 - Wrong Answer 2', default: 'Memes', maxLength: 40 },
        { key: 'q4', type: 'text', label: 'Question 4', default: 'My love language is...', maxLength: 100 },
        { key: 'q4a', type: 'text', label: 'Q4 - Correct Answer', default: 'Quality time', maxLength: 40 },
        { key: 'q4b', type: 'text', label: 'Q4 - Wrong Answer 1', default: 'Gifts', maxLength: 40 },
        { key: 'q4c', type: 'text', label: 'Q4 - Wrong Answer 2', default: 'Words', maxLength: 40 },
        { key: 'perfectMsg', type: 'text', label: 'Perfect Score Message', default: 'You know me so well! 💕', maxLength: 60 },
        { key: 'goodMsg', type: 'text', label: 'Good Score Message', default: 'Pretty close! We need more dates 😘', maxLength: 60 },
        {
            key: 'skin', type: 'select', label: 'Style', default: 'romantic', options: [
                { value: 'romantic', label: '❤️ Romantic' },
                { value: 'neon', label: '💜 Neon' },
                { value: 'pastel', label: '🌸 Pastel' },
            ]
        },
    ],
    outputFields: [
        { key: 'score', label: 'Score', type: 'number' },
        { key: 'total', label: 'Total', type: 'number' },
        { key: 'playedAt', label: 'Played At', type: 'datetime' },
    ],
};

export interface LoveQuizInput {
    title?: string;
    q1?: string; q1a?: string; q1b?: string; q1c?: string;
    q2?: string; q2a?: string; q2b?: string; q2c?: string;
    q3?: string; q3a?: string; q3b?: string; q3c?: string;
    q4?: string; q4a?: string; q4b?: string; q4c?: string;
    perfectMsg?: string; goodMsg?: string;
    skin?: 'romantic' | 'neon' | 'pastel';
}

export interface LoveQuizOutput { score: number; total: number; playedAt: string; }
