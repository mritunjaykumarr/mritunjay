import { Link } from 'react-router-dom';
import { Bot, Sparkles, Star } from 'lucide-react';
import PrinceAI from '../components/PrinceAI';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO';
export default function PrinceAIPage() {
  usePortfolioMotion(); useSEO(SEO_CONFIGS.princeAI);
  return (
    <div className="page-wrapper prince-ai-page" style={{ paddingTop:'5.5rem', paddingBottom:'5rem', background:'var(--background)', position:'relative' }}>
      <div aria-hidden="true" style={{ position:'absolute', right:'6%', top:100, width:56, height:56, background:'var(--accent)', border:'2px solid var(--foreground)', borderRadius:'50%', boxShadow:'var(--shadow-pop)' }} />
      <div aria-hidden="true" style={{ position:'absolute', left:'4%', top:180, width:0, height:0, borderLeft:'12px solid transparent', borderRight:'12px solid transparent', borderBottom:'20px solid var(--tertiary)', filter:'drop-shadow(4px 4px 0 #1E293B)', transform:'rotate(12deg)' }} />
      <section className="page-header" style={{ paddingBottom:'1rem', position:'relative', overflow:'clip' }}>
        <div className="container">
          <div className="breadcrumb" style={{ fontFamily:'var(--font-body)' }}><Link to="/">Home</Link><span>/</span><span className="current">Prince AI</span></div>
          <div className="page-header-content reveal playful-enter">
            <div className="badge-playful" style={{ background:'var(--quaternary)' }}><Bot size={14} strokeWidth={2.5}/> AI Assistant</div>
            <h1 className="page-title" style={{ fontFamily:'var(--font-heading)', fontWeight:800, marginTop:'0.6rem' }}>Prince <span style={{ color:'var(--accent)' }}>AI Experience</span></h1>
            <p className="page-subtitle" style={{ fontFamily:'var(--font-body)', color:'var(--muted-foreground)' }}>An intelligent assistant for product strategy, code recommendations, and instant ideation.</p>
            <div style={{ display:'flex', gap:'0.6rem', marginTop:'1rem', flexWrap:'wrap' }}>
              <span className="badge-playful" style={{ background:'var(--accent)', color:'white', fontSize:'0.7rem' }}><Sparkles size={12} strokeWidth={2.5}/> LLM powered</span>
              <span className="badge-playful" style={{ background:'var(--secondary)', color:'white', fontSize:'0.7rem' }}><Star size={12} strokeWidth={2.5}/> Context aware</span>
              <span className="badge-playful" style={{ background:'var(--tertiary)', fontSize:'0.7rem' }}><Bot size={12} strokeWidth={2.5}/> Fast responses</span>
            </div>
          </div>
        </div>
        <svg aria-hidden="true" viewBox="0 0 120 12" preserveAspectRatio="none" style={{ position:'absolute', bottom:0, left:0, width:'100%', height:12, color:'var(--foreground)' }}><path d="M0 6 Q15 0 30 6 T60 6 T90 6 T120 6" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round"/></svg>
      </section>
      <div style={{ maxWidth:'1152px', margin:'0 auto', padding:'0 1rem' }}>
        <div className="card-sticker" style={{ padding:'1rem', overflow:'hidden' }}>
          <PrinceAI />
        </div>
      </div>
    </div>
  );
}
