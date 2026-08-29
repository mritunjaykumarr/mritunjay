import { Link } from 'react-router-dom';
import { Briefcase, GraduationCap, Calendar, MapPin, CheckCircle, Download, Sparkles } from 'lucide-react';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO';

export default function ExperiencePage() {
  usePortfolioMotion();
  useSEO(SEO_CONFIGS.experience);

  const experiences = [
    {
      id: 1,
      role: 'Fullstack Developer',
      company: 'Epigroww Global',
      location: 'New Delhi, India',
      period: 'Present',
      type: 'Full-time',
      desc: 'Leading frontend architecture and full-stack feature development for client web platforms and high-traffic applications.',
      highlights: [
        'Designed responsive web applications with React 19, TypeScript, and custom design systems.',
        'Engineered backend APIs with Node.js, Express, Supabase for real-time flow.',
        'Optimized load speeds by 40% using code-splitting, lazy loading, and asset caching.',
        'Built interactive dashboards and automated customer utilities cross-functionally.'
      ],
      skills: ['React 19', 'TypeScript', 'Node.js', 'Express', 'Supabase', 'CSS3', 'REST APIs']
    },
    {
      id: 2,
      role: 'Software Developer Intern',
      company: 'Digicaptain Technology',
      location: 'Noida, India',
      period: '2026 (3 Months)',
      type: 'Internship',
      desc: 'Assisted in building client-facing web pages, widgets, and internal utilities.',
      highlights: [
        'Built UI components adhering to strict design guidelines and responsiveness.',
        'Integrated third-party APIs and asynchronous data transformations.',
        'Managed Git/GitHub workflows, pull request reviews, and sprint standups.',
        'Resolved cross-browser layout inconsistencies and accessibility standards.'
      ],
      skills: ['JavaScript (ES6+)', 'HTML5', 'CSS3', 'Sass', 'Git', 'GitHub', 'Vercel']
    }
  ];

  const education = [
    {
      id: 1,
      degree: 'B.Tech Computer Science',
      institution: 'VMKV Engineering College',
      location: 'Salem, India',
      period: '2022 — 2026',
      details: 'Comprehensive computer science foundations, algorithms, distributed systems, and web technologies.',
      coursework: ['Data Structures & Algorithms', 'Database Systems (SQL)', 'Web Technologies', 'Software Engineering', 'Object-Oriented Programming']
    }
  ];

  return (
    <div className="page-wrapper experience-page" style={{ paddingTop: '6rem', paddingBottom: '5rem', background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      {/* Page Header */}
      <section className="page-header" style={{ padding: '2rem 0 3rem' }}>
        <div className="container">
          <div className="breadcrumb" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--text)' }}>Experience</span>
          </div>

          <div className="page-header-content">
            <div className="badge-playful" style={{ marginBottom: '1rem' }}>
              <Briefcase size={13} />
              <span>Career &amp; Milestones</span>
            </div>
            <h1 className="page-title" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', fontWeight: 600, letterSpacing: '-0.04em', margin: '0.5rem 0 1rem', color: 'var(--text)' }}>
              Professional <em>Journey &amp; Education</em>
            </h1>
            <p className="page-subtitle" style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '600px', lineHeight: 1.65 }}>
              A comprehensive view of my engineering roles, technical impact, production deliverables, and academic background.
            </p>
          </div>
        </div>
      </section>

      {/* Experience History */}
      <section className="section" style={{ padding: '2rem 0 4rem' }}>
        <div className="container">
          <div className="badge-playful" style={{ marginBottom: '1rem' }}>
            <Sparkles size={13} />
            <span>Work History</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--text)', margin: '0 0 2.5rem' }}>
            Production <em>Experience</em>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {experiences.map((exp) => (
              <div
                key={exp.id}
                style={{
                  padding: '1.5rem', background: 'var(--card)', border: '1px solid var(--border)',
                  borderRadius: '14px', position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      padding: '0.25rem 0.65rem', borderRadius: '5px',
                      background: 'var(--surface-2)', border: '1px solid var(--border)',
                      fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text)', fontWeight: 500
                    }}>
                      <Briefcase size={12} /> {exp.type}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '0.6rem', color: 'var(--text)' }}>
                      {exp.role}
                    </h3>
                    <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.2rem' }}>
                      {exp.company}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '6px',
                      padding: '0.3rem 0.75rem', color: 'var(--text)', fontWeight: 500
                    }}>
                      <Calendar size={13} /> {exp.period}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      <MapPin size={13} /> {exp.location}
                    </div>
                  </div>
                </div>

                <p style={{ marginTop: '1.25rem', color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.94rem' }}>
                  {exp.desc}
                </p>

                <div style={{ marginTop: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Key Contributions &amp; Technical Impact:
                  </h4>
                  <ul style={{ display: 'grid', gap: '0.5rem', listStyle: 'none', padding: 0, margin: 0 }}>
                    {exp.highlights.map((h, i) => (
                      <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: 'var(--text)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                        <span style={{ width: 18, height: 18, borderRadius: '4px', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: 2 }}>
                          <CheckCircle size={11} style={{ color: 'var(--text)' }} />
                        </span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {exp.skills.map(skill => (
                    <span key={skill} style={{
                      padding: '0.25rem 0.6rem', borderRadius: '5px', background: 'var(--surface-2)',
                      border: '1px solid var(--border)', fontSize: '0.74rem', color: 'var(--text-muted)'
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Background */}
      <section className="section" style={{ padding: '4rem 0', background: 'var(--bg-subtle, var(--bg))', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="badge-playful" style={{ marginBottom: '1rem' }}>
            <GraduationCap size={13} />
            <span>Academic Foundation</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: 'var(--text)', margin: '0 0 2rem' }}>
            Education &amp; <em>Degrees</em>
          </h2>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {education.map(edu => (
              <div
                key={edu.id}
                style={{
                  padding: '2rem', background: 'var(--card)', border: '1px solid var(--border)',
                  borderRadius: '14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'grid', placeItems: 'center', color: 'var(--text)' }}>
                    <GraduationCap size={16} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
                    {edu.degree}
                  </h3>
                </div>

                <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '0.75rem' }}>
                  {edu.institution} · {edu.period} · {edu.location}
                </div>
                <p style={{ color: 'var(--text)', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
                  {edu.details}
                </p>

                <div>
                  <h4 style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Core Coursework:
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                    {edu.coursework.map(c => (
                      <span key={c} style={{
                        fontSize: '0.74rem', padding: '0.3rem 0.65rem', borderRadius: '5px',
                        background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-muted)'
                      }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2.5rem' }}>
            <a href="/updated_resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-primary">
              <Download size={14} />
              <span>Download Complete CV / Resume</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
