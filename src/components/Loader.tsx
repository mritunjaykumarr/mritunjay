import { useEffect, useState } from 'react';

export default function Loader() {
  const [loading, setLoading] = useState(true);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setLoading(false), 1200);
      // Wait for transition to finish before removing from DOM (optional)
      setTimeout(() => setIsDone(true), 2100); 
    };
    
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      const safety = setTimeout(handleLoad, 3000);
      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(safety);
      };
    }
  }, []);

  if (isDone) return null;

  return (
    <div className={`loader ${!loading ? 'hidden' : ''}`} id="loader">
      <div className="loader-wordmark">MRITUNJAY</div>
      <div className="loader-line">
        <div className="loader-line-fill"></div>
      </div>
      <div className="loader-label">Architecting the future</div>
    </div>
  );
}
