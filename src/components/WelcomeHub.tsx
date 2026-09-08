import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Bot,
  Briefcase,
  FileText,
  Globe,
  Zap,
  Volume2,
  VolumeX,
  X,
  Check,
  Compass,
  Shuffle,
  Terminal,
  Layers,
  Send,
  ExternalLink,
  Clock
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';

// --- Web Audio API Futuristic Chime Synthesizer ---
function playSynthesizedChime(type: 'welcome' | 'sparkle' | 'click' | 'pop') {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    if (type === 'welcome') {
      // 3-note ascending warm futuristic chord: C5 -> E5 -> G5 -> B5 (Maj7 sparkle)
      const freqs = [523.25, 659.25, 783.99, 987.77];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.65);
      });
    } else if (type === 'sparkle') {
      // High frequency double twinkle
      [1046.5, 1318.51, 1567.98].forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.05);

        gain.gain.setValueAtTime(0.001, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.05, now + idx * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.4);
      });
    } else if (type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.06);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    }
  } catch {
    // AudioContext blocked or not allowed by browser autoplay policy
  }
}

// --- High-Performance Lightweight Canvas Confetti Engine ---
interface ConfettiParticle {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  vx: number;
  vy: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
  shape: 'rect' | 'circle' | 'star';
}

function launchConfetti(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#ffffff', '#e0e7ff', '#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#34d399', '#fbbf24'];
  const particles: ConfettiParticle[] = [];
  const count = 90;

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 12 + 6;
    particles.push({
      x: canvas.width / 2 + (Math.random() * 80 - 40),
      y: canvas.height / 2 + (Math.random() * 60 - 30),
      w: Math.random() * 9 + 5,
      h: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 6,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 14,
      opacity: 1,
      shape: Math.random() > 0.4 ? 'rect' : Math.random() > 0.5 ? 'circle' : 'star',
    });
  }

  const startTime = performance.now();

  const render = (now: number) => {
    const elapsed = now - startTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let active = false;

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.32; // Gravity
      p.vx *= 0.985; // Drag
      p.rotation += p.rotSpeed;
      if (elapsed > 1200) {
        p.opacity = Math.max(0, 1 - (elapsed - 1200) / 800);
      }

      if (p.opacity > 0) {
        active = true;
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }
        ctx.restore();
      }
    });

    if (active && elapsed < 2200) {
      requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  requestAnimationFrame(render);
}

// --- Fun Achievements & Tech Insights Data ---
const TECH_INSIGHTS = [
  {
    title: 'Full-Stack & React 19 Speed',
    detail: 'Engineered with React 19, TypeScript, zero lag & buttery-smooth 60fps animations.',
    icon: Zap,
  },
  {
    title: 'Custom AI Integrations',
    detail: 'Creator of PrinceAI™ — streaming LLMs connected with live context retrieval.',
    icon: Bot,
  },
  {
    title: '100+ Live Channels Platform',
    detail: 'Architected high-throughput live streaming player with sub-second response times.',
    icon: Globe,
  },
  {
    title: 'Infosys Certified Full-Stack',
    detail: 'Rigorous engineering credentials spanning distributed systems, Node.js & Supabase.',
    icon: Check,
  },
  {
    title: 'Global Product Engineering',
    detail: 'Delivering end-to-end web apps for international founders and fast-moving teams.',
    icon: Briefcase,
  },
];

