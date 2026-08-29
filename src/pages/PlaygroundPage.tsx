import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import AIPlayground from '../components/AIPlayground';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO';

export default function PlaygroundPage() {
  usePortfolioMotion();
  useSEO(SEO_CONFIGS.playground);

  return (
    <div className="page-wrapper playground-page" style={{ paddingTop: '6rem', paddingBottom: '5rem', background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      {/* Page Header */}
      <section className="page-header" style={{ padding: '2rem 0 2rem' }}>
        <div className="container">
          <div className="breadcrumb" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--text)' }}>AI Playground</span>
          </div>

          <div className="page-header-content">
            <div className="badge-playful" style={{ marginBottom: '1rem' }}>
              <Sparkles size={13} />
              <span>Interactive AI Tools Sandbox</span>
            </div>
            <h1 className="page-title" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', fontWeight: 600, letterSpacing: '-0.04em', margin: '0.5rem 0 1rem', color: 'var(--text)' }}>
              AI <em>Playground</em>
            </h1>
            <p className="page-subtitle" style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '600px', lineHeight: 1.65 }}>
              A suite of 6 live engineering utilities demonstrating practical AI code generation, performance audits, regex builders, and prompt optimizers.
            </p>
          </div>
        </div>
      </section>

      <div className="container" style={{ margin: '1.5rem auto' }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: 'clamp(0.75rem, 2vw, 1.5rem)' }}>
          <AIPlayground />
        </div>
      </div>
    </div>
  );
}
