import { Link } from 'react-router-dom';
import { Mail, ChevronRight, MapPin, Phone } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from './SocialIcons';

export default function Footer() {
  return (
    <footer className="footer reveal">
      <div className="container">
        <div className="footer-shell">
          <div className="footer-brand-card">
            <Link to="/" className="footer-brand-logo">
              <span>MRITUNJAY</span>
              <span className="logo-dot" />
            </Link>
            <h3 className="footer-brand-title">Full Stack Developer</h3>
            <p className="footer-tagline">
              Premium frontend work, product-thinking, and AI-informed storytelling presented in a clean modern identity.
            </p>
            <div className="footer-socials">
              <a href="https://github.com/mritunjaykumarr" target="_blank" rel="noreferrer" aria-label="GitHub"><GithubIcon size={18} /></a>
              <a href="https://www.linkedin.com/in/mritunjay-kumar-22a7a828b" target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedinIcon size={18} /></a>
              <a href="https://www.instagram.com/mritunjaykumar.dev/" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon size={18} /></a>
              <a href="mailto:me@mritify.online" aria-label="Email"><Mail size={18} /></a>
            </div>
          </div>

          <div className="footer-links-grid">
            <div className="footer-col">
              <h4 className="footer-col-title">Navigation</h4>
              <div className="footer-col-links">
                <Link to="/" className="footer-col-link"><ChevronRight size={12} /> Home</Link>
                <Link to="/about" className="footer-col-link"><ChevronRight size={12} /> About</Link>
                <Link to="/experience" className="footer-col-link"><ChevronRight size={12} /> Experience</Link>
                <Link to="/projects" className="footer-col-link"><ChevronRight size={12} /> Projects</Link>
                <Link to="/skills" className="footer-col-link"><ChevronRight size={12} /> Skills</Link>
                <Link to="/certifications" className="footer-col-link"><ChevronRight size={12} /> Certifications</Link>
                <Link to="/blog" className="footer-col-link"><ChevronRight size={12} /> Blog</Link>
                <Link to="/pricing" className="footer-col-link"><ChevronRight size={12} /> Services & Pricing</Link>
                <Link to="/prince-ai" className="footer-col-link"><ChevronRight size={12} /> Prince AI</Link>
                <Link to="/contact" className="footer-col-link"><ChevronRight size={12} /> Contact</Link>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Tech Stack</h4>
              <div className="footer-col-links">
                <span className="footer-col-link"><ChevronRight size={12} /> React 19 + TypeScript</span>
                <span className="footer-col-link"><ChevronRight size={12} /> Node.js + Express</span>
                <span className="footer-col-link"><ChevronRight size={12} /> OpenRouter AI</span>
                <span className="footer-col-link"><ChevronRight size={12} /> Supabase PostgreSQL</span>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Contact & Support</h4>
              <div className="footer-col-links">
                <span className="footer-col-link"><MapPin size={12} /> Bihar / New Delhi, India</span>
                <a href="tel:+919470880956" className="footer-col-link"><Phone size={12} /> +91 94708 80956</a>
                <a href="mailto:me@mritify.online" className="footer-col-link" title="Direct Email"><Mail size={12} /> me@mritify.online (Direct)</a>
                <a href="mailto:support@mritify.online" className="footer-col-link" title="Tech Support"><Mail size={12} /> support@mritify.online (Support)</a>
                <a href="mailto:info@mritify.online" className="footer-col-link" title="General Info"><Mail size={12} /> info@mritify.online (Info)</a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <div className="footer-copy">© {new Date().getFullYear()} <span className="accent">Mritunjay Kumar</span>. All rights reserved.</div>
          <div className="footer-tags">
            <span className="footer-tag">REACT 19</span>
            <span className="footer-tag">TYPESCRIPT</span>
            <span className="footer-tag">SUPABASE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
