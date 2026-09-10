import { Link } from 'react-router-dom';
import ToolOutRedirectCard from '../components/ToolOutRedirectCard';
import { usePortfolioMotion } from '../lib/usePortfolioMotion.ts';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO.ts';

export default function DomainCheckerPage() {
  usePortfolioMotion();
  useSEO(SEO_CONFIGS.domainChecker);

  return (
    <div className="page-wrapper domain-checker-page" style={{ paddingTop: '6rem', paddingBottom: '5rem', background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      {/* Page Header */}
      <section className="page-header" style={{ padding: '2rem 0 1rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="breadcrumb" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--text)' }}>Domain Registrar Checker</span>
          </div>
        </div>
      </section>

      {/* Redirect Card */}
      <div className="container" style={{ margin: '0 auto' }}>
        <ToolOutRedirectCard
          toolName="Domain Registrar & WHOIS Checker"
          targetUrl="https://toolout.online/tools/domain-checker"
        />
      </div>
    </div>
  );
}
