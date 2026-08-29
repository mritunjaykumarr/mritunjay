import { Link } from 'react-router-dom';
import { AlertTriangle, Info, Mail } from 'lucide-react';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO } from '../lib/useSEO';

const BASE_URL = 'https://mritify.online';

export default function Disclaimer() {
  usePortfolioMotion();
  useSEO({
    title: 'Disclaimer | mritify.online — Content & Affiliate Disclosure',
    description: 'Disclaimer for mritify.online — informational content, external links, affiliate and advertising disclosure for Google AdSense.',
    canonical: `${BASE_URL}/disclaimer`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Disclaimer',
      name: 'Disclaimer — mritify.online',
      url: `${BASE_URL}/disclaimer`,
    },
  });

  return (
    <div className="page-wrapper" style={{ paddingTop: '6rem', paddingBottom: '5rem', background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      <section className="page-header" style={{ padding: '2rem 0 3rem' }}>
        <div className="container">
          <div className="breadcrumb" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--text)' }}>Disclaimer</span>
          </div>
          <div className="page-header-content">
            <div className="badge-playful" style={{ marginBottom: '1rem' }}>
              <AlertTriangle size={13} />
              <span>Transparency &amp; Disclosures</span>
            </div>
            <h1 className="page-title" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', fontWeight: 600, letterSpacing: '-0.04em', margin: '0.5rem 0 1rem', color: 'var(--text)' }}>
              Disclaimer &amp; <em>Disclosures</em>
            </h1>
            <p className="page-subtitle" style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '600px', lineHeight: 1.65 }}>
              Transparent information about project demonstrations, benchmarks, and external links.
            </p>
          </div>
        </div>
      </section>

      <section className="section" style={{ padding: '2rem 0 4rem' }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <div style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', marginBottom: '1.5rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <h2 style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.75rem', display: 'flex', gap: 8, alignItems: 'center', color: 'var(--text)' }}>
              <Info size={18} /> Informational Purpose
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem' }}>
              mritify.online is a personal engineering portfolio. Project case studies, benchmarks, and articles describe the author’s practical work. Code snippets are provided for educational review and should be evaluated before production use.
            </p>
          </div>

          <div style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', marginBottom: '1.5rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <h2 style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--text)' }}>
              External Content &amp; Accuracy
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem' }}>
              We link to live demos, GitHub repositories, certificate verification portals, and technical documentation. We strive for precision across all metrics, which reflect empirical testing in our development environments.
            </p>
          </div>

          <div style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', marginBottom: '1.5rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <h2 style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--text)' }}>
              Advertising Disclosure
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem' }}>
              Advertising banners served by Google AdSense are marked as sponsored placements. We do not promote accidental clicks or misleading ad representations.
            </p>
          </div>

          <div style={{ padding: '1.5rem 2rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Mail size={20} style={{ color: 'var(--text)', flexShrink: 0 }} />
            <div>
              <h3 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text)', margin: '0 0 0.2rem' }}>Questions?</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', margin: 0 }}>Contact <a href="mailto:me@mritify.online" style={{ color: 'var(--text)', textDecoration: 'underline' }}>me@mritify.online</a> for any inquiries.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
