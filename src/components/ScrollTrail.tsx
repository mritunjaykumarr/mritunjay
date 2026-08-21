import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Animaster-style scroll trail
 * - Top progress bar (hard shadow style)
 * - Left vertical dotted trail with active dot that follows scroll
 * - Respects prefers-reduced-motion
 */
export default function ScrollTrail() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(m.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    m.addEventListener?.('change', h);
    return () => m.removeEventListener?.('change', h);
  }, []);

  if (reduced) return null;

  return (
    <>
      {/* Top hard-shadow progress — playful 4px bar with foreground border */}
      <motion.div
        aria-hidden="true"
        style={{
          scaleX,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: 'var(--accent)',
          borderBottom: '2px solid var(--foreground)',
          transformOrigin: '0%',
          zIndex: 9999,
        }}
      />
      {/* Left vertical trail — dots + fill */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: 14,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 18,
          height: '38vh',
          minHeight: 180,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          pointerEvents: 'none',
          zIndex: 999,
        }}
        className="scroll-trail-wrap"
      >
        {/* track */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 8,
            bottom: 8,
            width: 4,
            background: 'var(--border)',
            border: '2px solid var(--foreground)',
            borderRadius: 999,
            transform: 'translateX(-50%)',
            overflow: 'hidden',
          }}
        >
          <motion.div
            style={{
              scaleY,
              transformOrigin: '0% 0%',
              position: 'absolute',
              inset: 0,
              background: 'var(--accent)',
              borderRadius: 999,
            }}
          />
          {/* trailing glow dot */}
          <motion.div
            style={{
              y: useTransform(scrollYProgress, [0, 1], ['0%', 'calc(38vh - 24px)']),
              position: 'absolute',
              left: '50%',
              top: 0,
              width: 10,
              height: 10,
              background: 'var(--tertiary)',
              border: '2px solid var(--foreground)',
              borderRadius: '50%',
              boxShadow: '2px 2px 0 var(--foreground)',
              transform: 'translateX(-50%)',
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          />
        </div>

        {/* 4 section dots */}
        {[ 'var(--accent)', 'var(--secondary)', 'var(--tertiary)', 'var(--quaternary)' ].map((c, i) => {
          const dotY = useTransform(scrollYProgress, [i * 0.25, (i + 1) * 0.25], [0.4, 1]);
          return (
            <motion.div
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: c,
                border: '2px solid var(--foreground)',
                boxShadow: '2px 2px 0 var(--foreground)',
                zIndex: 1,
                scale: dotY,
              }}
            />
          );
        })}
      </div>

      <style>{`
        @media (max-width: 1024px) { .scroll-trail-wrap { display: none !important; } }
        @media (prefers-reduced-motion: reduce) { .scroll-trail-wrap { display: none !important; } }
      `}</style>
    </>
  );
}
