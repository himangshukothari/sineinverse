'use client';

import { useState, useEffect, useMemo } from 'react';

interface AdminCard {
    id: string;
    slug: string;
    recipient_name: string;
    sender_name: string;
    user_email: string | null;
    status: string;
    paid_at: string | null;
    expires_at: string | null;
    transaction_id: string | null;
    created_at: string;
}

type PaymentMode = 'disabled' | 'qr' | 'phonepe';

export default function AdminPage() {
    const [password, setPassword] = useState(() => {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem('admin_password') || '';
        }
        return '';
    });
    const [authenticated, setAuthenticated] = useState(false);
    const [paymentMode, setPaymentMode] = useState<PaymentMode>('disabled');
    const [qrImageUrl, setQrImageUrl] = useState('');
    const [qrInput, setQrInput] = useState('');
    const [upiId, setUpiId] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('143');
    const [contactEmail, setContactEmail] = useState('');
    const [cards, setCards] = useState<AdminCard[]>([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const showToast = (msg: string) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 3000);
    };

    const headers = () => ({
        'Content-Type': 'application/json',
        'x-admin-password': password,
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin', { headers: { 'x-admin-password': password } });
            if (!res.ok) throw new Error('Unauthorized');
            const data = await res.json();
            setAuthenticated(true);
            sessionStorage.setItem('admin_password', password);
            setPaymentMode(data.paymentMode || 'disabled');
            setQrImageUrl(data.qrImageUrl || '');
            setQrInput(data.qrImageUrl || '');
            setUpiId(data.upiId || '');
            setPaymentAmount(data.paymentAmount || '143');
            setContactEmail(data.contactEmail || '');
            setCards(data.cards || []);
        } catch {
            sessionStorage.removeItem('admin_password');
            showToast('❌ Invalid password');
        } finally {
            setLoading(false);
        }
    };

    // Auto-login on mount if password is saved in sessionStorage
    useEffect(() => {
        if (password && !authenticated) {
            loadData();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        loadData();
    };

    const handleSetMode = async (mode: PaymentMode) => {
        try {
            const res = await fetch('/api/admin', {
                method: 'POST', headers: headers(),
                body: JSON.stringify({ action: 'set_payment_mode', mode }),
            });
            if (res.ok) {
                setPaymentMode(mode);
                showToast(`✅ Payment mode: ${mode.toUpperCase()}`);
            }
        } catch { showToast('❌ Failed to update mode'); }
    };

    const handleUploadQr = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast('❌ Please select an image file');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            showToast('❌ Image too large. Max 2MB.');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                headers: { 'x-admin-password': password },
                body: formData,
            });
            const data = await res.json();
            if (res.ok && data.qrImageUrl) {
                setQrImageUrl(data.qrImageUrl);
                setQrInput(data.qrImageUrl);
                showToast('✅ QR image uploaded!');
            } else {
                showToast(`❌ ${data.error || 'Upload failed'}`);
            }
        } catch { showToast('❌ Upload failed'); }
        finally { setLoading(false); }
    };

    const handleSaveQrUrl = async () => {
        if (!qrInput.trim()) { showToast('Enter a QR image URL'); return; }
        try {
            const res = await fetch('/api/admin', {
                method: 'POST', headers: headers(),
                body: JSON.stringify({ action: 'set_qr_image', url: qrInput.trim() }),
            });
            if (res.ok) {
                setQrImageUrl(qrInput.trim());
                showToast('✅ QR image saved');
            }
        } catch { showToast('❌ Failed to save QR'); }
    };

    const handleSaveUpi = async () => {
        try {
            const res = await fetch('/api/admin', {
                method: 'POST', headers: headers(),
                body: JSON.stringify({ action: 'set_upi_id', upiId }),
            });
            if (res.ok) showToast('✅ UPI ID saved');
        } catch { showToast('❌ Failed'); }
    };

    const handleSaveAmount = async () => {
        try {
            const res = await fetch('/api/admin', {
                method: 'POST', headers: headers(),
                body: JSON.stringify({ action: 'set_payment_amount', amount: paymentAmount }),
            });
            if (res.ok) showToast('✅ Amount saved');
        } catch { showToast('❌ Failed'); }
    };

    const handleSaveEmail = async () => {
        try {
            const res = await fetch('/api/admin', {
                method: 'POST', headers: headers(),
                body: JSON.stringify({ action: 'set_contact_email', email: contactEmail }),
            });
            if (res.ok) showToast('✅ Contact email saved');
        } catch { showToast('❌ Failed'); }
    };
    const handleMarkPaid = async (cardId: string) => {
        try {
            const res = await fetch('/api/admin', {
                method: 'POST', headers: headers(),
                body: JSON.stringify({ action: 'mark_paid', cardId }),
            });
            if (res.ok) {
                showToast('✅ Card activated');
                loadData();
            }
        } catch { showToast('❌ Failed'); }
    };

    const handleMarkUnpaid = async (cardId: string) => {
        try {
            const res = await fetch('/api/admin', {
                method: 'POST', headers: headers(),
                body: JSON.stringify({ action: 'mark_unpaid', cardId }),
            });
            if (res.ok) {
                showToast('✅ Card deactivated');
                loadData();
            }
        } catch { showToast('❌ Failed'); }
    };

    const isExpired = (expiresAt: string | null) => {
        if (!expiresAt) return false;
        return new Date(expiresAt) < new Date();
    };

    // Short ID for display (first 8 chars of UUID)
    const shortId = (id: string) => id.slice(0, 8).toUpperCase();

    // Search filter
    const filteredCards = useMemo(() => {
        if (!searchQuery.trim()) return cards;
        const q = searchQuery.toLowerCase();
        return cards.filter(c =>
            c.slug.toLowerCase().includes(q) ||
            c.id.toLowerCase().includes(q) ||
            shortId(c.id).toLowerCase().includes(q) ||
            c.recipient_name.toLowerCase().includes(q) ||
            c.sender_name.toLowerCase().includes(q) ||
            (c.user_email || '').toLowerCase().includes(q) ||
            (c.transaction_id || '').toLowerCase().includes(q)
        );
    }, [cards, searchQuery]);

    // ── Login Screen ──────────────────────────────
    if (!authenticated) {
        return (
            <div style={s.page}>
                <div style={s.loginCard}>
                    <h1 style={s.loginTitle}>🔐 Admin Panel</h1>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            placeholder="Enter admin password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={s.input}
                            autoFocus
                        />
                        <button type="submit" style={s.primaryBtn} disabled={loading}>
                            {loading ? 'Checking...' : 'Login'}
                        </button>
                    </form>
                    {message && <div style={s.toast}>{message}</div>}
                </div>
            </div>
        );
    }

    // ── Admin Dashboard ───────────────────────────
    return (
        <div style={s.page}>
            <div style={s.container}>
                <h1 style={s.title}>⚙️ Admin Panel</h1>

                {message && <div style={s.toast}>{message}</div>}

                {/* ── Payment Mode ─────────────────── */}
                <div style={s.section}>
                    <h2 style={s.sectionTitle}>Payment Mode</h2>
                    <div style={s.modeGrid}>
                        {(['disabled', 'qr', 'phonepe'] as PaymentMode[]).map(mode => (
                            <button
                                key={mode}
                                onClick={() => handleSetMode(mode)}
                                style={{
                                    ...s.modeBtn,
                                    ...(paymentMode === mode ? s.modeBtnActive : {}),
                                    borderColor: paymentMode === mode
                                        ? (mode === 'disabled' ? '#dc2626' : mode === 'qr' ? '#7c3aed' : '#059669')
                                        : '#334155',
                                }}
                            >
                                <span style={s.modeIcon}>
                                    {mode === 'disabled' ? '🚫' : mode === 'qr' ? '📱' : '💳'}
                                </span>
                                <span style={s.modeLabel}>
                                    {mode === 'disabled' ? 'Disabled' : mode === 'qr' ? 'QR Code' : 'PhonePe'}
                                </span>
                                <span style={s.modeDesc}>
                                    {mode === 'disabled' ? 'Cards work for free'
                                        : mode === 'qr' ? 'Pay via QR + Card ID'
                                            : 'Auto pay via PhonePe'}
                                </span>
                                {paymentMode === mode && <span style={s.activeDot}>●</span>}
                            </button>
                        ))}
                    </div>

                    {/* QR Settings (shown when QR mode) */}
                    {paymentMode === 'qr' && (
                        <div style={s.qrSettings}>
                            <h3 style={s.subTitle}>QR Code Image</h3>
                            <p style={s.hint}>
                                Upload your UPI QR code image directly, or paste a URL below.
                                Users will scan this QR and include their Card ID in the payment remarks.
                            </p>

                            {/* File Upload */}
                            <div style={s.uploadRow}>
                                <label style={s.uploadBtn}>
                                    📤 {loading ? 'Uploading...' : 'Upload QR Image'}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleUploadQr}
                                        style={{ display: 'none' }}
                                        disabled={loading}
                                    />
                                </label>
                                <span style={s.hint}>PNG, JPG — max 2MB</span>
                            </div>

                            {/* OR divider */}
                            <div style={s.orDivider}>
                                <span style={s.orLine} />
                                <span style={s.orText}>or paste a URL</span>
                                <span style={s.orLine} />
                            </div>

                            {/* URL Input */}
                            <div style={s.qrInputRow}>
                                <input
                                    type="url"
                                    placeholder="https://example.com/your-upi-qr.png"
                                    value={qrInput}
                                    onChange={(e) => setQrInput(e.target.value)}
                                    style={{ ...s.input, flex: 1 }}
                                />
                                <button onClick={handleSaveQrUrl} style={s.saveQrBtn}>
                                    Save URL
                                </button>
                            </div>

                            {qrImageUrl && (
                                <div style={s.qrPreview}>
                                    <p style={s.hint}>Current QR:</p>
                                    <img src={qrImageUrl} alt="QR Code" style={s.qrImage} />
                                </div>
                            )}

                            {/* UPI ID */}
                            <h3 style={{ ...s.subTitle, marginTop: '20px' }}>UPI ID (clickable link)</h3>
                            <p style={s.hint}>
                                Enter your UPI ID (e.g. yourname@paytm). Users get a clickable &quot;Pay via UPI&quot; button.
                            </p>
                            <div style={s.qrInputRow}>
                                <input
                                    type="text"
                                    placeholder="yourname@paytm"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    style={{ ...s.input, flex: 1 }}
                                />
                                <button onClick={handleSaveUpi} style={s.saveQrBtn}>
                                    Save
                                </button>
                            </div>

                            {/* Payment Amount */}
                            <h3 style={{ ...s.subTitle, marginTop: '16px' }}>Payment Amount (₹)</h3>
                            <div style={s.qrInputRow}>
                                <input
                                    type="number"
                                    placeholder="143"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    style={{ ...s.input, flex: 1, maxWidth: '120px' }}
                                />
                                <button onClick={handleSaveAmount} style={s.saveQrBtn}>
                                    Save
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Settings ───────────────────── */}
                <div style={s.section}>
                    <h2 style={s.sectionTitle}>⚙️ General Settings</h2>
                    <h3 style={s.subTitle}>Contact Email</h3>
                    <p style={s.hint}>Shown at the bottom of cards for reports/complaints.</p>
                    <div style={s.qrInputRow}>
                        <input
                            type="email"
                            placeholder="contact@yourdomain.com"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            style={{ ...s.input, flex: 1 }}
                        />
                        <button onClick={handleSaveEmail} style={s.saveQrBtn}>
                            Save
                        </button>
                    </div>
                </div>

                {/* ── Cards Table ─────────────────── */}
                <div style={s.section}>
                    <div style={s.cardsHeader}>
                        <h2 style={s.sectionTitle}>Cards ({filteredCards.length}/{cards.length})</h2>
                    </div>

                    {/* Search */}
                    <div style={s.searchRow}>
                        <input
                            type="text"
                            placeholder="🔍 Search by Card ID, slug, name, email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={s.searchInput}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} style={s.clearBtn}>✕</button>
                        )}
                    </div>

                    <div style={s.tableWrap}>
                        <table style={s.table}>
                            <thead>
                                <tr>
                                    <th style={s.th}>Card ID</th>
                                    <th style={s.th}>Slug</th>
                                    <th style={s.th}>To / From</th>
                                    <th style={s.th}>User</th>
                                    <th style={s.th}>Status</th>
                                    <th style={s.th}>Paid At</th>
                                    <th style={s.th}>Expires</th>
                                    <th style={s.th}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCards.map((card) => (
                                    <tr key={card.id} style={s.tr}>
                                        <td style={s.td}>
                                            <code style={s.cardId}>{shortId(card.id)}</code>
                                        </td>
                                        <td style={s.td}>
                                            <code style={s.code}>{card.slug}</code>
                                        </td>
                                        <td style={s.td}>{card.recipient_name} / {card.sender_name}</td>
                                        <td style={s.td}>{card.user_email || '—'}</td>
                                        <td style={s.td}>
                                            <span style={{
                                                ...s.badge,
                                                background: card.status === 'paid'
                                                    ? (isExpired(card.expires_at) ? '#fef2f2' : '#ecfdf5')
                                                    : '#faf5ff',
                                                color: card.status === 'paid'
                                                    ? (isExpired(card.expires_at) ? '#dc2626' : '#059669')
                                                    : '#7c3aed',
                                            }}>
                                                {card.status === 'paid'
                                                    ? (isExpired(card.expires_at) ? '⏰ Expired' : '✅ Paid')
                                                    : '⏳ Unpaid'}
                                            </span>
                                        </td>
                                        <td style={s.td}>
                                            {card.paid_at ? new Date(card.paid_at).toLocaleDateString() : '—'}
                                        </td>
                                        <td style={s.td}>
                                            {card.expires_at ? new Date(card.expires_at).toLocaleDateString() : '—'}
                                        </td>
                                        <td style={s.td}>
                                            {card.status === 'paid' ? (
                                                <button onClick={() => handleMarkUnpaid(card.id)} style={s.dangerBtn}>
                                                    Deactivate
                                                </button>
                                            ) : (
                                                <button onClick={() => handleMarkPaid(card.id)} style={s.successBtn}>
                                                    Activate
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredCards.length === 0 && (
                                    <tr>
                                        <td colSpan={8} style={{ ...s.td, textAlign: 'center', color: '#94a3b8' }}>
                                            {searchQuery ? 'No cards match your search' : 'No cards yet'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Inline Styles ─────────────────────────────────
const s: Record<string, React.CSSProperties> = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        padding: '20px',
        fontFamily: "'Inter', system-ui, sans-serif",
        color: '#e2e8f0',
    },
    loginCard: {
        maxWidth: '380px',
        margin: '120px auto',
        background: 'rgba(30, 41, 59, 0.9)',
        border: '1px solid #334155',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center' as const,
        backdropFilter: 'blur(10px)',
    },
    loginTitle: {
        fontSize: '28px',
        marginBottom: '24px',
        background: 'linear-gradient(135deg, #a78bfa, #818cf8)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    container: {
        maxWidth: '1100px',
        margin: '0 auto',
    },
    title: {
        fontSize: '28px',
        marginBottom: '24px',
        background: 'linear-gradient(135deg, #a78bfa, #818cf8)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    toast: {
        background: 'rgba(124, 58, 237, 0.15)',
        border: '1px solid rgba(124, 58, 237, 0.3)',
        borderRadius: '10px',
        padding: '12px 20px',
        marginBottom: '20px',
        fontSize: '14px',
        textAlign: 'center' as const,
    },
    section: {
        background: 'rgba(30, 41, 59, 0.6)',
        border: '1px solid #334155',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: 600,
        marginBottom: '16px',
    },
    subTitle: {
        fontSize: '15px',
        fontWeight: 600,
        marginBottom: '8px',
        marginTop: '16px',
    },
    hint: {
        fontSize: '13px',
        color: '#94a3b8',
        marginBottom: '12px',
        lineHeight: '1.5',
    },

    // Payment mode buttons
    modeGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
    },
    modeBtn: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: '6px',
        padding: '16px 12px',
        background: 'rgba(15, 23, 42, 0.5)',
        border: '2px solid #334155',
        borderRadius: '12px',
        cursor: 'pointer',
        color: '#e2e8f0',
        transition: 'all 0.2s',
        position: 'relative' as const,
    },
    modeBtnActive: {
        background: 'rgba(124, 58, 237, 0.1)',
        boxShadow: '0 0 20px rgba(124, 58, 237, 0.15)',
    },
    modeIcon: { fontSize: '28px' },
    modeLabel: { fontSize: '14px', fontWeight: 600 },
    modeDesc: { fontSize: '11px', color: '#94a3b8', textAlign: 'center' as const },
    activeDot: {
        position: 'absolute' as const,
        top: '8px',
        right: '8px',
        color: '#22c55e',
        fontSize: '12px',
    },

    // QR Settings
    qrSettings: {
        marginTop: '16px',
        padding: '16px',
        background: 'rgba(124, 58, 237, 0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(124, 58, 237, 0.2)',
    },
    uploadRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '12px',
    },
    uploadBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 600,
        transition: 'all 0.2s',
        boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
    },
    orDivider: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        margin: '12px 0',
    },
    orLine: {
        flex: 1,
        height: '1px',
        background: 'rgba(124, 58, 237, 0.2)',
    },
    orText: {
        fontSize: '12px',
        color: '#64748b',
        textTransform: 'uppercase' as const,
        letterSpacing: '1px',
    },
    qrInputRow: {
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
    },
    saveQrBtn: {
        padding: '10px 18px',
        background: '#7c3aed',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: 600,
        whiteSpace: 'nowrap' as const,
    },
    qrPreview: { marginTop: '12px' },
    qrImage: {
        maxWidth: '200px',
        borderRadius: '8px',
        border: '1px solid #334155',
    },

    // Search
    cardsHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    searchRow: {
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
        position: 'relative' as const,
    },
    searchInput: {
        flex: 1,
        padding: '10px 16px',
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid #334155',
        borderRadius: '10px',
        color: '#e2e8f0',
        fontSize: '14px',
        outline: 'none',
    },
    clearBtn: {
        padding: '8px 12px',
        background: 'transparent',
        border: '1px solid #475569',
        borderRadius: '8px',
        color: '#94a3b8',
        cursor: 'pointer',
        fontSize: '14px',
    },

    // Table
    input: {
        width: '100%',
        padding: '12px 16px',
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid #334155',
        borderRadius: '10px',
        color: '#e2e8f0',
        fontSize: '14px',
        marginBottom: '12px',
        outline: 'none',
    },
    primaryBtn: {
        width: '100%',
        padding: '12px',
        background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: 600,
    },
    tableWrap: {
        overflowX: 'auto' as const,
        borderRadius: '10px',
        border: '1px solid #1e293b',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse' as const,
        fontSize: '13px',
    },
    th: {
        padding: '10px 12px',
        textAlign: 'left' as const,
        background: 'rgba(15, 23, 42, 0.8)',
        borderBottom: '1px solid #1e293b',
        fontWeight: 600,
        whiteSpace: 'nowrap' as const,
        color: '#94a3b8',
        fontSize: '12px',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px',
    },
    tr: {
        borderBottom: '1px solid rgba(30, 41, 59, 0.5)',
    },
    td: {
        padding: '10px 12px',
        whiteSpace: 'nowrap' as const,
    },
    code: {
        background: 'rgba(124, 58, 237, 0.15)',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
    },
    cardId: {
        background: 'rgba(251, 191, 36, 0.15)',
        color: '#fbbf24',
        padding: '3px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '0.5px',
    },
    badge: {
        padding: '3px 10px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: 600,
    },
    successBtn: {
        padding: '6px 14px',
        background: '#059669',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 600,
    },
    dangerBtn: {
        padding: '6px 14px',
        background: '#dc2626',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 600,
    },
};
