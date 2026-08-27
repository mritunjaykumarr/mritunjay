import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SendHorizonal, MessageSquare, Mail, MapPin, Clock, ChevronDown, Sparkles } from 'lucide-react';
import { LinkedinIcon } from '../components/SocialIcons';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO';

export default function ContactPage() {
  usePortfolioMotion();
  useSEO(SEO_CONFIGS.contact);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const json = JSON.stringify(data);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: json
      });
      const result = await res.json();
      if (result.success) {
        setStatus('✓ Message sent successfully! I will respond within 24 hours.');
        (form as HTMLFormElement).reset();
      } else {
        setStatus('Something went wrong. Please email me at me@mritify.online.');
      }
    } catch {
      setStatus('Something went wrong. Please email me at me@mritify.online.');
    } finally {
      setLoading(false);
    }
  };

  const contactFaqs = [
    { q: 'What is your typical response time?', a: 'I aim to respond to all inquiries within 12 to 24 hours.' },
    { q: 'Are you available for remote work globally?', a: 'Yes, I work seamlessly with international clients across time zones via async tools, Slack, WhatsApp, and GitHub.' },
    { q: 'Can we schedule a discovery call?', a: 'Absolutely! Send a quick message via the form or email, and I will share a direct calendar scheduling link.' }
  ];

  return (
    <div className="page-wrapper contact-page" style={{ paddingTop: '6rem', paddingBottom: '5rem', background: '#000000', color: '#ffffff', minHeight: '100vh' }}>
      {/* Page Header */}
      <section className="page-header" style={{ padding: '2rem 0 3rem' }}>
        <div className="container">
          <div className="breadcrumb" style={{ fontSize: '0.82rem', color: '#888888', marginBottom: '1rem' }}>
            <Link to="/" style={{ color: '#888888', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#ffffff' }}>Contact</span>
          </div>

          <div className="page-header-content">
            <div className="badge-playful" style={{ marginBottom: '1rem' }}>
              <MessageSquare size={13} />
              <span>Direct Communication</span>
            </div>
            <h1 className="page-title" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', fontWeight: 600, letterSpacing: '-0.04em', margin: '0.5rem 0 1rem' }}>
              Let&apos;s build something <em>extraordinary.</em>
            </h1>
            <p className="page-subtitle" style={{ fontSize: '1.05rem', color: '#9a9a9a', maxWidth: '600px', lineHeight: 1.65 }}>
              Whether you have a specific product in mind, want to discuss engineering contracts, or explore a fullstack role, my inbox is open.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="section" style={{ padding: '2rem 0 4rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
            {/* Left Channel Information */}
            <div>
              <div style={{ padding: '1.5rem', marginBottom: '1.5rem', background: '#0a0a0a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                  <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#ffffff' }}>Available for Select Projects</span>
                </div>
                <p style={{ fontSize: '0.86rem', color: '#9a9a9a', marginTop: '0.5rem', lineHeight: 1.6, margin: '0.5rem 0 0' }}>
                  Currently accepting new product engineering contracts, full-stack roles, and AI workflow consultancies.
                </p>
              </div>

              <div style={{ padding: '1.75rem', marginBottom: '1.5rem', background: '#0a0a0a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.25rem', color: '#ffffff' }}>Direct Channels</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {[
                    { href: 'mailto:me@mritify.online', label: 'Direct / Founder Email', value: 'me@mritify.online', Icon: Mail },
                    { href: 'mailto:support@mritify.online', label: 'Client & Tech Support', value: 'support@mritify.online', Icon: Mail },
                    { href: 'mailto:info@mritify.online', label: 'General Inquiries & Info', value: 'info@mritify.online', Icon: Mail },
                    { href: 'https://wa.me/919470880956', label: 'WhatsApp / Phone', value: '+91 94708 80956', Icon: MessageSquare },
                    { href: 'https://www.linkedin.com/in/mritunjay-kumar-22a7a828b', label: 'LinkedIn', value: 'Mritunjay Kumar', Icon: LinkedinIcon as any },
                  ].map(item => (
                    <a
                      key={item.value}
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel="noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px', color: '#ffffff',
                        textDecoration: 'none', padding: '0.75rem', borderRadius: '8px',
                        background: '#121212', border: '1px solid rgba(255, 255, 255, 0.08)'
                      }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: '6px', background: 'rgba(255, 255, 255, 0.08)', display: 'grid', placeItems: 'center', color: '#ffffff', flexShrink: 0 }}>
                        <item.Icon size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</div>
                        <div style={{ fontWeight: 500, fontSize: '0.88rem', color: '#ffffff' }}>{item.value}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div style={{ padding: '1.5rem', background: '#0a0a0a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff', fontSize: '0.88rem' }}>
                    <MapPin size={15} /> Bihar / New Delhi, India
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#9a9a9a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> IST (UTC+5:30)
                  </div>
                </div>
                <div style={{ marginTop: '0.75rem', fontSize: '1.2rem', fontWeight: 600, color: '#ffffff' }}>
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} IST
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div>
              <div style={{ padding: '2.25rem', background: '#0a0a0a', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '14px' }}>
                <div className="badge-playful" style={{ marginBottom: '0.75rem' }}>
                  <Sparkles size={12} />
                  <span>Send a message</span>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 600, marginBottom: '0.5rem', color: '#ffffff' }}>
                  Send a Direct Message
                </h3>
                <p style={{ color: '#9a9a9a', fontSize: '0.88rem', marginBottom: '1.75rem' }}>
                  Fill out the form below and your message will land directly in my priority inbox.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input type="hidden" name="access_key" value="af71a9aa-dfeb-4439-a91b-afa7bc2e17d8" />
                  
                  <div style={{ display: 'grid', gap: '4px' }}>
                    <label htmlFor="c-page-name" style={{ fontSize: '0.76rem', color: '#9a9a9a' }}>Full Name</label>
                    <input type="text" name="name" placeholder="John Doe" required id="c-page-name" />
                  </div>

                  <div style={{ display: 'grid', gap: '4px' }}>
                    <label htmlFor="c-page-email" style={{ fontSize: '0.76rem', color: '#9a9a9a' }}>Email Address</label>
                    <input type="email" name="email" placeholder="john@company.com" required id="c-page-email" />
                  </div>

                  <div style={{ display: 'grid', gap: '4px' }}>
                    <label htmlFor="c-page-subject" style={{ fontSize: '0.76rem', color: '#9a9a9a' }}>Subject / Project Scope</label>
                    <input type="text" name="subject" placeholder="New product build, AI workflow, full stack role..." id="c-page-subject" />
                  </div>

                  <div style={{ display: 'grid', gap: '4px' }}>
                    <label htmlFor="c-page-message" style={{ fontSize: '0.76rem', color: '#9a9a9a' }}>Your Message</label>
                    <textarea name="message" rows={5} placeholder="Tell me about your project goals, timelines, and details..." required id="c-page-message" />
                  </div>

                  <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                    <span>{loading ? 'Sending Message…' : 'Send Message'}</span>
                    <SendHorizonal size={15} />
                  </button>

                  {status && (
                    <div style={{
                      marginTop: '0.75rem', textAlign: 'center', padding: '0.75rem', borderRadius: '8px',
                      background: status.includes('✓') ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid ' + (status.includes('✓') ? '#22c55e' : '#ef4444'),
                      color: '#ffffff', fontSize: '0.85rem'
                    }}>
                      {status}
                    </div>
                  )}
                </form>
              </div>

              {/* FAQs accordion */}
              <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: '#0a0a0a', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff', marginBottom: '1rem' }}>Frequently Asked Questions</h4>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {contactFaqs.map((faq, i) => (
                    <div key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.75rem' }}>
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        style={{
                          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          textAlign: 'left', color: '#ffffff', fontSize: '0.86rem', fontWeight: 500, cursor: 'pointer', padding: 0
                        }}
                      >
                        <span>{faq.q}</span>
                        <ChevronDown size={14} style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                      </button>
                      {openFaq === i && (
                        <p style={{ fontSize: '0.82rem', color: '#9a9a9a', marginTop: '0.5rem', lineHeight: 1.6, margin: '0.5rem 0 0' }}>
                          {faq.a}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
