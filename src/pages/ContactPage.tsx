import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  SendHorizonal, MessageSquare, Mail, MapPin, Clock, 
  ChevronDown 
} from 'lucide-react';
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
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: json
      });
      const result = await res.json();
      if (result.success) {
        setStatus('✓ Message sent successfully! I will respond within 24 hours.');
        form.reset();
      } else {
        setStatus('Something went wrong. Please try again.');
      }
    } catch {
      setStatus('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactFaqs = [
    {
      q: 'What is your typical response time?',
      a: 'I aim to respond to all inquiries within 12 to 24 hours.'
    },
    {
      q: 'Are you available for remote work globally?',
      a: 'Yes, I work seamlessly with international clients across various time zones via Async tools, Slack, WhatsApp, and GitHub.'
    },
    {
      q: 'Can we schedule a discovery call?',
      a: 'Absolutely! Send a quick message via the form or email, and I will share a direct calendar scheduling link.'
    }
  ];

  return (
    <div className="page-wrapper contact-page" style={{ paddingTop: '5.5rem', paddingBottom: '5rem' }}>
      {/* Header Banner */}
      <section className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span className="current">Contact</span>
          </div>
          <div className="page-header-content reveal">
            <div className="section-eyebrow"><MessageSquare size={14} /> Direct Communication</div>
            <h1 className="page-title">
              Let's build something <span className="grad">extraordinary</span>
            </h1>
            <p className="page-subtitle">
              Whether you have a specific project in mind, want to hire me, or simply wish to say hello, my inbox is always open.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <section className="section" style={{ padding: '3rem 0 4rem' }}>
        <div className="container">
          <div className="contact-main-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
            
            {/* Left Contact Information */}
            <div className="contact-info-col reveal">
              
              {/* Availability Card */}
              <div className="card-glass" style={{ padding: '1.5rem', borderRadius: 'var(--r-md)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                  <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)' }}>Available for Select Projects</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-2)', marginTop: '0.5rem', lineHeight: 1.5 }}>
                  Currently accepting new freelance projects, fullstack roles, and technical consultancies.
                </p>
              </div>

              {/* Communication Channels */}
              <div className="card-glass" style={{ padding: '2rem', borderRadius: 'var(--r-md)', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--text)' }}>Direct Channels</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <a 
                    href="mailto:me@mritify.online"
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--text)', textDecoration: 'none', padding: '0.75rem', borderRadius: 'var(--r-sm)', background: 'var(--bg-elevated)', transition: 'transform 0.2s ease' }}
                  >
                    <div className="icon-box" style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <Mail size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Direct / Founder Email</div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>me@mritify.online</div>
                    </div>
                  </a>

                  <a 
                    href="mailto:support@mritify.online"
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--text)', textDecoration: 'none', padding: '0.75rem', borderRadius: 'var(--r-sm)', background: 'var(--bg-elevated)', transition: 'transform 0.2s ease' }}
                  >
                    <div className="icon-box" style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <Mail size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Client & Technical Support</div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>support@mritify.online</div>
                    </div>
                  </a>

                  <a 
                    href="mailto:info@mritify.online"
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--text)', textDecoration: 'none', padding: '0.75rem', borderRadius: 'var(--r-sm)', background: 'var(--bg-elevated)', transition: 'transform 0.2s ease' }}
                  >
                    <div className="icon-box" style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <Mail size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>General Inquiries & Info</div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>info@mritify.online</div>
                    </div>
                  </a>

                  <a 
                    href="https://wa.me/919470880956" 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--text)', textDecoration: 'none', padding: '0.75rem', borderRadius: 'var(--r-sm)', background: 'var(--bg-elevated)', transition: 'transform 0.2s ease' }}
                  >
                    <div className="icon-box" style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>WhatsApp / Phone</div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>+91 94708 80956</div>
                    </div>
                  </a>

                  <a 
                    href="https://www.linkedin.com/in/mritunjay-kumar-22a7a828b" 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--text)', textDecoration: 'none', padding: '0.75rem', borderRadius: 'var(--r-sm)', background: 'var(--bg-elevated)', transition: 'transform 0.2s ease' }}
                  >
                    <div className="icon-box" style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                      <LinkedinIcon size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>LinkedIn</div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>Mritunjay Kumar</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Timezone & Location Card */}
              <div className="card-glass" style={{ padding: '1.5rem', borderRadius: 'var(--r-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text)' }}>
                    <MapPin size={16} className="grad-text" />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Bihar / New Delhi, India</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} /> IST (UTC+5:30)
                  </div>
                </div>
                <div style={{ marginTop: '0.75rem', fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>

            </div>

            {/* Right Message Form */}
            <div className="contact-form-col reveal reveal-right">
              <div className="card-glass" style={{ padding: '2.5rem', borderRadius: 'var(--r-lg)' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text)' }}>Send a Direct Message</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '2rem' }}>
                  Fill out the form below and your message will land directly in my priority inbox.
                </p>

                <form onSubmit={handleSubmit} className="contact-form" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <input type="hidden" name="access_key" value="af71a9aa-dfeb-4439-a91b-afa7bc2e17d8" />

                  <div className="float-field">
                    <input type="text" name="name" placeholder=" " required id="c-page-name" />
                    <label htmlFor="c-page-name">Full Name</label>
                  </div>

                  <div className="float-field">
                    <input type="email" name="email" placeholder=" " required id="c-page-email" />
                    <label htmlFor="c-page-email">Email Address</label>
                  </div>

                  <div className="float-field">
                    <input type="text" name="subject" placeholder=" " id="c-page-subject" />
                    <label htmlFor="c-page-subject">Subject / Project Scope</label>
                  </div>

                  <div className="float-field">
                    <textarea name="message" rows={5} placeholder=" " required id="c-page-message" />
                    <label htmlFor="c-page-message">Your Message</label>
                  </div>

                  <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                    <span>{loading ? 'Sending...' : 'Send Message'}</span>
                    <SendHorizonal size={16} />
                  </button>

                  {status && (
                    <div className="form-status" style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                      <span className={status.includes('✓') ? 'success' : 'error'} style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                        {status}
                      </span>
                    </div>
                  )}
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Accordion FAQ */}
      <section className="section bg-elevated" style={{ padding: '4rem 0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="section-eyebrow text-center">Helpful Information</div>
          <h2 className="section-title text-center reveal">Communication <span className="grad">FAQs</span></h2>

          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {contactFaqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="card-glass reveal" 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                style={{ padding: '1.25rem 1.5rem', borderRadius: 'var(--r-md)', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--text)', margin: 0, fontWeight: 600 }}>{faq.q}</h3>
                  <ChevronDown size={18} style={{ transform: openFaq === idx ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', color: 'var(--primary)' }} />
                </div>
                {openFaq === idx && (
                  <p style={{ marginTop: '0.75rem', color: 'var(--text-2)', fontSize: '0.92rem', lineHeight: 1.6, paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
