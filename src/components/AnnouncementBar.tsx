import { Tv, Sparkles, ArrowRight } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div
      className="announcement-bar-wrapper"
      role="region"
      aria-label="Live TV Channel Release Announcement"
    >
      {/* Animated Background Shimmer */}
      <div className="announcement-shimmer" aria-hidden="true" />

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
          <Tv size={13} className="announcement-tv-icon" />
          <span className="announcement-badge-text">LIVE TV</span>
        </div>

        {/* Main Message */}
        <div className="announcement-message">
          <span className="announcement-highlight">🎉 Live TV Channel website created by Mritify!</span>
          <span className="announcement-subtext">Stream 100+ live channels instantly</span>
        </div>

        {/* Interactive CTA Pill */}
        <div className="announcement-cta-btn">
          <Sparkles size={12} className="announcement-sparkle-icon" />
          <span>Click Here for Access</span>
          <ArrowRight size={13} className="announcement-arrow-icon" />
        </div>
      </a>
    </div>
  );
}
