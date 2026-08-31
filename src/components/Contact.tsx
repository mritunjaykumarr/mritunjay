import React, { useState, useEffect } from 'react';
import { SendHorizonal, MessageSquare, Mail, X } from 'lucide-react';
import { LinkedinIcon } from './SocialIcons';

interface ContactProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Contact({ isOpen, onClose }: ContactProps) {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

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
        setStatus('✓ Message sent successfully! I will reply within 24 hours.');
        form.reset();
      } else {
        setStatus('Something went wrong. Please email me at me@mritify.online.');
      }
    } catch {
      setStatus('Something went wrong. Please email me at me@mritify.online.');
    } finally {
      setLoading(false);
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div 
          className="modal-overlay open" 
          onClick={(e) => e.target === e.currentTarget && onClose()}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'var(--bg-overlay, rgba(0, 0, 0, 0.75))',
            backdropFilter: 'blur(16px)',
            display: 'grid',
            placeItems: 'center',
            padding: '1rem'
          }}
        >
          <div 
            className="modal-box" 
            style={{
              maxWidth: '780px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '0',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-lg)',
              position: 'relative'
            }}
          >
            <button
              onClick={onClose}
              aria-label="Close modal"
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={16} />
            </button>

            <div className="contact-modal-grid">
              {/* Left Info Panel */}
              <div style={{ padding: 'clamp(1.5rem, 3vw, 2.25rem)', background: 'var(--surface-2)' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: 'var(--text)', fontWeight: 600 }}>
                  Let&apos;s talk about your product
                </h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '0.88rem', lineHeight: 1.6 }}>
                  I&apos;m always open to discussing new engineering projects, AI integrations, or high-impact technical roles.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <a href="mailto:me@mritify.online" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text)', textDecoration: 'none', fontSize: '0.86rem' }}>
                    <Mail size={16} style={{ color: 'var(--text-muted)' }} />
                    <span>me@mritify.online <small style={{ color: 'var(--text-muted)' }}>(Direct)</small></span>
                  </a>
                  <a href="mailto:support@mritify.online" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text)', textDecoration: 'none', fontSize: '0.86rem' }}>
                    <Mail size={16} style={{ color: 'var(--text-muted)' }} />
                    <span>support@mritify.online <small style={{ color: 'var(--text-muted)' }}>(Support)</small></span>
                  </a>
                  <a href="mailto:info@mritify.online" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text)', textDecoration: 'none', fontSize: '0.86rem' }}>
                    <Mail size={16} style={{ color: 'var(--text-muted)' }} />
                    <span>info@mritify.online <small style={{ color: 'var(--text-muted)' }}>(Info)</small></span>
                  </a>
                  <a href="https://wa.me/919470880956" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text)', textDecoration: 'none', fontSize: '0.86rem' }}>
                    <MessageSquare size={16} style={{ color: 'var(--text-muted)' }} />
                    <span>+91 94708 80956</span>
                  </a>
                  <a href="https://www.linkedin.com/in/mritunjay-kumar-22a7a828b" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text)', textDecoration: 'none', fontSize: '0.86rem' }}>
                    <LinkedinIcon size={16} />
                    <span>LinkedIn Profile</span>
                  </a>
                </div>
              </div>

              {/* Right Form */}
              <div style={{ padding: 'clamp(1.5rem, 3vw, 2.25rem)', background: 'var(--card)' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input type="hidden" name="access_key" value="af71a9aa-dfeb-4439-a91b-afa7bc2e17d8" />
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label htmlFor="contact-name" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>Full Name</label>
                    <input type="text" name="name" placeholder="Your Name" required id="contact-name" style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.88rem' }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label htmlFor="contact-email" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>Email Address</label>
                    <input type="email" name="email" placeholder="you@company.com" required id="contact-email" style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.88rem' }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label htmlFor="contact-message" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>Your Message</label>
                    <textarea name="message" rows={4} placeholder="Tell me about your project goals..." required id="contact-message" style={{ padding: '0.65rem 0.85rem', borderRadius: '8px', background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.88rem', resize: 'vertical' }} />
                  </div>

                  <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                    <span>{loading ? 'Sending…' : 'Send Message'}</span>
                    <SendHorizonal size={15} />
                  </button>

                  {status && (
                    <div style={{ fontSize: '0.82rem', color: status.includes('✓') ? '#22c55e' : '#f87171' }}>
                      {status}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
