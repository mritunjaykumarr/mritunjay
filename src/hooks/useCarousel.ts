import { useEffect, useRef, useState, useCallback } from 'react';
import { animate } from 'framer-motion';

export function useCarousel(itemCount: number, cardSelector: string = '.carousel-card') {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const grid = scrollRef.current;
    if (!section || !grid || itemCount <= 1) return;

    let isScrolling = false;

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.modal-overlay') || target.closest('.modal-bg') || target.closest('.modal-box') || target.closest('.modal')) {
        return;
      }

      if (e.deltaY === 0) return;
      const isScrollable = grid.scrollWidth > grid.clientWidth;
      if (!isScrollable) return;

      const isAtLeft = grid.scrollLeft === 0;
      const isAtRight = Math.abs(grid.scrollWidth - grid.clientWidth - grid.scrollLeft) < 1;

      if ((e.deltaY < 0 && isAtLeft) || (e.deltaY > 0 && isAtRight)) {
        return;
      }

      e.preventDefault();

      if (isScrolling) return;
      isScrolling = true;

      const cardWidth = grid.querySelector(cardSelector)?.clientWidth || 0;
      const gap = 24;
      const scrollAmount = cardWidth + gap;
      const from = grid.scrollLeft;
      const to = from + (e.deltaY > 0 ? scrollAmount : -scrollAmount);

      animate(from, to, {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (latest: number) => { grid.scrollLeft = latest; },
        onComplete: () => { isScrolling = false; },
      });
    };

    const handleScroll = () => {
      const cardWidth = grid.querySelector(cardSelector)?.clientWidth || 0;
      const gap = 24;
      const idx = Math.round(grid.scrollLeft / (cardWidth + gap));
      setActiveIndex(idx);
    };

    grid.addEventListener('scroll', handleScroll, { passive: true });
    section.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      section.removeEventListener('wheel', handleWheel);
      grid.removeEventListener('scroll', handleScroll);
    };
  }, [itemCount, cardSelector]);

  const scrollTo = useCallback((index: number) => {
    const grid = scrollRef.current;
    if (!grid) return;
    const cardWidth = grid.querySelector(cardSelector)?.clientWidth || 0;
    const gap = 24;
    const from = grid.scrollLeft;
    const to = index * (cardWidth + gap);

    animate(from, to, {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest: number) => { grid.scrollLeft = latest; },
    });
  }, [cardSelector]);

  return { sectionRef, scrollRef, activeIndex, scrollTo };
}