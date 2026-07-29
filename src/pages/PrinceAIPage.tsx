import { Link } from 'react-router-dom';
import { Bot } from 'lucide-react';
import PrinceAI from '../components/PrinceAI';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';

export default function PrinceAIPage() {
  usePortfolioMotion();

  return (
    <div className="page-wrapper prince-ai-page" style={{ paddingTop: '5.5rem', paddingBottom: '5rem' }}>
      <section className="page-header" style={{ paddingBottom: '1rem' }}>
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span className="current">Prince AI</span>
          </div>
          <div className="page-header-content reveal">
            <div className="section-eyebrow"><Bot size={14} /> AI Assistant</div>
            <h1 className="page-title">
              Prince <span className="grad">AI Experience</span>
            </h1>
            <p className="page-subtitle">
              An intelligent assistant for product strategy, code recommendations, and instant ideation.
            </p>
          </div>
        </div>
      </section>

      <PrinceAI />
    </div>
  );
}
