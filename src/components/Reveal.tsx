import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  stagger?: number;
};

/**
 * Framer-based reveal — pop scale 0.92→1 with bounce, respects reduced-motion
 * Use for cards, headings. Stagger via delay.
 */
export function Reveal({ children, delay = 0, y = 14, className = '' }: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, scale: 0.94, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2, margin: '-40px' }}
      transition={{ duration: 0.55, delay, ease: [0.34, 1.56, 0.64, 1] as any }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger container — children pop one after another
 */
export function Stagger({ children, className = '', delay = 0, style }: { children: ReactNode; className?: string; delay?: number; style?: React.CSSProperties }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className} style={style}>{children}</div>;
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export const itemPop = {
  hidden: { opacity: 0, y: 18, scale: 0.92, rotate: -1 },
  show: { opacity: 1, y: 0, scale: 1, rotate: 0, transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as any } },
};

export const itemPopAlt = {
  hidden: { opacity: 0, y: 18, scale: 0.92, rotate: 1 },
  show: { opacity: 1, y: 0, scale: 1, rotate: 0, transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as any } },
};
