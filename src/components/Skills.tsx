import { useEffect, useRef } from 'react';
import { Code, Server, Languages, Wrench } from 'lucide-react';

const skillBars = [
  { label: 'HTML/CSS', value: 95 },
  { label: 'JavaScript', value: 85 },
  { label: 'React', value: 78 },
  { label: 'Node.js', value: 72 },
  { label: 'TypeScript', value: 70 },
  { label: 'Performance', value: 82 },
];

export default function Skills() {
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fills = entry.target.querySelectorAll('.skill-bar-fill');
          fills.forEach((fill, i) => {
            setTimeout(() => {
              fill.classList.add('animate');
            }, i * 80);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    if (visualRef.current) observer.observe(visualRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" className="section skills-section">
      <div className="container">
        <div className="section-eyebrow">Skills</div>
        <h2 className="section-title reveal">My Technical <span className="grad">Stack</span></h2>

        <div className="skills-layout">
          <div className="skills-cards reveal">
            <div className="skill-cat">
              <h4><Code size={16} /> Frontend</h4>
              <div className="skill-tags">
                <span>HTML5</span><span>CSS3</span><span>JavaScript</span><span>React</span><span>Sass</span><span>WordPress</span>
              </div>
            </div>
            <div className="skill-cat">
              <h4><Server size={16} /> Backend</h4>
              <div className="skill-tags">
                <span>Node.js</span><span>Express</span><span>MongoDB</span><span>PostgreSQL</span>
              </div>
            </div>
            <div className="skill-cat">
              <h4><Languages size={16} /> Languages</h4>
              <div className="skill-tags">
                <span>Java</span><span>JavaScript</span><span>C#</span><span>Python</span>
              </div>
            </div>
            <div className="skill-cat">
              <h4><Wrench size={16} /> Tools</h4>
              <div className="skill-tags">
                <span>Git</span><span>GitHub</span><span>Figma</span><span>Render</span><span>Vercel</span>
              </div>
            </div>
          </div>

          <div className="skills-visual reveal reveal-right" ref={visualRef}>
            {skillBars.map(skill => (
              <div key={skill.label} className="skill-bar-item">
                <span className="skill-bar-label">{skill.label}</span>
                <div className="skill-bar-track">
                  <div
                    className="skill-bar-fill"
                    style={{ '--progress': skill.value / 100 } as React.CSSProperties}
                  />
                </div>
                <span className="skill-bar-val">{skill.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
