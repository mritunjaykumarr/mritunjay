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
    <div className="page-wrapper" style={{ paddingTop: '5.5rem', paddingBottom: '5rem' }}>
      <section className="page-header">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><span className="current">Disclaimer</span></div>
          <div className="page-header-content reveal">
            <div className="section-eyebrow"><AlertTriangle size={14} /> Transparency</div>
            <h1 className="page-title">Disclaimer & <span className="grad">Disclosure</span></h1>
            <p className="page-subtitle">Clear information about the purpose of this portfolio, external content, and advertising.</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ padding: '3rem 0' }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="card-sticker" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', gap: 8, alignItems: 'center' }}><Info size={18} /> Informational Purpose</h2>
            <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.7 }}>mritify.online is a personal portfolio. Project case studies, articles, and experience descriptions are based on the author’s actual work and learning. They are not professional financial, legal, or medical advice. Any code snippets are provided for educational purposes — test them in your own environment before production use.</p>
          </div>

          <div className="card-sticker" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.75rem' }}>External Content & Accuracy</h2>
            <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.7 }}>We link to live demos, GitHub repositories, certificate validators, and articles across the web. We aim for accuracy but cannot guarantee that external sites or project metrics remain unchanged over time. Metrics shown (e.g., “99.2% deliverability”, “sub-20ms latency”) reflect our testing conditions and are not guarantees for every user.</p>
          </div>

          <div className="card-sticker" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.75rem' }}>Advertising & Affiliate Disclosure</h2>
            <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.7 }}>If ads are displayed via Google AdSense, they are clearly marked as advertisements and are not endorsements. We may also link to tools we use (Vercel, Supabase, etc.) without receiving affiliate compensation unless explicitly stated. We never place ads to induce accidental clicks, and we never encourage ad clicks.</p>
          </div>

          <div className="card-sticker" style={{ padding: '2rem', background: 'var(--muted)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Mail size={20} style={{ color: 'var(--accent)' }} />
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Questions?</h3>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.92rem' }}>Contact <a href="mailto:me@mritify.online" style={{ color: 'var(--accent)', fontWeight: 700 }}>me@mritify.online</a> for clarifications.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
