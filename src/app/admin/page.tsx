'use client';

import { useState, useEffect } from 'react';

interface CardInfo {
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

export default function AdminPage() {
    const [password, setPassword] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const [paymentsEnabled, setPaymentsEnabled] = useState(true);
    const [cards, setCards] = useState<CardInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const headers = {
        'Content-Type': 'application/json',
        'x-admin-password': password,
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin', { headers });
            if (!res.ok) {
                setAuthenticated(false);
                setMessage('Wrong password');
                return;
            }
            const data = await res.json();
            setPaymentsEnabled(data.paymentsEnabled);
            setCards(data.cards);
            setAuthenticated(true);
            setMessage('');
        } catch {
            setMessage('Error fetching data');
        }
        setLoading(false);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetchData();
    };

    const togglePayments = async () => {
        const res = await fetch('/api/admin', {
            method: 'POST',
            headers,
            body: JSON.stringify({ action: 'toggle_payments' }),
        });
        const data = await res.json();
        if (data.success) {
            setPaymentsEnabled(data.paymentsEnabled);
            setMessage(`Payments ${data.paymentsEnabled ? 'ENABLED' : 'DISABLED'}`);
        }
    };

    const markPaid = async (cardId: string) => {
        const res = await fetch('/api/admin', {
            method: 'POST',
            headers,
            body: JSON.stringify({ action: 'mark_paid', cardId }),
        });
        if ((await res.json()).success) {
            await fetchData();
            setMessage('Card marked as paid ✅');
        }
    };

    const markUnpaid = async (cardId: string) => {
        const res = await fetch('/api/admin', {
            method: 'POST',
            headers,
            body: JSON.stringify({ action: 'mark_unpaid', cardId }),
        });
        if ((await res.json()).success) {
            await fetchData();
            setMessage('Card reverted to draft ⬅️');
        }
    };

    const isExpired = (expiresAt: string | null) => {
        if (!expiresAt) return false;
        return new Date(expiresAt) < new Date();
    };

    // ─── LOGIN SCREEN ───
    if (!authenticated) {
        return (
            <div style={styles.page}>
                <div style={styles.loginCard}>
                    <h1 style={styles.loginTitle}>🔐 Admin Panel</h1>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            placeholder="Enter admin password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            autoFocus
                        />
                        <button type="submit" style={styles.loginBtn}>
                            {loading ? 'Checking...' : 'Enter'}
                        </button>
                    </form>
                    {message && <p style={styles.error}>{message}</p>}
                </div>
            </div>
        );
    }

    // ─── ADMIN DASHBOARD ───
    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h1 style={styles.title}>⚙️ Admin Panel</h1>

                {message && <div style={styles.toast}>{message}</div>}

                {/* Payment Toggle */}
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>Payment Gateway</h2>
                    <div style={styles.toggleRow}>
                        <span>
                            Payments are <strong style={{ color: paymentsEnabled ? '#059669' : '#dc2626' }}>
                                {paymentsEnabled ? 'ENABLED' : 'DISABLED'}
                            </strong>
                        </span>
                        <button onClick={togglePayments} style={{
                            ...styles.toggleBtn,
                            background: paymentsEnabled ? '#dc2626' : '#059669',
                        }}>
                            {paymentsEnabled ? 'Disable Payments' : 'Enable Payments'}
                        </button>
                    </div>
                    <p style={styles.hint}>
                        When disabled, all card links work for free. Previously paid cards remain paid.
                    </p>
                </div>

