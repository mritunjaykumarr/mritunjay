import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sun, Moon, FileText, X, ChevronRight,
  Briefcase, FolderKanban, Wrench, Award,
  BookOpen, DollarSign, Bot, LayoutDashboard, Gamepad2, Sparkles,
  Home, User, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
}

/* ── Navigation data ── */
const primaryNav = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'About', path: '/about', icon: User },
  { label: 'Contact', path: '/contact', icon: Mail },
];

const drawerSections = [
  {
    title: 'Portfolio & Work',
    items: [
      { label: 'Projects', path: '/projects', icon: FolderKanban, desc: 'Selected builds & case studies' },
      { label: 'Experience', path: '/experience', icon: Briefcase, desc: 'Career path & engineering work' },
      { label: 'Skills', path: '/skills', icon: Wrench, desc: 'Frontend, backend & AI stack' },
      { label: 'Certifications', path: '/certifications', icon: Award, desc: 'Verified credentials & achievements' },
    ],
  },
  {
    title: 'Writing & Pricing',
    items: [
      { label: 'Blog & Articles', path: '/blog', icon: BookOpen, desc: 'Insights on React 19, AI & motion' },
      { label: 'Services & Pricing', path: '/pricing', icon: DollarSign, desc: 'Product build plans & rates' },
    ],
  },
  {
    title: 'AI & Interactive Tools',
    items: [
      { label: 'PrinceAI', path: '/prince-ai', icon: Bot, desc: 'Personal LLM AI assistant' },
      { label: 'Playground', path: '/playground', icon: Gamepad2, desc: 'Interactive AI & UI experiments' },
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, desc: 'Performance analytics & stats' },
    ],
  },
];

