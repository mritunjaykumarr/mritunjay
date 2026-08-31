import { Link } from 'react-router-dom';
import { Bot } from 'lucide-react';
import PrinceAI from '../components/PrinceAI';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO';

export default function PrinceAIPage() {
  usePortfolioMotion();
  useSEO(SEO_CONFIGS.princeAI);

  return (
    <div className="page-wrapper prince-ai-page" style={{ paddingTop: '5rem', paddingBottom: '2rem', background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      {/* Page Header */}
      <section className="page-header" style={{ padding: '1.5rem 0 1rem' }}>
        <div className="container">
          <div className="breadcrumb" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--text)' }}>Prince AI</span>
          </div>

          <div className="page-header-content">
            <div className="badge-playful" style={{ marginBottom: '0.75rem' }}>
              <Bot size={13} />
              <span>Flagship AI Product · Trained by Mritify</span>
            </div>
            <h1 className="page-title" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 600, letterSpacing: '-0.04em', margin: '0.5rem 0 0.75rem', color: 'var(--text)' }}>
              Prince <em>AI Assistant</em>
            </h1>
            <p className="page-subtitle" style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '600px', lineHeight: 1.65 }}>
              An intelligent, context-aware AI assistant fully trained by Mritify — powered by streaming LLM integrations, product reasoning, and custom prompt workflows.
            </p>
          </div>
        </div>
      </section>

      <div className="container" style={{ margin: '0.5rem auto 2rem' }}>
        <PrinceAI fullPage />
      </div>
    </div>
  );
}
