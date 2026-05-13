import { useState } from 'react';

export default function About() {
  const [activeTab, setActiveTab] = useState('philosophy');

  return (
    <section id="about" className="section about">
      <div className="container">
        <div className="section-eyebrow">02 · About Me</div>
        <h2 className="section-title reveal">
          Crafting the future,<br/><span className="grad">one line at a time</span>
        </h2>
        <div className="about-grid">
          <div className="about-img reveal">
            <div className="about-img-wrap">
              <img src="/assets/about2.png" alt="Mritunjay Kumar" className="about-photo" />
              <div className="about-img-glow"></div>
              <div className="about-tag">
                <i className="fa-solid fa-code"></i>
                <span>Frontend Dev</span>
              </div>
            </div>
          </div>

          <div className="about-content reveal reveal-right">
            <p className="about-text">I am a detail-oriented frontend developer with a passion for creating intuitive and beautiful user interfaces. My journey in web development is driven by a desire to solve complex problems and build products that not only work flawlessly but also provide a delightful experience.</p>

            <div className="tabs">
              <div className="tab-btns">
                <button 
                  className={`tab-btn ${activeTab === 'philosophy' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('philosophy')}
                >Philosophy</button>
                <button 
                  className={`tab-btn ${activeTab === 'experience' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('experience')}
                >Experience</button>
                <button 
                  className={`tab-btn ${activeTab === 'core-skills' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('core-skills')}
                >Core Skills</button>
              </div>
              
              <div className={`tab-content ${activeTab === 'philosophy' ? 'active' : ''}`}>
                <p>User-first approach with a commitment to writing clean, scalable, and accessible code. Every project is an opportunity to optimise performance and deliver experiences that feel effortless and inevitable.</p>
              </div>
              
              <div className={`tab-content ${activeTab === 'experience' ? 'active' : ''}`}>
                <div className="mini-timeline">
                  <div className="mt-item">
                    <span className="mt-year">2025</span>
                    <span className="mt-role">Frontend Developer — Freelance</span>
                  </div>
                  <div className="mt-item">
                    <span className="mt-year">2024</span>
                    <span className="mt-role">Frontend Intern</span>
                  </div>
                </div>
              </div>
              
              <div className={`tab-content ${activeTab === 'core-skills' ? 'active' : ''}`}>
                <ul className="skills-checklist">
                  <li><i className="fa-solid fa-circle-check"></i> Responsive Design</li>
                  <li><i className="fa-solid fa-circle-check"></i> Interactive UI & Motion</li>
                  <li><i className="fa-solid fa-circle-check"></i> Component Architecture</li>
                  <li><i className="fa-solid fa-circle-check"></i> Accessibility (WCAG)</li>
                  <li><i className="fa-solid fa-circle-check"></i> API Integration</li>
                  <li><i className="fa-solid fa-circle-check"></i> Performance Optimisation</li>
                </ul>
              </div>
            </div>

            <div className="about-btns">
              <a href="#contact" className="btn-glow"><span>Work with me</span><i className="fa-solid fa-arrow-right"></i></a>
              <a href="https://drive.google.com/file/d/1InESJ_ExHbQ5QjUo-ie3bvmDETT9v5Q3/view?usp=sharing" download className="btn-ghost">
                <i className="fa-solid fa-download"></i><span>Download CV</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
