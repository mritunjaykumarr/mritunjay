import React, { useState } from 'react';
import { SendHorizonal, MessageSquare, Linkedin, Mail } from 'lucide-react';

export default function Contact() {
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

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="section-eyebrow">Contact</div>
        <h2 className="section-title reveal">Let's <span className="grad">Connect</span></h2>

        <div className="contact-grid">
          <div className="contact-left reveal">
            <div className="contact-img-card">
              <img src="/assets/contactus.png" alt="Contact" className="contact-photo" loading="lazy" />
              <div className="contact-overlay-text">
                <h3>Let's talk about your project</h3>
                <p>I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.</p>
                <div className="contact-info-links">
                  <a href="https://wa.me/919470880956" target="_blank" rel="noreferrer">
                    <MessageSquare size={16} />
                    <span>+91 94708 80956</span>
                  </a>
                  <a href="https://www.linkedin.com/in/mritunjay-kumar-22a7a828b" target="_blank" rel="noreferrer">
                    <Linkedin size={16} />
                    <span>LinkedIn Profile</span>
                  </a>
                  <a href="mailto:mritunjaykumar2025@gmail.com">
                    <Mail size={16} />
                    <span>mritunjaykumar2025@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-right reveal reveal-right">
            <form className="contact-form" onSubmit={handleSubmit} id="contactForm">
              <input type="hidden" name="access_key" value="97011d8a-de48-4384-9c59-bf750ab854ab" />
              <div className="form-header">
                <h3>Send a Message</h3>
                <p>Fill in the form and I'll get back to you shortly.</p>
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
    </section>
  );
}
