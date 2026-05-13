import React, { useState } from 'react';

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
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      });
      const result = await res.json();
      if (result.success) {
        setStatus('✓ Message sent successfully!');
        form.reset();
      } else {
        setStatus('Something went wrong. Please try again.');
      }
    } catch (err) {
      setStatus('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="section-eyebrow">09 · Contact</div>
        <h2 className="section-title reveal">Let's <span className="grad">Connect</span></h2>
        
        <div className="contact-grid">
          <div className="contact-left reveal">
            <div className="contact-img-card">
              <img src="/assets/contactus.png" alt="Contact" className="contact-photo" />
              <div className="contact-overlay-text">
                <h3>Let's talk about your project</h3>
                <p>I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.</p>
                <div className="contact-info-links">
                  <a href="https://wa.me/919470880956" target="_blank" rel="noreferrer">
                    <i className="fa-brands fa-whatsapp"></i>
                    <span>+91 94708 80956</span>
                  </a>
                  <a href="https://www.linkedin.com/in/mritunjay-kumar-22a7a828b" target="_blank" rel="noreferrer">
                    <i className="fa-brands fa-linkedin-in"></i>
                    <span>LinkedIn Profile</span>
                  </a>
                  <a href="mailto:mritunjaykumar2025@gmail.com">
                    <i className="fa-solid fa-envelope"></i>
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
                <h3>Message Intelligence</h3>
                <p>Send a direct transmission to my terminal.</p>
              </div>

              <div className="float-field">
                <input type="text" name="name" placeholder=" " required />
                <label>Full Name</label>
                <div className="field-line"></div>
              </div>

              <div className="float-field">
                <input type="email" name="email" placeholder=" " required />
                <label>Email Address</label>
                <div className="field-line"></div>
              </div>

              <div className="float-field">
                <textarea name="message" rows={4} placeholder=" " required></textarea>
                <label>Your Message</label>
                <div className="field-line"></div>
              </div>

              <button type="submit" className="btn-glow" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
                <i className="fa-solid fa-paper-plane"></i>
              </button>
              
              <div className="form-status" style={{ marginTop: '12px' }}>
                {status && <span className={status.includes('✓') ? 'success' : 'error'}>{status}</span>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
