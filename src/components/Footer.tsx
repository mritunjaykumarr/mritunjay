import { Link } from 'react-router-dom';
import { Mail, ChevronRight, MapPin, Phone, Code2 } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from './SocialIcons';

export default function Footer() {
  return (
    <footer className="footer" style={{ background: '#000000', borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '4rem', paddingBottom: '3rem', position: 'relative' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '3rem', paddingBottom: '3rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {/* Brand Info */}
          <div>
            <Link to="/" style={{ textDecoration: 'none', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '26px', height: '26px', borderRadius: '5px',
                background: 'linear-gradient(135deg, #222222, #000000)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'grid', placeItems: 'center', color: '#ffffff'
              }}>
                <Code2 size={14} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
                MRITUNJAY KUMAR
              </span>
            </Link>

            <h3 style={{ fontSize: '0.92rem', color: '#ffffff', marginTop: '0.85rem', fontWeight: 500 }}>
              AI Engineer & Full Stack Developer
            </h3>
            <p style={{ color: '#9a9a9a', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '0.5rem', maxWidth: '340px' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {/* Column 1: Navigation */}
            <div>
              <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#777777', marginBottom: '1rem', fontWeight: 600 }}>
                Navigation
              </h4>
              <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.85rem' }}>
                <Link to="/" style={{ color: '#cccccc', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: '#666666' }} /> Home
                </Link>
                <Link to="/about" style={{ color: '#cccccc', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: '#666666' }} /> About
                </Link>
                <Link to="/projects" style={{ color: '#cccccc', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: '#666666' }} /> Projects
                </Link>
                <Link to="/skills" style={{ color: '#cccccc', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: '#666666' }} /> Skills
                </Link>
                <Link to="/experience" style={{ color: '#cccccc', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: '#666666' }} /> Experience
                </Link>
                <Link to="/certifications" style={{ color: '#cccccc', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: '#666666' }} /> Certifications
                </Link>
                <Link to="/prince-ai" style={{ color: '#cccccc', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: '#666666' }} /> Prince AI
                </Link>
                <Link to="/contact" style={{ color: '#cccccc', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: '#666666' }} /> Contact
                </Link>
              </div>
            </div>

            {/* Column 2: Tech Stack */}
            <div>
              <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#777777', marginBottom: '1rem', fontWeight: 600 }}>
                Core Technologies
              </h4>
              <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.85rem', color: '#9a9a9a' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: '#666666' }} /> React 19 + TypeScript
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: '#666666' }} /> Node.js & Express
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: '#666666' }} /> OpenRouter & Gemini AI
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: '#666666' }} /> Supabase & PostgreSQL
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: '#666666' }} /> Socket.io Realtime
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={13} style={{ color: '#666666' }} /> Gmail API & Automation
                </span>
              </div>
            </div>

            {/* Column 3: Contact & Support */}
            <div>
              <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#777777', marginBottom: '1rem', fontWeight: 600 }}>
                Contact Details
              </h4>
              <div style={{ display: 'grid', gap: '0.6rem', fontSize: '0.85rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9a9a9a' }}>
                  <MapPin size={14} /> India · Available Globally
                </span>
                <a href="tel:+919470880956" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff', textDecoration: 'none' }}>
                  <Phone size={14} /> +91 94708 80956
                </a>
                <a href="mailto:me@mritify.online" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff', textDecoration: 'none' }}>
                  <Mail size={14} /> me@mritify.online
                </a>
                <a href="mailto:support@mritify.online" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9a9a9a', textDecoration: 'none' }}>
                  <Mail size={14} /> support@mritify.online
                </a>
                <a href="mailto:info@mritify.online" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9a9a9a', textDecoration: 'none' }}>
                  <Mail size={14} /> info@mritify.online
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingTop: '1.75rem', fontSize: '0.82rem', color: '#888888' }}>
          <div>
            © {new Date().getFullYear()} <span style={{ color: '#ffffff', fontWeight: 600 }}>Mritunjay Kumar</span>. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            <Link to="/privacy-policy" style={{ color: '#888888', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/terms-and-conditions" style={{ color: '#888888', textDecoration: 'none' }}>Terms & Conditions</Link>
            <Link to="/disclaimer" style={{ color: '#888888', textDecoration: 'none' }}>Disclaimer</Link>
            <Link to="/contact" style={{ color: '#888888', textDecoration: 'none' }}>Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
