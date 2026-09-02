import { useEffect, useRef, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
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
    const princeSection = document.getElementById('prince-ai');
    if (princeSection) {
      princeSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: 'easeOut' },
    },
  };

  const rightVariants: Variants = {
    hidden: { opacity: 0, x: 40, scale: 0.96 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.8, ease: 'easeOut', delay: 0.25 },
    },
  };

  return (
    <section id="home" className="hero hero-redesign" ref={heroRef}>
      {/* 3D Interactive Canvas Background */}
      <HeroCanvas3D />

      {/* Mouse Spotlight Gradient Layer */}
      <div
        className="hero-spotlight-overlay"
        style={{
          background: `radial-gradient(600px circle at ${spotlightPos.x}% ${spotlightPos.y}%, var(--accent-glow), transparent 80%)`,
        }}
      />

      <div className="hero-bg" aria-hidden="true">
        <div className="hero-grid-pattern" />
        <div className="hero-gradient hero-gradient-1" />
        <div className="hero-gradient hero-gradient-2" />
      </div>

      <div className="container hero-inner">
        {/* HERO LEFT COLUMN */}
        <motion.div
          className="hero-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="hero-badge">
            <span className="badge-pulse" />
            <span>Available for Enterprise & AI Projects</span>
          </motion.div>

          {/* Live Typewriter Headline */}
          <motion.h1 variants={itemVariants} className="hero-h1">
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
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={itemVariants} className="hero-sub">
            Full Stack Developer at <strong>Epigroww Global</strong>. Creator of AI automation platforms. Engineering pixel-perfect, sub-100ms digital products with cutting-edge AI integration.
          </motion.p>

          {/* Quick AI Prompt Input in Hero */}
          <motion.div
            variants={itemVariants}
            className="hero-ai-prompt-box card-glass"
            whileHover={{ scale: 1.012, boxShadow: '0 12px 35px var(--shadow-accent)' }}
            transition={{ duration: 0.2 }}
          >
            <div className="ai-prompt-input-wrapper">
              <Bot size={18} className="text-primary" />
              <input
                type="text"
                placeholder="Ask Prince AI about projects, tech stack, or hiring..."
                value={heroInput}
                onChange={(e) => setHeroInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAskPrinceAI();
                }}
              />
              <motion.button
                onClick={handleAskPrinceAI}
                className="btn-primary btn-sm"
                aria-label="Ask AI"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Ask AI</span>
                <Sparkles size={14} />
              </motion.button>
            </div>
            <div className="hero-prompt-chips">
              <motion.button
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setHeroInput('What is your tech stack?'); handleAskPrinceAI(); }}
              >
                Tech Stack
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setHeroInput('Show best project'); handleAskPrinceAI(); }}
              >
                Best Projects
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setHeroInput('Why should we hire you?'); handleAskPrinceAI(); }}
              >
                Why Hire Me?
              </motion.button>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="hero-btns">
            <motion.a
              href="#projects"
              className="btn-primary"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Explore Projects</span>
              <ArrowRight size={16} />
            </motion.a>
            <motion.button
              onClick={() => window.dispatchEvent(new Event('open-contact'))}
              className="btn-outline"
              style={{ fontFamily: 'inherit', cursor: 'pointer' }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <SendHorizonal size={15} />
              <span>Let's Talk</span>
            </motion.button>
          </motion.div>

          {/* Animated Stats */}
          <motion.div variants={itemVariants} className="hero-stats" ref={statsRef}>
            <motion.div className="stat-item" whileHover={{ y: -4, scale: 1.03 }}>
              <span className="stat-num" data-val="12">0</span>
              <span className="stat-lbl">Projects Shipped</span>
            </motion.div>
            <motion.div className="stat-item" whileHover={{ y: -4, scale: 1.03 }}>
              <span className="stat-num" data-val="99.9">0</span>
              <span className="stat-lbl">% SLA Uptime</span>
            </motion.div>
            <motion.div className="stat-item" whileHover={{ y: -4, scale: 1.03 }}>
              <span className="stat-num" data-val="4.9">0</span>
              <span className="stat-lbl">Client Rating</span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* HERO RIGHT COLUMN: Interactive Terminal & Floating Tech Badges */}
        <motion.div
          className="hero-right"
          variants={rightVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="profile-stage-redesign">
            {/* Interactive Terminal Component */}
            <HeroTerminal />

            {/* Orbiting Floating Tech Icons with Framer Motion floating loop */}
            <motion.div
              className="float-badge badge-react float-orbit-1"
              title="React 19"
              animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="2" /><ellipse cx="12" cy="12" rx="10" ry="4" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" /></svg>
              <span>React</span>
            </motion.div>

            <motion.div
              className="float-badge badge-node float-orbit-2"
              title="Node.js"
              animate={{ y: [0, 10, 0], rotate: [0, -2, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
              <span>Node.js</span>
            </motion.div>

            <motion.div
              className="float-badge badge-ai float-orbit-3"
              title="OpenRouter & Gemini AI"
              animate={{ y: [0, -10, 0], scale: [1, 1.04, 1] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            >
              <Bot size={16} />
              <span>Gemini / OpenRouter</span>
            </motion.div>

            <motion.div
              className="float-badge badge-ts float-orbit-4"
              title="TypeScript"
              animate={{ y: [0, 12, 0], rotate: [0, 3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            >
              <span className="badge-code-lang">TS</span>
              <span>TypeScript</span>
            </motion.div>

            <motion.div
              className="float-badge badge-open float-orbit-5"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            >
              <span className="badge-open-dot" />
              <span>Full Stack @ Epigroww</span>
            </motion.div>
          </div>

          <motion.div
            className="hero-socials-bar card-glass"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <span>Connect:</span>
            <div className="hero-socials">
              <motion.a whileHover={{ scale: 1.25, y: -2 }} href="https://github.com/mritunjaykumarr" target="_blank" rel="noreferrer" className="social-link" aria-label="GitHub"><GithubIcon size={18} /></motion.a>
              <motion.a whileHover={{ scale: 1.25, y: -2 }} href="https://www.linkedin.com/in/mritunjay-kumar-22a7a828b" target="_blank" rel="noreferrer" className="social-link" aria-label="LinkedIn"><LinkedinIcon size={18} /></motion.a>
              <motion.a whileHover={{ scale: 1.25, y: -2 }} href="https://www.instagram.com/princegupta.dev/" target="_blank" rel="noreferrer" className="social-link" aria-label="Instagram"><InstagramIcon size={18} /></motion.a>
              <motion.a whileHover={{ scale: 1.25, y: -2 }} href="https://x.com/mritunjay2025" target="_blank" rel="noreferrer" className="social-link" aria-label="Twitter"><TwitterIcon size={18} /></motion.a>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="scroll-hint"
        aria-hidden="true"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="scroll-line" />
        <span>Scroll Down</span>
      </motion.div>
    </section>
  );
}
