import { Link } from 'react-router-dom';
import { Check, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';

export default function PricingPage() {
  usePortfolioMotion();

  const pricingTiers = [
    {
      name: 'Starter Landing Page',
      price: '$299',
      period: 'one-time',
      desc: 'Ideal for startups, portfolios, or product launches requiring a high-impact, performant single-page website.',
      features: [
        'Custom Responsive Design System',
        'Lightweight Animated Interactions (GSAP)',
        'SEO Metadata & OpenGraph Optimization',
        'Contact Form Integration (Web3Forms/API)',
        '1-Year Free Hosting Setup & Domain Help',
        'Fast 3-Day Turnaround'
      ],
      cta: 'Start Landing Project',
      popular: false
    },
    {
      name: 'Modern Web Application',
      price: '$699',
      period: 'one-time',
      desc: 'Complete multi-page React / TypeScript web application with custom state, routing, and dynamic data APIs.',
      features: [
        'Full Multi-Page React 19 / TypeScript SPA',
        'Custom Component Architecture & Micro-Animations',
        'Supabase / REST API Integration & Database Setup',
        'Dark / Light Mode Theme Switching',
        'Admin Dashboard & Content Management',
        'Mobile App-like PWA Optimization',
        '1-Month Post-Launch Tech Support'
      ],
      cta: 'Build Web App',
      popular: true
    },
    {
      name: 'Enterprise / Custom Software',
      price: '$1,299+',
      period: 'custom',
      desc: 'Full-scale custom software platforms, real-time socket applications, AI assistant tools, and API backend architecture.',
      features: [
        'Custom Fullstack Node.js / Express Backend',
        'Realtime WebSockets / Socket.io Integrations',
        'Generative AI Models & Chatbot Assistants',
        'PostgreSQL / Supabase Row-Level Security',
        'High Volume Email / Automation Tools',
        'Priority Tech Support & Dedicated Maintenance'
      ],
      cta: 'Discuss Enterprise Scope',
      popular: false
    }
  ];

  const faqs = [
    {
      q: 'How long does a web project typically take?',
      a: 'Single-page landing pages are delivered in 3 to 5 business days. Full multi-page web applications take between 1.5 to 3 weeks depending on feature complexity and API requirements.'
    },
    {
      q: 'What technologies do you use for development?',
      a: 'I specialize in React 19, TypeScript, Node.js, Express, Supabase, PostgreSQL, CSS3/Sass, and GSAP animation libraries to deliver modern, fast, and scalable applications.'
    },
    {
      q: 'Can you help update or optimize an existing website?',
      a: 'Yes! I provide performance audits, UI/UX redesigns, React code refactoring, and responsiveness upgrades for existing projects.'
    }
  ];

  return (
    <div className="page-wrapper pricing-page" style={{ paddingTop: '5.5rem', paddingBottom: '5rem' }}>
      {/* Header Banner */}
      <section className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span className="current">Services & Pricing</span>
          </div>
          <div className="page-header-content reveal">
            <div className="section-eyebrow"><Sparkles size={14} /> Clear & Transparent Rates</div>
            <h1 className="page-title">
              Services, Packages & <span className="grad">Investment</span>
            </h1>
            <p className="page-subtitle">
              Straightforward pricing for handcrafted web development, product engineering, and AI-powered digital experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section" style={{ padding: '3rem 0 4rem' }}>
        <div className="container">
          <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {pricingTiers.map((tier) => (
              <div 
                key={tier.name} 
                className={`card-glass pricing-card reveal ${tier.popular ? 'popular' : ''}`}
                style={{
                  padding: '2.5rem 2rem',
                  borderRadius: 'var(--r-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: tier.popular ? '2px solid var(--primary)' : '1px solid var(--border)'
                }}
              >
                {tier.popular && (
                  <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '4px 14px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Most Popular
                  </div>
                )}

                <h3 style={{ fontSize: '1.4rem', color: 'var(--text)', marginBottom: '0.5rem' }}>{tier.name}</h3>
                <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', lineHeight: 1.6, minHeight: '3rem' }}>{tier.desc}</p>

                <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--text)' }}>{tier.price}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>/ {tier.period}</span>
                </div>

                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem', flex: 1 }}>
                  {tier.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem', color: 'var(--text-2)' }}>
                      <Check size={16} className="grad-text" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/contact" className={tier.popular ? 'btn-primary' : 'btn-outline'} style={{ width: '100%', justifyContent: 'center' }}>
                  <span>{tier.cta}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section bg-elevated" style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="section-eyebrow">Got Questions?</div>
          <h2 className="section-title reveal">Frequently Asked <span className="grad">Questions</span></h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
            {faqs.map(faq => (
              <div key={faq.q} className="card-glass reveal" style={{ padding: '1.75rem', borderRadius: 'var(--r-md)' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HelpCircle size={18} className="grad-text" /> {faq.q}
                </h3>
                <p style={{ color: 'var(--text-2)', fontSize: '0.95rem', lineHeight: 1.7 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
