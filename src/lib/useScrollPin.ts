import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollPin(itemCount: number) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) return;

    const ctx = gsap.context(() => {
      // We want to move the track entirely to the left so the last element is visible
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: "none" // Linear movement tied to scroll
      });

      triggerRef.current = ScrollTrigger.create({
        trigger: section,
        start: "center center",
        end: () => `+=${track.scrollWidth - window.innerWidth}`,
        pin: true,
        animation: tween,
        scrub: 1, // Smooth 1-second scrub interpolation
        invalidateOnRefresh: true, // Recalculates on resize
        onUpdate: (self) => {
          if (itemCount > 0) {
            const newIndex = Math.round(self.progress * (itemCount - 1));
            setActiveIndex(newIndex);
          }
        }
      });
    }, section);

    return () => ctx.revert();
  }, [itemCount]);

  const scrollTo = (index: number) => {
    const st = triggerRef.current;
    if (!st || itemCount <= 1) return;
    
    const progress = index / (itemCount - 1);
    const scrollPos = st.start + (st.end - st.start) * progress;
    
    // Smooth scroll window to the calculated trigger position
    window.scrollTo({
      top: scrollPos,
      behavior: 'smooth'
    });
  };

  return { sectionRef, trackRef, activeIndex, scrollTo };
}
