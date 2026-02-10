'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import styles from './lab.module.css';
import { getAllManifests, getBlock } from '@/lib/block-registry';
import { BlockRenderer } from '@/components/BlockRenderer';
import { AuthModal } from '@/components/AuthModal';
import { useToast } from '@/components/Toast';
import type { BlockSchema, FormField } from '@/types/blocks';

interface BlockType {
    id: string;
    name: string;
    emoji: string;
    category: string;
    description: string;
}

interface CardBlock {
    id: string;
    blockType: string;
    name: string;
    emoji: string;
    configured: boolean;
    inputData: Record<string, unknown>;
    schema?: BlockSchema;
}

const LAB_STORAGE_KEY = 'sineinverse_lab_draft';

interface LabDraft {
    recipientName: string;
    senderName: string;
    cardBlocks: Array<{ blockType: string; name: string; emoji: string; configured: boolean; inputData: Record<string, unknown> }>;
    pendingSave?: boolean;
}

function loadDraft(): LabDraft | null {
    try {
        const raw = localStorage.getItem(LAB_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return null;
}

function saveDraft(draft: LabDraft) {
    try { localStorage.setItem(LAB_STORAGE_KEY, JSON.stringify(draft)); } catch { /* ignore */ }
}

function clearDraft() {
    try { localStorage.removeItem(LAB_STORAGE_KEY); } catch { /* ignore */ }
}

// Category metadata
const categoryInfo: Record<string, { label: string; emoji: string; desc: string }> = {
    intro: { label: 'Intro', emoji: '✉️', desc: 'Set the stage — envelope, countdown' },
    game: { label: 'Games', emoji: '🎮', desc: 'Fun interactive mini-games' },
    puzzle: { label: 'Puzzles', emoji: '🧩', desc: 'Brain teasers & challenges' },
    reveal: { label: 'Reveals', emoji: '🎁', desc: 'Hidden surprise moments' },
    finale: { label: 'Finale', emoji: '💍', desc: 'The big moment — ask, promise' },
};

export default function LabPage() {
    const draft = typeof window !== 'undefined' ? loadDraft() : null;

    const [recipientName, setRecipientName] = useState(draft?.recipientName || '');
    const [senderName, setSenderName] = useState(draft?.senderName || '');
    const [cardBlocks, setCardBlocks] = useState<CardBlock[]>(
        draft?.cardBlocks?.map((b) => ({ ...b, id: `${b.blockType}-${Date.now()}-${Math.random()}`, schema: undefined })) || []
    );
    const [showBlockPicker, setShowBlockPicker] = useState(false);
    const [selectedBlockIndex, setSelectedBlockIndex] = useState<number | null>(null);
    const [hoveredBlockIndex, setHoveredBlockIndex] = useState<number | null>(null);
    const [availableBlocks, setAvailableBlocks] = useState<BlockType[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewMode, setPreviewMode] = useState(false);
    const [previewBlockIndex, setPreviewBlockIndex] = useState(0);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [mobileTab, setMobileTab] = useState<'blocks' | 'settings'>('blocks');
    const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
    const [draftRestored, setDraftRestored] = useState(!!draft?.cardBlocks?.length);
    const [pickerSearch, setPickerSearch] = useState('');
    const [pickerCategory, setPickerCategory] = useState<string | null>(null);

    const { data: session } = useSession();
    const { toast } = useToast();

    // Persist to localStorage
    useEffect(() => {
        if (cardBlocks.length === 0 && !recipientName && !senderName) return;
        saveDraft({
            recipientName, senderName,
            cardBlocks: cardBlocks.map((b) => ({
                blockType: b.blockType, name: b.name, emoji: b.emoji,
                configured: b.configured, inputData: b.inputData,
            })),
        });
    }, [recipientName, senderName, cardBlocks]);

    // Re-hydrate schemas
    useEffect(() => {
        if (!draftRestored || loading) return;
        setDraftRestored(false);
        async function rehydrate() {
            const updated = [...cardBlocks];
            for (let i = 0; i < updated.length; i++) {
                if (!updated[i].schema) {
                    try {
                        const mod = await getBlock(updated[i].blockType);
                        if (mod) updated[i] = { ...updated[i], schema: mod.schema };
                    } catch { /* ignore */ }
                }
            }
            setCardBlocks(updated);
            const d = loadDraft();
            if (d?.pendingSave && session?.user) {
                toast('Welcome back! Your card has been restored. Tap Save to continue.', 'info');
            }
        }
        rehydrate();
    }, [draftRestored, loading]);

    // Load blocks
    useEffect(() => {
        async function loadBlocks() {
            try {
                const manifests = await getAllManifests();
                setAvailableBlocks(manifests.map(m => ({
                    id: m.id, name: m.name, emoji: m.emoji,
                    category: m.category, description: m.description,
                })));
            } catch (e) { console.error('Failed to load blocks:', e); }
            finally { setLoading(false); }
        }
        loadBlocks();
    }, []);

    const addBlock = async (blockType: BlockType) => {
        let schema: BlockSchema | undefined;
        try {
            const mod = await getBlock(blockType.id);
            if (mod) schema = mod.schema;
        } catch { /* ignore */ }

        const inputData: Record<string, unknown> = {};
        if (schema) {
            schema.inputFields.forEach(f => {
                if (f.default !== undefined) inputData[f.key] = f.default;
            });
        }

        setCardBlocks([...cardBlocks, {
            id: `${blockType.id}-${Date.now()}`,
            blockType: blockType.id,
            name: blockType.name,
            emoji: blockType.emoji,
            configured: false,
            inputData,
            schema,
        }]);
        setShowBlockPicker(false);
        setSelectedBlockIndex(cardBlocks.length);
        setSettingsPanelOpen(true);
        setMobileTab('settings');
    };

    const removeBlock = (index: number) => {
        setCardBlocks(cardBlocks.filter((_, i) => i !== index));
        if (selectedBlockIndex === index) setSelectedBlockIndex(null);
        else if (selectedBlockIndex !== null && selectedBlockIndex > index) setSelectedBlockIndex(selectedBlockIndex - 1);
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        const newBlocks = [...cardBlocks];
        const target = direction === 'up' ? index - 1 : index + 1;
        if (target < 0 || target >= newBlocks.length) return;
        [newBlocks[index], newBlocks[target]] = [newBlocks[target], newBlocks[index]];
        setCardBlocks(newBlocks);
        if (selectedBlockIndex === index) setSelectedBlockIndex(target);
        else if (selectedBlockIndex === target) setSelectedBlockIndex(index);
    };

    const updateBlockInput = (index: number, key: string, value: unknown) => {
        const nb = [...cardBlocks];
        nb[index].inputData[key] = value;
        setCardBlocks(nb);
    };

    const markConfigured = (index: number) => {
        const nb = [...cardBlocks];
        nb[index].configured = true;
        setCardBlocks(nb);
        toast('Block configured! ✅', 'success');
    };

    const handleStartPreview = () => {
        if (cardBlocks.length > 0) {
            setPreviewBlockIndex(0);
            setPreviewMode(true);
        }
    };

    const handleNextBlock = useCallback(() => {
        if (previewBlockIndex < cardBlocks.length - 1) setPreviewBlockIndex(prev => prev + 1);
        else setPreviewMode(false);
    }, [previewBlockIndex, cardBlocks.length]);

    const handleBlockComplete = (output: Record<string, unknown>) => {
        console.log('Block completed:', output);
        handleNextBlock();
    };

    const handleSave = async () => {
        if (!session?.user) {
            saveDraft({
                recipientName, senderName,
                cardBlocks: cardBlocks.map(b => ({
                    blockType: b.blockType, name: b.name, emoji: b.emoji,
                    configured: b.configured, inputData: b.inputData,
                })),
                pendingSave: true,
            });
            setShowAuthModal(true);
            return;
        }
        if (cardBlocks.length === 0) { toast('Add at least one block to your card', 'error'); return; }
        if (!recipientName.trim()) { toast('Please enter a recipient name', 'error'); return; }

        setIsSaving(true);
        try {
            const response = await fetch('/api/cards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: `Card for ${recipientName}`,
                    recipientName: recipientName.trim(),
                    senderName: senderName.trim() || session.user.name || '',
                    blocks: cardBlocks.map((b, i) => ({ blockId: b.blockType, order: i, input: b.inputData }))
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to save');
            clearDraft();
            toast('Card saved! Redirecting...', 'success');
            setTimeout(() => { window.location.href = '/account'; }, 1500);
        } catch (error) {
            console.error('Failed to save:', error);
            toast('Failed to save card. Please try again.', 'error');
        } finally { setIsSaving(false); }
    };

    const selectedBlock = selectedBlockIndex !== null ? cardBlocks[selectedBlockIndex] : null;

    const renderInputField = (field: FormField, block: CardBlock, blockIndex: number) => {
        const value = block.inputData[field.key] ?? field.default ?? '';
        switch (field.type) {
            case 'text':
                return (
                    <div key={field.key} className={styles.formGroup}>
                        <label>{field.label}{field.required && ' *'}</label>
                        <input type="text" placeholder={field.placeholder} value={value as string}
                            onChange={(e) => updateBlockInput(blockIndex, field.key, e.target.value)}
                            maxLength={field.maxLength} />
                        {field.hint && <small className={styles.hint}>{field.hint}</small>}
                    </div>
                );
            case 'textarea':
                return (
                    <div key={field.key} className={styles.formGroup}>
                        <label>{field.label}{field.required && ' *'}</label>
                        <textarea placeholder={field.placeholder} value={value as string}
                            onChange={(e) => updateBlockInput(blockIndex, field.key, e.target.value)}
                            maxLength={field.maxLength} rows={3} />
                        {field.hint && <small className={styles.hint}>{field.hint}</small>}
                    </div>
                );
            case 'number':
                return (
                    <div key={field.key} className={styles.formGroup}>
                        <label>{field.label}{field.required && ' *'}</label>
                        <input type="number" value={value as number}
                            onChange={(e) => updateBlockInput(blockIndex, field.key, Number(e.target.value))}
                            min={field.min} max={field.max} />
                    </div>
                );
            default:
                return (
                    <div key={field.key} className={styles.formGroup}>
                        <label>{field.label}</label>
                        <input type="text" value={value as string}
                            onChange={(e) => updateBlockInput(blockIndex, field.key, e.target.value)} />
                    </div>
                );
        }
    };

    // Filtered blocks for picker
    const filteredBlocks = availableBlocks.filter(b => {
        if (pickerCategory && b.category !== pickerCategory) return false;
        if (pickerSearch && !b.name.toLowerCase().includes(pickerSearch.toLowerCase())) return false;
        return true;
    });

    // =============== PREVIEW MODE ===============
    if (previewMode && cardBlocks.length > 0) {
        const currentBlock = cardBlocks[previewBlockIndex];
        return (
            <div className={styles.previewFullscreen}>
                <div className={styles.previewHeader}>
                    <div className={styles.previewProgress}>
                        {cardBlocks.map((_, i) => (
                            <div key={i} className={`${styles.progressDot} ${i === previewBlockIndex ? styles.active : ''} ${i < previewBlockIndex ? styles.done : ''}`} />
                        ))}
                    </div>
                    <button className={styles.exitPreviewBtn} onClick={() => setPreviewMode(false)}>✕ Exit</button>
                </div>
                <div className={styles.previewContent}>
                    <BlockRenderer blockId={currentBlock.blockType} input={currentBlock.inputData} mode="play" onComplete={handleBlockComplete} />
                </div>
                <div className={styles.previewFooter}>
                    <span>{previewBlockIndex + 1} / {cardBlocks.length}</span>
                    <button className={styles.skipBtn} onClick={handleNextBlock}>Skip →</button>
                </div>
            </div>
        );
    }

    // =============== MAIN LAB UI ===============
    return (
        <div className={styles.lab}>
            {/* ===== Header ===== */}
            <header className={styles.header}>
                <Link href="/" className={styles.logo}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span>Card Builder</span>
                </Link>

                <div className={styles.headerCenter}>
                    <div className={styles.nameInputs}>
                        <div className={styles.nameField}>
                            <label>To</label>
                            <input type="text" placeholder="Their name" value={recipientName}
                                onChange={(e) => setRecipientName(e.target.value)} />
                        </div>
                        <span className={styles.nameSep}>→</span>
                        <div className={styles.nameField}>
                            <label>From</label>
                            <input type="text" placeholder="Your name" value={senderName}
                                onChange={(e) => setSenderName(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className={styles.headerActions}>
                    <button className={styles.previewBtn} disabled={cardBlocks.length === 0} onClick={handleStartPreview}>
                        ▶ Preview
                    </button>
                    <button className={styles.saveBtn} disabled={cardBlocks.length === 0 || isSaving} onClick={handleSave}>
                        {isSaving ? 'Saving...' : '💾 Save'}
                    </button>
                </div>
            </header>

            {/* ===== Mobile Tab Bar ===== */}
            <div className={styles.mobileTabBar}>
                <button className={`${styles.mobileTab} ${mobileTab === 'blocks' ? styles.activeTab : ''}`}
                    onClick={() => { setMobileTab('blocks'); setSettingsPanelOpen(false); }}>
                    🧩 Card Flow
                </button>
                <button className={`${styles.mobileTab} ${mobileTab === 'settings' ? styles.activeTab : ''}`}
                    onClick={() => { setMobileTab('settings'); setSettingsPanelOpen(true); }}>
                    ⚙️ Configure
                </button>
            </div>

            {/* ===== Mobile Name Inputs ===== */}
            <div className={styles.mobileNameInputs}>
                <div className={styles.nameField}>
                    <label>To</label>
                    <input type="text" placeholder="Their name" value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)} />
                </div>
                <span className={styles.nameSep}>→</span>
                <div className={styles.nameField}>
                    <label>From</label>
                    <input type="text" placeholder="Your name" value={senderName}
                        onChange={(e) => setSenderName(e.target.value)} />
                </div>
            </div>

            {/* ===== Main Content ===== */}
            <div className={styles.content}>
                {/* ===== CENTER: Card Flow ===== */}
                <main className={`${styles.canvas} ${mobileTab === 'blocks' ? styles.mobileShow : ''}`}>
                    <div className={styles.canvasHeader}>
                        <h2>Your Card Flow</h2>
                        <div className={styles.canvasHeaderRight}>
                            <span className={styles.blockCount}>
                                {cardBlocks.length} block{cardBlocks.length !== 1 ? 's' : ''}
                            </span>
                            <button className={styles.addBlockInline} onClick={() => setShowBlockPicker(true)} disabled={loading}>
                                + Add Block
                            </button>
                        </div>
                    </div>

                    <div className={styles.phoneGallery}>
                        {cardBlocks.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyVisual}>
                                    <span>🧩</span>
                                    <span>🎡</span>
                                    <span>💌</span>
                                </div>
                                <h3>Build your interactive card</h3>
                                <p>Add game blocks — quizzes, scratch cards, spin wheels & more</p>
                                <button className={styles.addBlockBtnLarge} onClick={() => setShowBlockPicker(true)} disabled={loading}>
                                    {loading ? 'Loading...' : '+ Add Your First Block'}
                                </button>
                            </div>
                        ) : (
                            <>
                                {cardBlocks.map((block, index) => (
                                    <div key={block.id}
                                        className={`${styles.phoneMockup} ${selectedBlockIndex === index ? styles.selected : ''}`}
                                        onMouseEnter={() => setHoveredBlockIndex(index)}
                                        onMouseLeave={() => setHoveredBlockIndex(null)}
                                        onClick={() => { setSelectedBlockIndex(index); setSettingsPanelOpen(true); setMobileTab('settings'); }}
                                    >
                                        <div className={styles.blockCard}>
                                            <div className={styles.blockScreen}>
                                                <BlockRenderer blockId={block.blockType} input={block.inputData}
                                                    mode={hoveredBlockIndex === index ? 'preview' : 'edit'} />
                                            </div>
                                        </div>

                                        <div className={styles.phoneLabel}>
                                            <div className={styles.phoneLabelTop}>
                                                <span className={styles.blockNum}>{index + 1}</span>
                                                <span className={styles.blockEmoji}>{block.emoji}</span>
                                                <h4>{block.name}</h4>
                                                {block.configured && <span className={styles.doneCheck}>✓</span>}
                                            </div>
                                            <div className={styles.phoneActions}>
                                                <button onClick={(e) => { e.stopPropagation(); moveBlock(index, 'up'); }}
                                                    disabled={index === 0} title="Move left">←</button>
                                                <button onClick={(e) => { e.stopPropagation(); moveBlock(index, 'down'); }}
                                                    disabled={index === cardBlocks.length - 1} title="Move right">→</button>
                                                <button onClick={(e) => { e.stopPropagation(); removeBlock(index); }}
                                                    className={styles.deleteBtn} title="Remove">✕</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Add Block Card */}
                                <div className={styles.addPhoneMockup} onClick={() => setShowBlockPicker(true)}>
                                    <div className={styles.addPhoneFrame}>
                                        <span className={styles.addIcon}>+</span>
                                        <span>Add Block</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </main>

                {/* ===== RIGHT: Settings Panel ===== */}
                <aside className={`${styles.settingsPanel} ${settingsPanelOpen ? styles.open : ''} ${mobileTab === 'settings' ? styles.mobileShow : ''}`}>
                    {selectedBlock && selectedBlockIndex !== null ? (
                        <>
                            <div className={styles.settingsHead}>
                                <div className={styles.settingsBlockInfo}>
                                    <span className={styles.settingsEmoji}>{selectedBlock.emoji}</span>
                                    <div>
                                        <h2>Configure Block</h2>
                                        <p className={styles.settingsHint}>{selectedBlock.name}</p>
                                    </div>
                                </div>
                                <button className={styles.settingsClose}
                                    onClick={() => { setSettingsPanelOpen(false); setMobileTab('blocks'); }}>✕</button>
                            </div>

                            {selectedBlock.schema ? (
                                <div className={styles.settingsForm}>
                                    {selectedBlock.schema.inputFields.map(field =>
                                        renderInputField(field, selectedBlock, selectedBlockIndex)
                                    )}
                                </div>
                            ) : (
                                <div className={styles.settingsPlaceholder}>
                                    <span>🚧</span>
                                    <p>Schema coming soon!</p>
                                </div>
                            )}

                            <div className={styles.settingsActions}>
                                <button className={styles.markDoneBtn}
                                    onClick={() => markConfigured(selectedBlockIndex)}>
                                    ✓ Mark as Done
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className={styles.noSelection}>
                            <span>👈</span>
                            <h3>Select a block</h3>
                            <p>Tap a block in your card flow to configure it</p>
                        </div>
                    )}
                </aside>
            </div>

            {/* ===== Block Picker Modal ===== */}
            {showBlockPicker && (
                <div className={styles.modal} onClick={() => { setShowBlockPicker(false); setPickerSearch(''); setPickerCategory(null); }}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Add a Block</h2>
                            <button onClick={() => { setShowBlockPicker(false); setPickerSearch(''); setPickerCategory(null); }}>✕</button>
                        </div>

                        {/* Search */}
                        <div className={styles.modalSearch}>
                            <input type="text" placeholder="Search blocks..."
                                value={pickerSearch} onChange={(e) => setPickerSearch(e.target.value)} />
                        </div>

                        {/* Category Pills */}
                        <div className={styles.modalCategories}>
                            <button className={`${styles.catPill} ${!pickerCategory ? styles.catPillActive : ''}`}
                                onClick={() => setPickerCategory(null)}>All</button>
                            {Object.entries(categoryInfo).map(([key, info]) => (
                                <button key={key}
                                    className={`${styles.catPill} ${pickerCategory === key ? styles.catPillActive : ''}`}
                                    onClick={() => setPickerCategory(key)}>
                                    {info.emoji} {info.label}
                                </button>
                            ))}
                        </div>

                        {/* Block Grid */}
                        <div className={styles.blockGrid}>
                            {filteredBlocks.map((block) => (
                                <button key={block.id} className={styles.blockOption} onClick={() => addBlock(block)}>
                                    <span className={styles.blockOptionIcon}>{block.emoji}</span>
                                    <span className={styles.blockOptionName}>{block.name}</span>
                                    <span className={styles.blockOptionDesc}>{block.description}</span>
                                </button>
                            ))}
                            {filteredBlocks.length === 0 && (
                                <div className={styles.noResults}>
                                    <p>No blocks match &ldquo;{pickerSearch}&rdquo;</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Auth Modal */}
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)}
                message="Sign in to save your card and get a shareable link" />
        </div>
    );
}
