import { useEffect, useRef } from 'react';

/**
 * Animaster-style trailing cursor
 * - main dot (accent) snaps
 * - ring (foreground) trails 0.15
 * - 3 extra pastel dots trail 0.09 / 0.06 / 0.04 → scroll/mouse comet
 */
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const t1Ref = useRef<HTMLDivElement>(null);
  const t2Ref = useRef<HTMLDivElement>(null);
  const t3Ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const t1Pos = useRef({ x: 0, y: 0 });
  const t2Pos = useRef({ x: 0, y: 0 });
  const t3Pos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    const t1 = t1Ref.current;
    const t2 = t2Ref.current;
    const t3 = t3Ref.current;
    if (!cursor || !ring) return;

    // Reduced-motion or touch → no trail
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onMouseMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      // Lerp ring + 3 pastel trail dots (animaster)
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.15;
      t1Pos.current.x += (pos.current.x - t1Pos.current.x) * 0.09;
      t1Pos.current.y += (pos.current.y - t1Pos.current.y) * 0.09;
      t2Pos.current.x += (pos.current.x - t2Pos.current.x) * 0.06;
      t2Pos.current.y += (pos.current.y - t2Pos.current.y) * 0.06;
      t3Pos.current.x += (pos.current.x - t3Pos.current.x) * 0.04;
      t3Pos.current.y += (pos.current.y - t3Pos.current.y) * 0.04;

      cursor.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      if (t1) t1.style.transform = `translate3d(${t1Pos.current.x}px, ${t1Pos.current.y}px, 0) translate(-50%, -50%)`;
      if (t2) t2.style.transform = `translate3d(${t2Pos.current.x}px, ${t2Pos.current.y}px, 0) translate(-50%, -50%)`;
      if (t3) t3.style.transform = `translate3d(${t3Pos.current.x}px, ${t3Pos.current.y}px, 0) translate(-50%, -50%)`;

      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    const onEnter = () => {
      cursor.classList.add('hovered');
      ring.classList.add('hovered');
    };
    const onLeave = () => {
      cursor.classList.remove('hovered');
      ring.classList.remove('hovered');
    };

    const attachListeners = () => {
      document.querySelectorAll('a, button, .project-card, .cert-card, .blog-card-cover').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    };

    attachListeners();
    const observer = new MutationObserver(attachListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />
      {/* animaster pastel trail — secondary / tertiary / quaternary */}
      <div
        ref={t1Ref}
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0, width: 10, height: 10, borderRadius: '50%',
          background: 'var(--secondary)', border: '2px solid var(--foreground)',
          boxShadow: '2px 2px 0 var(--foreground)', pointerEvents: 'none', zIndex: 9997, willChange: 'transform',
        }}
      />
      <div
        ref={t2Ref}
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0, width: 14, height: 14, borderRadius: '50%',
          background: 'var(--tertiary)', border: '2px solid var(--foreground)',
          boxShadow: '2px 2px 0 var(--foreground)', pointerEvents: 'none', zIndex: 9997, willChange: 'transform',
        }}
      />
      <div
        ref={t3Ref}
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0, width: 8, height: 8, borderRadius: '50%',
          background: 'var(--quaternary)', border: '2px solid var(--foreground)',
          boxShadow: '1px 1px 0 var(--foreground)', pointerEvents: 'none', zIndex: 9997, willChange: 'transform',
        }}
      />
      <style>{`@media (pointer: coarse), (prefers-reduced-motion: reduce) { div[aria-hidden="true"][style*="var(--secondary)"], div[aria-hidden="true"][style*="var(--tertiary)"] { display:none !important; } }`}</style>
    </>
  );
}
