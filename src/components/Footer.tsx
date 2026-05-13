

export default function Footer() {
  return (
    <footer className="footer reveal">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#home" className="footer-brand-logo">
              <span className="logo-text">MRITUNJAY</span>
              <span className="logo-dot"></span>
            </a>
            <p className="footer-tagline">Crafting digital experiences with precision and aesthetics. Based in India, working worldwide.</p>
            <div className="footer-socials">
              <a href="https://github.com/mritunjaykumarr" target="_blank" rel="noreferrer"><i className="fa-brands fa-github"></i></a>
              <a href="https://www.linkedin.com/in/mritunjay-kumar-22a7a828b" target="_blank" rel="noreferrer"><i className="fa-brands fa-linkedin-in"></i></a>
              <a href="https://www.instagram.com/mritunjaykumar.dev/" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram"></i></a>
              <a href="mailto:mritunjaykumar2025@gmail.com"><i className="fa-solid fa-envelope"></i></a>
            </div>
            <div className="footer-status">
              <span className="footer-status-dot"></span>
              <span>SYSTEM ONLINE / 2026</span>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Navigation</h4>
            <div className="footer-col-links">
              <a href="#home" className="footer-col-link"><i className="fa-solid fa-chevron-right"></i> Home</a>
              <a href="#about" className="footer-col-link"><i className="fa-solid fa-chevron-right"></i> About</a>
              <a href="#education" className="footer-col-link"><i className="fa-solid fa-chevron-right"></i> Education</a>
              <a href="#projects" className="footer-col-link"><i className="fa-solid fa-chevron-right"></i> Projects</a>
              <a href="#certifications" className="footer-col-link"><i className="fa-solid fa-chevron-right"></i> Certs</a>
              <a href="#skills" className="footer-col-link"><i className="fa-solid fa-chevron-right"></i> Skills</a>
              <a href="#blog" className="footer-col-link"><i className="fa-solid fa-chevron-right"></i> Blog</a>
              <a href="#pricing" className="footer-col-link"><i className="fa-solid fa-chevron-right"></i> Pricing</a>
              <a href="#contact" className="footer-col-link"><i className="fa-solid fa-chevron-right"></i> Contact</a>
              <a href="/adfree" className="footer-col-link"><i className="fa-solid fa-chevron-right"></i> Ad-Free</a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Services</h4>
            <div className="footer-col-links">
              <a href="#projects" className="footer-col-link"><i className="fa-solid fa-chevron-right"></i> Web Apps</a>
              <a href="#projects" className="footer-col-link"><i className="fa-solid fa-chevron-right"></i> UI/UX Design</a>
              <a href="#projects" className="footer-col-link"><i className="fa-solid fa-chevron-right"></i> SEO</a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Contact</h4>
            <div className="footer-col-links">
              <span className="footer-col-link"><i className="fa-solid fa-location-dot"></i> Bihar, India</span>
              <a href="tel:+919470880956" className="footer-col-link"><i className="fa-solid fa-phone"></i> +91 94708 80956</a>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <div className="footer-copy">© 2026 <span className="accent">Mritunjay Kumar</span>. All rights reserved.</div>
          <div className="footer-tags">
            <span className="footer-tag">REACT</span>
            <span className="footer-tag">VITE</span>
            <span className="footer-tag">SUPABASE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
