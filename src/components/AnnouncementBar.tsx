import { useState, useEffect } from 'react';
import { Tv, ArrowRight, X } from 'lucide-react';

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(true); // Default true until checked

  useEffect(() => {
    try {
      const isDismissed = sessionStorage.getItem('mritify_announcement_dismissed');
      setDismissed(isDismissed === 'true');
    } catch {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(true);
    try {
      sessionStorage.setItem('mritify_announcement_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  if (dismissed) return null;

  return (
    <div
      className="announcement-bar-wrapper"
      role="region"
      aria-label="Live TV Channel Release Announcement"
    >
      {/* Animated Background Shimmer */}
      <div className="announcement-shimmer" aria-hidden="true" />

      <div className="announcement-bar-inner">
        <a
          href="https://live-tv-sooty.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="announcement-bar-content"
          title="Access Live TV Channels by Mritify"
        >
          {/* Live Status Badge */}
          <div className="announcement-badge">
            <span className="announcement-live-dot" aria-hidden="true" />
            <Tv size={12} className="announcement-tv-icon" />
            <span className="announcement-badge-text">LIVE TV</span>
          </div>

          {/* Main Message */}
          <div className="announcement-message">
            <span className="announcement-highlight">Live TV Channel website created by Mritify</span>
            <span className="announcement-subtext">· 100+ Channels</span>
          </div>

          {/* Interactive CTA Pill */}
          <div className="announcement-cta-btn">
            <span>Access</span>
            <ArrowRight size={12} className="announcement-arrow-icon" />
          </div>
        </a>

        {/* Close / Dismiss Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="announcement-close-btn"
          aria-label="Dismiss announcement"
          title="Dismiss announcement"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
