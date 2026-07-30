import { useEffect, useRef, useState } from 'react';
import { ArrowRight, SendHorizonal, Bot, Sparkles } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon, TwitterIcon } from './SocialIcons';
import HeroCanvas3D from './HeroCanvas3D';
import TypewriterText from './TypewriterText';
import HeroTerminal from './HeroTerminal';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
  const [heroInput, setHeroInput] = useState('');

  // Mouse spotlight tracker across hero
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = heroEl.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setSpotlightPos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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

  const handleAskPrinceAI = () => {
    if (!heroInput.trim()) return;
    // Dispatch event or scroll to Prince AI section
    const princeSection = document.getElementById('prince-ai');
    if (princeSection) {
      princeSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero hero-redesign" ref={heroRef}>
      {/* 3D Interactive Canvas Background */}
      <HeroCanvas3D />

      {/* Mouse Spotlight Gradient Layer */}
      <div 
        className="hero-spotlight-overlay" 
        style={{
          background: `radial-gradient(600px circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(99, 102, 241, 0.12), transparent 80%)`,
        }}
      />

      <div className="hero-bg" aria-hidden="true">
        <div className="hero-grid-pattern" />
        <div className="hero-gradient hero-gradient-1" />
        <div className="hero-gradient hero-gradient-2" />
      </div>

      <div className="container hero-inner">
        {/* HERO LEFT COLUMN */}
        <div className="hero-left reveal">
          <div className="hero-badge">
            <span className="badge-pulse" />
            <span>Available for Enterprise & AI Projects</span>
          </div>

          {/* Live Typewriter Headline */}
          <h1 className="hero-h1">
            <TypewriterText 
              phrases={[
                "Hello, I'm Mritunjay Kumar",
                "Full Stack & AI Application Developer",
                "I build enterprise-grade AI products, automation systems, and scalable SaaS platforms."
              ]}
              typingSpeed={70}
              deletingSpeed={35}
              delayBetween={2200}
              className="grad"
            />
          </h1>

          <p className="hero-sub">
            Full Stack Developer at <strong>Epigroww Global</strong>. Creator of <strong>RetailConnect</strong> & AI automation platforms. Engineering pixel-perfect, sub-100ms digital products with cutting-edge AI integration.
          </p>

          {/* Quick AI Prompt Input in Hero */}
          <div className="hero-ai-prompt-box card-glass">
            <div className="ai-prompt-input-wrapper">
              <Bot size={18} className="text-primary" />
              <input 
                type="text"
                placeholder="Ask Prince AI about RetailConnect, tech stack, or hiring..."
                value={heroInput}
                onChange={(e) => setHeroInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAskPrinceAI();
                }}
              />
              <button onClick={handleAskPrinceAI} className="btn-primary btn-sm" aria-label="Ask AI">
                <span>Ask AI</span>
                <Sparkles size={14} />
              </button>
            </div>
            <div className="hero-prompt-chips">
              <button onClick={() => { setHeroInput('Tell me about RetailConnect'); handleAskPrinceAI(); }}>RetailConnect</button>
              <button onClick={() => { setHeroInput('Show best project'); handleAskPrinceAI(); }}>Best Projects</button>
              <button onClick={() => { setHeroInput('Why should we hire you?'); handleAskPrinceAI(); }}>Why Hire Me?</button>
            </div>
          </div>

          <div className="hero-btns">
            <a href="#projects" className="btn-primary">
              <span>Explore Projects</span>
              <ArrowRight size={16} />
            </a>
            <button 
              onClick={() => window.dispatchEvent(new Event('open-contact'))} 
              className="btn-outline" 
              style={{ fontFamily: 'inherit', cursor: 'pointer' }}
            >
              <SendHorizonal size={15} />
              <span>Let's Talk</span>
            </button>
          </div>

          <div className="hero-stats" ref={statsRef}>
            <div className="stat-item">
              <span className="stat-num" data-val="12">0</span>
              <span className="stat-lbl">Projects Shipped</span>
            </div>
            <div className="stat-item">
              <span className="stat-num" data-val="99.9">0</span>
              <span className="stat-lbl">% SLA Uptime</span>
            </div>
            <div className="stat-item">
              <span className="stat-num" data-val="4.9">0</span>
              <span className="stat-lbl">Client Rating</span>
            </div>
          </div>
        </div>

        {/* HERO RIGHT COLUMN: Interactive Terminal & Floating Tech Badges */}
        <div className="hero-right reveal reveal-right">
          <div className="profile-stage-redesign">
            {/* Interactive Terminal Component */}
            <HeroTerminal />

            {/* Orbiting Floating Tech Icons */}
            <div className="float-badge badge-react float-orbit-1" title="React 19">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>
              <span>React</span>
            </div>

            <div className="float-badge badge-node float-orbit-2" title="Node.js">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              <span>Node.js</span>
            </div>

            <div className="float-badge badge-ai float-orbit-3" title="OpenRouter & Gemini AI">
              <Bot size={16} />
              <span>Gemini / OpenRouter</span>
            </div>

            <div className="float-badge badge-ts float-orbit-4" title="TypeScript">
              <span className="badge-code-lang">TS</span>
              <span>TypeScript</span>
            </div>

            <div className="float-badge badge-open float-orbit-5">
              <span className="badge-open-dot" />
              <span>Full Stack @ Epigroww</span>
            </div>
          </div>

          <div className="hero-socials-bar card-glass">
            <span>Connect:</span>
            <div className="hero-socials">
              <a href="https://github.com/mritunjaykumarr" target="_blank" rel="noreferrer" className="social-link" aria-label="GitHub"><GithubIcon size={18} /></a>
              <a href="https://www.linkedin.com/in/mritunjay-kumar-22a7a828b" target="_blank" rel="noreferrer" className="social-link" aria-label="LinkedIn"><LinkedinIcon size={18} /></a>
              <a href="https://www.instagram.com/mritunjaykumar.dev/" target="_blank" rel="noreferrer" className="social-link" aria-label="Instagram"><InstagramIcon size={18} /></a>
              <a href="https://x.com/mritunjay2025" target="_blank" rel="noreferrer" className="social-link" aria-label="Twitter"><TwitterIcon size={18} /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="scroll-hint" aria-hidden="true">
        <div className="scroll-line" />
        <span>Scroll Down</span>
      </div>
    </section>
  );
}
