import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code, ArrowRight, Download, CircleCheckBig, Sparkles, 
  Compass, Layers, Zap, Heart, Award
} from 'lucide-react';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';

export default function AboutPage() {
  usePortfolioMotion();
  const [activeTab, setActiveTab] = useState<'philosophy' | 'values' | 'milestones'>('philosophy');

  return (
    <div className="page-wrapper about-page" style={{ paddingTop: '5.5rem', paddingBottom: '5rem' }}>
      {/* Page Header Banner */}
      <section className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span className="current">About</span>
          </div>
          <div className="page-header-content reveal">
            <div className="section-eyebrow"><Sparkles size={14} /> Full Journey & Story</div>
            <h1 className="page-title">
              Crafting digital products with <span className="grad">purpose & precision</span>
            </h1>
            <p className="page-subtitle">
              Fullstack Developer with a relentless focus on high-performance frontends, intuitive UI/UX motion, and modern web software.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="section" style={{ padding: '3rem 0' }}>
        <div className="container">
          <div className="about-grid" style={{ alignItems: 'start' }}>
            {/* Left Photo & Card */}
            <div className="about-img reveal">
              <div className="about-img-wrap" style={{ borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
                <img src="/assets/about2.png" alt="Mritunjay Kumar" className="about-photo" loading="lazy" />
                <div className="about-tag">
                  <Code size={14} />
                  <span>Fullstack Developer</span>
                </div>
              </div>

              {/* Quick Info Box */}
              <div className="card-glass" style={{ marginTop: '1.5rem', padding: '1.5rem' }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text)' }}>Quick Facts</h4>
                <ul className="quick-facts-list">
                  <li><strong>Based in:</strong> Bihar / New Delhi, India</li>
                  <li><strong>Current Role:</strong> Fullstack Dev @ Epigroww Global</li>
                  <li><strong>Speciality:</strong> React, TypeScript, Node.js, Motion</li>
                  <li><strong>Status:</strong> Open for Select Projects</li>
                </ul>
              </div>
            </div>

            {/* Right Story & Tabs */}
            <div className="about-content reveal reveal-right">
              <div className="story-badge">
                <Compass size={16} /> My Narrative
              </div>
              <h2 className="section-title" style={{ fontSize: '2rem', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
                Turning complex problems into <span className="grad">effortless experiences</span>
              </h2>
              
              <p className="about-text" style={{ lineHeight: '1.8', fontSize: '1.05rem', color: 'var(--text-2)' }}>
                My web development journey began with a deep curiosity for how digital experiences are designed, structured, and executed. Over time, that curiosity evolved into a dedicated career building fast, accessible, and scalable applications.
              </p>
              <p className="about-text" style={{ lineHeight: '1.8', fontSize: '1.05rem', color: 'var(--text-2)', marginTop: '1rem' }}>
                Today, I specialize in crafting modern frontend interfaces using React, TypeScript, and CSS, paired with robust backend services in Node.js and Supabase. I view every project as a harmony between clean code architecture, aesthetic craftsmanship, and business impact.
              </p>

              {/* Interactive Tabs */}
              <div className="tabs" style={{ marginTop: '2rem' }}>
                <div className="tab-btns">
                  <button 
                    className={`tab-btn ${activeTab === 'philosophy' ? 'active' : ''}`}
                    onClick={() => setActiveTab('philosophy')}
                  >
                    Philosophy
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'values' ? 'active' : ''}`}
                    onClick={() => setActiveTab('values')}
                  >
                    Core Values
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'milestones' ? 'active' : ''}`}
                    onClick={() => setActiveTab('milestones')}
                  >
                    Milestones
                  </button>
                </div>

                <div className={`tab-content ${activeTab === 'philosophy' ? 'active' : ''}`} style={{ marginTop: '1.25rem' }}>
                  <p style={{ lineHeight: '1.7', color: 'var(--text-2)' }}>
                    I believe great software should feel natural, responsive, and immediate. Software shouldn't just meet functional specs — it must delight users, load in milliseconds, and maintain high standards of code elegance.
                  </p>
                  <ul className="skills-checklist" style={{ marginTop: '1rem' }}>
                    <li><CircleCheckBig size={16} /> User-First UI/UX Motion Design</li>
                    <li><CircleCheckBig size={16} /> Clean Component Architecture</li>
                    <li><CircleCheckBig size={16} /> WCAG Accessibility Standards</li>
                    <li><CircleCheckBig size={16} /> Performance First & Zero-Lag Mindset</li>
                  </ul>
                </div>

                <div className={`tab-content ${activeTab === 'values' ? 'active' : ''}`} style={{ marginTop: '1.25rem' }}>
                  <div className="values-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="value-card">
                      <Zap size={18} className="grad-text" />
                      <h4>Speed & Clarity</h4>
                      <p>Lightweight code bundles and swift feedback loops for seamless interactions.</p>
                    </div>
                    <div className="value-card">
                      <Layers size={18} className="grad-text" />
                      <h4>Modularity</h4>
                      <p>Scalable design systems and decoupled frontend/backend services.</p>
                    </div>
                    <div className="value-card">
                      <Heart size={18} className="grad-text" />
                      <h4>Craftsmanship</h4>
                      <p>Attention to micro-details, typographic hierarchy, and visual polish.</p>
                    </div>
                  </div>
                </div>

                <div className={`tab-content ${activeTab === 'milestones' ? 'active' : ''}`} style={{ marginTop: '1.25rem' }}>
                  <div className="milestones-timeline">
                    <div className="m-item">
                      <span className="m-badge">2026 — Present</span>
                      <h4>Fullstack Developer — Epigroww Global, New Delhi</h4>
                      <p>Building high-performing web platforms, dashboard tools, and client products.</p>
                    </div>
                    <div className="m-item">
                      <span className="m-badge">2026</span>
                      <h4>Software Intern — Digicaptain Technology, Noida</h4>
                      <p>Developed responsive web apps, REST APIs, and client-side toolings over 3 intensive months.</p>
                    </div>
                    <div className="m-item">
                      <span className="m-badge">2024</span>
                      <h4>Fullstack & Machine Learning Certifications — Infosys</h4>
                      <p>Completed comprehensive certifications in modern web engineering & ML fundamentals.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="about-btns" style={{ marginTop: '2.5rem' }}>
                <Link to="/contact" className="btn-primary">
                  <span>Work With Me</span>
                  <ArrowRight size={16} />
                </Link>
                <a 
                  href="https://drive.google.com/file/d/1InESJ_ExHbQ5QjUo-ie3bvmDETT9v5Q3/view?usp=sharing" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn-outline"
                >
                  <Download size={15} />
                  <span>Download Resume (PDF)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="section bg-elevated" style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div className="stat-card reveal">
              <div className="stat-num grad">2+</div>
              <div className="stat-lbl">Years of Experience</div>
            </div>
            <div className="stat-card reveal">
              <div className="stat-num grad">10+</div>
              <div className="stat-lbl">Projects Delivered</div>
            </div>
            <div className="stat-card reveal">
              <div className="stat-num grad">150+</div>
              <div className="stat-lbl">Currencies & APIs</div>
            </div>
            <div className="stat-card reveal">
              <div className="stat-num grad">99%</div>
              <div className="stat-lbl">Lighthouse Quality Score</div>
            </div>
          </div>
        </div>
      </section>

      {/* Passions & Domains */}
      <section className="section" style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="section-eyebrow">Domains & Expertise</div>
          <h2 className="section-title reveal">What drives my <span className="grad">craft</span></h2>
          <div className="domains-grid" style={{ marginTop: '2rem' }}>
            <div className="domain-card reveal">
              <div className="domain-icon"><Code size={22} /></div>
              <h3>Modern Web Applications</h3>
              <p>Engineering reactive SPA/MPA applications with React 19, TypeScript, Vite, and custom CSS design systems.</p>
            </div>
            <div className="domain-card reveal">
              <div className="domain-icon"><Layers size={22} /></div>
              <h3>Fullstack Data Architecture</h3>
              <p>Connecting frontends to Node.js, Express, PostgreSQL, and Supabase with real-time sockets and security.</p>
            </div>
            <div className="domain-card reveal">
              <div className="domain-icon"><Sparkles size={22} /></div>
              <h3>AI & Intelligent Workflows</h3>
              <p>Integrating generative AI models, custom prompt engineering, and intelligent chatbot interfaces into production.</p>
            </div>
            <div className="domain-card reveal">
              <div className="domain-icon"><Award size={22} /></div>
              <h3>Performance & Micro-Interactions</h3>
              <p>Crafting silky 60fps animations with GSAP and CSS while keeping bundle sizes lean and fast loading.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
