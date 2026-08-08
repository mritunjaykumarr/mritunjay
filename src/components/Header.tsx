import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sun, Moon, FileText, X, Menu, ChevronRight,
  Briefcase, FolderKanban, Wrench, Award,
  BookOpen, DollarSign, Bot, LayoutDashboard, Gamepad2, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
}

/* ── Navigation data ── */
const primaryNav = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const drawerSections = [
  {
    title: 'Portfolio',
    items: [
      { label: 'Projects', path: '/projects', icon: FolderKanban },
      { label: 'Experience', path: '/experience', icon: Briefcase },
      { label: 'Skills', path: '/skills', icon: Wrench },
      { label: 'Certifications', path: '/certifications', icon: Award },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Blog', path: '/blog', icon: BookOpen },
      { label: 'Pricing', path: '/pricing', icon: DollarSign },
    ],
  },
  {
    title: 'Tools',
    items: [
      { label: 'PrinceAI', path: '/prince-ai', icon: Bot },
      { label: 'Playground', path: '/playground', icon: Gamepad2 },
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ],
  },
];


export default function Header({ theme, toggleTheme }: HeaderProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Drawer state (used on both desktop + mobile)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerBtnRef = useRef<HTMLButtonElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mobile menu state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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

  /* ── Escape key closes everything ── */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDrawerOpen(false);
        setIsMobileOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  /* ── Lock body scroll when mobile menu is open ── */
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  /* ── Close drawer on outside click ── */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(e.target as Node) &&
        drawerBtnRef.current &&
        !drawerBtnRef.current.contains(e.target as Node)
      ) {
        setIsDrawerOpen(false);
      }
    };
    if (isDrawerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDrawerOpen]);

  /* ── Close drawer on route change ── */
  useEffect(() => {
    setIsDrawerOpen(false);
    setIsMobileOpen(false);
  }, [currentPath]);

  /* ── Desktop hover behavior with delay ── */
  const handleDrawerAreaEnter = useCallback(() => {
    if (window.innerWidth >= 861) {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = setTimeout(() => setIsDrawerOpen(true), 120);
    }
  }, []);

  const handleDrawerAreaLeave = useCallback(() => {
    if (window.innerWidth >= 861) {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = setTimeout(() => setIsDrawerOpen(false), 200);
    }
  }, []);

  const isLinkActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  return (
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

        {/* CENTER: PRIMARY NAVIGATION LINKS (3 links) */}
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

          {/* Drawer Toggle Button (Desktop) */}
          <div
            className="navbar-drawer-trigger"
            onMouseEnter={handleDrawerAreaEnter}
            onMouseLeave={handleDrawerAreaLeave}
          >
            <button
              ref={drawerBtnRef}
              className={`navbar-drawer-btn ${isDrawerOpen ? 'open' : ''}`}
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              aria-label="Open navigation drawer"
              aria-expanded={isDrawerOpen}
            >
              <span className="drawer-btn-lines">
                <span />
                <span />
                <span />
              </span>
            </button>

            {/* Desktop Drawer Panel */}
            <AnimatePresence>
              {isDrawerOpen && (
                <motion.div
                  ref={drawerRef}
                  className="navbar-drawer-panel"
                  role="menu"
                  aria-label="Extended navigation"
                  initial={{ opacity: 0, y: -12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.96 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={handleDrawerAreaEnter}
                  onMouseLeave={handleDrawerAreaLeave}
                >
                  <div className="drawer-panel-header">
                    <Sparkles size={14} />
                    <span>Explore</span>
                  </div>

                  <div className="drawer-panel-body">
                    {drawerSections.map((section, si) => (
                      <div key={section.title} className="drawer-section">
                        <p className="drawer-section-title">{section.title}</p>
                        <div className="drawer-section-items">
                          {section.items.map((item, ii) => {
                            const Icon = item.icon;
                            const active = isLinkActive(item.path);
                            return (
                              <motion.div
                                key={item.path}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.03 * (si * 4 + ii), duration: 0.22 }}
                              >
                                <Link
                                  to={item.path}
                                  className={`drawer-nav-item ${active ? 'active' : ''}`}
                                  onClick={() => setIsDrawerOpen(false)}
                                >
                                  <span className="drawer-nav-icon"><Icon size={16} /></span>
                                  <span className="drawer-nav-label">{item.label}</span>
                                  <ChevronRight size={14} className="drawer-nav-arrow" />
                                </Link>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className={`navbar-hamburger-btn ${isMobileOpen ? 'open' : ''}`}
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE FULL-SCREEN MENU */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="navbar-mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              className="navbar-mobile-menu"
              role="navigation"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mobile-menu-header">
                <div className="mobile-menu-brand">
                  <Sparkles size={16} className="text-accent" />
                  <span>Navigation</span>
                </div>
                <button
                  className="mobile-close-btn"
                  onClick={() => setIsMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Primary links */}
              <div className="mobile-menu-links">
                {primaryNav.map((link, i) => {
                  const active = isLinkActive(link.path);
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i, duration: 0.25 }}
                    >
                      <Link
                        to={link.path}
                        className={`mobile-nav-item ${active ? 'active' : ''}`}
                        onClick={() => setIsMobileOpen(false)}
                      >
                        <span>{link.label}</span>
                        {active && <span className="mobile-active-dot" />}
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Drawer sections in mobile */}
                {drawerSections.map((section, si) => (
                  <div key={section.title} className="mobile-section-group">
                    <p className="mobile-section-label">{section.title}</p>
                    {section.items.map((item, ii) => {
                      const active = isLinkActive(item.path);
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={item.path}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.04 * (primaryNav.length + si * 4 + ii), duration: 0.25 }}
                        >
                          <Link
                            to={item.path}
                            className={`mobile-nav-item ${active ? 'active' : ''}`}
                            onClick={() => setIsMobileOpen(false)}
                          >
                            <span className="mobile-nav-icon"><Icon size={15} /></span>
                            <span>{item.label}</span>
                            {active && <span className="mobile-active-dot" />}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="mobile-menu-footer">
                <div className="mobile-meta-row">
                  <div className="mobile-time-badge">
                    <span className="live-pulse-dot" />
                    <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST</span>
                  </div>

                  <button
                    className="mobile-theme-btn"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                </div>

                <div className="mobile-actions-grid">
                  <a
                    href="/updated_resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mobile-resume-btn"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <FileText size={15} />
                    <span>Resume</span>
                  </a>
                  <Link
                    to="/contact"
                    className="mobile-contact-btn"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <span>Contact Me</span>
                    <ChevronRight size={15} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
