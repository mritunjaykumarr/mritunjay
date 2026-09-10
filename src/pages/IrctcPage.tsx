import { Link } from 'react-router-dom';
import { TrainFront, ShieldCheck, Terminal, Navigation } from 'lucide-react';
import IrctcHub from '../components/irctc/IrctcHub';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO';
import '../styles/irctc.css';

export default function IrctcPage() {
  usePortfolioMotion();
  useSEO(SEO_CONFIGS.irctc || {
    title: 'IRCTC Rail Intelligence Suite & MCP Hub | Mritunjay Kumar',
    description: 'Real-time Indian Railways PNR status, live train running radar, seat confirmation matrix, fare enquiry, and MCP server remote endpoints.',
    keywords: 'IRCTC API, RapidAPI IRCTC, PNR Status, Live Train Running Status, Train Timetable, Seat Availability, MCP Remote Server',
  });

  return (
    <div
      className="page-wrapper irctc-page"
      style={{
        paddingTop: '6rem',
        paddingBottom: '5rem',
        background: 'var(--bg)',
        color: 'var(--text)',
        minHeight: '100vh',
      }}
    >
      {/* Page Header */}
      <section className="page-header" style={{ padding: '2rem 0 2rem' }}>
        <div className="container">
          <div
            className="breadcrumb"
            style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}
          >
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
              Home
            </Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--text)' }}>IRCTC Rail Intelligence</span>
          </div>

          <div className="page-header-content">
            <div className="badge-playful" style={{ marginBottom: '1rem' }}>
              <TrainFront size={14} />
              <span>Real-Time Indian Railways Engine & MCP Provider</span>
            </div>
            <h1
              className="page-title"
              style={{
                fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
                fontWeight: 600,
                letterSpacing: '-0.04em',
                margin: '0.5rem 0 1rem',
                color: 'var(--text)',
              }}
            >
              IRCTC Rail <em>Intelligence</em>
            </h1>
            <p
              className="page-subtitle"
              style={{
                fontSize: '1.05rem',
                color: 'var(--text-muted)',
                maxWidth: '700px',
                lineHeight: 1.65,
              }}
            >
              Real-time PNR tracking, live train route radar, multi-class seat confirmation probability, fare calculations, and MCP server endpoints powered by RapidAPI.
            </p>
          </div>
        </div>
      </section>

      {/* Main Suite Container */}
      <div className="container" style={{ margin: '1rem auto' }}>
        <IrctcHub />
      </div>

      {/* Feature Highlights Grid */}
      <div className="container" style={{ marginTop: '4rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          <div className="card-glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Navigation size={20} style={{ color: 'var(--accent)' }} />
              <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 600 }}>Live Running Radar</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Live GPS tracking with halt-by-halt milestone progression, delay in minutes, and platform arrival estimates.
            </p>
          </div>

          <div className="card-glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Terminal size={20} style={{ color: '#10b981' }} />
              <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 600 }}>MCP Remote Ready</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Out-of-the-box MCP server definitions allowing Antigravity, Claude, and AI agents to query live IRCTC data autonomously.
            </p>
          </div>

          <div className="card-glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <ShieldCheck size={20} style={{ color: '#f59e0b' }} />
              <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 600 }}>Automated Quota Resilience</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Smart HTTP 429 quota protection with seamless fallback to realistic sample telemetry so demos remain 100% operational.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
