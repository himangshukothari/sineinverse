'use client';

/**
 * Carousel Component with Netflix-style Navigation
 * - Left/Right navigation buttons on edges
 * - Arrows appear on hover
 * - Smooth scroll on click
 * - Touch/drag support
 */

import { useRef, useState, useEffect, ReactNode } from 'react';
import styles from './Carousel.module.css';

interface CarouselProps {
    children: ReactNode;
    className?: string;
}

export default function Carousel({ children, className = '' }: CarouselProps) {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [showPrev, setShowPrev] = useState(false);
    const [showNext, setShowNext] = useState(true);

    // Update navigation state based on scroll position
    const updateNavState = () => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        const scrollLeft = carousel.scrollLeft;
        const scrollWidth = carousel.scrollWidth;
        const clientWidth = carousel.clientWidth;

        // Show prev button if scrolled past 5px
        setShowPrev(scrollLeft > 5);

        // Hide next button if at end
        setShowNext(scrollLeft + clientWidth < scrollWidth - 5);
    };

    // Scroll carousel
    const scroll = (direction: 'prev' | 'next') => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        // Get first card to calculate scroll amount
        const card = carousel.firstElementChild as HTMLElement;
        if (!card) return;

        const cardWidth = card.offsetWidth;
        const gap = 24; // Same as CSS gap
        const visibleWidth = carousel.clientWidth;
        const cardWithGap = cardWidth + gap;

        // Scroll by most of the visible area
        const cardsToScroll = Math.max(1, Math.floor((visibleWidth - 80) / cardWithGap));
        const scrollAmount = cardWithGap * cardsToScroll;

        carousel.scrollBy({
            left: direction === 'next' ? scrollAmount : -scrollAmount,
            behavior: 'smooth'
        });
    };

    // Set up scroll listener
    useEffect(() => {
        const carousel = carouselRef.current;
        if (!carousel) return;

        carousel.addEventListener('scroll', updateNavState);
        updateNavState(); // Initial check

        // Also check on resize
        const resizeObserver = new ResizeObserver(updateNavState);
        resizeObserver.observe(carousel);

        return () => {
            carousel.removeEventListener('scroll', updateNavState);
            resizeObserver.disconnect();
        };
    }, []);

    return (
        <div className={styles.carouselWrapper}>
            {/* Left Navigation */}
            <button
                className={`${styles.navZone} ${styles.prev} ${showPrev ? styles.visible : ''}`}
                onClick={() => scroll('prev')}
                aria-label="Scroll left"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            </button>

            {/* Carousel Track */}
            <div ref={carouselRef} className={`${styles.carousel} ${className}`}>
                {children}
            </div>

            {/* Right Navigation */}
            <button
                className={`${styles.navZone} ${styles.next} ${showNext ? styles.visible : ''}`}
                onClick={() => scroll('next')}
                aria-label="Scroll right"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>
        </div>
    );
}
