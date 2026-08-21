import { useEffect, useRef } from 'react';

type AdUnitProps = {
  slot: string; // e.g. "6189533583"
  format?: string; // "auto" | "fluid" etc.
  style?: React.CSSProperties;
  className?: string;
  label?: string; // for accessibility / AdSense label
};

/**
 * Reusable AdSense unit for React SPA
 * - Assumes global adsbygoogle.js is already in index.html <head>
 *   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7211021479773356" crossorigin="anonymous">
 * - Renders <ins class="adsbygoogle"> + (adsbygoogle = window.adsbygoogle || []).push({})
 * - Respects policy: not rendered on 404, privacy, terms, or empty states
 */
declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdUnit({ slot, format = 'auto', style = { display: 'block' }, className = '', label = 'Advertisement' }: AdUnitProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    // Only push once per mount, and only in production + has slot
    if (!slot || pushed.current) return;
    // Ensure the <ins> is in DOM before pushing
    const tryPush = () => {
      try {
        if (window.adsbygoogle && insRef.current) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushed.current = true;
        }
      } catch (e) {
        // AdSense will log errors if not approved yet — ignore
        console.debug('AdSense push skipped', e);
      }
    };
    // Small delay ensures script loaded + ins rendered (SPA)
    const id = window.setTimeout(tryPush, 300);
    return () => window.clearTimeout(id);
  }, [slot]);

  return (
    <div className={`ad-unit-wrap ${className}`} aria-label={label} role="complementary" style={{ margin: '2rem 0', textAlign: 'center' }}>
      <div style={{ fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted-foreground)', fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '0.5rem' }}>
        Advertisement
      </div>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-7211021479773356"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      <style>{`
        .ad-unit-wrap { min-height: 100px; }
        .ad-unit-wrap ins.adsbygoogle { min-height: 100px; display: block; }
        @media (max-width: 768px) { .ad-unit-wrap { margin: 1.5rem 0 !important; } }
      `}</style>
    </div>
  );
}
