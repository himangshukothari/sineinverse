'use client';

import { useRouter } from 'next/navigation';
import styles from './library.module.css';

// 4 handpicked ready-made templates
const TEMPLATES = [
    {
        id: 'valentine-classic',
        name: "Valentine's Classic",
        emoji: '💘',
        gradient: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)',
        description: 'The ultimate love card — open the envelope, take a quiz, scratch to reveal, and pop the big question.',
        blocks: [
            { blockType: 'envelope-opening', name: 'Envelope Opening', emoji: '💌', configured: true, inputData: {} },
            { blockType: 'love-quiz', name: 'Love Quiz', emoji: '❓', configured: true, inputData: {} },
            { blockType: 'golden-ticket-reveal', name: 'Golden Ticket', emoji: '🎫', configured: true, inputData: {} },
            { blockType: 'finale-ask', name: 'Finale Ask', emoji: '💍', configured: true, inputData: {} },
        ],
        tags: ['Valentine', 'Romantic', 'Interactive'],
    },
    {
        id: 'birthday-bash',
        name: 'Birthday Bash',
        emoji: '🎂',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
        description: 'Countdown to the big day, spin the wheel for gifts, unwrap surprises, and read a heartfelt letter.',
        blocks: [
            { blockType: 'countdown-timer', name: 'Countdown Timer', emoji: '⏳', configured: true, inputData: {} },
            { blockType: 'slot-machine', name: 'Slot Machine', emoji: '🎰', configured: true, inputData: {} },
            { blockType: 'gift-box-unwrap', name: 'Gift Box Unwrap', emoji: '🎁', configured: true, inputData: {} },
            { blockType: 'love-letter', name: 'Love Letter', emoji: '💌', configured: true, inputData: {} },
        ],
        tags: ['Birthday', 'Fun', 'Surprise'],
    },
    {
        id: 'anniversary-special',
        name: 'Anniversary Special',
        emoji: '💎',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
        description: 'Seal your love with wax, read your fortune together, exchange promises, and reveal memories.',
        blocks: [
            { blockType: 'wax-seal-reveal', name: 'Wax Seal Reveal', emoji: '🔮', configured: true, inputData: {} },
            { blockType: 'fortune-cookie', name: 'Fortune Cookie', emoji: '🥠', configured: true, inputData: {} },
            { blockType: 'promise-cards', name: 'Promise Cards', emoji: '🤝', configured: true, inputData: {} },
            { blockType: 'polaroid-memories', name: 'Polaroid Memories', emoji: '📸', configured: true, inputData: {} },
        ],
        tags: ['Anniversary', 'Elegant', 'Memories'],
    },
    {
        id: 'quick-love-note',
        name: 'Quick Love Note',
        emoji: '💌',
        gradient: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
        description: 'Short and sweet — a beautiful love letter with a love meter to show just how much you care.',
        blocks: [
            { blockType: 'love-letter', name: 'Love Letter', emoji: '💌', configured: true, inputData: {} },
            { blockType: 'love-meter', name: 'Love Meter', emoji: '💕', configured: true, inputData: {} },
        ],
        tags: ['Quick', 'Sweet', 'Simple'],
    },
];

export default function LibraryPage() {
    const router = useRouter();

    const handleUseTemplate = (template: typeof TEMPLATES[0]) => {
        // Save template to localStorage so the lab picks it up
        const labDraft = {
            recipientName: '',
            senderName: '',
            cardBlocks: template.blocks.map(b => ({
                blockType: b.blockType,
                name: b.name,
                emoji: b.emoji,
                configured: b.configured,
                inputData: b.inputData,
            })),
        };
        localStorage.setItem('sineinverse_lab_draft', JSON.stringify(labDraft));
        router.push('/lab');
    };

    return (
        <div className={styles.library}>
            <main className={styles.content}>
                {/* Hero */}
                <div className={styles.hero}>
                    <h1 className={styles.title}>Card Templates</h1>
                    <p className={styles.subtitle}>
                        Handpicked, ready-to-send cards. Pick one, customize it, and send it in minutes.
                    </p>
                </div>

                {/* Template Grid */}
                <div className={styles.grid}>
                    {TEMPLATES.map((tpl) => (
                        <div key={tpl.id} className={styles.card}>
                            {/* Card Header with gradient */}
                            <div className={styles.cardHeader} style={{ background: tpl.gradient }}>
                                <span className={styles.cardEmoji}>{tpl.emoji}</span>
                                <h3 className={styles.cardName}>{tpl.name}</h3>
                            </div>

                            {/* Card Body */}
                            <div className={styles.cardBody}>
                                <p className={styles.cardDesc}>{tpl.description}</p>

                                {/* Block list */}
                                <div className={styles.blockList}>
                                    {tpl.blocks.map((block, i) => (
                                        <div key={i} className={styles.blockChip}>
                                            <span>{block.emoji}</span>
                                            <span>{block.name}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Tags */}
                                <div className={styles.tags}>
                                    {tpl.tags.map((tag) => (
                                        <span key={tag} className={styles.tag}>{tag}</span>
                                    ))}
                                </div>
                            </div>

                            {/* CTA */}
                            <div className={styles.cardFooter}>
                                <button className={styles.useBtn} onClick={() => handleUseTemplate(tpl)}>
                                    Use This Template
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className={styles.bottomCta}>
                    <p>Want full creative control?</p>
                    <button className={styles.buildBtn} onClick={() => router.push('/lab')}>
                        Build From Scratch →
                    </button>
                </div>
            </main>
        </div>
    );
}
