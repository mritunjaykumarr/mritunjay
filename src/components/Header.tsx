import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FileText, X, ChevronRight,
  Briefcase, FolderKanban, Wrench, Award,
  BookOpen, DollarSign, Bot, LayoutDashboard, Gamepad2, Sparkles,
  User, Mail, Code2, Sun, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
}

/* ── Primary 3-column nav ── */
const primaryNav = [
  { label: 'About', path: '/about' },
  { label: 'Skills', path: '/skills' },
  { label: 'Projects', path: '/projects' },
  { label: 'Experience', path: '/experience' },
  { label: 'Contact', path: '/contact' },
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

export default function Header({ theme = 'dark', toggleTheme = () => {} }: HeaderProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerPanelRef = useRef<HTMLDivElement>(null);

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
    setIsDrawerOpen(false);
  }, [currentPath]);

  const isLinkActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  return (
    <>
      <header
        className={`header-floating-wrapper ${scrolled ? 'header-scrolled' : ''}`}
        id="header"
      >
        <div className="navbar-pill-container">
          {/* Scroll Progress Bar */}
          <div className="header-progress" aria-hidden="true">
            <span style={{ transform: `scaleX(${Math.max(scrollProgress, 0.005)})` }} />
          </div>

          {/* LEFT: LOGO / NAME */}
          <Link to="/" className="navbar-logo" aria-label="Mritunjay Kumar Portfolio">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '6px',
                background: 'linear-gradient(135deg, #222222, #000000)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'grid', placeItems: 'center', color: '#ffffff'
              }}>
                <Code2 size={16} />
              </div>
              <span style={{ fontWeight: 600, fontSize: '0.95rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
                MRITUNJAY<span style={{ color: '#9a9a9a', fontWeight: 400 }}>.ai</span>
              </span>
            </div>
          </Link>

          {/* CENTER: LIQUID METAL NAV PILLS */}
          <nav className="navbar-center-nav" aria-label="Primary navigation">
            {primaryNav.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-pill-item ${active ? 'active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="nav-pill-label">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: THEME TOGGLE, RESUME & MENU TRIGGER */}
          <div className="navbar-right-actions">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="navbar-theme-btn"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* Resume Button */}
            <a
              href="/updated_resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="navbar-resume-btn btn-solid"
              aria-label="Download or view Resume PDF"
            >
              <FileText size={13} />
              <span>Resume</span>
            </a>

            {/* Menu / Drawer Trigger Button */}
            <button
              className={`navbar-drawer-trigger-btn ${isDrawerOpen ? 'open' : ''}`}
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              aria-label="Toggle navigation drawer"
              aria-expanded={isDrawerOpen}
            >
              {isDrawerOpen ? (
                <X size={17} />
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
      </header>

      {/* ── FULLSCREEN / SLIDE-IN MOBILE & DESKTOP MENU ── */}
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
            >
              {/* Drawer Top Bar */}
              <div className="drawer-panel-topbar">
                <div className="drawer-panel-brand">
                  <Sparkles size={16} style={{ color: '#ffffff' }} />
                  <div>
                    <span className="drawer-brand-name">Navigation</span>
                    <span className="drawer-brand-sub">Explore portfolio & tools</span>
                  </div>
                </div>
                <button
                  className="drawer-close-btn"
                  onClick={() => setIsDrawerOpen(false)}
                  aria-label="Close navigation drawer"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Drawer Main Scrollable Content */}
              <div className="drawer-panel-scroll-content">
                {/* Quick Access Primary Nav */}
                <div className="drawer-primary-grid">
                  <Link to="/" className="drawer-primary-card" onClick={() => setIsDrawerOpen(false)}>
                    <Code2 size={16} />
                    <span>Home</span>
                  </Link>
                  <Link to="/about" className="drawer-primary-card" onClick={() => setIsDrawerOpen(false)}>
                    <User size={16} />
                    <span>About</span>
                  </Link>
                  <Link to="/contact" className="drawer-primary-card" onClick={() => setIsDrawerOpen(false)}>
                    <Mail size={16} />
                    <span>Contact</span>
                  </Link>
                </div>

                {/* Categorized Navigation Sections */}
                {drawerSections.map((section) => (
                  <div key={section.title} className="drawer-section-group">
                    <p className="drawer-group-heading">{section.title}</p>
                    <div className="drawer-group-list">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const active = isLinkActive(item.path);
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`drawer-item-link ${active ? 'active' : ''}`}
                            onClick={() => setIsDrawerOpen(false)}
                          >
                            <div className="drawer-item-icon-box">
                              <Icon size={16} />
                            </div>
                            <div className="drawer-item-text">
                              <span className="drawer-item-title">{item.label}</span>
                              <span className="drawer-item-desc">{item.desc}</span>
                            </div>
                            <ChevronRight size={14} style={{ color: '#777777' }} />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Drawer Bottom Bar */}
              <div className="drawer-panel-footer">
                <div className="drawer-footer-actions">
                  <a
                    href="/updated_resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="drawer-resume-action"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    <FileText size={14} />
                    <span>Resume PDF</span>
                  </a>
                  <Link
                    to="/contact"
                    className="drawer-contact-action"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    <span>Get In Touch</span>
                    <ChevronRight size={14} />
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
