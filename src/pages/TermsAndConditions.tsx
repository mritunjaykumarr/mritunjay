import { Link } from 'react-router-dom';
import { Scale, FileText, AlertCircle, Mail } from 'lucide-react';
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
    <div className="page-wrapper" style={{ paddingTop: '5.5rem', paddingBottom: '5rem' }}>
      <section className="page-header">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link><span>/</span><span className="current">Terms</span></div>
          <div className="page-header-content reveal">
            <div className="section-eyebrow"><Scale size={14} /> Legal Terms</div>
            <h1 className="page-title">Terms and <span className="grad">Conditions</span></h1>
            <p className="page-subtitle">Last updated: August 6, 2026 — By accessing mritify.online you agree to these terms. Written for this portfolio, not a generic template.</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ padding: '3rem 0' }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="card-sticker" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', gap: 8, alignItems: 'center' }}><FileText size={18} /> Acceptance</h2>
            <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.7 }}>By browsing, sharing, or contacting through mritify.online you agree to use the site lawfully and respectfully. If you do not agree, please do not use the site. This site is a personal portfolio, not a marketplace, and does not process payments directly.</p>
          </div>

          <div className="card-sticker" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.75rem' }}>Intellectual Property</h2>
            <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.7 }}>All original content — case studies, project descriptions, UI designs, and technical articles — is authored by Mritunjay Kumar unless otherwise credited. Project screenshots remain the property of their respective owners. You may share links to public pages with attribution, but you may not copy substantial text, images, or code and represent it as your own.</p>
            <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.7, marginTop: '0.75rem' }}>Open-source code linked via GitHub retains its own license (see each repository). Resume PDF may be shared for hiring purposes with credit.</p>
          </div>

          <div className="card-sticker" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.75rem' }}>External Links & Services</h2>
            <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.7 }}>This portfolio links to GitHub, LinkedIn, live demos (including bulkmailsender.online, currency tools, chat apps), and third-party certificate validators. We are not responsible for the content or privacy practices of external sites. Ads served by Google AdSense, if displayed, are controlled by Google.</p>
          </div>

          <div className="card-sticker" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', gap: 8, alignItems: 'center' }}><AlertCircle size={18} /> Disclaimer & Liability</h2>
            <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.7 }}>Content is provided “as is” for informational and hiring purposes. While we strive for accuracy, we make no warranties about completeness or reliability of project metrics and articles. Use of any code or advice is at your own risk. To the fullest extent allowed by law, Mritunjay Kumar is not liable for any loss arising from use of the site.</p>
          </div>

          <div className="card-sticker" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.75rem' }}>Prohibited Use</h2>
            <ul style={{ color: 'var(--muted-foreground)', lineHeight: 1.7, paddingLeft: '1.25rem', listStyle: 'disc', display: 'grid', gap: '0.5rem' }}>
              <li>Do not attempt to scrape the blog API at abusive rates or post spam/ hateful comments.</li>
              <li>Do not impersonate the site owner or misrepresent affiliation.</li>
              <li>Do not use the site to distribute malware or violate applicable laws in India or your jurisdiction.</li>
            </ul>
          </div>

          <div className="card-sticker" style={{ padding: '2rem', background: 'var(--muted)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Mail size={20} style={{ color: 'var(--accent)' }} />
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Contact</h3>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.92rem' }}>Questions about these terms? Reach <a href="mailto:me@mritify.online" style={{ color: 'var(--accent)', fontWeight: 700 }}>me@mritify.online</a> or via <Link to="/contact" style={{ color: 'var(--accent)', fontWeight: 700 }}>contact page</Link>. We may update these terms and will revise the “Last updated” date.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
