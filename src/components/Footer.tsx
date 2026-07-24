
export default function Footer() {
  return (
    <footer className="footer reveal">
      <div className="container">
        <div className="footer-shell">
          <div className="footer-brand-card">
            <a href="#home" className="footer-brand-logo">
              <span className="logo-text">MRITUNJAY</span>
              <span className="logo-dot"></span>
            </a>
            <h3 className="footer-brand-title">AI-first portfolio system</h3>
            <p className="footer-tagline">
              Premium frontend work, product-thinking, and OpenRouter AI-informed storytelling presented in a clean red-and-white identity.
            </p>
            <div className="footer-ai-note">
              <span className="footer-ai-label">OpenRouter AI</span>
              <span>Workflow-ready, modern, and built for intelligent product experiences.</span>
            </div>
            <div className="footer-socials">
              <a href="https://github.com/mritunjaykumarr" target="_blank" rel="noreferrer" aria-label="GitHub"><i className="fa-brands fa-github"></i></a>
              <a href="https://www.linkedin.com/in/mritunjay-kumar-22a7a828b" target="_blank" rel="noreferrer" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in"></i></a>
              <a href="https://www.instagram.com/mritunjaykumar.dev/" target="_blank" rel="noreferrer" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>
              <a href="mailto:mritunjaykumar2025@gmail.com" aria-label="Email"><i className="fa-solid fa-envelope"></i></a>
            </div>
          </div>

          <div className="footer-links-grid">
            <div className="footer-col">
              <h4 className="footer-col-title">Navigation</h4>
              <div className="footer-col-links">
                <a href="#home" className="footer-col-link"><i className="fa-solid fa-chevron-right"></i> Home</a>
                <a href="#about" className="footer-col-link"><i className="fa-solid fa-chevron-right"></i> About</a>
                <a href="#projects" className="footer-col-link"><i className="fa-solid fa-chevron-right"></i> Projects</a>
                <a href="#skills" className="footer-col-link"><i className="fa-solid fa-chevron-right"></i> Skills</a>
                <a href="#prince-ai" className="footer-col-link"><i className="fa-solid fa-chevron-right"></i> Prince AI</a>
                <a href="#contact" className="footer-col-link"><i className="fa-solid fa-chevron-right"></i> Contact</a>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">AI stack</h4>
              <div className="footer-col-links">
                <span className="footer-col-link"><i className="fa-solid fa-chevron-right"></i> OpenRouter AI</span>
                <span className="footer-col-link"><i className="fa-solid fa-chevron-right"></i> Prompt design</span>
                <span className="footer-col-link"><i className="fa-solid fa-chevron-right"></i> UX storytelling</span>
                <span className="footer-col-link"><i className="fa-solid fa-chevron-right"></i> Product strategy</span>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-col-title">Contact</h4>
              <div className="footer-col-links">
                <span className="footer-col-link"><i className="fa-solid fa-location-dot"></i> Bihar, India</span>
                <a href="tel:+919470880956" className="footer-col-link"><i className="fa-solid fa-phone"></i> +91 94708 80956</a>
                <a href="mailto:mritunjaykumar2025@gmail.com" className="footer-col-link"><i className="fa-solid fa-envelope"></i> mritunjaykumar2025@gmail.com</a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <div className="footer-copy">© 2026 <span className="accent">Mritunjay Kumar</span>. All rights reserved.</div>
          <div className="footer-tags">
            <span className="footer-tag">REACT</span>
            <span className="footer-tag">OPENROUTER AI</span>
            <span className="footer-tag">SUPABASE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
