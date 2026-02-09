'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { Carousel } from '@/components/Carousel';
import { Nav } from '@/components/Nav';

// Cycling stickers for hero
const heroStickers = ['❤️', '🎉', '🥳', '💕', '✨'];

// 3 Master Templates
const masterTemplates = [
  {
    id: 'valentine-classic',
    name: 'Classic Valentine',
    subtitle: 'Games & Love',
    color: '#f43f5e'
  },
  {
    id: 'proposal',
    name: 'Proposal Special',
    subtitle: 'Will You Be Mine?',
    color: '#8b5cf6'
  },
  {
    id: 'memory-lane',
    name: 'Memory Lane',
    subtitle: 'Photo Puzzle',
    color: '#06b6d4'
  },
];

// Game Blocks
const gameBlocks = [
  { id: 'spin-wheel', name: 'Spin Wheel', icon: '🎡' },
  { id: 'memory-match', name: 'Memory Match', icon: '🃏' },
  { id: 'scratch-card', name: 'Scratch Card', icon: '✨' },
  { id: 'gift-box', name: 'Gift Box', icon: '🎁' },
  { id: 'love-meter', name: 'Love Meter', icon: '💕' },
  { id: 'quiz-game', name: 'Love Quiz', icon: '❓' },
  { id: 'puzzle', name: 'Photo Puzzle', icon: '🧩' },
  { id: 'fortune', name: 'Fortune Cookie', icon: '🥠' },
  { id: 'balloons', name: 'Pop Balloons', icon: '🎈' },
  { id: 'envelope', name: 'Love Letter', icon: '💌' },
];

// Testimonials
const testimonials = [
  { name: 'Sarah M.', text: 'My boyfriend loved the scratch card game! So creative!' },
  { name: 'Raj K.', text: 'Perfect for our anniversary. She cried happy tears!' },
  { name: 'Emma L.', text: 'Way better than a boring card. 10/10 recommend!' },
];

export default function Home() {
  const [stickerIndex, setStickerIndex] = useState(0);

  // Cycle through stickers
  useEffect(() => {
    const interval = setInterval(() => {
      setStickerIndex((prev) => (prev + 1) % heroStickers.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className={styles.main}>
      {/* ========== NAVIGATION ========== */}
      <Nav />

      {/* ========== HERO SECTION ========== */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Send love
          <span key={stickerIndex} className={styles.sticker}>
            {heroStickers[stickerIndex]}
          </span>
          that plays,
          <br />
          <span className={styles.heroHighlight}>not just displays!</span>
        </h1>
      </section>

      {/* ========== 3 TEMPLATE CARDS (Like Pilot'in) ========== */}
      <section id="templates" className={styles.templatesSection}>
        <div className={styles.templatesGrid}>
          {masterTemplates.map((template) => (
            <Link
              key={template.id}
              href={`/create?template=${template.id}`}
              className={styles.templateCard}
            >
              {/* PLACEHOLDER - Replace with GIF later */}
              <div
                className={styles.templatePlaceholder}
                style={{ backgroundColor: template.color }}
              >
                <div className={styles.placeholderContent}>
                  <span className={styles.placeholderLabel}>4:5 GIF PLACEHOLDER</span>
                  <span className={styles.placeholderTemplate}>{template.id}</span>
                </div>
              </div>

              {/* Card Label at Bottom */}
              <div className={styles.templateLabel}>
                <h3>{template.name}</h3>
                <span className={styles.templateArrow}>↗</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========== PROCESS SECTION (Step 1 → 2 → 3) ========== */}
      <section id="how-it-works" className={styles.processSection}>
        <div className={styles.processContainer}>
          <div className={styles.processStep}>
            <div className={styles.stepNumber}>1</div>
            <h3>Pick Your Template</h3>
            <p>Choose from our curated collection</p>
          </div>

          <div className={styles.processArrow}>→</div>

          <div className={styles.processStep}>
            <div className={styles.stepNumber}>2</div>
            <h3>Personalize It</h3>
            <p>Add photos, messages & games</p>
          </div>

          <div className={styles.processArrow}>→</div>

          <div className={styles.processStep}>
            <div className={styles.stepNumber}>3</div>
            <h3>Send With Love</h3>
            <p>Share via link & watch them smile</p>
          </div>
        </div>
      </section>

      {/* ========== BLOCKS SECTION (Netflix Carousel) ========== */}
      <section className={styles.blocksSection}>
        <div className={styles.blocksContainer}>
          <h2 className={styles.blocksSectionTitle}>Interactive Game Blocks</h2>
          <p className={styles.blocksSectionSubtitle}>Add these fun elements to your card</p>

          <Carousel className={styles.blocksCarousel}>
            {gameBlocks.map((block) => (
              <div key={block.id} className={styles.blockBox}>
                <span className={styles.blockBoxIcon}>{block.icon}</span>
                <span className={styles.blockBoxName}>{block.name}</span>
              </div>
            ))}
            {/* CTA Box at end */}
            <div className={styles.blockBoxCta}>
              <span>Build custom?</span>
            </div>
          </Carousel>
        </div>
      </section>

      {/* ========== TESTIMONIALS SECTION ========== */}
      <section className={styles.testimonialsSection}>
        <h2>What lovers say</h2>
        <div className={styles.testimonialsGrid}>
          {testimonials.map((t, i) => (
            <div key={i} className={styles.testimonialCard}>
              <p>"{t.text}"</p>
              <span className={styles.testimonialName}>— {t.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ========== FOOTER (Pilot'in Style) ========== */}
      <footer className={styles.footer}>
        <div className={styles.footerWave}>
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,64L60,58.7C120,53,240,43,360,48C480,53,600,75,720,80C840,85,960,75,1080,64C1200,53,1320,43,1380,37.3L1440,32L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z" fill="var(--violet-700)" />
          </svg>
        </div>

        <div className={styles.footerContent}>
          <div className={styles.footerMain}>
            {/* Brand */}
            <div className={styles.footerBrand}>
              <span className={styles.footerLogo}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                SineInverse
              </span>
              <p>Send love that plays, not just displays.</p>
            </div>

            {/* Links */}
            <div className={styles.footerLinks}>
              <div className={styles.footerLinkGroup}>
                <h4>Product</h4>
                <Link href="/templates">Templates</Link>
                <Link href="/blocks">Game Blocks</Link>
                <Link href="/pricing">Pricing</Link>
              </div>
              <div className={styles.footerLinkGroup}>
                <h4>Company</h4>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/blog">Blog</Link>
              </div>
              <div className={styles.footerLinkGroup}>
                <h4>Legal</h4>
                <Link href="/privacy">Privacy</Link>
                <Link href="/terms">Terms</Link>
              </div>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>© 2026 SineInverse. Made with 💜 in India</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

