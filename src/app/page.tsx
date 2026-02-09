'use client';

/**
 * SINEINVERSE - LANDING PAGE
 * Premium, romantic, stunning first impression
 * NO EMOJIS - Premium brands don't use emojis
 */

import Link from 'next/link';
import styles from './page.module.css';
import { Carousel } from '@/components/Carousel';

export default function HomePage() {
  return (
    <main className={styles.main}>
      {/* Floating Hearts Background - CSS shapes instead of emojis */}
      <div className={styles.heartsBackground}>
        <span className={styles.heart} style={{ left: '10%', animationDelay: '0s' }}></span>
        <span className={styles.heart} style={{ left: '25%', animationDelay: '2s' }}></span>
        <span className={styles.heart} style={{ left: '40%', animationDelay: '4s' }}></span>
        <span className={styles.heart} style={{ left: '55%', animationDelay: '1s' }}></span>
        <span className={styles.heart} style={{ left: '70%', animationDelay: '3s' }}></span>
        <span className={styles.heart} style={{ left: '85%', animationDelay: '5s' }}></span>
      </div>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor" />
            </svg>
          </div>
          <span className={styles.logoText}>SineInverse</span>
        </div>
        <nav className={styles.nav}>
          <Link href="#how-it-works" className={styles.navLink}>How it works</Link>
          <Link href="#gallery" className={styles.navLink}>Gallery</Link>
          <Link href="/create" className="btn-primary">Create Card</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.heroTag}>Make them feel special</p>
          <h1 className={styles.heroTitle}>
            Create <span className="gradient-text">Unforgettable</span>
            <br />Digital Love Letters
          </h1>
          <p className={styles.heroDescription}>
            Interactive experiences, personalized messages, and magical moments.
            <br />Give them a gift they&apos;ll treasure forever.
          </p>
          <div className={styles.heroCTA}>
            <Link href="/create" className="btn-primary">
              Start Creating
            </Link>
            <Link href="#gallery" className="btn-secondary">
              View Examples
            </Link>
          </div>
          <p className={styles.heroSubtext}>Starting at just ₹99 · No design skills needed</p>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.phoneFrame}>
            <div className={styles.phoneScreen}>
              <div className={styles.mockCard}>
                <div className={styles.mockHeart}></div>
                <p className={styles.mockTitle}>To: Priya</p>
                <p className={styles.mockSubtitle}>Something special awaits...</p>
                <div className={styles.mockButton}>Open Gift</div>
              </div>
            </div>
          </div>
          <div className={styles.floatingBadge}>
            <svg className={styles.badgeIcon} width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 6H3C1.9 6 1 6.9 1 8V16C1 17.1 1.9 18 3 18H21C22.1 18 23 17.1 23 16V8C23 6.9 22.1 6 21 6ZM21 16H3V8H21V16ZM9 10H7V14H9V10ZM13 10H11V14H13V10ZM17 10H15V14H17V10Z" fill="currentColor" />
            </svg>
            Interactive Games Inside
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <p className={styles.sectionSubtitle}>Create magic in 3 simple steps</p>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67A2.5 2.5 0 0 1 12 22zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5a.54.54 0 0 0-.14-.35c-.41-.46-.63-1.05-.63-1.65a2.5 2.5 0 0 1 2.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7z" fill="currentColor" />
                <circle cx="6.5" cy="11.5" r="1.5" fill="currentColor" />
                <circle cx="9.5" cy="7.5" r="1.5" fill="currentColor" />
                <circle cx="14.5" cy="7.5" r="1.5" fill="currentColor" />
                <circle cx="17.5" cy="11.5" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <h3 className={styles.stepTitle}>Choose Template</h3>
            <p className={styles.stepDescription}>
              Pick from stunning pre-designed cards or build your own from scratch
            </p>
          </div>

          <div className={styles.stepConnector}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="currentColor" />
            </svg>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" />
              </svg>
            </div>
            <h3 className={styles.stepTitle}>Personalize</h3>
            <p className={styles.stepDescription}>
              Add photos, messages, and choose which games to include
            </p>
          </div>

          <div className={styles.stepConnector}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="currentColor" />
            </svg>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepIcon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor" />
              </svg>
            </div>
            <h3 className={styles.stepTitle}>Send & Delight</h3>
            <p className={styles.stepDescription}>
              Share the link and watch them experience the magic
            </p>
          </div>
        </div>
      </section>

      {/* Template Carousel */}
      <section id="gallery" className={styles.templateSection}>
        <h2 className={styles.sectionTitle}>Ready-Made Templates</h2>
        <p className={styles.sectionSubtitle}>Choose a template and personalize it in minutes</p>


        <Carousel className={styles.templateCarouselTrack}>
          {/* Template 1 */}
          <div className={styles.templateCard}>
            <div className={styles.templatePreview}>
              <div className={styles.templateScreen}>
                <div className={styles.previewFrame}>
                  <div className={styles.previewStep} data-step="1">
                    <div className={styles.miniHeart}></div>
                    <span>Welcome</span>
                  </div>
                  <div className={styles.previewStep} data-step="2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z" />
                    </svg>
                    <span>Memory Game</span>
                  </div>
                  <div className={styles.previewStep} data-step="3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    <span>Spin Wheel</span>
                  </div>
                  <div className={styles.previewStep} data-step="4">
                    <div className={styles.miniHeart}></div>
                    <span>Finale</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.templateInfo}>
              <h3>Will You Be Mine?</h3>
              <p>4 interactive blocks · Perfect for proposals</p>
              <span className={styles.templatePrice}>₹99</span>
            </div>
          </div>

          {/* Template 2 */}
          <div className={styles.templateCard}>
            <div className={styles.templatePreview}>
              <div className={styles.templateScreen}>
                <div className={styles.previewFrame}>
                  <div className={styles.previewStep} data-step="1">
                    <div className={styles.miniHeart}></div>
                    <span>Welcome</span>
                  </div>
                  <div className={styles.previewStep} data-step="2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                    </svg>
                    <span>Photo Puzzle</span>
                  </div>
                  <div className={styles.previewStep} data-step="3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                    </svg>
                    <span>Treasure Hunt</span>
                  </div>
                  <div className={styles.previewStep} data-step="4">
                    <div className={styles.miniHeart}></div>
                    <span>Message</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.templateInfo}>
              <h3>Our Story</h3>
              <p>4 interactive blocks · Tell your journey</p>
              <span className={styles.templatePrice}>₹149</span>
            </div>
          </div>

          {/* Template 3 */}
          <div className={styles.templateCard}>
            <div className={styles.templatePreview}>
              <div className={styles.templateScreen}>
                <div className={styles.previewFrame}>
                  <div className={styles.previewStep} data-step="1">
                    <div className={styles.miniHeart}></div>
                    <span>Welcome</span>
                  </div>
                  <div className={styles.previewStep} data-step="2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    <span>Wheel 1</span>
                  </div>
                  <div className={styles.previewStep} data-step="3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    <span>Wheel 2</span>
                  </div>
                  <div className={styles.previewStep} data-step="4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    <span>Wheel 3</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.templateInfo}>
              <h3>100 Reasons</h3>
              <p>4 interactive blocks · Reveal your reasons</p>
              <span className={styles.templatePrice}>₹129</span>
            </div>
          </div>

          {/* Template 4 */}
          <div className={styles.templateCard}>
            <div className={styles.templatePreview}>
              <div className={styles.templateScreen}>
                <div className={styles.previewFrame}>
                  <div className={styles.previewStep} data-step="1">
                    <div className={styles.miniHeart}></div>
                    <span>Welcome</span>
                  </div>
                  <div className={styles.previewStep} data-step="2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 4H6C3.79 4 2 5.79 2 8v8c0 2.21 1.79 4 4 4h12c2.21 0 4-1.79 4-4V8c0-2.21-1.79-4-4-4zm0 12.01L6 16c-1.1 0-2-.9-2-2v-2l6-3 6 3v3.01c0 1.1-.9 1.99-2 1.99z" />
                    </svg>
                    <span>Scratch Card</span>
                  </div>
                  <div className={styles.previewStep} data-step="3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2z" />
                    </svg>
                    <span>Gift Reveal</span>
                  </div>
                  <div className={styles.previewStep} data-step="4">
                    <div className={styles.miniHeart}></div>
                    <span>Finale</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.templateInfo}>
              <h3>Surprise Gift</h3>
              <p>4 interactive blocks · Hide gift codes</p>
              <span className={styles.templatePrice}>₹179</span>
            </div>
          </div>

          {/* Template 5 */}
          <div className={styles.templateCard}>
            <div className={styles.templatePreview}>
              <div className={styles.templateScreen}>
                <div className={styles.previewFrame}>
                  <div className={styles.previewStep} data-step="1">
                    <div className={styles.miniHeart}></div>
                    <span>Welcome</span>
                  </div>
                  <div className={styles.previewStep} data-step="2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z" />
                    </svg>
                    <span>Memory</span>
                  </div>
                  <div className={styles.previewStep} data-step="3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                    </svg>
                    <span>Photo</span>
                  </div>
                  <div className={styles.previewStep} data-step="4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10" />
                    </svg>
                    <span>Wheel</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.templateInfo}>
              <h3>Anniversary Special</h3>
              <p>4 interactive blocks · Celebrate together</p>
              <span className={styles.templatePrice}>₹149</span>
            </div>
          </div>

          {/* Template 6 - Custom */}
          <div className={`${styles.templateCard} ${styles.templateCustom}`}>
            <div className={styles.templatePreview}>
              <div className={styles.templateScreen}>
                <div className={styles.customPreview}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                  <span>Build Your Own</span>
                </div>
              </div>
            </div>
            <div className={styles.templateInfo}>
              <h3>Custom Card</h3>
              <p>Choose any blocks · Full control</p>
              <span className={styles.templatePrice}>₹199</span>
            </div>
          </div>
        </Carousel>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.featuresGrid}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="currentColor" />
              </svg>
            </div>
            <h3>10+ Interactive Games</h3>
            <p>Memory puzzles, spin wheels, scratch cards, and more</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" fill="currentColor" />
              </svg>
            </div>
            <h3>Mobile Perfect</h3>
            <p>Looks stunning on every device</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.78 2.37 9.69 2 8.5 2A3 3 0 0 0 5.5 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-1c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM8.5 5c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM20 19H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z" fill="currentColor" />
              </svg>
            </div>
            <h3>Gift Codes</h3>
            <p>Hide Amazon/Flipkart gift cards inside</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" fill="currentColor" />
              </svg>
            </div>
            <h3>See Their Reactions</h3>
            <p>Know when they open and how they play</p>
          </div>
        </div>
      </section>

      {/* Game Blocks Carousel */}
      <section className={styles.blocksSection}>
        <h2 className={styles.sectionTitle}>Interactive Game Blocks</h2>
        <p className={styles.sectionSubtitle}>Mix and match these blocks to create your perfect card</p>


        <Carousel className={styles.blocksCarouselTrack}>
          {/* Block 1 - Intro */}
          <div className={styles.blockCard}>
            <div className={styles.blockPreview}>
              <div className={styles.blockAnimation} data-block="intro">
                <div className={styles.blockFrame}>
                  <div className={styles.animStep}></div>
                  <div className={styles.animStep}></div>
                  <div className={styles.animStep}></div>
                </div>
              </div>
            </div>
            <div className={styles.blockInfo}>
              <h3>Intro Block</h3>
              <p>Beautiful welcome animation</p>
              <span className={styles.blockCategory}>Welcome</span>
            </div>
          </div>

          {/* Block 2 - Memory Match */}
          <div className={styles.blockCard}>
            <div className={styles.blockPreview}>
              <div className={styles.blockAnimation} data-block="memory">
                <div className={styles.blockFrame}>
                  <div className={styles.memoryGrid}>
                    <span></span><span></span><span></span><span></span>
                    <span></span><span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.blockInfo}>
              <h3>Memory Match</h3>
              <p>Find matching photo pairs</p>
              <span className={styles.blockCategory}>Puzzle</span>
            </div>
          </div>

          {/* Block 3 - Spin Wheel */}
          <div className={styles.blockCard}>
            <div className={styles.blockPreview}>
              <div className={styles.blockAnimation} data-block="wheel">
                <div className={styles.blockFrame}>
                  <div className={styles.spinWheel}>
                    <div className={styles.wheelInner}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.blockInfo}>
              <h3>Spin Wheel</h3>
              <p>Spin to reveal surprises</p>
              <span className={styles.blockCategory}>Game</span>
            </div>
          </div>

          {/* Block 4 - Scratch Card */}
          <div className={styles.blockCard}>
            <div className={styles.blockPreview}>
              <div className={styles.blockAnimation} data-block="scratch">
                <div className={styles.blockFrame}>
                  <div className={styles.scratchCard}>
                    <div className={styles.scratchOverlay}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.blockInfo}>
              <h3>Scratch Card</h3>
              <p>Scratch to reveal message</p>
              <span className={styles.blockCategory}>Reveal</span>
            </div>
          </div>

          {/* Block 5 - Photo Puzzle */}
          <div className={styles.blockCard}>
            <div className={styles.blockPreview}>
              <div className={styles.blockAnimation} data-block="puzzle">
                <div className={styles.blockFrame}>
                  <div className={styles.puzzleGrid}>
                    <span></span><span></span><span></span>
                    <span></span><span></span><span></span>
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.blockInfo}>
              <h3>Photo Puzzle</h3>
              <p>Slide pieces to reveal</p>
              <span className={styles.blockCategory}>Puzzle</span>
            </div>
          </div>

          {/* Block 6 - Treasure Hunt */}
          <div className={styles.blockCard}>
            <div className={styles.blockPreview}>
              <div className={styles.blockAnimation} data-block="treasure">
                <div className={styles.blockFrame}>
                  <div className={styles.treasureBoxes}>
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.blockInfo}>
              <h3>Treasure Hunt</h3>
              <p>Find hidden treasures</p>
              <span className={styles.blockCategory}>Game</span>
            </div>
          </div>

          {/* Block 7 - Love Meter */}
          <div className={styles.blockCard}>
            <div className={styles.blockPreview}>
              <div className={styles.blockAnimation} data-block="meter">
                <div className={styles.blockFrame}>
                  <div className={styles.loveMeter}>
                    <div className={styles.meterFill}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.blockInfo}>
              <h3>Love Meter</h3>
              <p>Measure your love</p>
              <span className={styles.blockCategory}>Fun</span>
            </div>
          </div>

          {/* Block 8 - Pop Balloons */}
          <div className={styles.blockCard}>
            <div className={styles.blockPreview}>
              <div className={styles.blockAnimation} data-block="balloons">
                <div className={styles.blockFrame}>
                  <div className={styles.balloons}>
                    <span></span><span></span><span></span>
                    <span></span><span></span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.blockInfo}>
              <h3>Pop Balloons</h3>
              <p>Pop to reveal messages</p>
              <span className={styles.blockCategory}>Fun</span>
            </div>
          </div>

          {/* Block 9 - Gift Reveal */}
          <div className={styles.blockCard}>
            <div className={styles.blockPreview}>
              <div className={styles.blockAnimation} data-block="gift">
                <div className={styles.blockFrame}>
                  <div className={styles.giftBox}>
                    <div className={styles.giftLid}></div>
                    <div className={styles.giftBase}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.blockInfo}>
              <h3>Gift Reveal</h3>
              <p>Unwrap gift codes</p>
              <span className={styles.blockCategory}>Gift</span>
            </div>
          </div>

          {/* Block 10 - Finale */}
          <div className={styles.blockCard}>
            <div className={styles.blockPreview}>
              <div className={styles.blockAnimation} data-block="finale">
                <div className={styles.blockFrame}>
                  <div className={styles.finaleHeart}></div>
                </div>
              </div>
            </div>
            <div className={styles.blockInfo}>
              <h3>Finale Ask</h3>
              <p>The big question</p>
              <span className={styles.blockCategory}>Finale</span>
            </div>
          </div>
        </Carousel>

        <p className={styles.blocksCount}>10+ blocks and growing</p>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <h2>Ready to make them smile?</h2>
          <p>Create a card that they&apos;ll remember forever</p>
          <Link href="/create" className="btn-primary">
            Create Your Card Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor" />
            </svg>
            <span>SineInverse</span>
          </div>
          <p className={styles.footerTagline}>Making digital love letters magical</p>
          <div className={styles.footerLinks}>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <p className={styles.copyright}>© 2026 SineInverse. Made with love in India</p>
        </div>
      </footer>
    </main >
  );
}
