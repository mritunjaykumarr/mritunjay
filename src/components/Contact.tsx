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
        setStatus('✓ Message sent successfully!');
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
        <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
          <div className="modal-box" style={{ maxWidth: '800px', padding: '0', overflow: 'hidden' }}>
            <button className="modal-close" onClick={onClose} aria-label="Close modal"><X size={18} /></button>
            <div className="contact-grid" style={{ gap: 0 }}>
              <div className="contact-left" style={{ padding: '2rem', background: 'var(--bg-elevated)' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Let's talk about your project</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.</p>
                
                <div className="contact-info-links" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <a href="mailto:me@mritify.online" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text)', textDecoration: 'none' }}>
                    <Mail size={18} className="grad-text" /> <span>me@mritify.online <small style={{ color: 'var(--text-muted)' }}>(Direct)</small></span>
                  </a>
                  <a href="mailto:support@mritify.online" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text)', textDecoration: 'none' }}>
                    <Mail size={18} className="grad-text" /> <span>support@mritify.online <small style={{ color: 'var(--text-muted)' }}>(Support)</small></span>
                  </a>
                  <a href="mailto:info@mritify.online" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text)', textDecoration: 'none' }}>
                    <Mail size={18} className="grad-text" /> <span>info@mritify.online <small style={{ color: 'var(--text-muted)' }}>(Info)</small></span>
                  </a>
                  <a href="https://wa.me/919470880956" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text)', textDecoration: 'none' }}>
                    <MessageSquare size={18} className="grad-text" /> <span>+91 94708 80956</span>
                  </a>
                  <a href="https://www.linkedin.com/in/mritunjay-kumar-22a7a828b" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text)', textDecoration: 'none' }}>
                    <LinkedinIcon size={18} /> <span>LinkedIn Profile</span>
                  </a>
                </div>
              </div>

              <div className="contact-right" style={{ padding: '2rem' }}>
                <form className="contact-form" onSubmit={handleSubmit} id="contactForm">
                  <input type="hidden" name="access_key" value="af71a9aa-dfeb-4439-a91b-afa7bc2e17d8" />
                  <div className="form-header" style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Send a Message</h3>
                  </div>

                  <div className="float-field">
                    <input type="text" name="name" placeholder=" " required id="contact-name" />
                    <label htmlFor="contact-name">Full Name</label>
                  </div>

                  <div className="float-field">
                    <input type="email" name="email" placeholder=" " required id="contact-email" />
                    <label htmlFor="contact-email">Email Address</label>
                  </div>

                  <div className="float-field">
                    <textarea name="message" rows={4} placeholder=" " required id="contact-message" />
                    <label htmlFor="contact-message">Your Message</label>
                  </div>

                  <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                    <span>{loading ? 'Sending...' : 'Send Message'}</span>
                    <SendHorizonal size={16} />
                  </button>

                  <div className="form-status" style={{ marginTop: '0.75rem' }}>
                    {status && <span className={status.includes('✓') ? 'success' : 'error'}>{status}</span>}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
