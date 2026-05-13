import { useEffect, useState, useRef } from 'react';

export default function Header() {
  const [theme, setTheme] = useState('dark');
  const [scrolled, setScrolled] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dateTime, setDateTime] = useState({ date: '', time: '' });
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    const handleClickOutside = (event: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setIsMoreOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    if (window.scrollY > 20) setScrolled(true);

    const updateClock = () => {
      const now = new Date();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const day = days[now.getDay()];
      const date = String(now.getDate()).padStart(2, '0');
      const month = months[now.getMonth()];
      let h = now.getHours();
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      const hh = String(h).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      
      setDateTime({
        date: `${day}, ${date} ${month}`,
        time: `${hh}:${mm}:${ss} ${ampm}`
      });
    };
    
    updateClock();
    const timer = setInterval(updateClock, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      clearInterval(timer);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const navLinks = [
    { id: '01', label: 'Home', href: '#home', primary: true },
    { id: '02', label: 'About', href: '#about', primary: true },
    { id: '03', label: 'Education', href: '#education', primary: false },
    { id: '04', label: 'Projects', href: '#projects', primary: true },
    { id: '05', label: 'Certs', href: '#certifications', primary: false },
    { id: '06', label: 'Skills', href: '#skills', primary: false },
    { id: '07', label: 'Blog', href: '#blog', primary: true },
    { id: '08', label: 'Pricing', href: '#pricing', primary: false },
    { id: '09', label: 'Contact', href: '#contact', primary: true },
    { id: '10', label: 'Ad-Free', href: '/adfree', primary: false },
  ];

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`} id="header">
      <div className="container header-inner">
        <a href="#home" className="logo">
          <span className="logo-text">MRITUNJAY</span>
          <span className="logo-dot"></span>
        </a>

        <nav className="nav" id="nav">
          {navLinks.filter(l => l.primary).map(link => (
            <a key={link.id} href={link.href} className={`nav-link ${link.id === '01' ? 'active' : ''}`}>
              <span className="nav-num">{link.id}</span>{link.label}
            </a>
          ))}
          
          <div className={`nav-more ${isMoreOpen ? 'open' : ''}`} ref={moreRef}>
            <button className="nav-more-btn" onClick={() => setIsMoreOpen(!isMoreOpen)}>
              More <i className="fa-solid fa-ellipsis"></i>
            </button>
            <div className="nav-dropdown">
              {navLinks.filter(l => !l.primary).map(link => (
                <a key={link.id} href={link.href} className="nav-link" onClick={() => setIsMoreOpen(false)}>
                  <span className="nav-num">{link.id}</span>{link.label}
                </a>
              ))}
            </div>
          </div>
        </nav>

        <div className="header-actions">
          <div className="clock" id="clock">
            <span id="clock-date">{dateTime.date}</span>
            <span className="clock-sep">|</span>
            <span id="clock-time">{dateTime.time}</span>
          </div>
          <button className="theme-toggle" id="themeToggle" aria-label="Toggle theme" onClick={toggleTheme}>
            <span className="theme-icon">{theme === 'dark' ? '☾' : '☀'}</span>
          </button>
          
          <button className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>

          <a href="tel:+919470880956" className="btn-hire">
            <i className="fa-solid fa-phone"></i> Hire Me
          </a>
        </div>
      </div>

      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          {navLinks.map(link => (
            <li key={link.id}>
              <a href={link.href} className="mob-link" onClick={() => setIsMenuOpen(false)}>
                <span className="nav-num">{link.id}</span>{link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
