import { useEffect, useState } from 'react';

export default function Loader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setLoading(false), 1200);
    };
    
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      // Safety timeout: remove loader after 3s anyway
      const safety = setTimeout(handleLoad, 3000);
      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(safety);
      };
    }
  }, []);

  if (!loading) return null;

  return (
    <div className="loader" id="loader">
      <div className="l-content">
        <div className="l-logo">M.</div>
        <div className="l-bar"><div className="l-progress"></div></div>
      </div>
    </div>
  );
}
