import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import AIPlayground from '../components/AIPlayground';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO';

export default function PlaygroundPage() {
  usePortfolioMotion();
  useSEO(SEO_CONFIGS.playground);

  return (
    <div className="page-wrapper playground-page" style={{ paddingTop: '5.5rem', paddingBottom: '5rem' }}>
      <section className="page-header" style={{ paddingBottom: '1rem' }}>
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span className="current">AI Playground</span>
          </div>
          <div className="page-header-content reveal">
            <div className="section-eyebrow"><Sparkles size={14} /> Interactive Sandbox</div>
            <h1 className="page-title">
              AI <span className="grad">Playground</span>
            </h1>
            <p className="page-subtitle">
              A suite of 6 live engineering tools demonstrating real AI utility generation, execution metrics, and interactive parameter controls.
            </p>
          </div>
        </div>
      </section>

      <AIPlayground />
    </div>
  );
}
