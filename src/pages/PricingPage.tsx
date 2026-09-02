import { Link } from 'react-router-dom';
import { Check, ArrowRight, Sparkles, Star } from 'lucide-react';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO';
import ProjectEstimateCalculator from '../components/ProjectEstimateCalculator';
import Testimonials from '../components/Testimonials';

export default function PricingPage() {
  usePortfolioMotion();
  useSEO(SEO_CONFIGS.pricing);

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
    { q: 'How long does a web project typically take?', a: 'Landing pages take 3-5 days. Full web applications take 1.5-3 weeks depending on scope and feature complexity.' },
    { q: 'What technologies do you use?', a: 'React 19, TypeScript, Node.js, Express, Supabase, PostgreSQL, CSS3/Sass, and Framer Motion for fast, maintainable builds.' },
    { q: 'Can you help update an existing website?', a: 'Yes — performance audits, UI/UX redesigns, React modernizations, and responsive overhaul projects.' }
  ];

  return (
    <div className="page-wrapper pricing-page" style={{ paddingTop: '2rem', paddingBottom: '5rem', background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      {/* Page Header */}
      <section className="page-header" style={{ padding: '2rem 0 2rem' }}>
        <div className="container">
          <div className="breadcrumb" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--text)' }}>Services &amp; Pricing</span>
          </div>

          <div className="page-header-content">
            <div className="badge-playful" style={{ marginBottom: '1rem' }}>
              <Sparkles size={13} />
              <span>Clear &amp; Transparent Rates</span>
            </div>
            <h1 className="page-title" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', fontWeight: 600, letterSpacing: '-0.04em', margin: '0.5rem 0 1rem', color: 'var(--text)' }}>
              Services, Packages &amp; <em>Investment</em>
            </h1>
            <p className="page-subtitle" style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '600px', lineHeight: 1.65 }}>
              Straightforward pricing for handcrafted web applications, production engineering, and AI-powered digital products.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Project Quote / Estimate Calculator */}
      <section className="section" style={{ padding: '1rem 0 2rem' }}>
        <div className="container">
          <ProjectEstimateCalculator />
        </div>
      </section>

      {/* Pricing Standard Packages Grid */}
      <section className="section" style={{ padding: '2rem 0 3rem' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text)', margin: '0 0 0.5rem' }}>
              Standard <em>Packages</em>
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
              Fixed-scope packages with turnkey deliverables and clear delivery milestones.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                style={{
                  padding: '2.25rem', display: 'flex', flexDirection: 'column', position: 'relative',
                  background: 'var(--card)',
                  border: '1px solid ' + (tier.popular ? 'var(--border-accent)' : 'var(--border)'),
                  borderRadius: '14px',
                  boxShadow: tier.popular ? 'var(--shadow-lg)' : 'none'
                }}
              >
                {tier.popular && (
                  <div style={{
                    position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--accent)', color: 'var(--accent-foreground)', borderRadius: '4px', padding: '0.2rem 0.75rem',
                    fontWeight: 600, fontSize: '0.72rem', letterSpacing: '0.04em', textTransform: 'uppercase',
                    display: 'flex', alignItems: 'center', gap: '4px'
                  }}>
                    <Star size={11} fill="currentColor" /> Most Popular
                  </div>
                )}

                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.5rem' }}>{tier.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.6, minHeight: '3rem', margin: 0 }}>{tier.desc}</p>
                
                <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text)' }}>{tier.price}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>/ {tier.period}</span>
                </div>

                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '2rem', flex: 1, listStyle: 'none', padding: 0, margin: '0 0 2rem' }}>
                  {tier.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.86rem', color: 'var(--text)', lineHeight: 1.5 }}>
                      <span style={{ width: 18, height: 18, borderRadius: '4px', background: 'var(--surface-2)', display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: 2 }}>
                        <Check size={11} style={{ color: 'var(--text)' }} />
                      </span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className={tier.popular ? 'btn-primary' : 'btn-secondary'}
                  style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <span>{tier.cta}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Reviews Section */}
      <Testimonials />

      {/* Pricing FAQs */}
      <section className="section" style={{ padding: '3rem 0', background: 'var(--bg-subtle, var(--bg))', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--text)', margin: '0 0 1.5rem', textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ padding: '1.25rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', margin: '0 0 0.4rem' }}>{faq.q}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
