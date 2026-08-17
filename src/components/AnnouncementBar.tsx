import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tv, Sparkles, ArrowRight, X } from 'lucide-react';

interface AnnouncementBarProps {
  onHeightChange?: (height: number) => void;
}

export default function AnnouncementBar({ onHeightChange }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      const isDismissed = sessionStorage.getItem('mritify_live_tv_announcement_dismissed');
      return !isDismissed;
    }
    return true;
  });

  useEffect(() => {
    if (isVisible) {
      document.documentElement.style.setProperty('--announcement-bar-height', '42px');
      onHeightChange?.(42);
    } else {
      document.documentElement.style.setProperty('--announcement-bar-height', '0px');
      onHeightChange?.(0);
    }
  }, [isVisible, onHeightChange]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsVisible(false);
    sessionStorage.setItem('mritify_live_tv_announcement_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -45, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -45, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="announcement-bar-wrapper"
          role="region"
          aria-label="New Release Announcement"
        >
          {/* Animated Background Shimmer */}
          <div className="announcement-shimmer" aria-hidden="true" />

          <a
            href="https://live-tv-sooty.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="announcement-bar-content"
            title="Launch Live TV Channels by Mritify"
          >
            {/* Live Status Badge */}
            <div className="announcement-badge">
              <span className="announcement-live-dot" aria-hidden="true" />
              <Tv size={13} className="announcement-tv-icon" />
              <span className="announcement-badge-text">LIVE TV</span>
            </div>

            {/* Main Message */}
            <div className="announcement-message">
              <span className="announcement-highlight">🎉 Live TV Channel website by Mritify is now live!</span>
              <span className="announcement-subtext">Stream 100+ channels free</span>
            </div>

            {/* Interactive CTA Pill */}
            <div className="announcement-cta-btn">
              <Sparkles size={12} className="announcement-sparkle-icon" />
              <span>Click Here to Access</span>
              <ArrowRight size={13} className="announcement-arrow-icon" />
            </div>
          </a>

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="announcement-dismiss-btn"
            aria-label="Dismiss announcement"
            title="Dismiss"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
