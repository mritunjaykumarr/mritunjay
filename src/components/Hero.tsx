import { useEffect, useRef } from 'react';

export default function Hero() {
  const cardRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach((el) => revealObserver.observe(el));

    const card = cardRef.current;
    const hero = heroRef.current;

    if (card) {
      const handleMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -7;
        const rotY = ((x - cx) / cx) * 7;

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
          if (hero) {
            const heroRect = hero.getBoundingClientRect();
            const px = ((e.clientX - heroRect.left) / heroRect.width - 0.5) * 100;
            const py = ((e.clientY - heroRect.top) / heroRect.height - 0.5) * 100;
            hero.style.setProperty('--hero-mx', `${px.toFixed(2)}px`);
            hero.style.setProperty('--hero-my', `${py.toFixed(2)}px`);
          }
        });
      };

      const handleLeave = () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        card.style.transform = '';
        if (hero) {
          hero.style.removeProperty('--hero-mx');
          hero.style.removeProperty('--hero-my');
        }
      };

      card.addEventListener('mousemove', handleMove);
      card.addEventListener('mouseleave', handleLeave);

      return () => {
        card.removeEventListener('mousemove', handleMove);
        card.removeEventListener('mouseleave', handleLeave);
        revealObserver.disconnect();
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }

    return () => {
      revealObserver.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const animateCounter = (el: HTMLElement, target: number, decimals = 0) => {
      const duration = 1800;
      const startTime = performance.now();
      const update = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * target;
        el.textContent = decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toString();
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    };

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const nums = entry.target.querySelectorAll('.stat-num[data-val]');
          nums.forEach((num) => {
            const val = parseFloat((num as HTMLElement).dataset.val || '0');
            const decimals = (num as HTMLElement).dataset.val?.includes('.') ? 1 : 0;
            animateCounter(num as HTMLElement, val, decimals);
            (num as HTMLElement).removeAttribute('data-val');
          });
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });

    if (statsRef.current) statsObserver.observe(statsRef.current);
    return () => statsObserver.disconnect();
  }, []);

  return (
    <section id="home" className="hero" ref={heroRef}>
      <div className="hero-grid"></div>
      <div className="hero-scan"></div>
      <div className="hero-orb orb-p"></div>
      <div className="hero-orb orb-b"></div>
      <div className="hero-orb orb-c"></div>
      <div className="hero-particles" aria-hidden="true">
        <span style={{ top: '18%', left: '9%', animationDelay: '-0.2s' }}></span>
        <span style={{ top: '36%', left: '76%', animationDelay: '-1.4s' }}></span>
        <span style={{ bottom: '18%', left: '18%', animationDelay: '-2s' }}></span>
        <span style={{ bottom: '26%', right: '14%', animationDelay: '-0.8s' }}></span>
      </div>

      <div className="container hero-inner">
        <div className="hero-left reveal">
          <div className="hero-badge">
            <span className="badge-pulse"></span>
            Available for hire
          </div>
          <h1 className="hero-h1">
            <span className="hero-line" data-split-text>Building</span>
            <span className="hero-line grad" data-split-text>Extraordinary</span>
            <span className="hero-line" data-split-text>Experiences</span>
          </h1>
          <p className="hero-sub">
            Frontend Developer with hands-on experience crafting responsive, interactive, and pixel-perfect web applications. Turning complex ideas into elegant digital products.
          </p>
          <div className="hero-btns">
            <a href="#projects" className="btn-glow">
              <span>View Projects</span>
              <i className="fa-solid fa-arrow-right"></i>
            </a>
            <a href="tel:+919470880956" className="btn-ghost">
              <i className="fa-solid fa-phone"></i>
              <span>Let's Talk</span>
            </a>
          </div>
          <div className="hero-stats" ref={statsRef}>
            <div className="stat-item">
              <span className="stat-num" data-val="12">0</span>
              <span className="stat-lbl">Projects Shipped</span>
            </div>
            <div className="stat-item">
              <span className="stat-num" data-val="4">0</span>
              <span className="stat-lbl">Certifications</span>
            </div>
            <div className="stat-item">
              <span className="stat-num" data-val="4.9">0</span>
              <span className="stat-lbl">Client Rating</span>
            </div>
          </div>
        </div>

        <div className="hero-right reveal reveal-right">
          <div className="profile-stage">
            <div className="profile-ring profile-ring-outer"></div>
            <div className="profile-ring profile-ring-inner"></div>
            <div className="profile-card tilt-card" ref={cardRef}>
              <div className="profile-img-wrap">
                <img src="/assets/orgpic1.jpg" alt="Mritunjay Kumar" className="profile-photo" loading="eager" />
                <div className="profile-img-overlay">Software Engineer</div>
              </div>
              <div className="profile-footer">
                <div className="profile-meta">
                  <strong>Mritunjay Kumar</strong>
                  <small>Frontend Developer</small>
                </div>
                <div className="profile-socials">
                  <a href="https://github.com/mritunjaykumarr" target="_blank" rel="noreferrer" className="social-icon" aria-label="GitHub">
                    <i className="fa-brands fa-github"></i>
                  </a>
                  <a href="https://www.linkedin.com/in/mritunjay-kumar-22a7a828b" target="_blank" rel="noreferrer" className="social-icon" aria-label="LinkedIn">
                    <i className="fa-brands fa-linkedin-in"></i>
                  </a>
                  <a href="#" className="social-icon" aria-label="Instagram">
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="float-badge badge-react">
              <i className="fa-brands fa-react"></i> React
            </div>
            <div className="float-badge badge-node">
              <i className="fa-brands fa-node-js"></i> Node.js
            </div>
            <div className="float-badge badge-open">
              <span className="badge-open-dot"></span> Open to Work
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-hint">
        <div className="scroll-line"></div>
        <span>Scroll</span>
      </div>
    </section>
  );
}
