import { useEffect, useRef, useState } from 'react';

export default function Loader() {
  const [loading, setLoading] = useState(true);
  const [isDone, setIsDone] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let fadeTimer: number | undefined;
    let removeTimer: number | undefined;
    let cancelled = false;
    let introTimeline: { kill: () => void } | null = null;

    (async () => {
      const gsapModule = await import('gsap');
      const gsap = gsapModule.default;

      if (cancelled) return;

      const loader = loaderRef.current;

      if (loader) {
        introTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('.loader-mark', { scale: 0.68, opacity: 0, duration: 0.85 })
          .from('.loader-ring', { scale: 0.84, opacity: 0, rotate: -120, duration: 1 }, 0)
          .from('.loader-stroke circle', { strokeDashoffset: 520, duration: 1.2 }, 0.1)
          .from('.loader-particle', { scale: 0, opacity: 0, stagger: 0.08, duration: 0.45 }, 0.18)
          .from('.loader-copy > *', { y: 16, opacity: 0, stagger: 0.12, duration: 0.55 }, 0.24)
          .to('.loader-mark', { scale: 1.03, duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut' }, 0.5)
          .to('.loader-ring', { rotate: 360, duration: 2.3, repeat: -1, ease: 'none' }, 0)
          .to('.loader-orbit', { rotate: 360, duration: 3.5, repeat: -1, ease: 'none' }, 0);
      }
    })();

    const startTimers = () => {
      fadeTimer = window.setTimeout(() => setLoading(false), 1100);
      removeTimer = window.setTimeout(() => setIsDone(true), 2100);
    };
    
    if (document.readyState === 'complete') {
      startTimers();
    } else {
      window.addEventListener('load', startTimers, { once: true });
      const safety = window.setTimeout(startTimers, 3000);
      return () => {
        window.removeEventListener('load', startTimers);
        if (fadeTimer) window.clearTimeout(fadeTimer);
        if (removeTimer) window.clearTimeout(removeTimer);
        window.clearTimeout(safety);
      };
    }

    return () => {
      cancelled = true;
      introTimeline?.kill();
      if (fadeTimer) window.clearTimeout(fadeTimer);
      if (removeTimer) window.clearTimeout(removeTimer);
    };
  }, []);

  if (isDone) return null;

  return (
    <div ref={loaderRef} className={`loader ${!loading ? 'hidden' : ''}`} id="loader">
      <div className="loader-canvas" aria-label="Loading portfolio">
        <div className="loader-ring"></div>
        <svg className="loader-stroke" viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r="74"></circle>
        </svg>
        <span className="loader-orbit"></span>
        <span className="loader-orbit alt"></span>
        <span className="loader-particle" style={{ top: '18%', left: '22%', animationDelay: '-0.4s' }}></span>
        <span className="loader-particle" style={{ top: '76%', left: '18%', animationDelay: '-1.1s' }}></span>
        <span className="loader-particle" style={{ top: '20%', right: '18%', animationDelay: '-1.6s' }}></span>
        <span className="loader-particle" style={{ bottom: '18%', right: '24%', animationDelay: '-2.2s' }}></span>
        <div className="loader-mark">
          <div className="loader-initials">
            <strong>MK</strong>
            <span>Loading</span>
          </div>
        </div>
      </div>

      <div className="loader-copy">
        <div className="loader-wordmark">MRITUNJAY KUMAR</div>
        <div className="loader-line">
          <div className="loader-line-fill"></div>
        </div>
        <div className="loader-label">Luxury motion system initializing</div>
      </div>
    </div>
  );
}
