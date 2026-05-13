import React from 'react';

export default function Education() {
  return (
    <section id="education" className="section education-section">
      <div className="container">
        <div className="section-eyebrow">03 · Education</div>
        <h2 className="section-title reveal">Academic <span className="grad">Journey</span></h2>
        <div className="timeline">
          <div className="timeline-item reveal">
            <div className="tl-dot"><i className="fa-solid fa-graduation-cap"></i></div>
            <div className="tl-card">
              <span className="tl-year">2022 – 2026</span>
              <h3>B.Tech Computer Science</h3>
              <p className="tl-inst">VMKV Engineering College, Salem, Tamil Nadu</p>
              <p>Pursuing a comprehensive computer science education with specialisation in software engineering, web technologies, and data structures.</p>
            </div>
          </div>
          <div className="timeline-item reveal">
            <div className="tl-dot"><i className="fa-solid fa-school"></i></div>
            <div className="tl-card">
              <span className="tl-year">2020 – 2022</span>
              <h3>Class XII</h3>
              <p className="tl-inst">SRKG College, Sitamarhi, Bihar</p>
              <p>Completed with <strong>70.5%</strong>, establishing a strong foundation in sciences and mathematics.</p>
            </div>
          </div>
          <div className="timeline-item reveal">
            <div className="tl-dot"><i className="fa-solid fa-book"></i></div>
            <div className="tl-card">
              <span className="tl-year">2018 – 2020</span>
              <h3>Class X</h3>
              <p className="tl-inst">Holy Faith Public High School, Sitamarhi, Bihar</p>
              <p>Graduated with <strong>83.1%</strong>, demonstrating academic excellence and discipline.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
