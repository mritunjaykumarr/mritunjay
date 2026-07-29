import { Mail, ChevronRight, MapPin, Phone } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from './SocialIcons';

export default function Footer() {
  return (
    <footer className="footer reveal">
      <div className="container">
        <div className="footer-shell">
          <div className="footer-brand-card">
            <a href="#home" className="footer-brand-logo">
              <span>MRITUNJAY</span>
              <span className="logo-dot" />
            </a>
            <h3 className="footer-brand-title">Full Stack Developer</h3>
            <p className="footer-tagline">
              Premium frontend work, product-thinking, and AI-informed storytelling presented in a clean modern identity.
            </p>
            <div className="footer-socials">
              <a href="https://github.com/mritunjaykumarr" target="_blank" rel="noreferrer" aria-label="GitHub"><GithubIcon size={18} /></a>
              <a href="https://www.linkedin.com/in/mritunjay-kumar-22a7a828b" target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedinIcon size={18} /></a>
              <a href="https://www.instagram.com/mritunjaykumar.dev/" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon size={18} /></a>
              <a href="mailto:mritunjaykumar2025@gmail.com" aria-label="Email"><Mail size={18} /></a>
            </div>
          </div>

          <div className="footer-links-grid">
            <div className="footer-col">
              <h4 className="footer-col-title">Navigation</h4>
              <div className="footer-col-links">
                <a href="#home" className="footer-col-link"><ChevronRight size={12} /> Home</a>
                <a href="#about" className="footer-col-link"><ChevronRight size={12} /> About</a>
                <a href="#projects" className="footer-col-link"><ChevronRight size={12} /> Projects</a>
                <a href="#skills" className="footer-col-link"><ChevronRight size={12} /> Skills</a>
                <a href="#prince-ai" className="footer-col-link"><ChevronRight size={12} /> Prince AI</a>
                <button onClick={() => window.dispatchEvent(new Event('open-contact'))} className="footer-col-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0, textAlign: 'left', width: '100%', color: 'inherit' }}><ChevronRight size={12} /> Contact</button>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Tech Stack</h4>
              <div className="footer-col-links">
                <span className="footer-col-link"><ChevronRight size={12} /> React + TypeScript</span>
                <span className="footer-col-link"><ChevronRight size={12} /> Node.js + Express</span>
                <span className="footer-col-link"><ChevronRight size={12} /> OpenRouter AI</span>
                <span className="footer-col-link"><ChevronRight size={12} /> Supabase</span>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Contact</h4>
              <div className="footer-col-links">
                <span className="footer-col-link"><MapPin size={12} /> Bihar, India</span>
                <a href="tel:+919470880956" className="footer-col-link"><Phone size={12} /> +91 94708 80956</a>
                <a href="mailto:mritunjaykumar2025@gmail.com" className="footer-col-link"><Mail size={12} /> mritunjaykumar2025@gmail.com</a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <div className="footer-copy">© {new Date().getFullYear()} <span className="accent">Mritunjay Kumar</span>. All rights reserved.</div>
          <div className="footer-tags">
            <span className="footer-tag">REACT</span>
            <span className="footer-tag">TYPESCRIPT</span>
            <span className="footer-tag">SUPABASE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
