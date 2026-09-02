import { Link } from 'react-router-dom';
import { Globe, ShieldCheck, Server, Zap } from 'lucide-react';
import DomainChecker from '../components/DomainChecker.tsx';
import { usePortfolioMotion } from '../lib/usePortfolioMotion.ts';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO.ts';

export default function DomainCheckerPage() {
  usePortfolioMotion();
  useSEO(SEO_CONFIGS.domainChecker);

  return (
    <div className="page-wrapper domain-checker-page" style={{ paddingTop: '6rem', paddingBottom: '5rem', background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      {/* Page Header */}
      <section className="page-header" style={{ padding: '2rem 0 2rem' }}>
        <div className="container">
          <div className="breadcrumb" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--text)' }}>Domain Registrar Checker</span>
          </div>

          <div className="page-header-content">
            <div className="badge-playful" style={{ marginBottom: '1rem' }}>
              <Globe size={13} />
              <span>Real-Time WHOIS & RDAP Lookup Tool</span>
            </div>
            <h1 className="page-title" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', fontWeight: 600, letterSpacing: '-0.04em', margin: '0.5rem 0 1rem', color: 'var(--text)' }}>
              Domain Registrar <em>Checker</em>
            </h1>
            <p className="page-subtitle" style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '650px', lineHeight: 1.65 }}>
              Check domain registration details, expiration countdowns, authoritative registrars, and nameserver configurations with high-speed 1-hour in-memory cached RDAP queries.
            </p>
          </div>
        </div>
      </section>

      {/* Main Tool Container */}
      <div className="container" style={{ margin: '1rem auto' }}>
        <DomainChecker />
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
              <ShieldCheck size={20} style={{ color: 'var(--text)' }} />
              <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 600 }}>Official IANA RDAP Standard</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Queries the modern Registration Data Access Protocol (RFC 7480-7484) directly from authoritative top-level registry databases.
            </p>
          </div>

          <div className="card-glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Zap size={20} style={{ color: 'var(--text)' }} />
              <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 600 }}>Instant 1-Hour Caching</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Repeat lookups are served immediately from high-efficiency memory cache, eliminating upstream rate limits and wait times.
            </p>
          </div>

          <div className="card-glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Server size={20} style={{ color: 'var(--text)' }} />
              <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 600 }}>Full DNS & Nameserver Parsing</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Inspect authoritative DNS hostnames, transfer-lock security statuses, and lifecycle timestamps at a glance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
