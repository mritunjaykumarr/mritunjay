import { useEffect, useState } from 'react';

export default function Loader() {
  const [loading, setLoading] = useState(true);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let fadeTimer: number | undefined;
    let removeTimer: number | undefined;

    const startTimers = () => {
      fadeTimer = window.setTimeout(() => setLoading(false), 800);
      removeTimer = window.setTimeout(() => setIsDone(true), 1300);
    };

    if (document.readyState === 'complete') {
      startTimers();
    } else {
      window.addEventListener('load', startTimers, { once: true });
      const safety = window.setTimeout(startTimers, 2000);
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
    <div
      aria-label="Loading portfolio"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000000',
        color: '#ffffff',
        opacity: loading ? 1 : 0,
        visibility: loading ? 'visible' : 'hidden',
        transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.5s ease',
        pointerEvents: loading ? 'all' : 'none',
      }}
    >
      <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '1.5rem' }}>
        {/* Outer Ring */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            borderTopColor: '#ffffff',
            animation: 'loaderSpin 0.9s linear infinite',
          }}
        />
        {/* Inner Ring */}
        <div
          style={{
            position: 'absolute',
            inset: '8px',
            borderRadius: '50%',
            border: '2px solid transparent',
            borderBottomColor: 'rgba(255, 255, 255, 0.4)',
            animation: 'loaderSpin 1.4s linear infinite reverse',
          }}
        />
        {/* Monogram */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#ffffff',
            letterSpacing: '-0.02em',
          }}
        >
          MK
        </div>
      </div>

      <div
        style={{
          fontSize: '0.75rem',
          color: '#888888',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontWeight: 500,
        }}
      >
        Loading System
      </div>

      <div
        style={{
          width: '120px',
          height: '2px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '9999px',
          marginTop: '1rem',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #9a9a9a, #ffffff)',
            borderRadius: '9999px',
            animation: 'loaderProgress 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        />
      </div>

      <style>{`
        @keyframes loaderSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes loaderProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
