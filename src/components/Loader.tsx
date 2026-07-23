import { useEffect, useState } from 'react';

export default function Loader() {
  const [loading, setLoading] = useState(true);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let fadeTimer: number | undefined;
    let removeTimer: number | undefined;

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
      if (fadeTimer) window.clearTimeout(fadeTimer);
      if (removeTimer) window.clearTimeout(removeTimer);
    };
  }, []);

  if (isDone) return null;

  return (
    <div className={`loader ${!loading ? 'hidden' : ''}`} id="loader">
      <div className="loader-canvas" aria-label="Loading portfolio">
        <div className="loader-ring"></div>
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
