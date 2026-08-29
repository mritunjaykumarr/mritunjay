import { Link } from 'react-router-dom';
import { Bot } from 'lucide-react';
import PrinceAI from '../components/PrinceAI';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO';

export default function PrinceAIPage() {
  usePortfolioMotion();
  useSEO(SEO_CONFIGS.princeAI);

  return (
    <div className="page-wrapper prince-ai-page" style={{ paddingTop: '6rem', paddingBottom: '5rem', background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      {/* Page Header */}
      <section className="page-header" style={{ padding: '2rem 0 2rem' }}>
        <div className="container">
          <div className="breadcrumb" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--text)' }}>Prince AI</span>
          </div>

          <div className="page-header-content">
            <div className="badge-playful" style={{ marginBottom: '1rem' }}>
              <Bot size={13} />
              <span>Flagship AI Product</span>
            </div>
            <h1 className="page-title" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', fontWeight: 600, letterSpacing: '-0.04em', margin: '0.5rem 0 1rem', color: 'var(--text)' }}>
              Prince <em>AI Assistant</em>
            </h1>
            <p className="page-subtitle" style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '600px', lineHeight: 1.65 }}>
              An intelligent, context-aware AI assistant engineered with streaming LLM integrations, product reasoning, and custom prompt workflows.
            </p>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 1.25rem' }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1rem', overflow: 'hidden' }}>
          <PrinceAI />
        </div>
      </div>
    </div>
  );
}
