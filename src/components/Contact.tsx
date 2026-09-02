import React, { useState, useEffect } from 'react';
import { SendHorizonal, MessageSquare, Mail, X, Check, Copy, Sparkles, ExternalLink } from 'lucide-react';
import { LinkedinIcon } from './SocialIcons';

interface ContactProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChannelItem {
  id: string;
  label: string;
  value: string;
  href: string;
  isExternal?: boolean;
  Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  tag: string;
}

const CHANNELS: ChannelItem[] = [
  {
    id: 'direct',
    label: 'Direct / Founder Email',
    value: 'me@mritify.online',
    href: 'mailto:me@mritify.online',
    Icon: Mail,
    tag: 'Direct'
  },
  {
    id: 'support',
    label: 'Client & Tech Support',
    value: 'support@mritify.online',
    href: 'mailto:support@mritify.online',
    Icon: Mail,
    tag: 'Support'
  },
  {
    id: 'info',
    label: 'General Inquiries',
    value: 'info@mritify.online',
    href: 'mailto:info@mritify.online',
    Icon: Mail,
    tag: 'Info'
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp Direct Chat',
    value: '+91 94708 80956',
    href: 'https://wa.me/919470880956',
    isExternal: true,
    Icon: MessageSquare,
    tag: 'Chat'
  },
  {
    id: 'linkedin',
    label: 'LinkedIn Profile',
    value: 'Mritunjay Kumar',
    href: 'https://www.linkedin.com/in/mritunjay-kumar-22a7a828b',
    isExternal: true,
    Icon: LinkedinIcon as any,
    tag: 'Connect'
  }
];

export default function Contact({ isOpen, onClose }: ContactProps) {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileTab, setMobileTab] = useState<'form' | 'channels'>('form');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Lock body scroll and set class when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    setMobileTab('form');
    setStatus('');
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleCopy = (e: React.MouseEvent, id: string, text: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2200);
    }
  };

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

  if (!isOpen) return null;

  return (
    <div
      className="contact-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div className="contact-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="contact-modal-header">
          <div className="contact-modal-header-left">
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', flexShrink: 0, boxShadow: '0 0 8px #22c55e' }} />
            <div>
              <h2 id="contact-modal-title" className="contact-modal-title">
                Let&apos;s talk about your product
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="contact-modal-close-btn"
            aria-label="Close contact modal"
            type="button"
          >
            <X size={17} />
          </button>
        </div>

        {/* Mobile Segmented Switcher */}
        <div className="contact-modal-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === 'form'}
            className={`contact-tab-btn ${mobileTab === 'form' ? 'active' : ''}`}
            onClick={() => setMobileTab('form')}
          >
            <Mail size={14} />
            <span>Send Message</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === 'channels'}
            className={`contact-tab-btn ${mobileTab === 'channels' ? 'active' : ''}`}
            onClick={() => setMobileTab('channels')}
          >
            <Sparkles size={14} />
            <span>Direct Channels (5)</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="contact-modal-body">
          <div className="contact-modal-grid">
            {/* Left Info Column (Always on Desktop; Shown on Mobile when Tab == 'channels') */}
            <div
              className="contact-modal-col-info"
              style={{
                display: mobileTab === 'channels' ? 'flex' : undefined
              }}
            >
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
                  I&apos;m always open to discussing new engineering projects, AI workflows, or high-impact technical roles.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {CHANNELS.map((ch) => {
                    const isCopied = copiedId === ch.id;
                    return (
                      <a
                        key={ch.id}
                        href={ch.href}
                        target={ch.isExternal ? '_blank' : undefined}
                        rel={ch.isExternal ? 'noreferrer' : undefined}
                        className="contact-channel-item"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                          <ch.Icon size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                          <div style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <div style={{ fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {ch.value}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                              {ch.label}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                          {!ch.isExternal && (
                            <button
                              type="button"
                              onClick={(e) => handleCopy(e, ch.id, ch.value)}
                              title="Copy to clipboard"
                              aria-label={`Copy ${ch.value}`}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: isCopied ? '#22c55e' : 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'grid',
                                placeItems: 'center',
                                borderRadius: '4px'
                              }}
                            >
                              {isCopied ? <Check size={14} /> : <Copy size={14} />}
                            </button>
                          )}
                          {ch.isExternal && <ExternalLink size={13} style={{ color: 'var(--text-muted)' }} />}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>

              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span>📍 India • IST (UTC+5:30)</span>
                <span style={{ color: '#22c55e', fontWeight: 500 }}>⚡ ~12h reply</span>
              </div>
            </div>

            {/* Right Form Column (Always on Desktop; Shown on Mobile when Tab == 'form') */}
            <div
              className="contact-modal-col-form"
              style={{
                display: mobileTab === 'form' ? 'flex' : undefined
              }}
            >
              {/* Quick Contact Pills for rapid 1-tap mobile reach */}
              <div className="contact-quick-pills">
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500, marginRight: '4px' }}>
                  Quick reach:
                </span>
                <a
                  href="https://wa.me/919470880956"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-quick-pill whatsapp"
                >
                  <MessageSquare size={13} />
                  <span>WhatsApp</span>
                </a>
                <a
                  href="mailto:me@mritify.online"
                  className="contact-quick-pill"
                >
                  <Mail size={13} />
                  <span>Direct Mail</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/mritunjay-kumar-22a7a828b"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-quick-pill"
                >
                  <LinkedinIcon size={13} />
                  <span>LinkedIn</span>
                </a>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <input type="hidden" name="access_key" value="af71a9aa-dfeb-4439-a91b-afa7bc2e17d8" />
                <input type="hidden" name="subject" value="New Inquiry from Portfolio Contact Modal" />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="contact-modal-name" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="contact-modal-name"
                    placeholder="Your Name"
                    required
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                      fontSize: '0.88rem',
                      outline: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="contact-modal-email" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="contact-modal-email"
                    placeholder="you@company.com"
                    required
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                      fontSize: '0.88rem',
                      outline: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="contact-modal-msg" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    id="contact-modal-msg"
                    rows={3}
                    placeholder="Tell me about your project, timeline, or role..."
                    required
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                      fontSize: '0.88rem',
                      resize: 'vertical',
                      outline: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    marginTop: '0.25rem',
                    padding: '0.75rem 1rem',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  <span>{loading ? 'Sending Message…' : 'Send Message'}</span>
                  <SendHorizonal size={15} />
                </button>

                {status && (
                  <div
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      background: status.includes('✓') ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                      border: `1px solid ${status.includes('✓') ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                      color: status.includes('✓') ? '#22c55e' : '#f87171'
                    }}
                  >
                    {status}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
