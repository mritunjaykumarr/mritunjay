import { Star, CheckCircle2, Sparkles } from 'lucide-react';

export interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  initials: string;
  rating: number;
  project: string;
  quote: string;
  impact: string;
  tag: string;
}

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 1,
    name: 'Dustine Abhishek',
    role: 'Founder & CEO',
    company: 'CloudScale AI',
    avatar: '',
    initials: 'DA',
    rating: 5,
    project: 'Fullstack AI SaaS Platform',
    tag: 'AI Engineering',
    quote: 'Mritunjay took our messy AI idea and transformed it into a lightning-fast production web app with React 19 and streaming LLM APIs. He delivered 2 weeks ahead of our launch deadline with exceptional code quality and zero bugs.',
    impact: 'Shipped MVP 2 weeks early · 10k+ monthly active users'
  },
  {
    id: 2,
    name: 'Ashish Suman',
    role: 'Tech Lead & Consultant',
    company: 'Nexus Realtime Lab',
    avatar: '',
    initials: 'AS',
    rating: 5,
    project: 'Real-Time Data & Messaging Pipeline',
    tag: 'Fullstack Architecture',
    quote: 'Working with Mritunjay was effortless. His deep understanding of WebSockets, TypeScript, and state management resulted in a buttery-smooth interface that handles heavy concurrent traffic with 99.9% uptime.',
    impact: 'Reduced latency by 65% · Scaled to 50k requests/day'
  },
  {
    id: 3,
    name: 'Vivekanand Sharma',
    role: 'Engineering Manager',
    company: 'FinPulse Systems',
    avatar: '',
    initials: 'VS',
    rating: 5,
    project: 'Database Migration & Workflow Automations',
    tag: 'Backend & Data',
    quote: 'Mritunjay re-architected our Supabase and PostgreSQL schemas, built secure REST endpoints, and created an intuitive dashboard for our internal team. Clean code, zero fluff, and great async communication.',
    impact: 'Zero-downtime DB migration · 100% automated pipelines'
  },
  {
    id: 4,
    name: 'Gopal Yadav',
    role: 'Director of Growth',
    company: 'Veloce Digital Agency',
    avatar: '',
    initials: 'GY',
    rating: 5,
    project: 'High-Converting Product Launch & Web Suite',
    tag: 'UI/UX & Performance',
    quote: 'Our launch page conversion jumped by over 140% after Mritunjay redesigned it with custom GSAP micro-animations and mobile-first responsive architecture. Truly exceptional engineering craftsmanship.',
    impact: '+140% Conversion increase · 99 Google Lighthouse score'
  }
];

export default function Testimonials() {
  return (
    <section className="section testimonials-section" id="testimonials" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 2.5rem' }}>
          <div className="badge-playful" style={{ margin: '0 auto 0.75rem', display: 'inline-flex' }}>
            <Sparkles size={13} />
            <span>Client Reviews &amp; Social Proof</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--text)', margin: '0 0 0.75rem' }}>
            Trusted by <em>Founders &amp; Tech Leads</em>
          </h2>
          <p style={{ fontSize: '0.96rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
            Real feedback from startup founders, engineering managers, and product teams on delivered projects and engineering outcomes.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="testimonials-grid">
          {TESTIMONIALS_DATA.map((t) => (
            <div
              key={t.id}
              className="testimonial-card"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.25rem',
                position: 'relative',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.25s ease'
              }}
            >
              {/* Top Row: Stars + Project Tag */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '3px', color: '#f59e0b' }}>
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="#f59e0b" />
                  ))}
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)'
                  }}
                >
                  {t.tag}
                </span>
              </div>

              {/* Quote Text */}
              <p
                style={{
                  fontSize: '0.92rem',
                  color: 'var(--text)',
                  lineHeight: 1.65,
                  margin: 0,
                  fontStyle: 'normal'
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Impact Metric Pill */}
              <div
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  fontSize: '0.78rem',
                  color: 'var(--text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <CheckCircle2 size={14} style={{ color: '#22c55e', flexShrink: 0 }} />
                <span style={{ fontWeight: 500 }}>{t.impact}</span>
              </div>

              {/* Client Profile Footer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'var(--accent)',
                    color: 'var(--accent-foreground)',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    flexShrink: 0,
                    border: '1px solid var(--border)'
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text)' }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    {t.role} · <span style={{ color: 'var(--text)', fontWeight: 500 }}>{t.company}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
