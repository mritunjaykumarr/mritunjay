import { Link } from 'react-router-dom';
import { ShieldCheck, Cookie, BarChart3, Mail } from 'lucide-react';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO } from '../lib/useSEO';

const BASE_URL = 'https://mritify.online';

export default function PrivacyPolicy() {
  usePortfolioMotion();
  useSEO({
    title: 'Privacy Policy | mritify.online — How We Handle Your Data',
    description: 'Privacy Policy for mritify.online — learn how Mritunjay Kumar collects, uses, and protects your data, including cookies, analytics, and Google AdSense advertising.',
    canonical: `${BASE_URL}/privacy-policy`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'PrivacyPolicy',
      name: 'Privacy Policy — mritify.online',
      url: `${BASE_URL}/privacy-policy`,
      author: { '@type': 'Person', name: 'Mritunjay Kumar' },
    },
  });

  return (
    <div className="page-wrapper" style={{ paddingTop: '5.5rem', paddingBottom: '5rem' }}>
      <section className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link><span>/</span><span className="current">Privacy Policy</span>
          </div>
          <div className="page-header-content reveal">
            <div className="section-eyebrow"><ShieldCheck size={14} /> Your Privacy Matters</div>
            <h1 className="page-title">Privacy <span className="grad">Policy</span></h1>
            <p className="page-subtitle">Last updated: August 6, 2026 — This policy explains what data mritify.online collects and how it is used. No copied templates — written specifically for this portfolio.</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ padding: '3rem 0' }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <div className="card-sticker" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', gap: 8, alignItems: 'center' }}><ShieldCheck size={18} /> Who We Are</h2>
            <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>
              mritify.online is the personal portfolio of <strong>Mritunjay Kumar</strong>, Full Stack Developer & AI Engineer based in Bihar / New Delhi, India. Contact: <a href="mailto:me@mritify.online" style={{ color: 'var(--accent)', fontWeight: 700 }}>me@mritify.online</a> and <a href="mailto:support@mritify.online" style={{ color: 'var(--accent)', fontWeight: 700 }}>support@mritify.online</a>. This site showcases projects, skills, experience, and technical articles. It does not sell products directly.
            </p>
          </div>

          <div className="card-sticker" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', gap: 8, alignItems: 'center' }}><Cookie size={18} /> Cookies & Local Storage</h2>
            <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.7 }}>We use essential cookies for theme preference (<code>theme</code> in localStorage), and to remember if you dismissed the loader. No login cookies are set. If you enable comments/likes on blog posts, we store an anonymous ID (<code>anon_id</code>) and your like state (<code>user_likes</code>) locally to prevent duplicate likes — this is not linked to your real identity.</p>
            <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.7, marginTop: '0.75rem' }}>Third-party cookies may be set by Google AdSense, Google Analytics (if enabled), and embedded content such as YouTube iframes in project case studies. You can block or delete cookies in your browser settings at any time.</p>
          </div>

          <div className="card-sticker" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.75rem', display: 'flex', gap: 8, alignItems: 'center' }}><BarChart3 size={18} /> Analytics & Advertising</h2>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginTop: '1rem' }}>Google Analytics (if enabled)</h3>
            <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.7 }}>We may use privacy-friendly analytics to understand which pages are visited and which projects are viewed. No personal data is sold. IP addresses, if collected, are anonymized where possible.</p>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginTop: '1rem' }}>Google AdSense</h3>
            <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.7 }}>
              This site intends to display Google AdSense ads. Google uses cookies (including the DoubleClick cookie) to serve ads based on your visits to this and other sites. You can opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', fontWeight: 700 }}>Google Ads Settings</a>.
              Learn how Google uses data at <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', fontWeight: 700 }}>policies.google.com/technologies/ads</a>.
              We do not control third-party ad cookies. Ads are clearly labeled and never placed to cause accidental clicks.
            </p>
          </div>

          <div className="card-sticker" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.75rem' }}>Data You Provide</h2>
            <ul style={{ color: 'var(--muted-foreground)', lineHeight: 1.7, paddingLeft: '1.25rem', listStyle: 'disc', display: 'grid', gap: '0.5rem' }}>
              <li><strong>Contact form:</strong> When you submit the contact form (via web3forms.com), we receive your name, email, and message to respond to your inquiry. We do not share this data with advertisers.</li>
              <li><strong>Blog comments:</strong> If you post a comment, your displayed name (“Visitor” by default) and comment text are stored via Supabase and shown publicly on that post.</li>
              <li><strong>Resume download:</strong> No data is collected when you view or download the PDF resume.</li>
            </ul>
          </div>

          <div className="card-sticker" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.75rem' }}>Third-Party Services</h2>
            <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.7 }}>We rely on: Vercel (hosting), Supabase (blog likes/comments), Web3Forms (contact form), Google Fonts (Outfit + Plus Jakarta Sans), and Google AdSense/YouTube embeds. Each has its own privacy policy. We do not sell your data to any of them.</p>
          </div>

          <div className="card-sticker" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.75rem' }}>Your Choices & Rights</h2>
            <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.7 }}>You can: disable cookies, request deletion of a comment you posted (email us), opt out of personalized ads, and contact us for any privacy question. We respond within 7 days.</p>
          </div>

          <div className="card-sticker" style={{ padding: '2rem', background: 'var(--muted)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Mail size={20} style={{ color: 'var(--accent)' }} />
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Questions?</h3>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.92rem' }}>Email <a href="mailto:me@mritify.online" style={{ color: 'var(--accent)', fontWeight: 700 }}>me@mritify.online</a> or <a href="/contact" style={{ color: 'var(--accent)', fontWeight: 700 }}>use the contact page</a>. We will update this page and the “Last updated” date when our practices change.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