export default function WelcomeHub() {
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [insightIndex, setInsightIndex] = useState(0);
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [timeGreeting, setTimeGreeting] = useState('');
  const [localTimeStr, setLocalTimeStr] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Dynamic Time of Day calculation
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      let greeting = 'Welcome, Explorer! 👋';
      if (hours >= 5 && hours < 12) greeting = 'Good morning, Explorer! ☀️';
      else if (hours >= 12 && hours < 17) greeting = 'Good afternoon, Explorer! 🌤️';
      else if (hours >= 17 && hours < 22) greeting = 'Good evening, Explorer! 🌆';
      else greeting = 'Welcome, Night Owl! 🌙';

      setTimeGreeting(greeting);
      setLocalTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) +
          ' IST'
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // Check initial load & auto-trigger
  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem('mritify_welcome_hub_dismissed');
      if (!dismissed) {
        // Pop up smoothly after page entry / loader
        const timer = setTimeout(() => {
          setIsOpen(true);
          sessionStorage.setItem('mritify_welcome_hub_dismissed', 'true');
          if (soundEnabled) {
            playSynthesizedChime('welcome');
          }
        }, 900);
        return () => clearTimeout(timer);
      }
    } catch {
      // Fallback
    }
  }, []);

  // Global listener to trigger Welcome Hub from anywhere
  useEffect(() => {
    const handleOpenHub = () => {
      setIsOpen(true);
      if (soundEnabled) playSynthesizedChime('pop');
    };
    window.addEventListener('open-welcome-hub', handleOpenHub);
    return () => window.removeEventListener('open-welcome-hub', handleOpenHub);
  }, [soundEnabled]);

  // Keyboard shortcut listener (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setShowPitchModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleConfetti = () => {
    if (canvasRef.current) {
      launchConfetti(canvasRef.current);
      if (soundEnabled) playSynthesizedChime('sparkle');
    }
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) playSynthesizedChime('pop');
  };

  const handleCycleInsight = () => {
    setInsightIndex((prev) => (prev + 1) % TECH_INSIGHTS.length);
    if (soundEnabled) playSynthesizedChime('click');
  };

  // Clickable Path Handlers
  const handleExploreProjects = () => {
    setIsOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById('projects');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate('/#projects');
    }
  };

  const handleOpenPrinceAI = () => {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent('open-prince-ai', { detail: { tab: 'ai' } }));
    if (soundEnabled) playSynthesizedChime('pop');
  };

  const handleOpenContact = () => {
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent('open-contact'));
    if (soundEnabled) playSynthesizedChime('pop');
  };

  const handleOpenResume = () => {
    if (soundEnabled) playSynthesizedChime('click');
    window.open('/updated_resume.pdf', '_blank', 'noopener,noreferrer');
  };

  const handleOpenLiveTools = () => {
    setIsOpen(false);
    navigate('/domain-checker');
    if (soundEnabled) playSynthesizedChime('click');
  };

  const handleCopyPitch = () => {
    const pitchText =
      "Mritunjay Kumar — AI Engineer & Full-Stack Developer. Specialized in React 19, TypeScript, Next.js, Node.js, and custom LLM AI workflows. Available for select projects & engineering teams globally. me@mritify.online | https://mritify.online";
    navigator.clipboard.writeText(pitchText);
    setCopiedPitch(true);
    if (soundEnabled) playSynthesizedChime('sparkle');
    setTimeout(() => setCopiedPitch(false), 2400);
  };

  const currentInsight = TECH_INSIGHTS[insightIndex];
  const InsightIcon = currentInsight.icon;

  return (
    <>
      {/* Fullscreen Canvas for Celebration Confetti */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 999999,
        }}
      />

      {/* Floating Persistent Launcher Trigger Pill */}
      {!isOpen && (
        <motion.button
          onClick={() => {
            setIsOpen(true);
            if (soundEnabled) playSynthesizedChime('pop');
          }}
          className="welcome-floating-trigger"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Open Welcome Hub & Interactive Quick Start"
          aria-label="Open Welcome Hub"
        >
          <div className="welcome-trigger-pulse" />
          <Sparkles size={15} className="welcome-trigger-sparkle" />
          <span className="welcome-trigger-text">Welcome Hub</span>
          <span className="welcome-trigger-shortcut">Press ?</span>
        </motion.button>
      )}

      {/* Main Welcome Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="welcome-overlay">
            {/* Backdrop */}
            <motion.div
              className="welcome-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Card */}
            <motion.div
              className="welcome-modal-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="welcome-title"
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Ambient Glow Bar */}
              <div className="welcome-glow-bar" />

              {/* Modal Top Header Bar */}
              <div className="welcome-header">
                <div className="welcome-status-pill">
                  <span className="welcome-live-dot" />
                  <span className="welcome-status-text">Available for Projects & Hiring</span>
                  <span className="welcome-clock-divider">·</span>
                  <Clock size={12} className="welcome-clock-icon" />
                  <span className="welcome-clock-text">{localTimeStr}</span>
                </div>

                <div className="welcome-header-actions">
                  {/* Sound Toggle */}
                  <button
                    onClick={handleToggleSound}
                    className="welcome-icon-btn"
                    title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
                    aria-label="Toggle Sound"
                  >
                    {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </button>

                  {/* Confetti Trigger */}
                  <button
                    onClick={handleConfetti}
                    className="welcome-icon-btn welcome-confetti-btn"
                    title="Launch Celebration Confetti!"
                    aria-label="Launch Confetti"
                  >
                    <Sparkles size={16} />
                  </button>

                  {/* Close Modal */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="welcome-icon-btn welcome-close-btn"
                    title="Close Welcome Hub (Esc)"
                    aria-label="Close modal"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Welcome Title & Dynamic Greeting */}
              <div className="welcome-intro">
                <div className="welcome-avatar-wrap">
                  <img
                    src="/assets/orgpic1.jpg"
                    alt="Mritunjay Kumar"
                    className="welcome-avatar"
                  />
                  <div className="welcome-badge-icon">
                    <Zap size={12} />
                  </div>
                </div>

                <div className="welcome-intro-text">
                  <div className="welcome-greeting-badge">
                    <Sparkles size={12} />
                    <span>{timeGreeting}</span>
                  </div>
                  <h2 id="welcome-title">
                    Welcome to <em>Mritunjay’s</em> Workspace
                  </h2>
                  <p>
                    AI Engineer & Full-Stack Developer creating intelligent systems, fast interfaces, and production web products.
                  </p>
                </div>
              </div>

              {/* Interactive Achievement / Easter Egg Ticker */}
              <div className="welcome-insight-strip" onClick={handleCycleInsight} role="button" tabIndex={0}>
                <div className="welcome-insight-left">
                  <div className="welcome-insight-icon-wrap">
                    <InsightIcon size={14} />
                  </div>
                  <div className="welcome-insight-content">
                    <span className="welcome-insight-label">Interactive Highlight</span>
                    <strong className="welcome-insight-title">{currentInsight.title}: </strong>
                    <span className="welcome-insight-detail">{currentInsight.detail}</span>
                  </div>
                </div>
                <div className="welcome-insight-shuffle" title="Click to shuffle highlights">
                  <Shuffle size={13} />
                  <span>Shuffle</span>
                </div>
              </div>

              {/* --- 6 Clickable Journey Paths Grid --- */}
              <div className="welcome-pathways-title">
                <Compass size={14} />
                <span>Choose your journey or jump right in:</span>
              </div>

              <div className="welcome-grid">
                {/* 1. Explore Selected Works */}
                <button
                  type="button"
                  onClick={handleExploreProjects}
                  className="welcome-card welcome-card-primary"
                >
                  <div className="welcome-card-icon-wrap" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                    <Layers size={18} />
                  </div>
                  <div className="welcome-card-body">
                    <div className="welcome-card-top">
                      <h3>Explore Selected Works</h3>
                      <ArrowRight size={14} className="welcome-card-arrow" />
                    </div>
                    <p>35+ production projects, AI pipelines & live demos</p>
                    <div className="welcome-tags">
                      <span>Featured Work</span>
                      <span>Live Systems</span>
                    </div>
                  </div>
                </button>

                {/* 2. Chat with PrinceAI */}
                <button
                  type="button"
                  onClick={handleOpenPrinceAI}
                  className="welcome-card welcome-card-ai"
                >
                  <div className="welcome-card-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc' }}>
                    <Bot size={18} />
                  </div>
                  <div className="welcome-card-body">
                    <div className="welcome-card-top">
                      <h3>Chat with PrinceAI™</h3>
                      <div className="welcome-pill-live">
                        <span className="welcome-live-dot-mini" /> Live AI
                      </div>
                    </div>
                    <p>Ask my custom AI assistant about skills & architecture</p>
                    <div className="welcome-tags">
                      <span>Instant Reply</span>
                      <span>Custom LLM</span>
                    </div>
                  </div>
                </button>

                {/* 3. Hire Me / Request Quote */}
                <button
                  type="button"
                  onClick={handleOpenContact}
                  className="welcome-card"
                >
                  <div className="welcome-card-icon-wrap" style={{ background: 'rgba(34, 197, 94, 0.12)', color: '#4ade80' }}>
                    <Briefcase size={18} />
                  </div>
                  <div className="welcome-card-body">
                    <div className="welcome-card-top">
                      <h3>Hire for a Project</h3>
                      <ArrowRight size={14} className="welcome-card-arrow" />
                    </div>
                    <p>Have an MVP, full-stack app, or role to discuss?</p>
                    <div className="welcome-tags">
                      <span>24h Response</span>
                      <span>Direct Quote</span>
                    </div>
                  </div>
                </button>

                {/* 4. View / Download Resume */}
                <button
                  type="button"
                  onClick={handleOpenResume}
                  className="welcome-card"
                >
                  <div className="welcome-card-icon-wrap" style={{ background: 'rgba(234, 179, 8, 0.12)', color: '#facc15' }}>
                    <FileText size={18} />
                  </div>
                  <div className="welcome-card-body">
                    <div className="welcome-card-top">
                      <h3>View Resume (PDF)</h3>
                      <ExternalLink size={14} className="welcome-card-arrow" />
                    </div>
                    <p>Verified credentials, engineering education & stack</p>
                    <div className="welcome-tags">
                      <span>Infosys Certified</span>
                      <span>Full-Stack</span>
                    </div>
                  </div>
                </button>

                {/* 5. Try Live Developer Tools */}
                <button
                  type="button"
                  onClick={handleOpenLiveTools}
                  className="welcome-card"
                >
                  <div className="welcome-card-icon-wrap" style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8' }}>
                    <Globe size={18} />
                  </div>
                  <div className="welcome-card-body">
                    <div className="welcome-card-top">
                      <h3>Try Live Web Tools</h3>
                      <ArrowRight size={14} className="welcome-card-arrow" />
                    </div>
                    <p>Live Domain Checker, Streaming TV & AI Playground</p>
                    <div className="welcome-tags">
                      <span>Domain Checker</span>
                      <span>100+ Channels</span>
                    </div>
                  </div>
                </button>

                {/* 6. Quick 15s Pitch */}
                <button
                  type="button"
                  onClick={() => setShowPitchModal(true)}
                  className="welcome-card"
                >
                  <div className="welcome-card-icon-wrap" style={{ background: 'rgba(236, 72, 153, 0.12)', color: '#f472b6' }}>
                    <Terminal size={18} />
                  </div>
                  <div className="welcome-card-body">
                    <div className="welcome-card-top">
                      <h3>15-Second Elevator Pitch</h3>
                      <ArrowRight size={14} className="welcome-card-arrow" />
                    </div>
                    <p>A quick summary of experience, philosophy & stack</p>
                    <div className="welcome-tags">
                      <span>TL;DR</span>
                      <span>Quick Overview</span>
                    </div>
                  </div>
                </button>
              </div>

              {/* Bottom Footer Actions */}
              <div className="welcome-footer">
                <div className="welcome-social-links">
                  <a
                    href="https://github.com/mritunjaykumarr"
                    target="_blank"
                    rel="noreferrer"
                    className="welcome-social-icon"
                    title="GitHub Profile"
                  >
                    <GithubIcon size={15} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/mritunjay-kumar-22a7a828b"
                    target="_blank"
                    rel="noreferrer"
                    className="welcome-social-icon"
                    title="LinkedIn Profile"
                  >
                    <LinkedinIcon size={15} />
                  </a>
                  <a
                    href="https://wa.me/919470880956"
                    target="_blank"
                    rel="noreferrer"
                    className="welcome-social-icon"
                    title="WhatsApp Direct"
                  >
                    <Send size={14} />
                  </a>
                  <a
                    href="mailto:me@mritify.online"
                    className="welcome-social-icon"
                    title="Email me@mritify.online"
                  >
                    <Globe size={14} />
                  </a>
                </div>

                <div className="welcome-footer-right">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      handleConfetti();
                    }}
                    className="welcome-primary-cta"
                  >
                    <span>Start Exploring Portfolio</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Sub-Modal: Quick 15s Pitch Modal */}
            <AnimatePresence>
              {showPitchModal && (
                <motion.div
                  className="welcome-pitch-overlay"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div className="welcome-pitch-card">
                    <div className="welcome-pitch-header">
                      <div className="welcome-pitch-title">
                        <Terminal size={16} />
                        <span>Quick 15-Second Summary</span>
                      </div>
                      <button
                        onClick={() => setShowPitchModal(false)}
                        className="welcome-icon-btn"
                      >
                        <X size={15} />
                      </button>
                    </div>

                    <div className="welcome-pitch-content">
                      <p>
                        <strong>Mritunjay Kumar</strong> is a Full-Stack Developer & AI Engineer with 3+ years of experience building modern web architectures and generative AI products.
                      </p>
                      <ul>
                        <li><Check size={13} /> <strong>Frontend:</strong> React 19, TypeScript, Next.js, Framer Motion, GSAP.</li>
                        <li><Check size={13} /> <strong>Backend & Cloud:</strong> Node.js, Express, Supabase, PostgreSQL, REST/Socket APIs.</li>
                        <li><Check size={13} /> <strong>AI Systems:</strong> OpenRouter, Gemini, streaming interfaces, context retrieval pipelines.</li>
                        <li><Check size={13} /> <strong>Track Record:</strong> 35+ shipped projects, 100+ channels platform, Infosys certified.</li>
                      </ul>
                    </div>

                    <div className="welcome-pitch-actions">
                      <button
                        onClick={handleCopyPitch}
                        className="welcome-btn-outline"
                      >
                        {copiedPitch ? (
                          <>
                            <Check size={14} style={{ color: '#22c55e' }} />
                            <span>Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <FileText size={14} />
                            <span>Copy Quick Bio</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleOpenContact}
                        className="welcome-btn-solid"
                      >
                        <span>Start Conversation</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
