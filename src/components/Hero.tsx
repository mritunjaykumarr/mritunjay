import { useEffect, useRef } from 'react';
import { ArrowRight, SendHorizonal } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon, TwitterIcon } from './SocialIcons';

export default function Hero() {
  const cardRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const card = cardRef.current;

    if (card) {
      const handleMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -5;
        const rotY = ((x - cx) / cx) * 5;

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.01)`;
        });
      };

      const handleLeave = () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        card.style.transform = '';
      };

      card.addEventListener('mousemove', handleMove);
      card.addEventListener('mouseleave', handleLeave);

      return () => {
        card.removeEventListener('mousemove', handleMove);
        card.removeEventListener('mouseleave', handleLeave);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }
  }, []);

  // Animated counter
  useEffect(() => {
    const animateCounter = (el: HTMLElement, target: number, decimals = 0) => {
      const duration = 1600;
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
    <section id="home" className="hero">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-grid-pattern" />
        <div className="hero-gradient hero-gradient-1" />
        <div className="hero-gradient hero-gradient-2" />
        <div className="hero-gradient hero-gradient-3" />
      </div>

      <div className="container hero-inner">
        <div className="hero-left reveal">
          <div className="hero-badge">
            <span className="badge-pulse" />
            Available for work
          </div>
          <h1 className="hero-h1">
            <span className="hero-line" data-split-text>Building</span>
            <span className="hero-line grad" data-split-text>Extraordinary</span>
            <span className="hero-line" data-split-text>Experiences</span>
          </h1>
          <p className="hero-sub">
            Full Stack Developer at Epigroww Global crafting responsive, interactive, and pixel-perfect web applications. Turning complex ideas into elegant digital products.
          </p>
          <div className="hero-btns">
            <a href="#projects" className="btn-primary">
              <span>View Projects</span>
              <ArrowRight size={16} />
            </a>
            <a href="tel:+919470880956" className="btn-outline">
              <SendHorizonal size={15} />
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
            <div className="profile-card" ref={cardRef}>
              <div className="profile-img-wrap">
                <img src="/assets/orgpic1.jpg" alt="Mritunjay Kumar" className="profile-photo" loading="eager" width="400" height="500" />
                <div className="profile-img-overlay">Full Stack Developer</div>
              </div>
              <div className="profile-footer">
                <div className="profile-meta">
                  <strong>Mritunjay Kumar</strong>
                  <small>Frontend Developer</small>
                </div>
                <div className="hero-socials">
                  <a href="https://github.com/mritunjaykumarr" target="_blank" rel="noreferrer" className="social-link" aria-label="GitHub"><GithubIcon size={20} /></a>
                  <a href="https://www.linkedin.com/in/mritunjay-kumar-22a7a828b" target="_blank" rel="noreferrer" className="social-link" aria-label="LinkedIn"><LinkedinIcon size={20} /></a>
                  <a href="https://www.instagram.com/mritunjaykumar.dev/" target="_blank" rel="noreferrer" className="social-link" aria-label="Instagram"><InstagramIcon size={20} /></a>
                  <a href="https://x.com/mritunjay2025" target="_blank" rel="noreferrer" className="social-link" aria-label="Twitter"><TwitterIcon size={20} /></a>
                </div>
              </div>
            </div>

            <div className="float-badge badge-react">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>
              React
            </div>
            <div className="float-badge badge-node">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              Node.js
            </div>
            <div className="float-badge badge-open">
              <span className="badge-open-dot" />
              Epigroww Global
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-hint" aria-hidden="true">
        <div className="scroll-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
