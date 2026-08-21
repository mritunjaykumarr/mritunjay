import { Link } from 'react-router-dom';
import { Mail, ChevronRight, MapPin, Phone, Sparkles } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon } from './SocialIcons';

// Playful Geometric: footer as warm paper with squiggle divider
// - Brand card becomes sticker card with half-out icon circle (yellow)
// - Links grid uses playful headings (Outfit 800) + icon circles
// - Tags become pill badges with confetti rotation
// - Preserves all links/props, only visual tokens changed
export default function Footer() {
  return (
    <footer className="footer reveal" style={{ background:'var(--background)', borderTop:'2px solid var(--foreground)', position:'relative', overflow:'clip', paddingTop:'3rem' }}>
      {/* Squiggle divider — hard line, not blur */}
      <div aria-hidden="true" style={{ position:'absolute', top:0, left:0, right:0, height:12, background:'repeating-linear-gradient(90deg, var(--foreground) 0 2px, transparent 2px 12px)', opacity:0.15 }} />
      {/* Confetti behind footer */}
      <div aria-hidden="true" style={{ position:'absolute', right:'6%', top:24, width:44, height:44, background:'var(--tertiary)', border:'2px solid var(--foreground)', borderRadius:'50%', boxShadow:'var(--shadow-pop)' }} />
      <div aria-hidden="true" style={{ position:'absolute', left:'5%', bottom:80, width:0, height:0, borderLeft:'12px solid transparent', borderRight:'12px solid transparent', borderBottom:'20px solid var(--secondary)', filter:'drop-shadow(4px 4px 0 #1E293B)' }} />
      <div className="container" style={{ position:'relative', zIndex:1 }}>
        <div className="footer-shell" style={{ display:'grid', gridTemplateColumns:'1.1fr 1.9fr', gap:'2rem' }}>
          <div className="footer-brand-card card-sticker" style={{ padding:'1.75rem', paddingTop:'2.5rem', position:'relative' }}>
            <div className="card-icon-circle" aria-hidden="true" style={{ position:'absolute', top:-18, left:24, background:'var(--tertiary)', border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)' }}>
              <Sparkles size={18} strokeWidth={2.5} color="var(--foreground)" />
            </div>
            <Link to="/" className="footer-brand-logo" style={{ fontFamily:'var(--font-heading)', fontWeight:800, fontSize:'1.1rem', letterSpacing:'-0.02em', color:'var(--foreground)', display:'flex', alignItems:'center', gap:'0.35rem' }}>
              <span>MRITUNJAY</span>
              <span className="logo-dot" style={{ width:8, height:8, background:'var(--accent)', borderRadius:'50%', border:'2px solid var(--foreground)', display:'inline-block' }} />
            </Link>
            <h3 className="footer-brand-title" style={{ fontFamily:'var(--font-heading)', fontWeight:700, fontSize:'1rem', color:'var(--foreground)', marginTop:'0.5rem' }}>Full Stack Developer</h3>
            <p className="footer-tagline" style={{ fontFamily:'var(--font-body)', color:'var(--muted-foreground)', fontSize:'0.9rem', lineHeight:1.6, marginTop:'0.5rem' }}>
              Premium frontend work, product-thinking, and AI-informed storytelling presented in a clean modern identity.
            </p>
            <div className="footer-socials" style={{ display:'flex', gap:'0.6rem', marginTop:'1rem' }}>
              <a href="https://github.com/mritunjaykumarr" target="_blank" rel="noreferrer" aria-label="GitHub" className="icon-circle secondary" style={{ width:36, height:36 }}><GithubIcon size={16} /></a>
              <a href="https://www.linkedin.com/in/mritunjay-kumar-22a7a828b" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="icon-circle accent" style={{ width:36, height:36 }}><LinkedinIcon size={16} /></a>
              <a href="https://www.instagram.com/mritunjaykumar.dev/" target="_blank" rel="noreferrer" aria-label="Instagram" className="icon-circle tertiary" style={{ width:36, height:36 }}><InstagramIcon size={16} /></a>
              <a href="mailto:me@mritify.online" aria-label="Email" className="icon-circle quaternary" style={{ width:36, height:36 }}><Mail size={16} strokeWidth={2.5} /></a>
            </div>
          </div>

          <div className="footer-links-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem' }}>
            <div className="footer-col">
              <h4 className="footer-col-title" style={{ fontFamily:'var(--font-heading)', fontWeight:800, fontSize:'0.9rem', textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--foreground)', borderBottom:'2px solid var(--foreground)', paddingBottom:'0.4rem', display:'inline-block' }}>Navigation</h4>
              <div className="footer-col-links" style={{ display:'grid', gap:'0.45rem', marginTop:'0.9rem' }}>
                <Link to="/" className="footer-col-link" style={{ display:'flex', alignItems:'center', gap:'6px', fontFamily:'var(--font-body)', fontWeight:500, color:'var(--foreground)', fontSize:'0.9rem' }}><ChevronRight size={12} strokeWidth={2.5}/> Home</Link>
                <Link to="/about" className="footer-col-link" style={{ display:'flex', alignItems:'center', gap:'6px', fontFamily:'var(--font-body)', fontWeight:500 }}><ChevronRight size={12} strokeWidth={2.5}/> About</Link>
                <Link to="/experience" className="footer-col-link" style={{ display:'flex', alignItems:'center', gap:'6px' }}><ChevronRight size={12} strokeWidth={2.5}/> Experience</Link>
                <Link to="/projects" className="footer-col-link" style={{ display:'flex', alignItems:'center', gap:'6px' }}><ChevronRight size={12} strokeWidth={2.5}/> Projects</Link>
                <Link to="/skills" className="footer-col-link" style={{ display:'flex', alignItems:'center', gap:'6px' }}><ChevronRight size={12} strokeWidth={2.5}/> Skills</Link>
                <Link to="/certifications" className="footer-col-link" style={{ display:'flex', alignItems:'center', gap:'6px' }}><ChevronRight size={12} strokeWidth={2.5}/> Certifications</Link>
                <Link to="/blog" className="footer-col-link" style={{ display:'flex', alignItems:'center', gap:'6px' }}><ChevronRight size={12} strokeWidth={2.5}/> Blog</Link>
                <Link to="/pricing" className="footer-col-link" style={{ display:'flex', alignItems:'center', gap:'6px' }}><ChevronRight size={12} strokeWidth={2.5}/> Services & Pricing</Link>
                <Link to="/prince-ai" className="footer-col-link" style={{ display:'flex', alignItems:'center', gap:'6px' }}><ChevronRight size={12} strokeWidth={2.5}/> Prince AI</Link>
                <Link to="/contact" className="footer-col-link" style={{ display:'flex', alignItems:'center', gap:'6px' }}><ChevronRight size={12} strokeWidth={2.5}/> Contact</Link>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title" style={{ fontFamily:'var(--font-heading)', fontWeight:800, fontSize:'0.9rem', textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--foreground)', borderBottom:'2px solid var(--foreground)', paddingBottom:'0.4rem', display:'inline-block' }}>Tech Stack</h4>
              <div className="footer-col-links" style={{ display:'grid', gap:'0.45rem', marginTop:'0.9rem', fontFamily:'var(--font-body)', color:'var(--muted-foreground)', fontSize:'0.9rem' }}>
                <span style={{ display:'flex', gap:'6px', alignItems:'center' }}><ChevronRight size={12} strokeWidth={2.5}/> React 19 + TypeScript</span>
                <span style={{ display:'flex', gap:'6px', alignItems:'center' }}><ChevronRight size={12} strokeWidth={2.5}/> Node.js + Express</span>
                <span style={{ display:'flex', gap:'6px', alignItems:'center' }}><ChevronRight size={12} strokeWidth={2.5}/> OpenRouter AI</span>
                <span style={{ display:'flex', gap:'6px', alignItems:'center' }}><ChevronRight size={12} strokeWidth={2.5}/> Supabase PostgreSQL</span>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title" style={{ fontFamily:'var(--font-heading)', fontWeight:800, fontSize:'0.9rem', textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--foreground)', borderBottom:'2px solid var(--foreground)', paddingBottom:'0.4rem', display:'inline-block' }}>Contact & Support</h4>
              <div className="footer-col-links" style={{ display:'grid', gap:'0.45rem', marginTop:'0.9rem', fontFamily:'var(--font-body)', fontSize:'0.9rem' }}>
                <span style={{ display:'flex', gap:'6px', alignItems:'center', color:'var(--muted-foreground)' }}><MapPin size={12} strokeWidth={2.5}/> Bihar / New Delhi, India</span>
                <a href="tel:+919470880956" style={{ display:'flex', gap:'6px', alignItems:'center', color:'var(--foreground)', fontWeight:600 }}><Phone size={12} strokeWidth={2.5}/> +91 94708 80956</a>
                <a href="mailto:me@mritify.online" style={{ display:'flex', gap:'6px', alignItems:'center', color:'var(--foreground)' }}><Mail size={12} strokeWidth={2.5}/> me@mritify.online</a>
                <a href="mailto:support@mritify.online" style={{ display:'flex', gap:'6px', alignItems:'center', color:'var(--foreground)' }}><Mail size={12} strokeWidth={2.5}/> support@mritify.online</a>
                <a href="mailto:info@mritify.online" style={{ display:'flex', gap:'6px', alignItems:'center', color:'var(--foreground)' }}><Mail size={12} strokeWidth={2.5}/> info@mritify.online</a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-divider" style={{ height:2, background:'var(--foreground)', opacity:0.15, margin:'2rem 0 1.25rem' }} />

        <div className="footer-bottom" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
          <div className="footer-copy" style={{ fontFamily:'var(--font-body)', fontWeight:500, color:'var(--muted-foreground)', fontSize:'0.85rem' }}>© {new Date().getFullYear()} <span style={{ color:'var(--accent)', fontWeight:800 }}>Mritunjay Kumar</span>. All rights reserved.</div>
          <div className="footer-tags" style={{ display:'flex', gap:'0.5rem' }}>
            <span className="badge-playful" style={{ background:'var(--accent)', color:'white', fontSize:'0.7rem', padding:'0.25rem 0.6rem' }}>REACT 19</span>
            <span className="badge-playful secondary" style={{ background:'var(--secondary)', color:'white', fontSize:'0.7rem', padding:'0.25rem 0.6rem' }}>TYPESCRIPT</span>
            <span className="badge-playful" style={{ background:'var(--tertiary)', fontSize:'0.7rem', padding:'0.25rem 0.6rem' }}>SUPABASE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
