import { useEffect, useState, useRef } from 'react';
import { Sun, Moon, Mail, ChevronRight } from 'lucide-react';

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
}

export default function Header({ theme, toggleTheme }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
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

    const sectionIds = ['home', 'about', 'education', 'projects', 'certifications', 'skills', 'blog', 'pricing', 'prince-ai', 'contact'];
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id || 'home');
        }
      });
    }, { threshold: 0.3, rootMargin: '-10% 0px -50% 0px' });

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      sectionObserver.disconnect();
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
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Blog', href: '#blog' },
  ];

  const allLinks = [
    ...navLinks,
    { label: 'Education', href: '#education' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Prince AI', href: '#prince-ai' },
  ];

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`} id="header" ref={headerRef}>
      <div className="header-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${Math.max(scrollProgress, 0.01)})` }} />
      </div>
      <div className="container header-inner">
        <a href="#home" className="logo">
          <span>MRITUNJAY</span>
          <span className="logo-dot" />
        </a>

        <nav className="nav" aria-label="Main navigation">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link ${activeSection === link.href.slice(1) ? 'active' : ''}`}
            >
              {link.label}
            </a>
          ))}
          <button 
            className="nav-link" 
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}
            onClick={() => window.dispatchEvent(new Event('open-contact'))}
          >
            Contact
          </button>
        </nav>

        <div className="header-actions">
          <div className="header-clock" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', fontSize: '0.7rem', color: 'var(--text-muted)', marginRight: '1rem', lineHeight: '1.2' }}>
            <strong style={{ color: 'var(--text)', fontSize: '0.75rem' }}>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
            <span>{currentTime.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <button
            className="theme-toggle"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun /> : <Moon />}
          </button>

          <button
            className={`hamburger ${isMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span /><span /><span />
          </button>

          <button 
            onClick={() => window.dispatchEvent(new Event('open-contact'))} 
            className="btn-hire"
            style={{ fontFamily: 'inherit', border: 'none', cursor: 'pointer' }}
          >
            <Mail /> Contact
          </button>
        </div>
      </div>

      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`} role="navigation" aria-label="Mobile navigation">
        <ul>
          {allLinks.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`mob-link ${activeSection === link.href.slice(1) ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <ChevronRight size={14} />
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <button
              className="mob-link"
              style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              onClick={() => {
                setIsMenuOpen(false);
                window.dispatchEvent(new Event('open-contact'));
              }}
            >
              <ChevronRight size={14} />
              Contact
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}
