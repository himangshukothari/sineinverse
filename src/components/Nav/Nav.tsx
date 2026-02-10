'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import styles from './Nav.module.css';

// Navigation links config
const NAV_LINKS = [
    { id: 'home', name: 'Home', href: '/' },
    { id: 'lab', name: 'Lab', href: '/lab' },
    { id: 'library', name: 'Library', href: '/library' },
];

export function Nav() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const { data: session, status } = useSession();

    // Hide nav on card viewer pages
    if (pathname.startsWith('/c/')) return null;

    // Get active page ID from pathname
    const getActiveId = () => {
        if (pathname === '/') return 'home';
        const segment = pathname.split('/')[1];
        return segment || 'home';
    };

    const activeId = getActiveId();

    // Close menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    // Lock body scroll when menu open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [menuOpen]);

    const handleSignIn = () => {
        signIn('google');
    };

    return (
        <>
            {/* NAV BAR */}
            <nav className={styles.nav}>
                <div className={styles.container}>
                    {/* LOGO */}
                    <Link href="/" className={styles.logo}>
                        <img
                            src="/logo.gif"
                            alt="Sine Inverse"
                            width="32"
                            height="32"
                            className={styles.logoImage}
                        />
                        <span>Sine Inverse</span>
                    </Link>

                    {/* DESKTOP NAV LINKS */}
                    <div className={styles.desktopLinks}>
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.id}
                                href={link.href}
                                className={`${styles.navLink} ${activeId === link.id ? styles.activeLink : ''}`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* AUTH SECTION */}
                        {status === 'loading' ? (
                            <div className={styles.authLoading}>...</div>
                        ) : session?.user ? (
                            <Link href="/account" className={styles.userAvatar}>
                                {session.user.image ? (
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || 'User'}
                                        width="32"
                                        height="32"
                                    />
                                ) : (
                                    <span>{session.user.name?.[0] || '👤'}</span>
                                )}
                            </Link>
                        ) : (
                            <button className={styles.signInBtn} onClick={handleSignIn}>
                                Sign In
                            </button>
                        )}

                        {/* CTA BUTTON */}
                        <Link href="/lab" className={styles.ctaBtn}>
                            Start Creating
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {/* HAMBURGER MENU (Mobile) */}
                    <button
                        className={`${styles.hamburger} ${menuOpen ? styles.active : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(!menuOpen);
                        }}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </nav>

            {/* MOBILE OVERLAY — rendered OUTSIDE nav to avoid backdrop-filter containing block */}
            {menuOpen && (
                <div className={styles.overlay} onClick={() => setMenuOpen(false)} />
            )}

            {/* MOBILE DRAWER — rendered OUTSIDE nav so position:fixed works correctly */}
            <div className={`${styles.mobileDrawer} ${menuOpen ? styles.drawerOpen : ''}`}>
                {NAV_LINKS.map((link) => (
                    <Link
                        key={link.id}
                        href={link.href}
                        className={`${styles.drawerLink} ${activeId === link.id ? styles.drawerActive : ''}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        {link.name}
                    </Link>
                ))}

                {/* AUTH SECTION */}
                {status === 'loading' ? (
                    <div className={styles.authLoading}>...</div>
                ) : session?.user ? (
                    <Link
                        href="/account"
                        className={styles.drawerUser}
                        onClick={() => setMenuOpen(false)}
                    >
                        {session.user.image ? (
                            <img
                                src={session.user.image}
                                alt={session.user.name || 'User'}
                                width="36"
                                height="36"
                            />
                        ) : (
                            <span className={styles.drawerUserInitial}>
                                {session.user.name?.[0] || '👤'}
                            </span>
                        )}
                        <span>{session.user.name || 'Account'}</span>
                    </Link>
                ) : (
                    <button className={styles.drawerSignIn} onClick={handleSignIn}>
                        Sign In
                    </button>
                )}

                {/* CTA BUTTON */}
                <Link
                    href="/lab"
                    className={styles.drawerCta}
                    onClick={() => setMenuOpen(false)}
                >
                    Start Creating
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </>
    );
}
