import { Link } from 'react-router-dom';
import { Mail, ChevronRight, MapPin, Phone, Code2 } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from './SocialIcons';

export default function Footer() {
  return (
    <footer className="footer" style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)', paddingTop: '4rem', paddingBottom: '4rem', position: 'relative' }}>
      <div className="container">
        <div className="footer-main-grid">
          {/* Brand Info */}
          <div>
            <Link to="/" style={{ textDecoration: 'none', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '26px', height: '26px', borderRadius: '5px',
                background: 'var(--accent)',
                border: '1px solid var(--border)',
                display: 'grid', placeItems: 'center', color: 'var(--accent-foreground)'
              }}>
                <Code2 size={14} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
                MRITUNJAY KUMAR
              </span>
            </Link>

            <h3 style={{ fontSize: '0.92rem', color: 'var(--text)', marginTop: '0.85rem', fontWeight: 500 }}>
              AI Engineer &amp; Full Stack Developer
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '0.5rem', maxWidth: '340px' }}>
              Engineering intelligent AI systems, high-volume automation tools, and scalable web architectures.
            </p>

            <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.25rem' }}>
              <a href="https://github.com/mritunjaykumarr" target="_blank" rel="noreferrer" aria-label="GitHub" className="icon-circle">
                <GithubIcon size={16} />
              </a>
              <a href="https://www.linkedin.com/in/mritunjay-kumar-22a7a828b" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="icon-circle">
                <LinkedinIcon size={16} />
              </a>
              <a href="https://www.instagram.com/mritunjaykumar.dev/" target="_blank" rel="noreferrer" aria-label="Instagram" className="icon-circle">
                <InstagramIcon size={16} />
              </a>
              <a href="mailto:me@mritify.online" aria-label="Email" className="icon-circle">
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="footer-links-grid">
            {/* Column 1: Navigation */}
            <div>
              <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 600 }}>
                Navigation
              </h4>
              <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.85rem' }}>
                <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: 'var(--border-strong)' }} /> Home
                </Link>
                <Link to="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: 'var(--border-strong)' }} /> About
                </Link>
                <Link to="/projects" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: 'var(--border-strong)' }} /> Projects
                </Link>
                <Link to="/skills" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: 'var(--border-strong)' }} /> Skills
                </Link>
                <Link to="/experience" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: 'var(--border-strong)' }} /> Experience
                </Link>
                <Link to="/certifications" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: 'var(--border-strong)' }} /> Certifications
                </Link>
                <Link to="/prince-ai" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: 'var(--border-strong)' }} /> Prince AI
                </Link>
                <Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: 'var(--border-strong)' }} /> Contact
                </Link>
              </div>
            </div>

            {/* Column 2: Tech Stack */}
            <div>
              <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 600 }}>
                Core Technologies
              </h4>
              <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: 'var(--border-strong)' }} /> React 19 + TypeScript
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: 'var(--border-strong)' }} /> Node.js &amp; Express
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: 'var(--border-strong)' }} /> OpenRouter &amp; Gemini AI
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: 'var(--border-strong)' }} /> Supabase &amp; PostgreSQL
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: 'var(--border-strong)' }} /> Socket.io Realtime
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: 'var(--border-strong)' }} /> Gmail API &amp; Automation
                </span>
              </div>
            </div>

            {/* Column 3: Contact & Support */}
            <div>
              <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 600 }}>
                Contact Details
              </h4>
              <div style={{ display: 'grid', gap: '0.6rem', fontSize: '0.85rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                  <MapPin size={14} /> India · Available Globally
                </span>
                <a href="tel:+919470880956" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text)', textDecoration: 'none' }}>
                  <Phone size={14} /> +91 94708 80956
                </a>
                <a href="mailto:me@mritify.online" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text)', textDecoration: 'none' }}>
                  <Mail size={14} /> me@mritify.online
                </a>
                <a href="mailto:support@mritify.online" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', textDecoration: 'none' }}>
                  <Mail size={14} /> support@mritify.online
                </a>
                <a href="mailto:info@mritify.online" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', textDecoration: 'none' }}>
                  <Mail size={14} /> info@mritify.online
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1.75rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <div>
            © {new Date().getFullYear()} <span style={{ color: 'var(--text)', fontWeight: 600 }}>Mritunjay Kumar</span>. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <Link to="/privacy-policy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/terms-and-conditions" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms &amp; Conditions</Link>
            <Link to="/disclaimer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Disclaimer</Link>
            <Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
