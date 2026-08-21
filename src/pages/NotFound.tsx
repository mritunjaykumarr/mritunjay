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
    <div className="page-wrapper" style={{ paddingTop: '5.5rem', paddingBottom: '5rem' }}>
      <section className="section" style={{ padding: '6rem 0' }}>
        <div className="container" style={{ maxWidth: 640, textAlign: 'center' }}>
          <div className="card-sticker" style={{ padding: '3rem 2rem' }}>
            <SearchX size={48} style={{ color: 'var(--accent)', margin: '0 auto 1rem' }} />
            <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '2rem', color: 'var(--foreground)' }}>404 — Page not found</h1>
            <p style={{ color: 'var(--muted-foreground)', marginTop: '0.75rem', lineHeight: 1.7 }}>The page you tried to open does not exist or was moved. Check the URL or return to the homepage.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
              <Link to="/" className="btn-candy" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}><Home size={16} /> Go to Homepage</Link>
              <Link to="/contact" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}><ArrowLeft size={16} /> Contact Support</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