export default function Header({ theme, toggleTheme }: HeaderProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerPanelRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Live clock ── */
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* ── Scroll tracking ── */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      setScrollProgress(Math.min(window.scrollY / maxScroll, 1));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Escape key closes drawer ── */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  /* ── Lock body scroll when drawer is open ── */
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isDrawerOpen]);

  /* ── Close drawer on route change ── */
  useEffect(() => {
    const timer = setTimeout(() => setIsDrawerOpen(false), 0);
    return () => clearTimeout(timer);
  }, [currentPath]);

  /* ── Desktop hover triggers ── */
  const handleTriggerMouseEnter = useCallback(() => {
    if (window.innerWidth >= 861) {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = setTimeout(() => setIsDrawerOpen(true), 150);
    }
  }, []);

  const handleDrawerMouseLeave = useCallback(() => {
    if (window.innerWidth >= 861) {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = setTimeout(() => setIsDrawerOpen(false), 250);
    }
  }, []);

  const handleDrawerMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  }, []);

  const isLinkActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  return (
    <>
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`header-floating-wrapper ${scrolled ? 'header-scrolled' : ''}`}
        id="header"
      >
        <div className="navbar-pill-container">
          {/* Scroll Progress Bar */}
          <div className="header-progress" aria-hidden="true">
            <span style={{ transform: `scaleX(${Math.max(scrollProgress, 0.005)})` }} />
          </div>

          {/* LEFT: LOGO */}
          <Link to="/" className="navbar-logo" aria-label="Mritunjay AI Home">
            <img src="/brand/mritunjay-logo.svg" alt="Mritunjay" className="navbar-brand-logo" />
          </Link>

          {/* CENTER: PRIMARY NAVIGATION LINKS (3 links: Home, About, Contact) */}
          <nav className="navbar-center-nav" aria-label="Main navigation">
            {primaryNav.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-pill-item ${active ? 'active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {active && (
                    <motion.span
                      layoutId="navbar-active-pill"
                      className="nav-active-bg"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="nav-pill-label">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: ACTIONS */}
          <div className="navbar-right-actions">
            {/* Live Time Display */}
            <div className="navbar-live-time" title="Current Local Time (IST)">
              <span className="live-pulse-dot" aria-hidden="true" />
              <span className="time-text">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="time-tz">IST</span>
            </div>

            {/* Theme Toggle Button */}
            <motion.button
              className="navbar-theme-btn"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              onClick={toggleTheme}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92, rotate: 180 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </motion.button>

            {/* Resume Button */}
            <a
              href="/updated_resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="navbar-resume-btn"
              aria-label="Download or view Resume PDF"
            >
              <FileText size={14} />
              <span>Resume</span>
            </a>

            {/* Drawer / Menu Trigger Button (Desktop & Mobile) */}
            <button
              className={`navbar-drawer-trigger-btn ${isDrawerOpen ? 'open' : ''}`}
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              onMouseEnter={handleTriggerMouseEnter}
              aria-label="Toggle Navigation Drawer"
              aria-expanded={isDrawerOpen}
            >
              {isDrawerOpen ? (
                <X size={18} />
              ) : (
                <div className="drawer-hamburger-icon">
                  <span />
                  <span />
                  <span />
                </div>
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── PREMIUM SLIDE-IN SIDE DRAWER ── */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop Tint Overlay */}
            <motion.div
              className="navbar-drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsDrawerOpen(false)}
            />

            {/* Slide-In Side Panel */}
            <motion.div
              ref={drawerPanelRef}
              className="navbar-drawer-slide-panel"
              role="dialog"
              aria-label="Navigation Drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 32 }}
              onMouseEnter={handleDrawerMouseEnter}
              onMouseLeave={handleDrawerMouseLeave}
            >
              {/* Drawer Top Bar */}
              <div className="drawer-panel-topbar">
                <div className="drawer-panel-brand">
                  <Sparkles size={16} className="drawer-sparkle-icon" />
                  <div>
                    <span className="drawer-brand-name">Navigation</span>
                    <span className="drawer-brand-sub">Explore Portfolio & Tools</span>
                  </div>
                </div>
                <button
                  className="drawer-close-btn"
                  onClick={() => setIsDrawerOpen(false)}
                  aria-label="Close navigation drawer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Main Scrollable Content */}
              <div className="drawer-panel-scroll-content">
                {/* Quick Access Primary Nav (for mobile / all screen sizes) */}
                <div className="drawer-primary-grid">
                  {primaryNav.map((link) => {
                    const Icon = link.icon;
                    const active = isLinkActive(link.path);
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`drawer-primary-card ${active ? 'active' : ''}`}
                        onClick={() => setIsDrawerOpen(false)}
                      >
                        <Icon size={18} />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Categorized Navigation Sections */}
                {drawerSections.map((section, si) => (
                  <div key={section.title} className="drawer-section-group">
                    <p className="drawer-group-heading">{section.title}</p>
                    <div className="drawer-group-list">
                      {section.items.map((item, ii) => {
                        const Icon = item.icon;
                        const active = isLinkActive(item.path);
                        return (
                          <motion.div
                            key={item.path}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.03 * (si * 3 + ii), duration: 0.22 }}
                          >
                            <Link
                              to={item.path}
                              className={`drawer-item-link ${active ? 'active' : ''}`}
                              onClick={() => setIsDrawerOpen(false)}
                            >
                              <div className="drawer-item-icon-box">
                                <Icon size={17} />
                              </div>
                              <div className="drawer-item-text">
                                <span className="drawer-item-title">{item.label}</span>
                                <span className="drawer-item-desc">{item.desc}</span>
                              </div>
                              <ChevronRight size={15} className="drawer-item-arrow" />
                            </Link>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Drawer Bottom Bar */}
              <div className="drawer-panel-footer">
                <div className="drawer-footer-meta">
                  <div className="drawer-time-badge">
                    <span className="live-pulse-dot" />
                    <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST</span>
                  </div>

                  <button
                    className="drawer-theme-toggle-btn"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                </div>

                <div className="drawer-footer-actions">
                  <a
                    href="/updated_resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="drawer-resume-action"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    <FileText size={15} />
                    <span>Resume PDF</span>
                  </a>
                  <Link
                    to="/contact"
                    className="drawer-contact-action"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    <span>Get In Touch</span>
                    <ChevronRight size={15} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
