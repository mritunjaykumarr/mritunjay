import { Link } from 'react-router-dom';
import { SearchX, ArrowLeft, Home } from 'lucide-react';
import { useSEO } from '../lib/useSEO';

const BASE_URL = 'https://mritify.online';

export default function NotFound() {
  useSEO({
    title: 'Page Not Found — mritify.online',
    description: 'The page you are looking for does not exist. Return to the homepage of Mritunjay Kumar portfolio.',
    canonical: `${BASE_URL}/404`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: '404 Not Found',
      url: `${BASE_URL}/404`,
    },
  });

  return (
    <div className="page-wrapper" style={{ paddingTop: '6rem', paddingBottom: '5rem', background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      <section className="section" style={{ padding: '6rem 0' }}>
        <div className="container" style={{ maxWidth: 640, textAlign: 'center' }}>
          <div style={{ padding: '3rem 2rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px' }}>
            <SearchX size={44} style={{ color: 'var(--text)', margin: '0 auto 1.25rem' }} />
            <h1 style={{ fontWeight: 600, fontSize: '2.2rem', color: 'var(--text)', letterSpacing: '-0.03em', margin: '0 0 0.5rem' }}>404 — Page Not Found</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem', lineHeight: 1.7, fontSize: '0.94rem' }}>
              The page you requested could not be located. It may have been moved or updated.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
              <Link to="/" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Home size={15} /> Go to Homepage
              </Link>
              <Link to="/contact" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowLeft size={15} /> Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
