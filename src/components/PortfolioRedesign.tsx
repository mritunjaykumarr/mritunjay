import { useEffect, useRef, useState } from 'react';
import type { FormEvent, MouseEvent, ReactNode } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight, ArrowUpRight, Award, Bot, BrainCircuit, BriefcaseBusiness,
  Check, ChevronRight, CircleDot, Cloud, Code2, Database, ExternalLink,
  GraduationCap, Mail, MapPin,
  MessageCircle, MonitorSmartphone, Network, Send, Server, Sparkles,
  WandSparkles, Workflow, Zap
} from 'lucide-react';
import { EXTENDED_PROJECTS_DATA } from '../data/projectsData';
import { GithubIcon, LinkedinIcon } from './SocialIcons';
import PrinceAI from './PrinceAI';

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

function FadeIn({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={`${className} playful-enter`}
      initial={{ opacity: 0, scale: 0.92, y: 12 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.5, delay, ease: [0.34, 1.56, 0.64, 1] as any }}
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
  const { scrollY } = useScroll();
  const heroCircleY = useTransform(scrollY, [0, 600], [0, shouldReduce ? 0 : -50]);
  const heroDotsY = useTransform(scrollY, [0, 600], [0, shouldReduce ? 0 : -30]);

  // GSAP ScrollTrigger — animaster scroll trail for stats + story cards
  useEffect(() => {
    if (shouldReduce) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('.v3-stats-grid > div', {
        y: 24, opacity: 0, scale: 0.96, duration: 0.6, stagger: 0.08, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: '.v3-stats', start: 'top 85%', once: true },
      });
      gsap.from('.v3-story-card', {
        y: 30, opacity: 0, rotation: -1, duration: 0.7, stagger: 0.1, ease: 'back.out(1.5)',
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
        setStatus('Message sent — I’ll get back to you within 24 hours.');
        form.reset();
      } else {
        setStatus('That did not send. Please email me directly instead.');
      }
    } catch {
      setStatus('That did not send. Please email me directly instead.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="portfolio-v3" ref={canvasRef} onMouseMove={setSpotlight}>
      <div className="v3-ambient" aria-hidden="true"><i /><b /><em /></div>
      <main>
        <section ref={heroRef} className="v3-hero" id="home" style={{ position:'relative', overflow:'clip' }}>
          {/* Animaster scroll trail — yellow circle parallax */}
          <motion.div
            aria-hidden="true"
            style={{
              y: heroCircleY,
              position:'absolute', left:'5%', top:'12%', width:380, height:380,
              background:'var(--tertiary)', border:'2px solid var(--foreground)',
              borderRadius:'50%', boxShadow:'var(--shadow-pop)', opacity:0.18, zIndex:0,
            }}
          />
          <motion.div
            aria-hidden="true"
            style={{
              y: heroDotsY,
              position:'absolute', right:'2%', top:'8%', width:260, height:260,
              backgroundImage:'radial-gradient(circle, var(--foreground) 1.6px, transparent 1.6px)',
              backgroundSize:'18px 18px', opacity:0.06, borderRadius:'var(--radius-lg)', zIndex:0,
            }}
          />
          <div className="v3-container v3-hero-grid" style={{ position:'relative', zIndex:1 }}>
            <FadeIn className="v3-hero-copy">
              <div className="v3-kicker"><span className="v3-live-dot" /> Available for select projects</div>
              <p className="v3-eyebrow"><Sparkles size={14} /> AI Engineer · Full Stack Developer</p>
              <h1>Building AI products that solve <span>real business problems.</span></h1>
              <p className="v3-lede">I design and ship fast, thoughtful software for the teams turning ambitious ideas into useful, reliable products.</p>
              <div className="v3-hero-actions">
                <a href="#projects" className="v3-button v3-button-primary">View selected work <ArrowDownIcon /></a>
                <a href="#contact" className="v3-button v3-button-quiet">Start a conversation <MessageCircle size={17} /></a>
              </div>
              <div className="v3-hero-proof">
                <div className="v3-avatar-stack"><img src="/assets/profile1.jpg" alt="Mritunjay Kumar" /><span><Check size={12} /></span></div>
                <p><strong>Usually replies within 24 hours.</strong><br />Based in India · working globally</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.15} className="v3-stage-wrap">
              <div className="v3-stage">
                <div className="v3-stage-grid" />
                <div className="v3-stage-terminal">
                  <div className="v3-terminal-bar"><span /><span /><span /><b>mritunjay.ai / workspace</b></div>
                  <div className="v3-terminal-content">
                    <p><span>~</span> whoami</p>
                    <strong>AI-first full stack engineer</strong>
                    <p><span>~</span> focus --today</p>
                    <ul><li><i /> Crafting crisp product interfaces</li><li><i /> Connecting AI to useful workflows</li><li><i /> Shipping reliable systems</li></ul>
                    <p><span>~</span> <b className="v3-caret">_</b></p>
                  </div>
                </div>
                <motion.div className="v3-stage-photo" animate={{ y: [0, -7, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}>
                  <ProvidedImage name="img1" fallback="/assets/profile2.jpg" alt="Mritunjay Kumar" />
                  <div className="v3-photo-sheen" />
                </motion.div>
                <motion.div className="v3-tech-chip v3-chip-react" animate={{ y: [0, -9, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}><Code2 size={16} /> React 19</motion.div>
                <motion.div className="v3-tech-chip v3-chip-ai" animate={{ y: [0, 8, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}><Bot size={16} /> AI workflows</motion.div>
                <motion.div className="v3-tech-chip v3-chip-cloud" animate={{ y: [0, -6, 0] }} transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}><Cloud size={16} /> Cloud-ready</motion.div>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="v3-stats" aria-label="Portfolio impact">
          <div className="v3-container v3-stats-grid">
            <div><strong><CountUp end={12} suffix="+" /></strong><span>Products shipped</span></div>
            <div><strong><CountUp end={3} suffix="+" /></strong><span>Years building</span></div>
            <div><strong><CountUp end={18} suffix="+" /></strong><span>Technologies</span></div>
            <div><strong><CountUp end={99} suffix=".9%" /></strong><span>Uptime targets</span></div>
          </div>
        </section>

        <section className="v3-section" id="about">
          <div className="v3-container">
            <FadeIn className="v3-section-heading v3-split-heading">
              <div><p className="v3-eyebrow">01 / My approach</p><h2>Engineering with a product <span>point of view.</span></h2></div>
              <p>I care about the whole path: the user’s first click, the systems behind it, and what makes a product worth returning to.</p>
            </FadeIn>
            <div className="v3-story-grid">
              <FadeIn delay={0.05} className="v3-story-card v3-story-feature"><span className="v3-card-icon"><WandSparkles size={22} /></span><p className="v3-card-label">Mission</p><h3>Make complex technology feel inevitable.</h3><p>Every interface should remove friction, reveal value, and give people confidence in the system behind it.</p><div className="v3-orbit" aria-hidden="true"><i /><b /><em /></div></FadeIn>
              <FadeIn delay={0.12} className="v3-story-card"><p className="v3-card-label">Currently</p><h3>Building at Epigroww Global</h3><p>Designing full-stack features and responsive applications for client platforms and high-traffic experiences.</p><span className="v3-inline-link">Full-stack product development <ChevronRight size={16} /></span></FadeIn>
              <FadeIn delay={0.19} className="v3-story-card"><p className="v3-card-label">Principles</p><ul className="v3-check-list"><li><Check size={15} /> Business-first problem framing</li><li><Check size={15} /> Accessible, fast interfaces</li><li><Check size={15} /> Systems that scale simply</li></ul></FadeIn>
            </div>
          </div>
        </section>

        <section className="v3-section v3-section-projects" id="projects">
          <div className="v3-container">
            <FadeIn className="v3-section-heading"><p className="v3-eyebrow">02 / Selected work</p><h2>Products built to <span>move work forward.</span></h2><p>From AI-enabled experiences to real-time systems and focused web tools, each build starts with a practical problem.</p></FadeIn>
            <FadeIn className="v3-featured-project">
              <div className="v3-featured-copy"><div className="v3-project-category"><Zap size={14} /> Featured product</div><h3>{featured.title}</h3><p>{featured.fullDesc}</p><div className="v3-problem-solution"><div><small>Problem</small><span>{featured.problemSolved.problem}</span></div><div><small>Impact</small><span>{featured.problemSolved.impact}</span></div></div><div className="v3-stack-row">{featured.stack.slice(0, 4).map(item => <span key={item}>{item}</span>)}</div><div className="v3-project-actions"><a href={featured.url} target="_blank" rel="noreferrer" className="v3-button v3-button-primary">Live demo <ExternalLink size={16} /></a><a href={featured.github} target="_blank" rel="noreferrer" className="v3-text-link">GitHub <ArrowUpRight size={16} /></a></div></div>
              <div className="v3-device-area"><div className="v3-laptop"><div className="v3-laptop-camera" /><img src={featured.img} alt={`${featured.title} interface`} /><div className="v3-laptop-base" /></div><div className="v3-float-metric"><strong>10,000+</strong><span>emails processed</span></div></div>
            </FadeIn>
            <div className="v3-project-grid">
              {projectRows.map((project, index) => <FadeIn key={project.id} delay={index * 0.06} className="v3-project-card"><div className="v3-project-image"><img src={project.img} alt={project.title} loading="lazy" /><div className="v3-card-scrim" /><a href={project.url} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}><ArrowUpRight size={20} /></a></div><div className="v3-project-body"><span>{project.category}</span><h3>{project.title}</h3><p>{project.desc}</p><div>{project.tags.slice(0, 3).map(tag => <b key={tag}>{tag}</b>)}</div></div></FadeIn>)}
            </div>
          </div>
        </section>

        <section className="v3-prince-section" id="prince-ai">
          <div className="v3-container v3-prince-intro">
            <FadeIn className="v3-section-heading"><p className="v3-eyebrow">03 / Flagship AI product</p><h2>Meet <span>PrinceAI™</span></h2><p>Personal AI Assistant powered by my own LLM. A production-minded demonstration of conversational AI, intelligent automation, and API-connected product engineering.</p></FadeIn>
            <FadeIn delay={0.08} className="v3-ai-capabilities"><span><Bot size={16} /> LLM powered</span><span><Network size={16} /> Custom API integration</span><span><BrainCircuit size={16} /> Context aware</span><span><Zap size={16} /> Fast responses</span><span><Workflow size={16} /> AI automation</span><span><CircleDot size={16} /> Secure architecture</span></FadeIn>
          </div>
          <PrinceAI />
        </section>

        <section className="v3-section" id="skills">
          <div className="v3-container"><FadeIn className="v3-section-heading v3-split-heading"><div><p className="v3-eyebrow">04 / Technical range</p><h2>A versatile stack, <span>one high bar.</span></h2></div><p>Right tools, clear decisions, and the care to make a solution durable.</p></FadeIn><div className="v3-skill-grid">{skills.map((skill, i) => { const Icon = skill.icon; const yrs = parseInt(skill.years, 10) || 1; const pct = Math.min(100, 45 + yrs * 13); return <FadeIn key={skill.name} delay={i * 0.05} className="v3-skill-card"><div className="v3-skill-top"><span><Icon size={20} /></span><small>{skill.years}</small></div><h3>{skill.name}</h3><div className="v3-skill-list">{skill.items.map(item => <b key={item}>{item}</b>)}</div><div className="v3-skill-meter"><i style={{ width: `${pct}%` }} /></div></FadeIn>; })}</div></div>
        </section>

        <section className="v3-section v3-experience" id="experience"><div className="v3-container"><FadeIn className="v3-section-heading"><p className="v3-eyebrow">05 / Experience</p><h2>A progression built in <span>real product teams.</span></h2></FadeIn><div className="v3-timeline"><FadeIn className="v3-timeline-item"><div className="v3-timeline-mark"><BriefcaseBusiness size={18} /></div><div><p className="v3-date">Present · New Delhi, India</p><h3>Fullstack Developer <span>@ Epigroww Global</span></h3><p>Leading frontend architecture and full-stack feature development for client platforms. Shipping responsive UI, API integrations, and production-ready workflows.</p><div className="v3-timeline-tags"><span>React 19</span><span>TypeScript</span><span>Node.js</span><span>Supabase</span></div></div></FadeIn><FadeIn delay={0.12} className="v3-timeline-item"><div className="v3-timeline-mark"><Code2 size={18} /></div><div><p className="v3-date">2026 · Noida, India</p><h3>Software Developer Intern <span>@ Digicaptain Technology</span></h3><p>Built client-facing interfaces and utility tools, integrated APIs, and refined responsive experiences across desktop and mobile.</p><div className="v3-timeline-tags"><span>JavaScript</span><span>HTML/CSS</span><span>GitHub</span><span>Vercel</span></div></div></FadeIn><FadeIn delay={0.2} className="v3-timeline-item"><div className="v3-timeline-mark"><GraduationCap size={18} /></div><div><p className="v3-date">2022 — 2026 · Salem, India</p><h3>B.Tech Computer Science <span>@ VMKV Engineering College</span></h3><p>Built a strong software-engineering foundation across web technologies, data structures, and system design.</p></div></FadeIn></div></div></section>

        <section className="v3-section v3-credentials"><div className="v3-container"><FadeIn className="v3-section-heading"><p className="v3-eyebrow">06 / Credentials</p><h2>Always learning. <span>Always shipping.</span></h2></FadeIn><div className="v3-cert-grid">{certifications.map((cert, index) => <FadeIn delay={index * 0.08} key={cert.title} className="v3-cert-card"><div className="v3-cert-image"><img src={cert.image} alt={`${cert.title} certificate`} loading="lazy" /></div><div><span><Award size={15} /> Verified credential</span><h3>{cert.title}</h3><p>{cert.issuer} · {cert.year}</p></div></FadeIn>)}</div></div></section>

        <section className="v3-section" id="blog"><div className="v3-container"><FadeIn className="v3-section-heading v3-blog-heading"><div><p className="v3-eyebrow">07 / Notes from the build</p><h2>Ideas beyond <span>the commit.</span></h2></div><a className="v3-text-link" href="/blog">Read all notes <ArrowRight size={17} /></a></FadeIn><div className="v3-article-grid">{articles.map((article, index) => <FadeIn delay={index * 0.08} key={article.title} className="v3-article-card"><img src={article.image} alt="" loading="lazy" /><div><span>{article.category} <i /> {article.time}</span><h3>{article.title}</h3><a href="/blog">Read article <ArrowUpRight size={15} /></a></div></FadeIn>)}</div></div></section>

        <section className="v3-section v3-contact-section" id="contact"><div className="v3-container v3-contact-grid"><FadeIn><p className="v3-eyebrow">08 / Let’s work together</p><h2>Let’s build something <span>that matters.</span></h2><p className="v3-contact-copy">Have an ambitious product, a workflow worth automating, or a role where engineering craft matters? I’d love to hear about it.</p><motion.div className="v3-contact-photo" animate={{ y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}><ProvidedImage name="img2" fallback="/assets/aboutme.jpg" alt="Mritunjay Kumar" /><span>Let’s create something useful</span></motion.div><div className="v3-contact-details"><a href="mailto:me@mritify.online"><Mail size={18} /><span><small>Direct Email</small>me@mritify.online</span></a><a href="mailto:support@mritify.online"><Mail size={18} /><span><small>Tech / Client Support</small>support@mritify.online</span></a><a href="mailto:info@mritify.online"><Mail size={18} /><span><small>General Inquiries</small>info@mritify.online</span></a><a href="https://wa.me/919470880956" target="_blank" rel="noreferrer"><MessageCircle size={18} /><span><small>WhatsApp</small>+91 94708 80956</span></a><span><MapPin size={18} /><span><small>Based in</small>India · available globally</span></span></div><div className="v3-social-row">{socials.map(({ label, href, icon: Icon }) => <a key={label} href={href} target={label === 'Email' ? undefined : '_blank'} rel="noreferrer"><Icon size={18} />{label}</a>)}</div></FadeIn><FadeIn delay={0.1} className="v3-contact-form-wrap"><form onSubmit={handleSubmit}><input type="hidden" name="access_key" value="af71a9aa-dfeb-4439-a91b-afa7bc2e17d8" /><div className="v3-form-field"><input required id="v3-name" name="name" placeholder=" " /><label htmlFor="v3-name">Your name</label></div><div className="v3-form-field"><input required id="v3-email" name="email" type="email" placeholder=" " /><label htmlFor="v3-email">Work email</label></div><div className="v3-form-field"><input id="v3-subject" name="subject" placeholder=" " /><label htmlFor="v3-subject">What are we building?</label></div><div className="v3-form-field"><textarea required id="v3-message" name="message" rows={5} placeholder=" " /><label htmlFor="v3-message">Tell me a little about it</label></div><button className="v3-button v3-button-primary" disabled={sending} type="submit">{sending ? 'Sending…' : 'Send message'} <Send size={16} /></button>{status && <p className="v3-form-status">{status}</p>}</form></FadeIn></div></section>
      </main>
      <footer className="v3-footer"><div className="v3-container"><div className="v3-footer-top"><a href="#home" className="v3-wordmark"><img src="/brand/mritunjay-logo.svg" alt="Mritunjay" /></a><p>AI engineer & full stack developer<br />building useful things on the internet.</p><a href="#home" className="v3-back-top">Back to top <ArrowUpRight size={16} /></a></div><div className="v3-footer-bottom"><span>© {new Date().getFullYear()} Mritunjay Kumar</span><div><a href="/updated_resume.pdf" target="_blank" rel="noreferrer">Resume</a><a href="https://github.com/mritunjaykumarr" target="_blank" rel="noreferrer">GitHub</a><a href="mailto:support@mritify.online">Support</a><a href="mailto:me@mritify.online">Email</a></div></div></div></footer>
    </div>
  );
}

function ArrowDownIcon() { return <ArrowRight size={17} />; }
