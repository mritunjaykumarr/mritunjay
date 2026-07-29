import { Link } from 'react-router-dom';
import { Briefcase, GraduationCap, Calendar, MapPin, CheckCircle, ArrowRight, Download } from 'lucide-react';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';

export default function ExperiencePage() {
  usePortfolioMotion();

  const experiences = [
    {
      id: 1,
      role: 'Fullstack Developer',
      company: 'Epigroww Global',
      location: 'New Delhi, India',
      period: 'Present',
      type: 'Full-time',
      desc: 'Leading frontend architecture and fullstack feature development for client web platforms and high-traffic applications.',
      highlights: [
        'Designed and implemented responsive web applications using React 19, TypeScript, and custom CSS design systems.',
        'Engineered backend API endpoints with Node.js, Express, and Supabase for real-time data flow.',
        'Optimized page load speeds by 40% using code-splitting, lazy loading, and asset optimization.',
        'Collaborated with cross-functional teams to build intuitive administrative dashboards and customer tools.'
      ],
      skills: ['React', 'TypeScript', 'Node.js', 'Express', 'Supabase', 'CSS3', 'REST APIs']
    },
    {
      id: 2,
      role: 'Software Developer Intern',
      company: 'Digicaptain Technology',
      location: 'Noida, India',
      period: '2026 (3 Months)',
      type: 'Internship',
      desc: 'Assisted in building client-facing web pages, interactive widgets, and internal utility platforms.',
      highlights: [
        'Built interactive UI components adhering to strict design guidelines and responsive viewport standards.',
        'Integrated third-party APIs and handled async data transformations for smooth rendering.',
        'Maintained clean version control with Git/GitHub and participated in daily standups and code reviews.',
        'Resolved cross-browser layout inconsistencies and accessibility issues across mobile and desktop.'
      ],
      skills: ['JavaScript (ES6+)', 'HTML5', 'CSS3', 'Sass', 'Git', 'GitHub', 'Vercel']
    }
  ];

  const education = [
    {
      id: 1,
      degree: 'Bachelor of Computer Applications (BCA)',
      institution: 'State University',
      location: 'India',
      period: '2023 - 2026',
      details: 'Focused on core computer science foundations, software development principles, and modern web systems.',
      coursework: ['Data Structures & Algorithms', 'Database Systems (SQL)', 'Web Technologies', 'Software Engineering', 'Object Oriented Programming']
    }
  ];

  return (
    <div className="page-wrapper experience-page" style={{ paddingTop: '5.5rem', paddingBottom: '5rem' }}>
      {/* Header Banner */}
      <section className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span className="current">Experience</span>
          </div>
          <div className="page-header-content reveal">
            <div className="section-eyebrow"><Briefcase size={14} /> Career & Education</div>
            <h1 className="page-title">
              Professional <span className="grad">Journey & Milestones</span>
            </h1>
            <p className="page-subtitle">
              A comprehensive view of my software engineering experience, roles, academic foundation, and technical accomplishments.
            </p>
          </div>
        </div>
      </section>

      {/* Work Experience Timeline */}
      <section className="section" style={{ padding: '3rem 0' }}>
        <div className="container">
          <div className="section-eyebrow">Work History</div>
          <h2 className="section-title reveal">Production <span className="grad">Experience</span></h2>

          <div className="experience-list" style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {experiences.map(exp => (
              <div key={exp.id} className="card-glass experience-card reveal" style={{ padding: '2rem', borderRadius: 'var(--r-md)' }}>
                <div className="exp-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span className="exp-type-badge"><Briefcase size={12} /> {exp.type}</span>
                    <h3 style={{ fontSize: '1.4rem', marginTop: '0.5rem', color: 'var(--text)' }}>{exp.role}</h3>
                    <div style={{ fontSize: '1rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.2rem' }}>{exp.company}</div>
                  </div>
                  <div className="exp-meta" style={{ textAlign: 'right', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                      <Calendar size={14} /> {exp.period}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                      <MapPin size={14} /> {exp.location}
                    </div>
                  </div>
                </div>

                <p style={{ marginTop: '1.25rem', color: 'var(--text-2)', lineHeight: '1.7', fontSize: '1rem' }}>
                  {exp.desc}
                </p>

                <div style={{ marginTop: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.92rem', color: 'var(--text)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key Contributions & Impact:</h4>
                  <ul className="exp-highlights-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {exp.highlights.map((h, idx) => (
                      <li key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: 'var(--text-2)', fontSize: '0.95rem' }}>
                        <CheckCircle size={16} className="grad-text" style={{ flexShrink: 0, marginTop: '3px' }} />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="proj-tags" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  {exp.skills.map(skill => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Background */}
      <section className="section bg-elevated" style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="section-eyebrow">Academic Background</div>
          <h2 className="section-title reveal">Education & <span className="grad">Studies</span></h2>

          <div className="education-grid" style={{ marginTop: '2rem' }}>
            {education.map(edu => (
              <div key={edu.id} className="card-glass reveal" style={{ padding: '2rem', borderRadius: 'var(--r-md)' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div className="icon-box" style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', color: 'var(--text)' }}>{edu.degree}</h3>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.2rem' }}>{edu.institution} • {edu.period}</div>
                    <p style={{ marginTop: '1rem', color: 'var(--text-2)', lineHeight: '1.7' }}>{edu.details}</p>
                    
                    <div style={{ marginTop: '1.25rem' }}>
                      <h4 style={{ fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Core Modules:</h4>
                      <div className="skill-tags">
                        {edu.coursework.map(c => (
                          <span key={c} style={{ fontSize: '0.8rem', padding: '0.3rem 0.75rem', borderRadius: '20px', background: 'var(--card-bg)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>{c}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="section" style={{ padding: '4rem 0' }}>
        <div className="container text-center reveal">
          <div className="card-glass" style={{ padding: '3rem 2rem', borderRadius: 'var(--r-lg)' }}>
            <h2 className="section-title" style={{ fontSize: '2rem' }}>Want to see what I've <span className="grad">built?</span></h2>
            <p style={{ color: 'var(--text-2)', maxWidth: '600px', margin: '1rem auto 2rem' }}>
              Explore my full projects gallery containing live web applications, CLI utilities, and open-source tools.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/projects" className="btn-primary">
                <span>Browse Portfolio Gallery</span>
                <ArrowRight size={16} />
              </Link>
              <a 
                href="https://drive.google.com/file/d/1InESJ_ExHbQ5QjUo-ie3bvmDETT9v5Q3/view?usp=sharing" 
                target="_blank" 
                rel="noreferrer" 
                className="btn-outline"
              >
                <Download size={15} />
                <span>Download Resume</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
