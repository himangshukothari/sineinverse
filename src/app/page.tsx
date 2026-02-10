'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useMemo } from 'react';
import styles from './page.module.css';

/* ======= Data ======= */
const heroStickers = ['❤️', '🎉', '🥳', '💕', '✨', '🎁', '💌', '💘', '🌹', '🎊'];

const showcaseBlocks = [
  { name: 'Memory Match', icon: '🃏', color: '#f43f5e', desc: 'Flip & find matching hearts' },
  { name: 'Spin Wheel', icon: '🎡', color: '#8b5cf6', desc: 'Spin to win date nights' },
  { name: 'Scratch Card', icon: '✨', color: '#eab308', desc: 'Scratch to reveal treasure' },
  { name: 'Love Letter', icon: '💌', color: '#ec4899', desc: 'Animated typewriter message' },
  { name: 'Gift Box', icon: '🎁', color: '#10b981', desc: 'Unwrap surprise presents' },
  { name: 'Love Quiz', icon: '💘', color: '#f97316', desc: 'How well do you know me?' },
  { name: 'Fortune Cookie', icon: '🥠', color: '#a855f7', desc: 'Crack open your destiny' },
  { name: 'Slot Machine', icon: '🎰', color: '#ef4444', desc: 'Hit the jackpot of love' },
  { name: 'Photo Puzzle', icon: '🧩', color: '#06b6d4', desc: 'Slide tiles to solve' },
  { name: 'Envelope', icon: '✉️', color: '#6366f1', desc: '3D wax-seal opening' },
  { name: 'Promise Cards', icon: '🤞', color: '#14b8a6', desc: 'Stack of sweet promises' },
  { name: 'Countdown', icon: '⏳', color: '#f59e0b', desc: 'Timer to a big reveal' },
  { name: 'Confession Wall', icon: '📌', color: '#e879f9', desc: 'Flip sticky-note secrets' },
  { name: 'Love Meter', icon: '💓', color: '#fb7185', desc: 'Animated compatibility fill' },
  { name: 'Finale Ask', icon: '💍', color: '#8b5cf6', desc: 'The big yes-or-no moment' },
  { name: 'Polaroid Flip', icon: '📸', color: '#0ea5e9', desc: 'Photo memory reveal' },
];

const steps = [
  { num: '01', title: 'Choose Blocks', desc: 'Pick from 16+ interactive games — quizzes, scratch cards, spin wheels, and more.', icon: '🧱' },
  { num: '02', title: 'Personalize', desc: 'Add your messages, photos & pick a skin. Make every block uniquely yours.', icon: '🎨' },
  { num: '03', title: 'Share the Link', desc: 'Send it to your person & track when they open it, play it, and love it.', icon: '🚀' },
];

const testimonials = [
  { text: "My girlfriend literally cried. Best Valentine's surprise ever.", name: 'Aarav K.', emoji: '😭' },
  { text: "Way better than a boring greeting card. She played it 5 times!", name: 'Priya S.', emoji: '🥰' },
  { text: "The quiz block is genius. We couldn't stop laughing at the results.", name: 'Rohan M.', emoji: '😂' },
];

/* ======= Animated Counter Hook ======= */
function useCounter(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref };
}

