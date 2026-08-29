import { Link } from 'react-router-dom';
import { ShieldCheck, Cookie, BarChart3, Mail } from 'lucide-react';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO } from '../lib/useSEO';

const BASE_URL = 'https://mritify.online';

export default function PrivacyPolicy() {
  usePortfolioMotion();
  useSEO({
    title: 'Privacy Policy | mritify.online — How We Handle Your Data',
    description: 'Privacy Policy for mritify.online — learn how Mritunjay Kumar collects, uses, and protects your data, including cookies, analytics, and Google AdSense advertising.',
    canonical: `${BASE_URL}/privacy-policy`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'PrivacyPolicy',
      name: 'Privacy Policy — mritify.online',
      url: `${BASE_URL}/privacy-policy`,
      author: { '@type': 'Person', name: 'Mritunjay Kumar' },
    },
  });

  return (
    <div className="page-wrapper" style={{ paddingTop: '6rem', paddingBottom: '5rem', background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      <section className="page-header" style={{ padding: '2rem 0 3rem' }}>
        <div className="container">
          <div className="breadcrumb" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--text)' }}>Privacy Policy</span>
          </div>
          <div className="page-header-content">
            <div className="badge-playful" style={{ marginBottom: '1rem' }}>
              <ShieldCheck size={13} />
              <span>Data Protection &amp; Governance</span>
            </div>
            <h1 className="page-title" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', fontWeight: 600, letterSpacing: '-0.04em', margin: '0.5rem 0 1rem', color: 'var(--text)' }}>
              Privacy <em>Policy</em>
            </h1>
            <p className="page-subtitle" style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '600px', lineHeight: 1.65 }}>
              Last updated: August 2026 — This policy transparently explains how mritify.online handles data, cookies, and communications.
            </p>
          </div>
        </div>
      </section>

      <section className="section" style={{ padding: '2rem 0 4rem' }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <div style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', marginBottom: '1.5rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <h2 style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.75rem', display: 'flex', gap: 8, alignItems: 'center', color: 'var(--text)' }}>
              <ShieldCheck size={18} /> Who We Are
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem' }}>
              mritify.online is the personal portfolio of <strong>Mritunjay Kumar</strong>, AI Engineer & Full Stack Developer based in Bihar / New Delhi, India. Contact: <a href="mailto:me@mritify.online" style={{ color: 'var(--text)', textDecoration: 'underline' }}>me@mritify.online</a> and <a href="mailto:support@mritify.online" style={{ color: 'var(--text)', textDecoration: 'underline' }}>support@mritify.online</a>. This site showcases engineering projects, technical skills, production experience, and software articles.
            </p>
          </div>

          <div style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', marginBottom: '1.5rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <h2 style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.75rem', display: 'flex', gap: 8, alignItems: 'center', color: 'var(--text)' }}>
              <Cookie size={18} /> Cookies &amp; Local Storage
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem' }}>
              We use essential browser local storage for preferences and anonymous engagement metrics. No third-party tracking scripts harvest personal profiles. Third-party cookies may be set if interacting with external embeds such as YouTube demos or Google AdSense banners.
            </p>
          </div>

          <div style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', marginBottom: '1.5rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <h2 style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.75rem', display: 'flex', gap: 8, alignItems: 'center', color: 'var(--text)' }}>
              <BarChart3 size={18} /> Advertising &amp; Analytics
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem' }}>
              This website displays Google AdSense advertising units to support open-source tooling. Google uses standard cookies to serve relevant advertisements. You can opt out of personalized advertising by visiting Google Ad Settings.
            </p>
          </div>

          <div style={{ padding: '2rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <h2 style={{ fontWeight: 600, fontSize: '1.2rem', marginBottom: '0.75rem', display: 'flex', gap: 8, alignItems: 'center', color: 'var(--text)' }}>
              <Mail size={18} /> Contact &amp; Inquiries
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.92rem', margin: 0 }}>
              If you have any questions regarding privacy or data practices, please reach out via <a href="mailto:me@mritify.online" style={{ color: 'var(--text)', textDecoration: 'underline' }}>me@mritify.online</a> or <a href="mailto:support@mritify.online" style={{ color: 'var(--text)', textDecoration: 'underline' }}>support@mritify.online</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
