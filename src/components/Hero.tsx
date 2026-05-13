import React, { useEffect, useRef } from 'react';

export default function Hero() {
  const cardRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reveal Observer
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => revealObserver.observe(el));

    // Tilt Effect
    const card = cardRef.current;
    if (card) {
      const handleMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -7;
        const rotY = ((x - cx) / cx) * 7;
        card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
      };
      const handleLeave = () => {
        card.style.transform = '';
      };
      card.addEventListener('mousemove', handleMove);
      card.addEventListener('mouseleave', handleLeave);
      return () => {
        card.removeEventListener('mousemove', handleMove);
        card.removeEventListener('mouseleave', handleLeave);
        revealObserver.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    // Counter Animation
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
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const nums = entry.target.querySelectorAll('.stat-num[data-val]');
          nums.forEach(num => {
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
      <div className="hero-grid"></div>
      <div className="hero-scan"></div>
      <div className="hero-orb orb-p"></div>
      <div className="hero-orb orb-b"></div>
      <div className="hero-orb orb-c"></div>

      <div className="container hero-inner">
        <div className="hero-left reveal">
          <div className="hero-badge">
            <span className="badge-pulse"></span>
            Available for hire
          </div>
          <h1 className="hero-h1">
            Building<br/>
            <span className="grad" style={{ textShadow: '0 0 30px rgba(124, 58, 237, 0.4), 0 0 60px rgba(59, 130, 246, 0.2)' }}>Extraordinary</span><br/>
            Experiences
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
          <div className="profile-card tilt-card" ref={cardRef}>
            <div className="profile-img-wrap">
              <img src="/assets/orgpic1.jpg" alt="Mritunjay Kumar" className="profile-photo" />
              <div className="profile-img-overlay">Software Engineer</div>
            </div>
            <div className="profile-footer">
              <div className="profile-meta">
                <strong>Mritunjay Kumar</strong>
                <small>Frontend Developer</small>
              </div>
              <div className="profile-socials">
                <a href="https://github.com/mritunjaykumarr" target="_blank" className="social-icon" aria-label="GitHub">
                  <i className="fa-brands fa-github"></i>
                </a>
                <a href="https://www.linkedin.com/in/mritunjay-kumar-22a7a828b" target="_blank" className="social-icon" aria-label="LinkedIn">
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

      <div className="scroll-hint">
        <div className="scroll-line"></div>
        <span>Scroll</span>
      </div>
    </section>
  );
}
