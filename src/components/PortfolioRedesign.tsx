import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, FormEvent, MouseEvent, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight, ArrowUpRight, Award, Bot, BrainCircuit, BriefcaseBusiness,
  Check, ChevronRight, Cloud, Code2, Database, ExternalLink,
  GraduationCap, Mail, MapPin,
  MessageCircle, MonitorSmartphone, Send, Server, Sparkles,
  Workflow, Zap, FileText
} from 'lucide-react';
import { EXTENDED_PROJECTS_DATA } from '../data/projectsData';
import { GithubIcon, LinkedinIcon } from './SocialIcons';
import PrinceAI from './PrinceAI';
import AdUnit from './AdUnit';

const socials = [
  { label: 'GitHub', href: 'https://github.com/mritunjaykumarr', icon: GithubIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mritunjay-kumar-22a7a828b', icon: LinkedinIcon },
  { label: 'Email', href: 'mailto:me@mritify.online', icon: Mail },
];

const skills = [
  { name: 'Frontend systems', icon: MonitorSmartphone, items: ['React 19', 'TypeScript', 'Next.js', 'Motion'], years: '3+ years' },
  { name: 'Backend & APIs', icon: Server, items: ['Node.js', 'Express', 'REST APIs', 'Socket.io'], years: '3+ years' },
  { name: 'AI engineering', icon: BrainCircuit, items: ['OpenRouter', 'Gemini', 'Streaming', 'Prompt UX'], years: '1+ year' },
  { name: 'Data & cloud', icon: Database, items: ['Supabase', 'PostgreSQL', 'MongoDB', 'Vercel'], years: '2+ years' },
  { name: 'Automation', icon: Workflow, items: ['Gmail API', 'Nodemailer', 'CSV pipelines', 'OAuth2'], years: '2+ years' },
  { name: 'Delivery', icon: Cloud, items: ['GitHub', 'CI/CD', 'Performance', 'Accessibility'], years: '3+ years' },
];

const certifications = [
  { title: 'Fullstack Completion', issuer: 'Infosys', year: '2024', image: '/assets/fullstackC.png' },
  { title: 'Claude Code In Action', issuer: 'Infosys', year: '2026', image: '/assets/cert-6.png' },
  { title: 'Basic Machine Learning', issuer: 'Infosys', year: '2024', image: '/assets/machinelearningC.png' },
];

const articles = [
  { category: 'Engineering', time: '6 min read', title: 'Building next-gen web apps with React 19 & TypeScript', image: '/assets/bulkmailP.png' },
  { category: 'Performance', time: '4 min read', title: 'The discipline behind buttery-smooth product motion', image: '/assets/adfree.png' },
  { category: 'AI strategy', time: '5 min read', title: 'A practical path to streaming AI experiences', image: '/assets/clip.png' },
];

function CountUp({ end, suffix = '' }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const started = performance.now();
      const duration = 1200;
      const tick = (now: number) => {
        const progress = Math.min((now - started) / duration, 1);
        setValue(Math.round(end * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: 0.5 });
    observer.observe(target);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [end]);

  return <span ref={ref}>{value}{suffix}</span>;
}

function FadeIn({ children, delay = 0, className = '', style }: { children: ReactNode; delay?: number; className?: string; style?: CSSProperties }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ProvidedImage({ name, fallback, alt, className }: { name: 'img1' | 'img2'; fallback: string; alt: string; className?: string }) {
  const [source, setSource] = useState(`/assets/${name}.jpeg`);
  const [triedPng, setTriedPng] = useState(false);

  return (
    <img
      className={className}
      src={source}
      alt={alt}
      onError={() => {
        if (!triedPng) {
          setTriedPng(true);
          setSource(`/assets/${name}.png`);
        } else {
          setSource(fallback);
        }
      }}
    />
  );
}

export default function PortfolioRedesign() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');
  const featured = EXTENDED_PROJECTS_DATA[0];
  const projectRows = EXTENDED_PROJECTS_DATA.slice(1);
  const shouldReduce = useReducedMotion() ?? false;

  // GSAP ScrollTrigger
  useEffect(() => {
    if (shouldReduce) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('.v3-stats-grid > div', {
        y: 20, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: '.v3-stats', start: 'top 85%', once: true },
      });
      gsap.from('.v3-story-card', {
        y: 24, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '#about', start: 'top 80%', once: true },
      });
    }, canvasRef);
    return () => ctx.revert();
  }, [shouldReduce]);

  const setSpotlight = (event: MouseEvent<HTMLDivElement>) => {
    const box = canvasRef.current?.getBoundingClientRect();
    if (!box || !canvasRef.current) return;
    canvasRef.current.style.setProperty('--spot-x', `${event.clientX - box.left}px`);
    canvasRef.current.style.setProperty('--spot-y', `${event.clientY - box.top}px`);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setStatus('');
    const form = event.currentTarget;
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result = await response.json();
      if (result.success) {
        setStatus('✓ Message sent — I will get back to you within 24 hours.');
        form.reset();
      } else {
        setStatus('Failed to send. Please email me directly at me@mritify.online.');
      }
    } catch {
      setStatus('Failed to send. Please email me directly at me@mritify.online.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="portfolio-v3" ref={canvasRef} onMouseMove={setSpotlight} style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <main>
        {/* ——— Hero Section ——— */}
        <section ref={heroRef} className="v3-hero" id="home">
          <div className="v3-container v3-hero-grid">
            <FadeIn className="v3-hero-copy">
              <div className="v3-kicker" style={{ marginBottom: '1.25rem' }}>
                <Sparkles size={13} style={{ color: 'var(--text)' }} />
                <span>Available for select projects · AI-First Engineering</span>
              </div>

              <h1>
                Engineering intelligent <em>AI systems</em> & scalable web products.
              </h1>

              <p className="v3-lede">
                I design and ship fast, thoughtful software for teams turning ambitious ideas into useful, high-impact products.
              </p>

              <div className="v3-hero-actions">
                <a href="#projects" className="btn-primary v3-button-primary">
                  <span>View Selected Work</span>
                  <ArrowRight size={15} />
                </a>
                <a href="/updated_resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-secondary v3-button-quiet">
                  <FileText size={15} />
                  <span>View Resume</span>
                </a>
                <a href="#contact" className="btn-secondary v3-button-quiet">
                  <MessageCircle size={15} />
                  <span>Start a Conversation</span>
                </a>
              </div>

              <div className="v3-hero-proof">
                <div className="v3-avatar-stack">
                  <img src="/assets/profile1.jpg" alt="Mritunjay Kumar" />
                </div>
                <p>
                  <strong>Usually replies within 24 hours.</strong>
                  <br />
                  Based in India · working globally with product teams
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.15} className="v3-stage-wrap">
              <div className="v3-stage">
                <div className="v3-stage-terminal">
                  <div className="v3-terminal-bar">
                    <span /><span /><span />
                    <b>mritunjay.ai / workspace</b>
                  </div>
                  <div className="v3-terminal-content">
                    <p><span style={{ color: '#9a9a9a' }}>~</span> whoami</p>
                    <strong>Mritunjay Kumar — AI Engineer & Full Stack Developer</strong>
                    <p><span style={{ color: '#9a9a9a' }}>~</span> focus --current</p>
                    <ul>
                      <li><Check size={13} style={{ color: '#ffffff' }} /> Crafting crisp, high-performance interfaces</li>
                      <li><Check size={13} style={{ color: '#ffffff' }} /> Connecting LLMs to actionable business workflows</li>
                      <li><Check size={13} style={{ color: '#ffffff' }} /> Shipping reliable full-stack architectures</li>
                    </ul>
                    <p><span style={{ color: '#9a9a9a' }}>~</span> <b style={{ animation: 'blink 1s infinite' }}>_</b></p>
                  </div>
                </div>

                <div className="v3-stage-photo">
                  <ProvidedImage name="img1" fallback="/assets/profile2.jpg" alt="Mritunjay Kumar" />
                </div>

                <motion.div className="v3-tech-chip v3-chip-react" animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                  <Code2 size={14} /> React 19 + TypeScript
                </motion.div>
                <motion.div className="v3-tech-chip v3-chip-ai" animate={{ y: [0, 6, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}>
                  <Bot size={14} /> AI Workflows & LLMs
                </motion.div>
                <motion.div className="v3-tech-chip v3-chip-cloud" animate={{ y: [0, -5, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}>
                  <Cloud size={14} /> Supabase & Node.js
                </motion.div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ——— Stats Section ——— */}
        <section className="v3-stats" aria-label="Portfolio metrics">
          <div className="v3-container v3-stats-grid">
            <div>
              <strong><CountUp end={12} suffix="+" /></strong>
              <span>Products shipped</span>
            </div>
            <div>
              <strong><CountUp end={3} suffix="+" /></strong>
              <span>Years building</span>
            </div>
            <div>
              <strong><CountUp end={18} suffix="+" /></strong>
              <span>Technologies</span>
            </div>
            <div>
              <strong><CountUp end={99} suffix=".9%" /></strong>
              <span>Uptime targets</span>
            </div>
          </div>
        </section>

        {/* ——— About Section ——— */}
        <section className="v3-section" id="about">
          <div className="v3-container">
            <FadeIn className="v3-section-heading v3-split-heading">
              <div>
                <p className="v3-eyebrow">01 / About Me</p>
                <h2>Engineering with a product <em>point of view.</em></h2>
              </div>
              <p>
                I care about the entire craft: the user’s first click, the systems running behind it, and what makes a product worth returning to.
              </p>
            </FadeIn>

            <div className="v3-story-grid">
              <FadeIn delay={0.05} className="v3-story-card">
                <p className="v3-card-label">Mission</p>
                <h3>Make complex technology feel inevitable.</h3>
                <p>
                  Every interface should remove friction, reveal immediate value, and give people confidence in the intelligence behind it.
                </p>
              </FadeIn>

              <FadeIn delay={0.12} className="v3-story-card">
                <p className="v3-card-label">Currently</p>
                <h3>Building at Epigroww Global</h3>
                <p>
                  Designing full-stack features, API integrations, and responsive applications for high-traffic platforms.
                </p>
                <div style={{ marginTop: '1rem' }}>
                  <span style={{ fontSize: '0.82rem', color: '#9a9a9a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Full-stack product development <ChevronRight size={14} />
                  </span>
                </div>
              </FadeIn>

              <FadeIn delay={0.19} className="v3-story-card">
                <p className="v3-card-label">Principles</p>
                <ul className="v3-check-list">
                  <li><Check size={14} style={{ color: '#ffffff' }} /> Business-first problem framing</li>
                  <li><Check size={14} style={{ color: '#ffffff' }} /> Accessible, fast interfaces</li>
                  <li><Check size={14} style={{ color: '#ffffff' }} /> Systems that scale simply</li>
                </ul>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ——— Projects Section ——— */}
        <section className="v3-section" id="projects">
          <div className="v3-container">
            <FadeIn className="v3-section-heading">
              <p className="v3-eyebrow">02 / Selected Work</p>
              <h2>Products built to <em>move work forward.</em></h2>
              <p>
                From AI-enabled experiences to real-time systems and focused web tools, each build solves a practical problem.
              </p>
            </FadeIn>

            {/* Featured Project */}
            <FadeIn className="v3-featured-project">
              <div className="v3-featured-copy">
                <div className="v3-project-category">
                  <Zap size={14} /> Featured Product
                </div>
                <h3>{featured.title}</h3>
                <p>{featured.fullDesc}</p>

                <div className="v3-problem-solution">
                  <div>
                    <small>Problem</small>
                    <span>{featured.problemSolved.problem}</span>
                  </div>
                  <div>
                    <small>Impact</small>
                    <span>{featured.problemSolved.impact}</span>
                  </div>
                </div>

                <div className="v3-stack-row">
                  {featured.stack.slice(0, 5).map(item => (
                    <span key={item}>{item}</span>
                  ))}
                </div>

                <div className="v3-project-actions">
                  <a href={featured.url} target="_blank" rel="noreferrer" className="btn-primary v3-button-primary">
                    <span>Live Demo</span>
                    <ExternalLink size={15} />
                  </a>
                  <a href={featured.github} target="_blank" rel="noreferrer" className="btn-secondary v3-button-quiet">
                    <GithubIcon size={15} />
                    <span>GitHub</span>
                  </a>
                </div>
              </div>

              <div className="v3-device-area">
                <img src={featured.img} alt={`${featured.title} interface`} />
              </div>
            </FadeIn>

            {/* Project Grid */}
            <div className="v3-project-grid">
              {projectRows.map((project, index) => (
                <FadeIn key={project.id} delay={index * 0.06} className="v3-project-card">
                  <div className="v3-project-image">
                    <img src={project.img} alt={project.title} loading="lazy" />
                    <a href={project.url} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}>
                      <ArrowUpRight size={18} />
                    </a>
                  </div>
                  <div className="v3-project-body">
                    <span>{project.category}</span>
                    <h3>{project.title}</h3>
                    <p>{project.desc}</p>
                    <div>
                      {project.tags.slice(0, 4).map(tag => (
                        <b key={tag}>{tag}</b>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* AdSense Unit */}
        <section className="section" style={{ padding: '2rem 0' }}>
          <div className="v3-container">
            <AdUnit slot="6189533583" />
          </div>
        </section>

        {/* ——— PrinceAI Flagship Section ——— */}
        <section className="v3-section" id="prince-ai" style={{ background: 'var(--bg)' }}>
          <div className="v3-container">
            <FadeIn className="v3-section-heading">
              <p className="v3-eyebrow">03 / Flagship AI Product</p>
              <h2>Meet <em>PrinceAI™</em></h2>
              <p>
                Personal AI Assistant powered by custom LLM integrations. A production-ready demonstration of conversational AI, contextual knowledge retrieval, and API-connected engineering.
              </p>
            </FadeIn>

            <PrinceAI />
          </div>
        </section>

        {/* ——— Skills Section ——— */}
        <section className="v3-section" id="skills">
          <div className="v3-container">
            <FadeIn className="v3-section-heading v3-split-heading">
              <div>
                <p className="v3-eyebrow">04 / Technical Range</p>
                <h2>A versatile stack, <em>one high bar.</em></h2>
              </div>
              <p>Right tools, clear decisions, and the engineering care to make every solution durable.</p>
            </FadeIn>

            <div className="v3-skill-grid">
              {skills.map((skill, i) => {
                const Icon = skill.icon;
                const yrs = parseInt(skill.years, 10) || 1;
                const pct = Math.min(100, 50 + yrs * 14);
                return (
                  <FadeIn key={skill.name} delay={i * 0.05} className="v3-skill-card">
                    <div className="v3-skill-top">
                      <Icon size={18} />
                      <small>{skill.years}</small>
                    </div>
                    <h3>{skill.name}</h3>
                    <div className="v3-skill-list">
                      {skill.items.map(item => (
                        <b key={item}>{item}</b>
                      ))}
                    </div>
                    <div className="v3-skill-meter">
                      <i style={{ width: `${pct}%` }} />
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>

        {/* ——— Experience & Education Section ——— */}
        <section className="v3-section" id="experience">
          <div className="v3-container">
            <FadeIn className="v3-section-heading">
              <p className="v3-eyebrow">05 / Career Progression</p>
              <h2>Experience built in <em>real product teams.</em></h2>
            </FadeIn>

            <div className="v3-timeline">
              <FadeIn className="v3-timeline-item">
                <div className="v3-timeline-mark">
                  <BriefcaseBusiness size={18} />
                </div>
                <div>
                  <p className="v3-date">Present · New Delhi, India</p>
                  <h3>Fullstack Developer <span>@ Epigroww Global</span></h3>
                  <p>
                    Leading frontend architecture and full-stack feature development for client platforms. Shipping responsive UI, API integrations, and production-ready workflows.
                  </p>
                  <div className="v3-timeline-tags">
                    <span>React 19</span>
                    <span>TypeScript</span>
                    <span>Node.js</span>
                    <span>Supabase</span>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.1} className="v3-timeline-item">
                <div className="v3-timeline-mark">
                  <Code2 size={18} />
                </div>
                <div>
                  <p className="v3-date">2026 · Noida, India</p>
                  <h3>Software Developer Intern <span>@ Digicaptain Technology</span></h3>
                  <p>
                    Built client-facing interfaces and utility tools, integrated REST APIs, and refined responsive experiences across desktop and mobile.
                  </p>
                  <div className="v3-timeline-tags">
                    <span>JavaScript</span>
                    <span>HTML/CSS</span>
                    <span>GitHub</span>
                    <span>Vercel</span>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.18} className="v3-timeline-item">
                <div className="v3-timeline-mark">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <p className="v3-date">2022 — 2026 · Salem, India</p>
                  <h3>B.Tech Computer Science <span>@ VMKV Engineering College</span></h3>
                  <p>
                    Built a rigorous software-engineering foundation across web technologies, algorithms, data structures, and distributed systems.
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ——— Credentials / Certifications ——— */}
        <section className="v3-section" id="certifications">
          <div className="v3-container">
            <FadeIn className="v3-section-heading">
              <p className="v3-eyebrow">06 / Credentials</p>
              <h2>Always learning. <em>Always shipping.</em></h2>
            </FadeIn>

            <div className="v3-cert-grid">
              {certifications.map((cert, index) => (
                <FadeIn delay={index * 0.08} key={cert.title} className="v3-cert-card">
                  <div className="v3-cert-image">
                    <img src={cert.image} alt={`${cert.title} certificate`} loading="lazy" />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#9a9a9a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Award size={14} /> Verified Credential
                    </span>
                    <h3 style={{ margin: '0.4rem 0 0.2rem', fontSize: '1.05rem' }}>{cert.title}</h3>
                    <p style={{ margin: 0, fontSize: '0.82rem' }}>{cert.issuer} · {cert.year}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ——— Blog / Articles ——— */}
        <section className="v3-section" id="blog">
          <div className="v3-container">
            <FadeIn className="v3-section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p className="v3-eyebrow">07 / Notes from the Build</p>
                <h2>Ideas beyond <em>the commit.</em></h2>
              </div>
              <a href="/blog" className="btn-secondary v3-button-quiet" style={{ textDecoration: 'none' }}>
                <span>Read All Notes</span>
                <ArrowRight size={15} />
              </a>
            </FadeIn>

            <div className="v3-article-grid">
              {articles.map((article, index) => (
                <FadeIn delay={index * 0.08} key={article.title} className="v3-article-card">
                  <img src={article.image} alt="" loading="lazy" />
                  <div>
                    <span style={{ fontSize: '0.74rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {article.category} · {article.time}
                    </span>
                    <h3 style={{ margin: '0.4rem 0 0.85rem', fontSize: '1.05rem' }}>{article.title}</h3>
                    <a href="/blog" style={{ color: '#ffffff', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                      Read Article <ArrowUpRight size={14} />
                    </a>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* ——— Contact Section ——— */}
        <section className="v3-section" id="contact">
          <div className="v3-container v3-contact-grid">
            <FadeIn>
              <p className="v3-eyebrow">08 / Let’s Work Together</p>
              <h2>Let’s build something <em>that matters.</em></h2>
              <p style={{ marginTop: '0.75rem', marginBottom: '1.5rem' }}>
                Have an ambitious product, a workflow worth automating, or an engineering role where craft and speed matter? Let's connect.
              </p>

              <div className="v3-contact-details">
                <a href="mailto:me@mritify.online">
                  <Mail size={16} />
                  <span>
                    <small>Direct Email</small>
                    me@mritify.online
                  </span>
                </a>
                <a href="mailto:support@mritify.online">
                  <Mail size={16} />
                  <span>
                    <small>Tech & Client Support</small>
                    support@mritify.online
                  </span>
                </a>
                <a href="mailto:info@mritify.online">
                  <Mail size={16} />
                  <span>
                    <small>General Inquiries</small>
                    info@mritify.online
                  </span>
                </a>
                <a href="https://wa.me/919470880956" target="_blank" rel="noreferrer">
                  <MessageCircle size={16} />
                  <span>
                    <small>WhatsApp Direct</small>
                    +91 94708 80956
                  </span>
                </a>
                <span>
                  <MapPin size={16} />
                  <span>
                    <small>Location</small>
                    Bihar / New Delhi, India · Working Globally
                  </span>
                </span>
              </div>

              <div className="v3-social-row">
                {socials.map(({ label, href, icon: Icon }) => (
                  <a key={label} href={href} target={label === 'Email' ? undefined : '_blank'} rel="noreferrer">
                    <Icon size={14} />
                    {label}
                  </a>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.1} className="v3-contact-form-wrap">
              <form onSubmit={handleSubmit}>
                <input type="hidden" name="access_key" value="af71a9aa-dfeb-4439-a91b-afa7bc2e17d8" />
                <div className="v3-form-field">
                  <label htmlFor="v3-name">Your Name</label>
                  <input required id="v3-name" name="name" placeholder="John Doe" />
                </div>
                <div className="v3-form-field">
                  <label htmlFor="v3-email">Work Email</label>
                  <input required id="v3-email" name="email" type="email" placeholder="john@company.com" />
                </div>
                <div className="v3-form-field">
                  <label htmlFor="v3-subject">What are you building?</label>
                  <input id="v3-subject" name="subject" placeholder="New product build / Full stack project" />
                </div>
                <div className="v3-form-field">
                  <label htmlFor="v3-message">Message Details</label>
                  <textarea required id="v3-message" name="message" rows={4} placeholder="Tell me about your project goals and timeline..." />
                </div>
                <button className="btn-primary v3-button-primary" disabled={sending} type="submit" style={{ width: '100%', marginTop: '0.5rem' }}>
                  <span>{sending ? 'Sending Message…' : 'Send Message'}</span>
                  <Send size={15} />
                </button>
                {status && (
                  <p style={{ fontSize: '0.82rem', color: status.includes('✓') ? '#22c55e' : '#f87171', margin: '0.5rem 0 0' }}>
                    {status}
                  </p>
                )}
              </form>
            </FadeIn>
          </div>
        </section>
      </main>

      {/* ——— Footer ——— */}
      <footer className="v3-footer">
        <div className="v3-container">
          <div className="v3-footer-top">
            <div>
              <a href="#home" style={{ textDecoration: 'none', color: 'var(--text)', fontSize: '1.2rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
                MRITUNJAY KUMAR
              </a>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem' }}>
                AI Engineer & Full Stack Developer building high-performance web products.
              </p>
            </div>
            <a href="#home" className="btn-secondary v3-button-quiet" style={{ height: '36px', fontSize: '0.8rem' }}>
              <span>Back to Top</span>
              <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="v3-footer-bottom">
            <span>© {new Date().getFullYear()} Mritunjay Kumar. All rights reserved.</span>
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              <a href="/updated_resume.pdf" target="_blank" rel="noreferrer">Resume</a>
              <a href="https://github.com/mritunjaykumarr" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://www.linkedin.com/in/mritunjay-kumar-22a7a828b" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="mailto:me@mritify.online">Email</a>
              <a href="/privacy-policy">Privacy</a>
              <a href="/terms-and-conditions">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
