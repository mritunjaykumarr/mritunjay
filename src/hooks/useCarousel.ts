import { useEffect, useRef, useState } from 'react';

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
        return; // Allow natural scrolling inside modals
      }

      if (e.deltaY === 0) return;
      const isScrollable = grid.scrollWidth > grid.clientWidth;
      if (!isScrollable) return;
      
      const isAtLeft = grid.scrollLeft === 0;
      const isAtRight = Math.abs(grid.scrollWidth - grid.clientWidth - grid.scrollLeft) < 1;
      
      // If we're scrolling up and already at the start, or scrolling down and at the end, 
      // let the page scroll naturally
      if ((e.deltaY < 0 && isAtLeft) || (e.deltaY > 0 && isAtRight)) {
        return;
      }
      
      e.preventDefault();
      
      if (isScrolling) return;
      isScrolling = true;
      
      const cardWidth = grid.querySelector(cardSelector)?.clientWidth || 0;
      const gap = 24; // 1.5rem gap
      const scrollAmount = cardWidth + gap;
      
      grid.scrollBy({ left: e.deltaY > 0 ? scrollAmount : -scrollAmount, behavior: 'smooth' });
      
      setTimeout(() => {
        isScrolling = false;
      }, 400); 
    };

    const handleScroll = () => {
      const cardWidth = grid.querySelector(cardSelector)?.clientWidth || 0;
      const gap = 24;
      const index = Math.round(grid.scrollLeft / (cardWidth + gap));
      setActiveIndex(index);
    };

    grid.addEventListener('scroll', handleScroll, { passive: true });
    section.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      section.removeEventListener('wheel', handleWheel);
      grid.removeEventListener('scroll', handleScroll);
    };
  }, [itemCount, cardSelector]);

  const scrollTo = (index: number) => {
    const grid = scrollRef.current;
    if (!grid) return;
    const cardWidth = grid.querySelector(cardSelector)?.clientWidth || 0;
    const gap = 24;
    grid.scrollTo({ left: index * (cardWidth + gap), behavior: 'smooth' });
  };

  return { sectionRef, scrollRef, activeIndex, scrollTo };
}
