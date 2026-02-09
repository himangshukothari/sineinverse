'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import styles from './lab.module.css';
import { getAllManifests, getBlock } from '@/lib/block-registry';
import { BlockRenderer } from '@/components/BlockRenderer';
import { AuthModal } from '@/components/AuthModal';
import type { BlockManifest, BlockSchema, FormField } from '@/types/blocks';

// Block type for Lab
interface BlockType {
    id: string;
    name: string;
    emoji: string;
    category: string;
    description: string;
}

// Card block instance
interface CardBlock {
    id: string;
    blockType: string;
    name: string;
    emoji: string;
    configured: boolean;
    inputData: Record<string, unknown>;
    schema?: BlockSchema;
}

export default function LabPage() {
    const [recipientName, setRecipientName] = useState('');
    const [senderName, setSenderName] = useState('');
    const [cardBlocks, setCardBlocks] = useState<CardBlock[]>([]);
    const [showBlockPicker, setShowBlockPicker] = useState(false);
    const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);
    const [hoveredBlockIndex, setHoveredBlockIndex] = useState<number | null>(null);
    const [availableBlocks, setAvailableBlocks] = useState<BlockType[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewMode, setPreviewMode] = useState(false);
    const [previewBlockIndex, setPreviewBlockIndex] = useState(0);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const { data: session, status: authStatus } = useSession();



    // Load available blocks from registry
    useEffect(() => {
        async function loadBlocks() {
            try {
                const manifests = await getAllManifests();
                const blocks: BlockType[] = manifests.map(m => ({
                    id: m.id,
                    name: m.name,
                    emoji: m.emoji,
                    category: m.category,
                    description: m.description,
                }));

                // Add placeholder blocks for future implementation
                const placeholders: BlockType[] = [
                    { id: 'intro-envelope', name: 'Envelope Opening', emoji: '✉️', category: 'intro', description: 'Coming soon' },
                    { id: 'wax-seal-reveal', name: 'Wax Seal Reveal', emoji: '🔒', category: 'reveal', description: 'Coming soon' },
                    { id: 'finale-ask', name: 'The Big Question', emoji: '💍', category: 'finale', description: 'Coming soon' },
                ];

                setAvailableBlocks([...blocks, ...placeholders]);
            } catch (error) {
                console.error('Failed to load blocks:', error);
            } finally {
                setLoading(false);
            }
        }
        loadBlocks();
    }, []);

    const addBlock = async (blockType: BlockType) => {
        // Load block schema
        let schema: BlockSchema | undefined;
        try {
            const blockModule = await getBlock(blockType.id);
            if (blockModule) {
                schema = blockModule.schema;
            }
        } catch (e) {
            console.warn('Could not load schema for', blockType.id);
        }

        // Build default input data from schema
        const inputData: Record<string, unknown> = {};
        if (schema) {
            schema.inputFields.forEach(field => {
                if (field.default !== undefined) {
                    inputData[field.key] = field.default;
                }
            });
        }

        const newBlock: CardBlock = {
            id: `${blockType.id}-${Date.now()}`,
            blockType: blockType.id,
            name: blockType.name,
            emoji: blockType.emoji,
            configured: false,
            inputData,
            schema,
        };
        setCardBlocks([...cardBlocks, newBlock]);
        setShowBlockPicker(false);
        setSelectedBlockIndex(cardBlocks.length); // Select the new block
    };

    const removeBlock = (index: number) => {
        setCardBlocks(cardBlocks.filter((_, i) => i !== index));
        if (selectedBlockIndex === index) {
            setSelectedBlockIndex(null);
        } else if (selectedBlockIndex !== null && selectedBlockIndex > index) {
            setSelectedBlockIndex(selectedBlockIndex - 1);
        }
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        const newBlocks = [...cardBlocks];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
        [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
        setCardBlocks(newBlocks);

        if (selectedBlockIndex === index) {
            setSelectedBlockIndex(targetIndex);
        } else if (selectedBlockIndex === targetIndex) {
            setSelectedBlockIndex(index);
        }
    };

    const updateBlockInput = (index: number, key: string, value: unknown) => {
        const newBlocks = [...cardBlocks];
        newBlocks[index].inputData[key] = value;
        setCardBlocks(newBlocks);
    };

    const markConfigured = (index: number) => {
        const newBlocks = [...cardBlocks];
        newBlocks[index].configured = true;
        setCardBlocks(newBlocks);
    };

    const handleStartPreview = () => {
        if (cardBlocks.length > 0) {
            setPreviewBlockIndex(0);
            setPreviewMode(true);
        }
    };

    const handleNextBlock = useCallback(() => {
        if (previewBlockIndex < cardBlocks.length - 1) {
            setPreviewBlockIndex(prev => prev + 1);
        } else {
            setPreviewMode(false);
        }
    }, [previewBlockIndex, cardBlocks.length]);

    const handleBlockComplete = (output: Record<string, unknown>) => {
        console.log('Block completed:', output);
        handleNextBlock();
    };

    // Handle save - requires auth
    const handleSave = async () => {
        // Check if logged in
        if (!session?.user) {
            setShowAuthModal(true);
            return;
        }

        // Validate
        if (cardBlocks.length === 0) {
            alert('Please add at least one block to your card');
            return;
        }
        if (!recipientName.trim()) {
            alert('Please enter a recipient name');
            return;
        }

        setIsSaving(true);
        try {
            const response = await fetch('/api/cards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: `Card for ${recipientName}`,
                    recipientName: recipientName.trim(),
                    senderName: senderName.trim() || session.user.name || '',
                    blocks: cardBlocks.map((b, index) => ({
                        blockId: b.blockType,
                        order: index,
                        input: b.inputData
                    }))
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to save');
            }

            // Success - redirect to account/library
            alert(`Card saved! Slug: ${data.card.slug}`);
            window.location.href = '/account';
        } catch (error) {
            console.error('Failed to save:', error);
            alert('Failed to save card. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // Get selected block
    const selectedBlock = selectedBlockIndex !== null ? cardBlocks[selectedBlockIndex] : null;

    // Render input field based on type
    const renderInputField = (field: FormField, block: CardBlock, blockIndex: number) => {
        const value = block.inputData[field.key] ?? field.default ?? '';

        switch (field.type) {
            case 'text':
                return (
                    <div key={field.key} className={styles.formGroup}>
                        <label>{field.label}{field.required && ' *'}</label>
                        <input
                            type="text"
                            placeholder={field.placeholder}
                            value={value as string}
                            onChange={(e) => updateBlockInput(blockIndex, field.key, e.target.value)}
                            maxLength={field.maxLength}
                        />
                        {field.hint && <small className={styles.hint}>{field.hint}</small>}
                    </div>
                );
            case 'textarea':
                return (
                    <div key={field.key} className={styles.formGroup}>
                        <label>{field.label}{field.required && ' *'}</label>
                        <textarea
                            placeholder={field.placeholder}
                            value={value as string}
                            onChange={(e) => updateBlockInput(blockIndex, field.key, e.target.value)}
                            maxLength={field.maxLength}
                            rows={3}
                        />
                        {field.hint && <small className={styles.hint}>{field.hint}</small>}
                    </div>
                );
            case 'number':
                return (
                    <div key={field.key} className={styles.formGroup}>
                        <label>{field.label}{field.required && ' *'}</label>
                        <input
                            type="number"
                            value={value as number}
                            onChange={(e) => updateBlockInput(blockIndex, field.key, Number(e.target.value))}
                            min={field.min}
                            max={field.max}
                        />
                    </div>
                );
            default:
                return (
                    <div key={field.key} className={styles.formGroup}>
                        <label>{field.label}</label>
                        <input
                            type="text"
                            value={value as string}
                            onChange={(e) => updateBlockInput(blockIndex, field.key, e.target.value)}
                        />
                    </div>
                );
        }
    };

    // Full Preview Mode
    if (previewMode && cardBlocks.length > 0) {
        const currentBlock = cardBlocks[previewBlockIndex];
        return (
            <div className={styles.previewFullscreen}>
                <div className={styles.previewHeader}>
                    <div className={styles.previewProgress}>
                        {cardBlocks.map((_, i) => (
                            <div
                                key={i}
                                className={`${styles.progressDot} ${i === previewBlockIndex ? styles.active : ''} ${i < previewBlockIndex ? styles.done : ''}`}
                            />
                        ))}
                    </div>
                    <button
                        className={styles.exitPreviewBtn}
                        onClick={() => setPreviewMode(false)}
                    >
                        ✕ Exit Preview
                    </button>
                </div>

                <div className={styles.previewContent}>
                    <BlockRenderer
                        blockId={currentBlock.blockType}
                        input={currentBlock.inputData}
                        mode="play"
                        onComplete={handleBlockComplete}
                    />
                </div>

                <div className={styles.previewFooter}>
                    <span>{previewBlockIndex + 1} / {cardBlocks.length}</span>
                    <button
                        className={styles.skipBtn}
                        onClick={handleNextBlock}
                    >
                        Skip →
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.lab}>
            {/* Header */}
            <header className={styles.header}>
                <Link href="/" className={styles.logo}>
                    <img
                        src="/logo.gif"
                        alt="Sine Inverse"
                        width="32"
                        height="32"
                        style={{ borderRadius: '50%' }}
                    />
                    <span>Sine Inverse Lab</span>
                </Link>

                <div className={styles.headerActions}>
                    <button
                        className={styles.previewBtn}
                        disabled={cardBlocks.length === 0}
                        onClick={handleStartPreview}
                    >
                        ▶ Preview
                    </button>
                    <button
                        className={styles.saveBtn}
                        disabled={cardBlocks.length === 0 || isSaving}
                        onClick={handleSave}
                    >
                        {isSaving ? 'Saving...' : 'Save & Continue'}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className={styles.content}>
                {/* Left Panel - Card Info */}
                <aside className={styles.sidebar}>
                    <h2>Card Details</h2>

                    <div className={styles.formGroup}>
                        <label htmlFor="recipient">To (Recipient)</label>
                        <input
                            id="recipient"
                            type="text"
                            placeholder="Their name"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="sender">From (You)</label>
                        <input
                            id="sender"
                            type="text"
                            placeholder="Your name"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                        />
                    </div>

                    <hr className={styles.divider} />

                    <h3>Available Blocks</h3>
                    <div className={styles.blockCategories}>
                        {['intro', 'game', 'puzzle', 'reveal', 'finale'].map((cat) => {
                            const count = availableBlocks.filter(b => b.category === cat).length;
                            if (count === 0) return null;
                            return (
                                <div key={cat} className={styles.category}>
                                    <span className={styles.categoryLabel}>{cat}</span>
                                    <span className={styles.categoryCount}>{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </aside>

                {/* Center Panel - Phone Mockup Gallery */}
                <main className={styles.canvas}>
                    <div className={styles.canvasHeader}>
                        <h2>Your Card Flow</h2>
                        <span className={styles.blockCount}>
                            {cardBlocks.length} block{cardBlocks.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {/* Block Gallery - Phone Mockups */}
                    <div className={styles.phoneGallery}>
                        {cardBlocks.length === 0 ? (
                            <div className={styles.emptyState}>
                                <span className={styles.emptyIcon}>✨</span>
                                <h3>Start building your card</h3>
                                <p>Add blocks to create an interactive experience</p>
                                <button
                                    className={styles.addBlockBtnLarge}
                                    onClick={() => setShowBlockPicker(true)}
                                    disabled={loading}
                                >
                                    {loading ? 'Loading blocks...' : '+ Add First Block'}
                                </button>
                            </div>
                        ) : (
                            <>
                                {cardBlocks.map((block, index) => (
                                    <div
                                        key={block.id}
                                        className={`${styles.phoneMockup} ${selectedBlockIndex === index ? styles.selected : ''} ${hoveredBlockIndex === index ? styles.hovered : ''}`}
                                        onMouseEnter={() => setHoveredBlockIndex(index)}
                                        onMouseLeave={() => setHoveredBlockIndex(null)}
                                        onClick={() => setSelectedBlockIndex(index)}
                                    >
                                        {/* Clean Card Frame */}
                                        <div className={styles.blockCard}>
                                            <div className={styles.blockScreen}>
                                                <BlockRenderer
                                                    blockId={block.blockType}
                                                    input={block.inputData}
                                                    mode={hoveredBlockIndex === index ? 'preview' : 'edit'}
                                                />
                                            </div>
                                        </div>

                                        {/* Block Info Below Phone */}
                                        <div className={styles.phoneLabel}>
                                            <div className={styles.phoneLabelTop}>
                                                <span className={styles.blockNum}>{index + 1}</span>
                                                <span className={styles.blockEmoji}>{block.emoji}</span>
                                                <h4>{block.name}</h4>
                                            </div>
                                            <div className={styles.phoneActions}>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); moveBlock(index, 'up'); }}
                                                    disabled={index === 0}
                                                    title="Move left"
                                                >
                                                    ←
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); moveBlock(index, 'down'); }}
                                                    disabled={index === cardBlocks.length - 1}
                                                    title="Move right"
                                                >
                                                    →
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); removeBlock(index); }}
                                                    className={styles.deleteBtn}
                                                    title="Remove"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Add Block Phone */}
                                <div
                                    className={styles.addPhoneMockup}
                                    onClick={() => setShowBlockPicker(true)}
                                >
                                    <div className={styles.addPhoneFrame}>
                                        <span className={styles.addIcon}>+</span>
                                        <span>Add Block</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </main>

                {/* Right Panel - Block Settings */}
                <aside className={styles.settingsPanel}>
                    {selectedBlock && selectedBlockIndex !== null ? (
                        <>
                            <h2>Configure Block</h2>
                            <p className={styles.settingsHint}>
                                {selectedBlock.emoji} {selectedBlock.name}
                            </p>

                            {selectedBlock.schema ? (
                                <div className={styles.settingsForm}>
                                    {selectedBlock.schema.inputFields.map(field =>
                                        renderInputField(field, selectedBlock, selectedBlockIndex)
                                    )}
                                </div>
                            ) : (
                                <div className={styles.settingsPlaceholder}>
                                    <span>🚧</span>
                                    <p>This block is coming soon!</p>
                                </div>
                            )}

                            <div className={styles.settingsActions}>
                                <button
                                    className={styles.markDoneBtn}
                                    onClick={() => markConfigured(selectedBlockIndex)}
                                >
                                    ✓ Mark as Done
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className={styles.noSelection}>
                            <span>👈</span>
                            <p>Select a block to configure it</p>
                        </div>
                    )}
                </aside>
            </div>

            {/* Block Picker Modal */}
            {showBlockPicker && (
                <div className={styles.modal} onClick={() => setShowBlockPicker(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Add a Block</h2>
                            <button onClick={() => setShowBlockPicker(false)}>✕</button>
                        </div>

                        <div className={styles.blockGrid}>
                            {availableBlocks.map((block) => (
                                <button
                                    key={block.id}
                                    className={`${styles.blockOption} ${block.description === 'Coming soon' ? styles.comingSoon : ''}`}
                                    onClick={() => addBlock(block)}
                                >
                                    <span className={styles.blockOptionIcon}>{block.emoji}</span>
                                    <span className={styles.blockOptionName}>{block.name}</span>
                                    <span className={styles.blockOptionCategory}>{block.category}</span>
                                    {block.description === 'Coming soon' && (
                                        <span className={styles.comingSoonBadge}>Soon</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                message="Sign in to save your card and get a shareable link"
            />
        </div>
    );
}
