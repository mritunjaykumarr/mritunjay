import { Link } from 'react-router-dom';
import { Scale, FileText, Mail } from 'lucide-react';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO } from '../lib/useSEO';

const BASE_URL = 'https://mritify.online';

export default function TermsAndConditions() {
  usePortfolioMotion();
  useSEO({
    title: 'Terms and Conditions | mritify.online — Use of Portfolio',
    description: 'Terms and Conditions for mritify.online — rules for using the portfolio, content ownership, external links, and limitations of liability.',
    canonical: `${BASE_URL}/terms-and-conditions`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'TermsOfService',
      name: 'Terms and Conditions — mritify.online',
      url: `${BASE_URL}/terms-and-conditions`,
    },
  });

  return (
    <div className="page-wrapper" style={{ paddingTop: '6rem', paddingBottom: '5rem', background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      <section className="page-header" style={{ padding: '2rem 0 3rem' }}>
        <div className="container">
          <div className="breadcrumb" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--text)' }}>Terms</span>
          </div>
          <div className="page-header-content">
            <div className="badge-playful" style={{ marginBottom: '1rem' }}>
              <Scale size={13} />
              <span>Legal Guidelines</span>
            </div>
            <h1 className="page-title" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', fontWeight: 600, letterSpacing: '-0.04em', margin: '0.5rem 0 1rem', color: 'var(--text)' }}>
              Terms &amp; <em>Conditions</em>
            </h1>
            <p className="page-subtitle" style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '600px', lineHeight: 1.65 }}>
              Last updated: August 2026 — General conditions governing the use of mritify.online and open-source materials.
            </p>
          </div>
        </div>
      </section>

      <section className="section" style={{ padding: '2rem 0 4rem' }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <div style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', marginBottom: '1.5rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <h2 style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.75rem', display: 'flex', gap: 8, alignItems: 'center', color: 'var(--text)' }}>
              <FileText size={18} /> Acceptance
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem' }}>
              By browsing, sharing, or contacting through mritify.online you agree to use the site lawfully and respectfully. This site is a personal portfolio showcasing engineering work and software development services.
            </p>
          </div>

          <div style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', marginBottom: '1.5rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <h2 style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--text)' }}>
              Intellectual Property
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem' }}>
              All original code snippets, architecture diagrams, case studies, and technical articles are authored by Mritunjay Kumar unless otherwise credited. Open-source code linked via GitHub retains its designated open-source license.
            </p>
          </div>

          <div style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', marginBottom: '1.5rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <h2 style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--text)' }}>
              External Links &amp; Demonstrations
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem' }}>
              This portfolio links to live demos (including Bulk Mail Sender, Live TV, Chat App, and CLI tool repositories). We strive for 100% uptime but are not liable for outages on external host platforms.
            </p>
          </div>

          <div style={{ padding: '2rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <h2 style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.75rem', display: 'flex', gap: 8, alignItems: 'center', color: 'var(--text)' }}>
              <Mail size={18} /> Contact &amp; Questions
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem', margin: 0 }}>
              For questions regarding these terms, contact <a href="mailto:me@mritify.online" style={{ color: 'var(--text)', textDecoration: 'underline' }}>me@mritify.online</a> or <a href="mailto:support@mritify.online" style={{ color: 'var(--text)', textDecoration: 'underline' }}>support@mritify.online</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
