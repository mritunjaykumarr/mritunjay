import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, ArrowRight, FileText, Sparkles, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
}

export default function Header({ theme, toggleTheme }: HeaderProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      setScrollProgress(Math.min(window.scrollY / maxScroll, 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu on escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/#about' },
    { label: 'PrinceAI', path: '/#prince-ai' },
    { label: 'Projects', path: '/#projects' },
    { label: 'Experience', path: '/#experience' },
    { label: 'Skills', path: '/#skills' },
    { label: 'Blog', path: '/#blog' },
    { label: 'Contact', path: '/#contact' },
  ];

  const isLinkActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  return (
    <motion.header
      ref={headerRef}
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
          <img src="/brand/mritunjay-logo.svg" className="navbar-brand-logo" alt="Mritunjay" />
        </Link>

        {/* CENTER: DESKTOP NAVIGATION LINKS */}
        <nav className="navbar-center-nav" aria-label="Main navigation">
          {navLinks.map((link) => {
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

        {/* RIGHT: ACTIONS (Live Time, Theme Toggle, Resume, Contact CTA) */}
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

          {/* Secondary Resume Button */}
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

          {/* Primary Gradient Contact CTA Button */}
          <Link to="/#contact" className="navbar-contact-cta">
            <span>Hire Me</span>
            <ArrowRight size={14} className="cta-arrow-icon" />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            className={`navbar-hamburger-btn ${isMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Navigation Menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE SLIDE-DOWN GLASS MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="navbar-mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsMenuOpen(false)}
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
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mobile-menu-links">
                {navLinks.map((link, i) => {
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
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span>{link.label}</span>
                        {active && <span className="mobile-active-dot" />}
                      </Link>
                    </motion.div>
                  );
                })}
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
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FileText size={15} />
                    <span>Resume</span>
                  </a>
                  <Link
                    to="/#contact"
                    className="mobile-contact-btn"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>Contact Me</span>
                    <ArrowRight size={15} />
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
