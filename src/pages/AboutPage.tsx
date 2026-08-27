import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code, ArrowRight, Download, CircleCheckBig, Sparkles, 
  Compass
} from 'lucide-react';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO';
import AdUnit from '../components/AdUnit';

export default function AboutPage() {
  usePortfolioMotion();
  useSEO(SEO_CONFIGS.about);
  const [activeTab, setActiveTab] = useState<'philosophy' | 'values' | 'milestones'>('philosophy');

  return (
    <div className="page-wrapper about-page" style={{ paddingTop: '6rem', paddingBottom: '5rem', background: '#000000', color: '#ffffff', minHeight: '100vh' }}>
      {/* Page Header */}
      <section className="page-header" style={{ padding: '2rem 0 3rem' }}>
        <div className="container">
          <div className="breadcrumb" style={{ fontSize: '0.82rem', color: '#888888', marginBottom: '1rem' }}>
            <Link to="/" style={{ color: '#888888', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#ffffff' }}>About</span>
          </div>

          <div className="page-header-content">
            <div className="badge-playful" style={{ marginBottom: '1rem' }}>
              <Sparkles size={13} />
              <span>Full Journey &amp; Engineering Story</span>
            </div>
            <h1 className="page-title" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', fontWeight: 600, letterSpacing: '-0.04em', margin: '0.5rem 0 1rem' }}>
              Crafting digital products with <em>purpose &amp; precision</em>
            </h1>
            <p className="page-subtitle" style={{ fontSize: '1.05rem', color: '#9a9a9a', maxWidth: '600px', lineHeight: 1.65 }}>
              AI Engineer & Full Stack Developer with a relentless focus on high-performance frontends, intuitive UI/UX motion, and modern web architectures.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="section" style={{ padding: '2rem 0 4rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.9fr', gap: '2.5rem', alignItems: 'start' }}>
            {/* Left Photo & Card */}
            <div>
              <div style={{ border: '1px solid rgba(255, 255, 255, 0.14)', borderRadius: '14px', overflow: 'hidden', background: '#0a0a0a', position: 'relative' }}>
                <img src="/assets/about2.png" alt="Mritunjay Kumar" className="about-photo" loading="lazy" style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', bottom: '1rem', left: '1rem',
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: 'rgba(0, 0, 0, 0.8)', padding: '0.35rem 0.75rem', borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.2)', fontSize: '0.78rem', color: '#ffffff', backdropFilter: 'blur(8px)'
                }}>
                  <Code size={13} />
                  <span>Full Stack Developer</span>
                </div>
              </div>

              {/* Quick Info Box */}
              <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: '#0a0a0a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', marginBottom: '1rem' }}>Quick Facts</h3>
                <div style={{ display: 'grid', gap: '0.6rem', fontSize: '0.86rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#888888' }}>Based in:</span>
                    <span style={{ color: '#ffffff' }}>Bihar / New Delhi, India</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#888888' }}>Current Role:</span>
                    <span style={{ color: '#ffffff' }}>Fullstack Dev @ Epigroww</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#888888' }}>Speciality:</span>
                    <span style={{ color: '#ffffff' }}>React 19, TypeScript, Node.js</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#888888' }}>Status:</span>
                    <span style={{ color: '#22c55e' }}>Available for select projects</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Story & Tabs */}
            <div>
              <div className="badge-playful" style={{ marginBottom: '1rem' }}>
                <Compass size={13} />
                <span>My Narrative</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', fontWeight: 600, margin: '0 0 1.25rem', letterSpacing: '-0.035em' }}>
                Turning complex systems into <em>effortless interfaces.</em>
              </h2>
              
              <p style={{ fontSize: '1rem', lineHeight: 1.75, color: '#9a9a9a', marginBottom: '1rem' }}>
                My software engineering journey began with a deep curiosity for how digital experiences are designed, structured, and scaled. Over time, that curiosity evolved into a dedicated career building fast, accessible, and resilient applications for modern product teams.
              </p>
              <p style={{ fontSize: '1rem', lineHeight: 1.75, color: '#9a9a9a', marginBottom: '2rem' }}>
                Today, I specialize in crafting next-generation web applications using React, TypeScript, and high-performance CSS, paired with robust backend services in Node.js and Supabase. I approach every build as a balance between clean code architecture, aesthetic precision, and business outcomes.
              </p>

              {/* Interactive Tabs */}
              <div style={{ background: '#0a0a0a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                  <button 
                    className="nav-pill-item"
                    onClick={() => setActiveTab('philosophy')}
                    style={{
                      height: '34px', padding: '0 14px', fontSize: '0.8rem',
                      background: activeTab === 'philosophy' ? 'linear-gradient(180deg, #ffffff 0%, #d5d5d5 100%)' : 'transparent',
                      color: activeTab === 'philosophy' ? '#000000' : '#cccccc',
                      borderColor: activeTab === 'philosophy' ? '#ffffff' : 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    Philosophy
                  </button>
                  <button 
                    className="nav-pill-item"
                    onClick={() => setActiveTab('values')}
                    style={{
                      height: '34px', padding: '0 14px', fontSize: '0.8rem',
                      background: activeTab === 'values' ? 'linear-gradient(180deg, #ffffff 0%, #d5d5d5 100%)' : 'transparent',
                      color: activeTab === 'values' ? '#000000' : '#cccccc',
                      borderColor: activeTab === 'values' ? '#ffffff' : 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    Core Values
                  </button>
                  <button 
                    className="nav-pill-item"
                    onClick={() => setActiveTab('milestones')}
                    style={{
                      height: '34px', padding: '0 14px', fontSize: '0.8rem',
                      background: activeTab === 'milestones' ? 'linear-gradient(180deg, #ffffff 0%, #d5d5d5 100%)' : 'transparent',
                      color: activeTab === 'milestones' ? '#000000' : '#cccccc',
                      borderColor: activeTab === 'milestones' ? '#ffffff' : 'rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    Milestones
                  </button>
                </div>

                {activeTab === 'philosophy' && (
                  <div style={{ color: '#cccccc', fontSize: '0.92rem', lineHeight: 1.7 }}>
                    <p style={{ margin: 0 }}>
                      User-first engineering with an uncompromising commitment to clean, scalable, and accessible code. Every project is an opportunity to eliminate unnecessary friction and deliver software that feels natural and reliable.
                    </p>
                  </div>
                )}

                {activeTab === 'values' && (
                  <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.88rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CircleCheckBig size={15} style={{ color: '#ffffff' }} />
                      <span><strong>Craft &amp; Detail:</strong> Zero compromise on design execution and typography.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CircleCheckBig size={15} style={{ color: '#ffffff' }} />
                      <span><strong>Reliability:</strong> Architecting resilient systems with proactive error handling.</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CircleCheckBig size={15} style={{ color: '#ffffff' }} />
                      <span><strong>Speed &amp; Delivery:</strong> Rapid iteration with maintainable clean code standards.</span>
                    </div>
                  </div>
                )}

                {activeTab === 'milestones' && (
                  <div style={{ display: 'grid', gap: '0.85rem', fontSize: '0.88rem' }}>
                    <div style={{ borderLeft: '2px solid rgba(255, 255, 255, 0.2)', paddingLeft: '12px' }}>
                      <strong style={{ color: '#ffffff' }}>Present — Fullstack Developer</strong>
                      <p style={{ margin: '2px 0 0', color: '#9a9a9a', fontSize: '0.82rem' }}>Leading frontend architectures and full-stack modules at Epigroww Global.</p>
                    </div>
                    <div style={{ borderLeft: '2px solid rgba(255, 255, 255, 0.2)', paddingLeft: '12px' }}>
                      <strong style={{ color: '#ffffff' }}>2026 — Software Developer Intern</strong>
                      <p style={{ margin: '2px 0 0', color: '#9a9a9a', fontSize: '0.82rem' }}>Built utility tools and client interfaces at Digicaptain Technology.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
                <a href="/updated_resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <Download size={15} />
                  <span>Download Resume</span>
                </a>
                <Link to="/contact" className="btn-secondary">
                  <span>Start a Conversation</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AdSense Unit */}
      <section className="section" style={{ padding: '2rem 0' }}>
        <div className="container">
          <AdUnit slot="6189533583" />
        </div>
      </section>
    </div>
  );
}
