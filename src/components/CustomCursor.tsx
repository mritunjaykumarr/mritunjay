import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      cursor.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`;
    };

    document.addEventListener('mousemove', onMouseMove);

    const onMouseEnter = () => {
      cursor.classList.add('hovered');
      ring.classList.add('hovered');
    };
    const onMouseLeave = () => {
      cursor.classList.remove('hovered');
      ring.classList.remove('hovered');
    };

    const attachListeners = () => {
      const interactive = document.querySelectorAll('a, button, .tilt-card, .cert-card, .connect-card, .blog-card-cover, .blog-action-btn');
      interactive.forEach(el => {
        el.addEventListener('mouseenter', onMouseEnter);
        el.addEventListener('mouseleave', onMouseLeave);
      });
    };

    attachListeners();
    const observer = new MutationObserver(attachListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="cursor" ref={cursorRef}></div>
      <div className="cursor-ring" ref={ringRef}></div>
    </>
  );
}
