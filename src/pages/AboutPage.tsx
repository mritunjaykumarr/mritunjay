import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Code, ArrowRight, Download, CircleCheckBig, Sparkles, 
  Compass, Layers, Zap, Heart, Award
} from 'lucide-react';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO';
import { Stagger, itemPop } from '../components/Reveal';
import AdUnit from '../components/AdUnit';

export default function AboutPage() {
  usePortfolioMotion();
  useSEO(SEO_CONFIGS.about);
  const [activeTab, setActiveTab] = useState<'philosophy' | 'values' | 'milestones'>('philosophy');

  return (
    <div className="page-wrapper about-page" style={{ paddingTop: '5.5rem', paddingBottom: '5rem' }}>
      {/* Page Header Banner — stable grid + wild decoration: yellow circle behind text */}
      <section className="page-header" style={{ position: 'relative', overflow: 'clip' }}>
        {/* Confetti — decorative, aria-hidden */}
        <div aria-hidden="true" style={{ position:'absolute', right:'4%', top:'18%', width:96, height:96, background:'var(--tertiary)', border:'2px solid var(--foreground)', borderRadius:'50%', boxShadow:'var(--shadow-pop)', opacity:0.95 }} />
        <div aria-hidden="true" style={{ position:'absolute', left:'6%', bottom:'-20px', width:28, height:28, background:'var(--secondary)', border:'2px solid var(--foreground)', borderRadius:'50%', boxShadow:'var(--shadow-pop)', transform:'rotate(12deg)' }} />
        <div aria-hidden="true" style={{ position:'absolute', right:'22%', bottom:16, width:0, height:0, borderLeft:'14px solid transparent', borderRight:'14px solid transparent', borderBottom:'24px solid var(--quaternary)', filter:'drop-shadow(4px 4px 0 #1E293B)' }} />
        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div className="breadcrumb" style={{ fontFamily:'var(--font-body)' }}>
            <Link to="/">Home</Link>
            <span>/</span>
            <span className="current">About</span>
          </div>
          <div className="page-header-content reveal playful-enter">
            <div className="section-eyebrow" style={{ background:'var(--card)', border:'2px solid var(--foreground)', borderRadius:'9999px', padding:'0.35rem 0.75rem', boxShadow:'var(--shadow-pop)' }}><Sparkles size={14} strokeWidth={2.5}/> Full Journey &amp; Story</div>
            <h1 className="page-title" style={{ fontFamily:'var(--font-heading)', fontWeight:800 }}>
              Crafting digital products with <span style={{ color:'var(--accent)' }}>purpose &amp; precision</span>
            </h1>
            <p className="page-subtitle" style={{ fontFamily:'var(--font-body)', color:'var(--muted-foreground)' }}>
              Fullstack Developer with a relentless focus on high-performance frontends, intuitive UI/UX motion, and modern web software.
            </p>
          </div>
        </div>
        {/* Squiggle divider */}
        <svg className="squiggle-divider" aria-hidden="true" viewBox="0 0 120 12" preserveAspectRatio="none" style={{ position:'absolute', bottom:0, left:0, width:'100%', height:12, color:'var(--foreground)' }}>
          <path d="M0 6 Q15 0 30 6 T60 6 T90 6 T120 6" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round"/>
        </svg>
      </section>

      {/* Main Content Grid */}
      <section className="section" style={{ padding: '3rem 0' }}>
        <div className="container">
          <div className="about-grid" style={{ alignItems: 'start', display:'grid', gridTemplateColumns:'1.1fr 1.9fr', gap:'2rem' }}>
            {/* Left Photo & Card — sticker card with blob mask */}
            <div className="about-img reveal playful-enter">
              <div className="about-img-wrap" style={{ border:'2px solid var(--foreground)', borderRadius:'24px 4px 24px 24px', boxShadow:'var(--shadow-pop)', overflow:'hidden', background:'var(--card)' }}>
                <img src="/assets/about2.png" alt="Mritunjay Kumar" className="about-photo" loading="lazy" style={{ display:'block', width:'100%', height:'auto' }} />
                <div className="about-tag" style={{ background:'var(--secondary)', color:'white', border:'2px solid var(--foreground)', borderRadius:'9999px', boxShadow:'var(--shadow-pop)', fontFamily:'var(--font-heading)' }}>
                  <Code size={14} strokeWidth={2.5} />
                  <span>Fullstack Developer</span>
                </div>
              </div>

              {/* Quick Info Box — sticker card, icon half-out, confetti rotation */}
              <div className="card-sticker" style={{ marginTop:'1.5rem', padding:'1.5rem', position:'relative', paddingTop:'2rem' }}>
                <div className="card-icon-circle secondary" aria-hidden="true" style={{ position:'absolute', top:-18, left:24 }}>
                  <Sparkles size={18} strokeWidth={2.5} color="white" />
                </div>
                <h2 style={{ fontSize:'1rem', marginBottom:'1rem', color:'var(--foreground)', fontWeight:800, fontFamily:'var(--font-heading)' }}>Quick Facts</h2>
                <ul className="quick-facts-list" style={{ display:'grid', gap:'0.6rem', fontFamily:'var(--font-body)' }}>
                  <li><strong>Based in:</strong> Bihar / New Delhi, India</li>
                  <li><strong>Current Role:</strong> Fullstack Dev @ Epigroww Global</li>
                  <li><strong>Speciality:</strong> React, TypeScript, Node.js, Motion</li>
                  <li><strong>Status:</strong> Open for Select Projects</li>
                </ul>
              </div>
            </div>

            {/* Right Story & Tabs */}
            <div className="about-content reveal reveal-right">
              <div className="badge-playful" style={{ background:'var(--tertiary)' }}>
                <Compass size={16} strokeWidth={2.5} /> My Narrative
              </div>
              <h2 className="section-title" style={{ fontSize:'2rem', marginTop:'0.5rem', marginBottom:'1.25rem', fontFamily:'var(--font-heading)', fontWeight:800 }}>
                Turning complex problems into <span style={{ color:'var(--accent)' }}>effortless experiences</span>
              </h2>
              
              <p className="about-text" style={{ lineHeight:'1.8', fontSize:'1.05rem', color:'var(--muted-foreground)', fontFamily:'var(--font-body)' }}>
                My web development journey began with a deep curiosity for how digital experiences are designed, structured, and executed. Over time, that curiosity evolved into a dedicated career building fast, accessible, and scalable applications.
              </p>
              <p className="about-text" style={{ lineHeight:'1.8', fontSize:'1.05rem', color:'var(--muted-foreground)', marginTop:'1rem', fontFamily:'var(--font-body)' }}>
                Today, I specialize in crafting modern frontend interfaces using React, TypeScript, and CSS, paired with robust backend services in Node.js and Supabase. I view every project as a harmony between clean code architecture, aesthetic craftsmanship, and business impact.
              </p>

              {/* Interactive Tabs — playful underline uses accent/secondary */}
              <div className="tabs" style={{ marginTop:'2rem' }}>
                <div className="tab-btns" style={{ borderBottom:'2px solid var(--foreground)', display:'flex', gap:'0.5rem' }}>
                  <button 
                    className={`tab-btn ${activeTab === 'philosophy' ? 'active' : ''}`}
                    onClick={() => setActiveTab('philosophy')}
                    style={{ fontFamily:'var(--font-heading)', fontWeight:700, borderBottom: activeTab==='philosophy'?'3px solid var(--accent)':'3px solid transparent' }}
                  >
                    Philosophy
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'values' ? 'active' : ''}`}
                    onClick={() => setActiveTab('values')}
                    style={{ fontFamily:'var(--font-heading)', fontWeight:700, borderBottom: activeTab==='values'?'3px solid var(--secondary)':'3px solid transparent' }}
                  >
                    Core Values
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'milestones' ? 'active' : ''}`}
                    onClick={() => setActiveTab('milestones')}
                    style={{ fontFamily:'var(--font-heading)', fontWeight:700, borderBottom: activeTab==='milestones'?'3px solid var(--quaternary)':'3px solid transparent' }}
                  >
                    Milestones
                  </button>
                </div>

                <div className={`tab-content ${activeTab === 'philosophy' ? 'active' : ''}`} style={{ marginTop:'1.25rem', display: activeTab==='philosophy'?'block':'none' }}>
                  <p style={{ lineHeight:'1.7', color:'var(--muted-foreground)', fontFamily:'var(--font-body)' }}>
                    I believe great software should feel natural, responsive, and immediate. Software shouldn't just meet functional specs — it must delight users, load in milliseconds, and maintain high standards of code elegance.
                  </p>
                  <ul className="skills-checklist" style={{ marginTop:'1rem', display:'grid', gap:'0.5rem' }}>
                    <li style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}><span className="icon-circle quaternary" style={{ width:28, height:28 }}><CircleCheckBig size={14} strokeWidth={2.5}/></span> User-First UI/UX Motion Design</li>
                    <li style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}><span className="icon-circle accent" style={{ width:28, height:28 }}><CircleCheckBig size={14} strokeWidth={2.5}/></span> Clean Component Architecture</li>
                    <li style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}><span className="icon-circle secondary" style={{ width:28, height:28 }}><CircleCheckBig size={14} strokeWidth={2.5}/></span> WCAG Accessibility Standards</li>
                    <li style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}><span className="icon-circle tertiary" style={{ width:28, height:28 }}><CircleCheckBig size={14} strokeWidth={2.5}/></span> Performance First &amp; Zero-Lag Mindset</li>
                  </ul>
                </div>

                <div className={`tab-content ${activeTab === 'values' ? 'active' : ''}`} style={{ marginTop:'1.25rem', display: activeTab==='values'?'block':'none' }}>
                  <div className="values-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'1rem' }}>
                    <div className="card-sticker" style={{ padding:'1.25rem', paddingTop:'2.2rem', position:'relative' }}>
                      <div className="card-icon-circle" aria-hidden="true" style={{ background:'var(--accent)', border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)' }}><Zap size={18} strokeWidth={2.5} color="white"/></div>
                      <h4 style={{ fontFamily:'var(--font-heading)', fontWeight:800 }}>Speed &amp; Clarity</h4>
                      <p style={{ fontFamily:'var(--font-body)', color:'var(--muted-foreground)' }}>Lightweight code bundles and swift feedback loops for seamless interactions.</p>
                    </div>
                    <div className="card-sticker" style={{ padding:'1.25rem', paddingTop:'2.2rem', position:'relative', transform:'rotate(0.5deg)' }}>
                      <div className="card-icon-circle secondary" aria-hidden="true"><Layers size={18} strokeWidth={2.5} color="white"/></div>
                      <h4 style={{ fontFamily:'var(--font-heading)', fontWeight:800 }}>Modularity</h4>
                      <p style={{ fontFamily:'var(--font-body)', color:'var(--muted-foreground)' }}>Scalable design systems and decoupled frontend/backend services.</p>
                    </div>
                    <div className="card-sticker" style={{ padding:'1.25rem', paddingTop:'2.2rem', position:'relative', transform:'rotate(-0.5deg)' }}>
                      <div className="card-icon-circle tertiary" aria-hidden="true"><Heart size={18} strokeWidth={2.5}/></div>
                      <h4 style={{ fontFamily:'var(--font-heading)', fontWeight:800 }}>Craftsmanship</h4>
                      <p style={{ fontFamily:'var(--font-body)', color:'var(--muted-foreground)' }}>Attention to micro-details, typographic hierarchy, and visual polish.</p>
                    </div>
                  </div>
                </div>

                <div className={`tab-content ${activeTab === 'milestones' ? 'active' : ''}`} style={{ marginTop:'1.25rem', display: activeTab==='milestones'?'block':'none' }}>
                  <div className="milestones-timeline" style={{ borderLeft:'2px dashed var(--foreground)', paddingLeft:'1.25rem', display:'grid', gap:'1.25rem' }}>
                    <div className="m-item" style={{ position:'relative' }}>
                      <span className="badge-playful" style={{ background:'var(--accent)', color:'white' }}>2026 — Present</span>
                      <h4 style={{ fontFamily:'var(--font-heading)', fontWeight:700, marginTop:'0.5rem' }}>Fullstack Developer — Epigroww Global, New Delhi</h4>
                      <p style={{ fontFamily:'var(--font-body)', color:'var(--muted-foreground)' }}>Building high-performing web platforms, dashboard tools, and client products.</p>
                    </div>
                    <div className="m-item">
                      <span className="badge-playful secondary" style={{ background:'var(--secondary)', color:'white' }}>2026</span>
                      <h4 style={{ fontFamily:'var(--font-heading)', fontWeight:700, marginTop:'0.5rem' }}>Software Intern — Digicaptain Technology, Noida</h4>
                      <p style={{ fontFamily:'var(--font-body)', color:'var(--muted-foreground)' }}>Developed responsive web apps, REST APIs, and client-side toolings over 3 intensive months.</p>
                    </div>
                    <div className="m-item">
                      <span className="badge-playful" style={{ background:'var(--tertiary)' }}>2024</span>
                      <h4 style={{ fontFamily:'var(--font-heading)', fontWeight:700, marginTop:'0.5rem' }}>Fullstack &amp; Machine Learning Certifications — Infosys</h4>
                      <p style={{ fontFamily:'var(--font-body)', color:'var(--muted-foreground)' }}>Completed comprehensive certifications in modern web engineering &amp; ML fundamentals.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons — Candy + Secondary with icon circles */}
              <div className="about-btns" style={{ marginTop:'2.5rem', display:'flex', gap:'1rem', flexWrap:'wrap' }}>
                <Link to="/contact" className="btn-candy" style={{ display:'inline-flex', alignItems:'center', gap:'0.6rem' }}>
                  <span>Work With Me</span>
                  <span className="icon-circle" style={{ width:26, height:26, background:'white', border:'2px solid var(--foreground)', borderRadius:'50%', display:'inline-grid', placeItems:'center' }}><ArrowRight size={14} strokeWidth={2.5} color="var(--foreground)"/></span>
                </Link>
                <a 
                  href="https://drive.google.com/file/d/1InESJ_ExHbQ5QjUo-ie3bvmDETT9v5Q3/view?usp=sharing" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn-secondary"
                >
                  <Download size={15} strokeWidth={2.5} />
                  <span>Download Resume (PDF)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics — sticker cards with confetti dots */}
      <section className="section" style={{ padding:'4rem 0', background:'var(--muted)', borderTop:'2px solid var(--foreground)', borderBottom:'2px solid var(--foreground)', position:'relative' }}>
        <div className="container">
          <Stagger className="stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'1.5rem' }}>
            {[
              { n:'2+', l:'Years of Experience', c:'var(--accent)' },
              { n:'10+', l:'Projects Delivered', c:'var(--secondary)' },
              { n:'150+', l:'Currencies & APIs', c:'var(--tertiary)' },
              { n:'99%', l:'Lighthouse Quality Score', c:'var(--quaternary)' },
            ].map(item=> (
              <motion.div key={item.l} variants={itemPop} className="card-sticker" style={{ padding:'1.5rem', textAlign:'center', background:'var(--card)' }}>
                <div className="stat-num" style={{ fontFamily:'var(--font-heading)', fontWeight:800, fontSize:'2rem', color:item.c }}>{item.n}</div>
                <div className="stat-lbl" style={{ fontFamily:'var(--font-heading)', fontWeight:700, fontSize:'0.75rem', textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--muted-foreground)', marginTop:'0.25rem' }}>{item.l}</div>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Domains & Expertise — 4-col sticker grid with dashed connector */}
      <section className="section" style={{ padding:'4rem 0', position:'relative' }}>
        <div className="container">
          <div className="badge-playful" style={{ background:'var(--quaternary)' }}><Sparkles size={14} strokeWidth={2.5}/> Domains &amp; Expertise</div>
          <h2 className="section-title reveal" style={{ fontFamily:'var(--font-heading)', fontWeight:800, marginTop:'0.5rem' }}>What drives my <span style={{ color:'var(--accent)' }}>craft</span></h2>
          <Stagger className="domains-grid" style={{ marginTop:'2rem', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'1.25rem', position:'relative' }}>
            {/* dashed SVG line is in playful-pages.css .v3-story-grid::before — similar here via inline border */}
            {[
              { Icon: Code, title:'Modern Web Applications', desc:'Engineering reactive SPA/MPA applications with React 19, TypeScript, Vite, and custom CSS design systems.', color:'var(--accent)' },
              { Icon: Layers, title:'Fullstack Data Architecture', desc:'Connecting frontends to Node.js, Express, PostgreSQL, and Supabase with real-time sockets and security.', color:'var(--secondary)' },
              { Icon: Sparkles, title:'AI & Intelligent Workflows', desc:'Integrating generative AI models, custom prompt engineering, and intelligent chatbot interfaces into production.', color:'var(--quaternary)' },
              { Icon: Award, title:'Performance & Micro-Interactions', desc:'Crafting silky 60fps animations with GSAP and CSS while keeping bundle sizes lean and fast loading.', color:'var(--tertiary)' },
            ].map(({Icon, title, desc, color})=> (
              <motion.div key={title} variants={itemPop} className="card-sticker" style={{ padding:'1.75rem', paddingTop:'2.5rem', position:'relative' }}>
                <div className="icon-circle" aria-hidden="true" style={{ position:'absolute', top:-16, left:20, background:color, border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)' }}>
                  <Icon size={20} strokeWidth={2.5} color={color==='var(--tertiary)'?'var(--foreground)':'white'} />
                </div>
                <h3 style={{ fontFamily:'var(--font-heading)', fontWeight:800, marginBottom:'0.5rem' }}>{title}</h3>
                <p style={{ fontFamily:'var(--font-body)', color:'var(--muted-foreground)', lineHeight:1.6 }}>{desc}</p>
              </motion.div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* AdSense — after content-rich domains, before footer, labeled */}
      <section className="section" style={{ padding: '2rem 0' }}>
        <div className="container">
          <AdUnit slot="6189533583" />
        </div>
      </section>
    </div>
  );
}
