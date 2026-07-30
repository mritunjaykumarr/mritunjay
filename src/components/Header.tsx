import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Mail, ChevronRight } from 'lucide-react';
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

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Experience', path: '/experience' },
    { label: 'Projects', path: '/projects' },
    { label: 'Skills', path: '/skills' },
    { label: 'Certifications', path: '/certifications' },
    { label: 'Blog', path: '/blog' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Prince AI', path: '/prince-ai' },
  ];

  const isLinkActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`} id="header" ref={headerRef}>
      <div className="header-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${Math.max(scrollProgress, 0.01)})` }} />
      </div>
      <div className="container header-inner">
        <Link to="/" className="logo">
          <span>MRITUNJAY</span>
          <span className="logo-dot" />
        </Link>

        <nav className="nav" aria-label="Main navigation">
          {navLinks.slice(0, 5).map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${isLinkActive(link.path) ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/blog"
            className={`nav-link ${isLinkActive('/blog') ? 'active' : ''}`}
          >
            Blog
          </Link>
          <Link
            to="/prince-ai"
            className={`nav-link ${isLinkActive('/prince-ai') ? 'active' : ''}`}
          >
            Prince AI
          </Link>
          <Link
            to="/contact"
            className={`nav-link ${isLinkActive('/contact') ? 'active' : ''}`}
          >
            Contact
          </Link>
        </nav>

        <div className="header-actions">
          <div className="header-clock" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '0.7rem', color: 'var(--text-muted)', marginRight: '0.75rem', lineHeight: '1.2' }}>
            <strong style={{ color: 'var(--text)', fontSize: '0.75rem' }}>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
            <span>{currentTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
          </div>

          <button
            className="theme-toggle"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            className={`hamburger ${isMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span /><span /><span />
          </button>

          <Link 
            to="/contact" 
            className="btn-hire"
            style={{ textDecoration: 'none' }}
          >
            <Mail size={15} /> Contact
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              onClick={() => setIsMenuOpen(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 98,
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              }}
            />
            <motion.div
              className="mobile-menu"
              role="navigation"
              aria-label="Mobile navigation"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 99,
                width: 'min(320px, 85vw)',
                background: 'var(--bg-elevated)',
                borderLeft: '1px solid var(--border)',
                padding: '5.5rem 1.5rem 2rem',
                overflowY: 'auto',
                boxShadow: '-8px 0 32px rgba(0,0,0,0.3)',
              }}
            >
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      to={link.path}
                      className={`mob-link ${isLinkActive(link.path) ? 'active' : ''}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <ChevronRight size={14} />
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * navLinks.length, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to="/contact"
                    className={`mob-link ${isLinkActive('/contact') ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ChevronRight size={14} />
                    Contact Page
                  </Link>
                </motion.li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
