import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import AIPlayground from '../components/AIPlayground';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO';

export default function PlaygroundPage() {
  usePortfolioMotion();
  useSEO(SEO_CONFIGS.playground);
  return (
    <div className="page-wrapper playground-page" style={{ paddingTop:'5.5rem', paddingBottom:'5rem', background:'var(--background)', position:'relative' }}>
      <div aria-hidden="true" style={{ position:'absolute', right:'5%', top:90, width:72, height:72, background:'var(--secondary)', border:'2px solid var(--foreground)', borderRadius:'50%', boxShadow:'var(--shadow-pop)' }} />
      <section className="page-header" style={{ paddingBottom:'1rem', position:'relative', overflow:'clip' }}>
        <div className="container">
          <div className="breadcrumb" style={{ fontFamily:'var(--font-body)' }}><Link to="/">Home</Link><span>/</span><span className="current">AI Playground</span></div>
          <div className="page-header-content reveal playful-enter">
            <div className="badge-playful" style={{ background:'var(--quaternary)' }}><Sparkles size={14} strokeWidth={2.5}/> Interactive Sandbox</div>
            <h1 className="page-title" style={{ fontFamily:'var(--font-heading)', fontWeight:800, marginTop:'0.6rem' }}>AI <span style={{ color:'var(--accent)' }}>Playground</span></h1>
            <p className="page-subtitle" style={{ fontFamily:'var(--font-body)', color:'var(--muted-foreground)' }}>A suite of 6 live engineering tools demonstrating real AI utility generation, execution metrics, and interactive parameter controls.</p>
          </div>
        </div>
        <svg aria-hidden="true" viewBox="0 0 120 12" preserveAspectRatio="none" style={{ position:'absolute', bottom:0, left:0, width:'100%', height:12, color:'var(--foreground)' }}><path d="M0 6 Q15 0 30 6 T60 6 T90 6 T120 6" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round"/></svg>
      </section>
      <div style={{ maxWidth:1152, margin:'2rem auto', padding:'0 1rem' }}>
        <div className="card-sticker" style={{ padding:'1rem' }}>
          <AIPlayground />
        </div>
      </div>
    </div>
  );
}
