import { useState } from 'react';
import { Code, ArrowRight, Download, CircleCheckBig } from 'lucide-react';

export default function About() {
  const [activeTab, setActiveTab] = useState('philosophy');

  return (
    <section id="about" className="section about">
      <div className="container">
        <div className="section-eyebrow">About Me</div>
        <h2 className="section-title reveal">
          Crafting the future,<br /><span className="grad">one line at a time</span>
        </h2>
        <div className="about-grid">
          <div className="about-img reveal">
            <div className="about-img-wrap">
              <img src="/assets/about2.png" alt="Mritunjay Kumar" className="about-photo" loading="lazy" />
              <div className="about-tag">
                <Code size={14} />
                <span>Frontend Dev</span>
              </div>
            </div>
          </div>

          <div className="about-content reveal reveal-right">
            <p className="about-text">I am a detail-oriented frontend developer with a passion for creating intuitive and beautiful user interfaces. My journey in web development is driven by a desire to solve complex problems and build products that not only work flawlessly but also provide a delightful experience.</p>

            <div className="tabs">
              <div className="tab-btns">
                <button className={`tab-btn ${activeTab === 'philosophy' ? 'active' : ''}`} onClick={() => setActiveTab('philosophy')}>Philosophy</button>
                <button className={`tab-btn ${activeTab === 'experience' ? 'active' : ''}`} onClick={() => setActiveTab('experience')}>Experience</button>
                <button className={`tab-btn ${activeTab === 'core-skills' ? 'active' : ''}`} onClick={() => setActiveTab('core-skills')}>Core Skills</button>
              </div>

              <div className={`tab-content ${activeTab === 'philosophy' ? 'active' : ''}`}>
                <p>User-first approach with a commitment to writing clean, scalable, and accessible code. Every project is an opportunity to optimise performance and deliver experiences that feel effortless and inevitable.</p>
              </div>

              <div className={`tab-content ${activeTab === 'experience' ? 'active' : ''}`}>
                <div className="mini-timeline horizontal-scroll horizontal-scroll-mobile-only">
                  <div className="mt-item">
                    <span className="mt-year" style={{ flex: '0 0 70px' }}>Present</span>
                    <span className="mt-role">Fullstack Developer — Epigroww Global, New Delhi</span>
                  </div>
                  <div className="mt-item">
                    <span className="mt-year" style={{ flex: '0 0 70px' }}>2026</span>
                    <span className="mt-role">Intern (3 Months) — Digicaptain Technology, Noida</span>
                  </div>
                </div>
              </div>

              <div className={`tab-content ${activeTab === 'core-skills' ? 'active' : ''}`}>
                <ul className="skills-checklist">
                  <li><CircleCheckBig size={16} /> Responsive Design</li>
                  <li><CircleCheckBig size={16} /> Interactive UI & Motion</li>
                  <li><CircleCheckBig size={16} /> Component Architecture</li>
                  <li><CircleCheckBig size={16} /> Accessibility (WCAG)</li>
                  <li><CircleCheckBig size={16} /> API Integration</li>
                  <li><CircleCheckBig size={16} /> Performance Optimisation</li>
                </ul>
              </div>
            </div>

            <div className="about-btns">
              <button onClick={() => window.dispatchEvent(new Event('open-contact'))} className="btn-primary" style={{ fontFamily: 'inherit', border: 'none', cursor: 'pointer' }}><span>Work with me</span><ArrowRight size={16} /></button>
              <a href="https://drive.google.com/file/d/1InESJ_ExHbQ5QjUo-ie3bvmDETT9v5Q3/view?usp=sharing" target="_blank" rel="noreferrer" className="btn-outline">
                <Download size={15} /><span>Download CV</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
