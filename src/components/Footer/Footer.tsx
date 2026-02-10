'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';

export function Footer() {
    const pathname = usePathname();

    // Hide footer on card viewer pages
    if (pathname.startsWith('/c/')) return null;

    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Top Section */}
                <div className={styles.top}>
                    <div className={styles.brand}>
                        <Link href="/" className={styles.logo}>
                            <img
                                src="/logo.gif"
                                alt="Sine Inverse"
                                width="40"
                                height="40"
                                className={styles.logoImage}
                            />
                            <span>Sine Inverse</span>
                        </Link>
                        <p className={styles.tagline}>
                            Create stunning, interactive greeting cards for your loved ones.
                            Make memories that last forever. 💜
                        </p>
                    </div>

                    <div className={styles.links}>
                        <div className={styles.linkCol}>
                            <h4>Product</h4>
                            <Link href="/lab">Card Builder</Link>
                            <Link href="/library">Templates</Link>
                        </div>
                        <div className={styles.linkCol}>
                            <h4>Company</h4>
                            <Link href="/">Home</Link>
                            <Link href="/account">Account</Link>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className={styles.divider} />

                {/* Bottom */}
                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        © {currentYear} Sine Inverse. All rights reserved.
                    </p>
                    <div className={styles.socials}>
                        <a href="https://instagram.com/sineinverse" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                                <rect x="2" y="2" width="20" height="20" rx="5" />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                            </svg>
                        </a>
                        <a href="https://twitter.com/sineinverse" target="_blank" rel="noopener noreferrer" aria-label="Twitter/X">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