/* ======= Component ======= */
export default function Home() {
  const [stickerIndex, setStickerIndex] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const blocksCounter = useCounter(16);
  const skinsCounter = useCounter(50);
  const madeCounter = useCounter(999);

  // Cycle stickers
  useEffect(() => {
    const i = setInterval(() => setStickerIndex((p) => (p + 1) % heroStickers.length), 1600);
    return () => clearInterval(i);
  }, []);

  // Cycle testimonials
  useEffect(() => {
    const i = setInterval(() => setActiveTestimonial((p) => (p + 1) % testimonials.length), 4000);
    return () => clearInterval(i);
  }, []);

  // Scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add(styles.visible); }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll(`.${styles.anim}`).forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Randomize block grid positions for parallax effect
  const blockRows = useMemo(() => {
    const row1 = showcaseBlocks.slice(0, 8);
    const row2 = showcaseBlocks.slice(8, 16);
    return [row1, row2];
  }, []);

  return (
    <main className={styles.main}>

      {/* ━━━━━ HERO ━━━━━ */}
      <section className={styles.hero}>
        <div className={styles.heroMesh} />
        <div className={styles.heroGlow1} />
        <div className={styles.heroGlow2} />

        {/* Floating emoji particles */}
        <div className={styles.particles}>
          {['💕', '✨', '🌹', '💜', '🎁', '💌'].map((e, i) => (
            <span key={i} className={styles.particle} style={{ '--i': i } as React.CSSProperties}>{e}</span>
          ))}
        </div>

        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>
            <span className={styles.badgeDot} />
            <span>Interactive Greeting Cards ✨</span>
          </div>

          <h1 className={styles.heroTitle}>
            Send love
            <span key={stickerIndex} className={styles.sticker}>{heroStickers[stickerIndex]}</span>
            that <em>plays</em>,
            <br />
            <span className={styles.gradientText}>not just displays.</span>
          </h1>

          <p className={styles.heroSub}>
            Build stunning cards with mini-games, quizzes, scratch reveals & more.
            Your person plays through each surprise — and you see their reactions.
          </p>

          <div className={styles.heroActions}>
            <Link href="/lab" className={styles.heroCta}>
              <span>Start Creating — Free</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a href="#blocks" className={styles.heroGhost}>
              Explore Blocks ↓
            </a>
          </div>
        </div>

        {/* Phone mockup with live preview */}
        <div className={styles.heroPhone}>
          <div className={styles.phoneFrame}>
            <div className={styles.phoneNotch} />
            <div className={styles.phoneScreen}>
              <div className={styles.phoneMiniBlock} style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}>
                <span>💌</span><p>Love Letter</p>
              </div>
              <div className={styles.phoneMiniBlock} style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
                <span>🎡</span><p>Spin Wheel</p>
              </div>
              <div className={styles.phoneMiniBlock} style={{ background: 'linear-gradient(135deg, #10b981, #14b8a6)' }}>
                <span>🎁</span><p>Gift Box</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━ STATS BAR ━━━━━ */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard} ref={blocksCounter.ref}>
            <span className={styles.statNum}>{blocksCounter.count}+</span>
            <span className={styles.statLbl}>Game Blocks</span>
          </div>
          <div className={styles.statCard} ref={skinsCounter.ref}>
            <span className={styles.statNum}>{skinsCounter.count}+</span>
            <span className={styles.statLbl}>Skin Variants</span>
          </div>
          <div className={styles.statCard} ref={madeCounter.ref}>
            <span className={styles.statNum}>{madeCounter.count === 999 ? '∞' : madeCounter.count}</span>
            <span className={styles.statLbl}>Memories Made</span>
          </div>
        </div>
      </section>

      {/* ━━━━━ HOW IT WORKS ━━━━━ */}
      <section className={`${styles.howSection} ${styles.anim}`}>
        <div className={styles.sectionHead}>
          <span className={styles.pill}>How It Works</span>
          <h2>Three steps to magic ✨</h2>
          <p>No coding. No downloads. Just pure creativity.</p>
        </div>

        <div className={styles.stepsGrid}>
          {steps.map((s, i) => (
            <div key={i} className={styles.stepCard}>
              <div className={styles.stepIconWrap}>
                <span className={styles.stepIcon}>{s.icon}</span>
                <span className={styles.stepNum}>{s.num}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {i < 2 && <div className={styles.stepConnector} />}
            </div>
          ))}
        </div>
      </section>

      {/* ━━━━━ BLOCKS SHOWCASE ━━━━━ */}
      <section id="blocks" className={`${styles.blocksSection} ${styles.anim}`}>
        <div className={styles.sectionHead}>
          <span className={styles.pillDark}>Game Blocks</span>
          <h2>16+ Interactive Surprises</h2>
          <p>Every block is a delightful mini-game your recipient plays through</p>
        </div>

        <div className={styles.blockGrid}>
          {showcaseBlocks.map((b, i) => (
            <div
              key={i}
              className={styles.blockTile}
              style={{ '--accent': b.color, '--di': `${i * 0.04}s` } as React.CSSProperties}
            >
              <div className={styles.blockTileIcon}>
                <span>{b.icon}</span>
              </div>
              <h4>{b.name}</h4>
              <p>{b.desc}</p>
            </div>
          ))}
        </div>

        <div className={styles.blocksCta}>
          <Link href="/lab" className={styles.blocksBuildBtn}>
            Build Your Card with These →
          </Link>
        </div>
      </section>

      {/* ━━━━━ TESTIMONIALS ━━━━━ */}
      <section className={`${styles.testSection} ${styles.anim}`}>
        <div className={styles.sectionHead}>
          <span className={styles.pill}>Love Letters From Users</span>
          <h2>People are obsessed 💜</h2>
        </div>

        <div className={styles.testCarousel}>
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`${styles.testCard} ${i === activeTestimonial ? styles.testActive : ''}`}
            >
              <span className={styles.testEmoji}>{t.emoji}</span>
              <blockquote>&ldquo;{t.text}&rdquo;</blockquote>
              <cite>— {t.name}</cite>
            </div>
          ))}

          <div className={styles.testDots}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`${styles.testDot} ${i === activeTestimonial ? styles.testDotActive : ''}`}
                onClick={() => setActiveTestimonial(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ━━━━━ FINAL CTA ━━━━━ */}
      <section className={`${styles.ctaSection} ${styles.anim}`}>
        <div className={styles.ctaGlow} />
        <div className={styles.ctaInner}>
          <h2>Ready to blow their mind?</h2>
          <p>It takes 5 minutes to create something they&apos;ll remember forever.</p>
          <Link href="/lab" className={styles.ctaBtn}>
            Start Creating — It&apos;s Free
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <span className={styles.ctaNote}>No account needed to start</span>
        </div>
      </section>

      {/* ━━━━━ FOOTER ━━━━━ */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <span className={styles.footerLogo}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              SineInverse
            </span>
            <p>Send love that plays, not just displays.</p>
          </div>

          <div className={styles.footerLinks}>
            <div>
              <h4>Product</h4>
              <Link href="/lab">Card Builder</Link>
              <a href="#blocks">Game Blocks</a>
            </div>
            <div>
              <h4>Account</h4>
              <Link href="/login">Sign In</Link>
              <Link href="/account">My Cards</Link>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© 2026 SineInverse. Made with 💜 in India</p>
        </div>
      </footer>
    </main>
  );
}
