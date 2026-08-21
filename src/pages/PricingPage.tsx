import { Link } from 'react-router-dom';
import { Check, ArrowRight, Sparkles, HelpCircle, Star } from 'lucide-react';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO';

// Playful: middle tier scaled + rotated star badge, all tiers sticker cards with hard shadows, confetti CTA
export default function PricingPage() {
  usePortfolioMotion();
  useSEO(SEO_CONFIGS.pricing);
  const pricingTiers = [
    {
      name: 'Starter Landing Page',
      price: '$299',
      period: 'one-time',
      desc: 'Ideal for startups, portfolios, or product launches requiring a high-impact, performant single-page website.',
      features: ['Custom Responsive Design System','Lightweight Animated Interactions (GSAP)','SEO Metadata & OpenGraph Optimization','Contact Form Integration (Web3Forms/API)','1-Year Free Hosting Setup & Domain Help','Fast 3-Day Turnaround'],
      cta: 'Start Landing Project',
      popular: false,
      color: 'var(--quaternary)'
    },
    {
      name: 'Modern Web Application',
      price: '$699',
      period: 'one-time',
      desc: 'Complete multi-page React / TypeScript web application with custom state, routing, and dynamic data APIs.',
      features: ['Full Multi-Page React 19 / TypeScript SPA','Custom Component Architecture & Micro-Animations','Supabase / REST API Integration & Database Setup','Dark / Light Mode Theme Switching','Admin Dashboard & Content Management','Mobile App-like PWA Optimization','1-Month Post-Launch Tech Support'],
      cta: 'Build Web App',
      popular: true,
      color: 'var(--accent)'
    },
    {
      name: 'Enterprise / Custom Software',
      price: '$1,299+',
      period: 'custom',
      desc: 'Full-scale custom software platforms, real-time socket applications, AI assistant tools, and API backend architecture.',
      features: ['Custom Fullstack Node.js / Express Backend','Realtime WebSockets / Socket.io Integrations','Generative AI Models & Chatbot Assistants','PostgreSQL / Supabase Row-Level Security','High Volume Email / Automation Tools','Priority Tech Support & Dedicated Maintenance'],
      cta: 'Discuss Enterprise Scope',
      popular: false,
      color: 'var(--secondary)'
    }
  ];
  const faqs = [
    { q: 'How long does a web project typically take?', a: 'Landing pages 3-5 days. Full web apps 1.5-3 weeks depending on complexity.' },
    { q: 'What technologies do you use?', a: 'React 19, TypeScript, Node.js, Express, Supabase, PostgreSQL, CSS3/Sass, GSAP — fast, scalable, modern.' },
    { q: 'Can you help update an existing website?', a: 'Yes — performance audits, UI/UX redesigns, React refactoring, responsiveness upgrades.' }
  ];
  return (
    <div className="page-wrapper pricing-page" style={{ paddingTop:'5.5rem', paddingBottom:'5rem', background:'var(--background)', position:'relative' }}>
      <div aria-hidden="true" style={{ position:'absolute', right:'6%', top:80, width:64, height:64, background:'var(--secondary)', border:'2px solid var(--foreground)', borderRadius:'50%', boxShadow:'var(--shadow-pop)', transform:'rotate(-8deg)' }} />
      <section className="page-header" style={{ position:'relative', overflow:'clip' }}>
        <div className="container">
          <div className="breadcrumb" style={{ fontFamily:'var(--font-body)' }}><Link to="/">Home</Link><span>/</span><span className="current">Services & Pricing</span></div>
          <div className="page-header-content reveal playful-enter">
            <div className="badge-playful" style={{ background:'var(--tertiary)' }}><Sparkles size={14} strokeWidth={2.5}/> Clear & Transparent Rates</div>
            <h1 className="page-title" style={{ fontFamily:'var(--font-heading)', fontWeight:800, marginTop:'0.6rem' }}>Services, Packages & <span style={{ color:'var(--accent)' }}>Investment</span></h1>
            <p className="page-subtitle" style={{ fontFamily:'var(--font-body)', color:'var(--muted-foreground)' }}>Straightforward pricing for handcrafted web development, product engineering, and AI-powered digital experiences.</p>
          </div>
        </div>
        <svg aria-hidden="true" viewBox="0 0 120 12" preserveAspectRatio="none" style={{ position:'absolute', bottom:0, left:0, width:'100%', height:12, color:'var(--foreground)' }}><path d="M0 6 Q15 0 30 6 T60 6 T90 6 T120 6" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round"/></svg>
      </section>

      <section className="section" style={{ padding:'3rem 0 4rem' }}>
        <div className="container">
          <div className="pricing-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'2rem', alignItems:'start' }}>
            {pricingTiers.map((tier) => (
              <div key={tier.name} className={`card-sticker ${tier.popular ? 'featured' : ''}`} style={{
                padding:'2.5rem 2rem', display:'flex', flexDirection:'column', position:'relative',
                transform: tier.popular ? 'scale(1.05) rotate(-0.4deg)' : undefined,
                borderColor: tier.popular ? 'var(--foreground)' : undefined,
                background:'var(--card)'
              }}>
                {tier.popular && (
                  <div aria-hidden="true" style={{ position:'absolute', top:'-16px', left:'50%', transform:'translateX(-50%) rotate(3deg)', background:'var(--tertiary)', border:'2px solid var(--foreground)', borderRadius:'9999px', padding:'0.4rem 1rem', fontFamily:'var(--font-heading)', fontWeight:800, fontSize:'0.7rem', letterSpacing:'0.06em', boxShadow:'var(--shadow-pop)', display:'flex', alignItems:'center', gap:'6px', whiteSpace:'nowrap' }}>
                    <Star size={12} strokeWidth={2.5} fill="var(--foreground)"/> MOST POPULAR
                  </div>
                )}
                <div style={{ width:44, height:44, borderRadius:'50%', background:tier.color, border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)', display:'grid', placeItems:'center', marginBottom:'1rem', color: tier.color==='var(--tertiary)'?'var(--foreground)':'white' }}>
                  <Sparkles size={18} strokeWidth={2.5} />
                </div>
                <h3 style={{ fontSize:'1.35rem', fontFamily:'var(--font-heading)', fontWeight:800, color:'var(--foreground)', marginBottom:'0.5rem' }}>{tier.name}</h3>
                <p style={{ color:'var(--muted-foreground)', fontSize:'0.9rem', lineHeight:1.6, minHeight:'3rem', fontFamily:'var(--font-body)' }}>{tier.desc}</p>
                <div style={{ margin:'1.5rem 0', display:'flex', alignItems:'baseline', gap:'6px' }}>
                  <span style={{ fontSize:'2.8rem', fontWeight:800, color:'var(--foreground)', fontFamily:'var(--font-heading)' }}>{tier.price}</span>
                  <span style={{ color:'var(--muted-foreground)', fontSize:'0.9rem', fontFamily:'var(--font-body)' }}>/ {tier.period}</span>
                </div>
                <ul style={{ display:'flex', flexDirection:'column', gap:'0.75rem', marginBottom:'2rem', flex:1, listStyle:'none', padding:0 }}>
                  {tier.features.map(f => (
                    <li key={f} style={{ display:'flex', alignItems:'flex-start', gap:'10px', fontSize:'0.9rem', color:'var(--muted-foreground)', fontFamily:'var(--font-body)' }}>
                      <span style={{ width:22, height:22, borderRadius:'50%', background:'var(--quaternary)', border:'2px solid var(--foreground)', display:'grid', placeItems:'center', flexShrink:0, marginTop:2 }}><Check size={12} strokeWidth={3} color="var(--foreground)"/></span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className={tier.popular ? 'btn-candy' : 'btn-secondary'} style={{ width:'100%', justifyContent:'center', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'0.5rem' }}>
                  <span>{tier.cta}</span><ArrowRight size={16} strokeWidth={2.5} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ padding:'4rem 0', background:'var(--muted)', borderTop:'2px solid var(--foreground)', borderBottom:'2px solid var(--foreground)' }}>
        <div className="container">
          <div className="badge-playful" style={{ background:'var(--quaternary)' }}><HelpCircle size={14} strokeWidth={2.5}/> Got Questions?</div>
          <h2 className="section-title" style={{ fontFamily:'var(--font-heading)', fontWeight:800, marginTop:'0.5rem' }}>Frequently Asked <span style={{ color:'var(--secondary)' }}>Questions</span></h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'1.5rem', marginTop:'2rem' }}>
            {faqs.map(faq => (
              <div key={faq.q} className="card-sticker" style={{ padding:'1.75rem' }}>
                <h3 style={{ fontSize:'1.05rem', fontFamily:'var(--font-heading)', fontWeight:800, color:'var(--foreground)', marginBottom:'0.75rem', display:'flex', alignItems:'center', gap:'8px' }}>
                  <span style={{ width:28, height:28, borderRadius:'50%', background:'var(--tertiary)', border:'2px solid var(--foreground)', display:'grid', placeItems:'center', flexShrink:0 }}><HelpCircle size={14} strokeWidth={2.5} color="var(--foreground)"/></span>
                  {faq.q}
                </h3>
                <p style={{ color:'var(--muted-foreground)', fontSize:'0.92rem', lineHeight:1.7, fontFamily:'var(--font-body)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