                {/* Cards Table */}
                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>All Cards ({cards.length})</h2>
                    <div style={styles.tableWrap}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Slug</th>
                                    <th style={styles.th}>To / From</th>
                                    <th style={styles.th}>User</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Paid At</th>
                                    <th style={styles.th}>Expires</th>
                                    <th style={styles.th}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cards.map((card) => (
                                    <tr key={card.id} style={styles.tr}>
                                        <td style={styles.td}>
                                            <code style={styles.code}>{card.slug}</code>
                                        </td>
                                        <td style={styles.td}>{card.recipient_name} / {card.sender_name}</td>
                                        <td style={styles.td}>{card.user_email || '—'}</td>
                                        <td style={styles.td}>
                                            <span style={{
                                                ...styles.badge,
                                                background: card.status === 'paid'
                                                    ? (isExpired(card.expires_at) ? '#fef2f2' : '#ecfdf5')
                                                    : '#faf5ff',
                                                color: card.status === 'paid'
                                                    ? (isExpired(card.expires_at) ? '#dc2626' : '#059669')
                                                    : '#7c3aed',
                                            }}>
                                                {card.status === 'paid' && isExpired(card.expires_at)
                                                    ? 'EXPIRED' : card.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            {card.paid_at ? new Date(card.paid_at).toLocaleDateString() : '—'}
                                        </td>
                                        <td style={styles.td}>
                                            {card.expires_at ? new Date(card.expires_at).toLocaleDateString() : '—'}
                                        </td>
                                        <td style={styles.td}>
                                            {card.status === 'paid' ? (
                                                <button onClick={() => markUnpaid(card.id)} style={styles.actionBtn}>
                                                    Revert to Draft
                                                </button>
                                            ) : (
                                                <button onClick={() => markPaid(card.id)} style={{
                                                    ...styles.actionBtn,
                                                    background: '#059669',
                                                }}>
                                                    Mark Paid
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <button onClick={() => { setAuthenticated(false); setPassword(''); }} style={styles.logoutBtn}>
                    Logout
                </button>
            </div>
        </div>
    );
}

// ─── INLINE STYLES ─────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
    page: {
        minHeight: '100vh',
        background: '#0f0a1a',
        color: '#e2e8f0',
        fontFamily: 'system-ui, sans-serif',
        padding: '2rem 1rem',
    },
    container: {
        maxWidth: '1100px',
        margin: '0 auto',
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: 700,
        marginBottom: '1.5rem',
    },
    loginCard: {
        maxWidth: '360px',
        margin: '15vh auto',
        background: '#1e1033',
        borderRadius: '16px',
        padding: '2rem',
        textAlign: 'center' as const,
    },
    loginTitle: {
        fontSize: '1.25rem',
        marginBottom: '1.5rem',
    },
    input: {
        width: '100%',
        padding: '0.75rem 1rem',
        background: '#2a1a45',
        border: '1px solid rgba(139,92,246,0.2)',
        borderRadius: '10px',
        color: 'white',
        fontSize: '1rem',
        marginBottom: '1rem',
        outline: 'none',
        boxSizing: 'border-box' as const,
    },
    loginBtn: {
        width: '100%',
        padding: '0.75rem',
        background: '#7c3aed',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontWeight: 600,
        fontSize: '0.9375rem',
        cursor: 'pointer',
    },
    error: {
        color: '#f87171',
        marginTop: '0.75rem',
        fontSize: '0.875rem',
    },
    section: {
        background: '#1e1033',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
    },
    sectionTitle: {
        fontSize: '1.125rem',
        fontWeight: 600,
        marginBottom: '1rem',
    },
    toggleRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap' as const,
    },
    toggleBtn: {
        padding: '0.625rem 1.25rem',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontWeight: 600,
        cursor: 'pointer',
    },
    hint: {
        color: '#94a3b8',
        fontSize: '0.8125rem',
        marginTop: '0.75rem',
    },
    tableWrap: {
        overflowX: 'auto' as const,
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse' as const,
        fontSize: '0.8125rem',
    },
    th: {
        textAlign: 'left' as const,
        padding: '0.625rem 0.75rem',
        borderBottom: '1px solid rgba(139,92,246,0.15)',
        color: '#a78bfa',
        fontWeight: 600,
        whiteSpace: 'nowrap' as const,
    },
    tr: {
        borderBottom: '1px solid rgba(139,92,246,0.08)',
    },
    td: {
        padding: '0.625rem 0.75rem',
        whiteSpace: 'nowrap' as const,
    },
    code: {
        background: '#2a1a45',
        padding: '0.2rem 0.5rem',
        borderRadius: '6px',
        fontSize: '0.75rem',
    },
    badge: {
        padding: '0.2rem 0.5rem',
        borderRadius: '6px',
        fontSize: '0.6875rem',
        fontWeight: 700,
    },
    actionBtn: {
        padding: '0.375rem 0.75rem',
        background: '#7c3aed',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '0.75rem',
        fontWeight: 600,
        cursor: 'pointer',
    },
    logoutBtn: {
        padding: '0.5rem 1rem',
        background: 'transparent',
        color: '#94a3b8',
        border: '1px solid rgba(148,163,184,0.2)',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '0.875rem',
    },
    toast: {
        background: '#059669',
        color: 'white',
        padding: '0.75rem 1rem',
        borderRadius: '10px',
        marginBottom: '1rem',
        fontSize: '0.875rem',
        fontWeight: 500,
    },
};
