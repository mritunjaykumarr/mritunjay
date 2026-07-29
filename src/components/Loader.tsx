import { useEffect, useState } from 'react';

export default function Loader() {
  const [loading, setLoading] = useState(true);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let fadeTimer: number | undefined;
    let removeTimer: number | undefined;

    const startTimers = () => {
      fadeTimer = window.setTimeout(() => setLoading(false), 1200);
      removeTimer = window.setTimeout(() => setIsDone(true), 1900);
    };

    if (document.readyState === 'complete') {
      startTimers();
    } else {
      window.addEventListener('load', startTimers, { once: true });
      const safety = window.setTimeout(startTimers, 3000);
      return () => {
        window.removeEventListener('load', startTimers);
        window.clearTimeout(safety);
        if (fadeTimer) window.clearTimeout(fadeTimer);
        if (removeTimer) window.clearTimeout(removeTimer);
      };
    }

    return () => {
      if (fadeTimer) window.clearTimeout(fadeTimer);
      if (removeTimer) window.clearTimeout(removeTimer);
    };
  }, []);

  if (isDone) return null;

  return (
    <div className={`loader ${!loading ? 'hidden' : ''}`} aria-label="Loading portfolio">
      <div className="loader-ring-wrap">
        <div className="loader-ring" />
        <div className="loader-ring-inner" />
        <div className="loader-initials">MK</div>
      </div>
      <div className="loader-text">Loading</div>
      <div className="loader-progress">
        <div className="loader-progress-fill" />
      </div>
    </div>
  );
}
