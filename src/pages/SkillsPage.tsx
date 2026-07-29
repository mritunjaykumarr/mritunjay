import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code, Server, Languages, Wrench, Search, Sparkles, 
  Cpu, Layers, CheckCircle2 
} from 'lucide-react';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';

interface SkillItem {
  name: string;
  category: 'frontend' | 'backend' | 'languages' | 'tools';
  proficiency: number;
  level: 'Expert' | 'Advanced' | 'Proficient';
  desc: string;
  experience: string;
}

const skillsDatabase: SkillItem[] = [
  // Frontend
  { name: 'HTML5 & CSS3', category: 'frontend', proficiency: 95, level: 'Expert', desc: 'Semantic markup, modern layout math (Flex/Grid), accessibility (WCAG), CSS animations.', experience: '2+ Years' },
  { name: 'JavaScript (ES6+)', category: 'frontend', proficiency: 90, level: 'Expert', desc: 'Async execution, closures, DOM manipulation, ES modules, Web APIs.', experience: '2+ Years' },
  { name: 'React 19', category: 'frontend', proficiency: 88, level: 'Advanced', desc: 'Hooks, custom state management, component architecture, lazy loading, context.', experience: '2+ Years' },
  { name: 'TypeScript', category: 'frontend', proficiency: 82, level: 'Advanced', desc: 'Strict typing, generics, interfaces, type-safe API client integration.', experience: '1.5+ Years' },
  { name: 'Sass / SCSS', category: 'frontend', proficiency: 85, level: 'Advanced', desc: 'Modular styling, mixins, custom utility classes, CSS custom properties.', experience: '2+ Years' },
  { name: 'Responsive & Motion UI', category: 'frontend', proficiency: 92, level: 'Expert', desc: 'Fluid layout breakpoints, mobile-first design, GSAP scroll triggers, CSS keyframes.', experience: '2+ Years' },

  // Backend
  { name: 'Node.js', category: 'backend', proficiency: 82, level: 'Advanced', desc: 'Event loop asynchronous servers, file streaming, CLI scripts, NPM modules.', experience: '2+ Years' },
  { name: 'Express.js', category: 'backend', proficiency: 80, level: 'Advanced', desc: 'RESTful API routing, middleware stacks, CORS handling, error handling.', experience: '2+ Years' },
  { name: 'Supabase', category: 'backend', proficiency: 84, level: 'Advanced', desc: 'PostgreSQL database modeling, authentication, storage buckets, row-level security.', experience: '1+ Year' },
  { name: 'PostgreSQL', category: 'backend', proficiency: 75, level: 'Proficient', desc: 'Relational schema design, indexes, SQL queries, join operations.', experience: '1+ Year' },
  { name: 'MongoDB', category: 'backend', proficiency: 72, level: 'Proficient', desc: 'Document schemas, aggregation pipelines, Mongoose ODM.', experience: '1+ Year' },
  { name: 'WebSockets & Socket.io', category: 'backend', proficiency: 78, level: 'Proficient', desc: 'Real-time duplex messaging, channel subscription, presence event broadcasting.', experience: '1+ Year' },

  // Languages
  { name: 'Java', category: 'languages', proficiency: 75, level: 'Proficient', desc: 'Object-oriented programming, data structures, collections framework.', experience: '2+ Years' },
  { name: 'Python', category: 'languages', proficiency: 70, level: 'Proficient', desc: 'Scripting, basic data processing, machine learning concepts.', experience: '1+ Year' },
  { name: 'C#', category: 'languages', proficiency: 68, level: 'Proficient', desc: '.NET basics, object-oriented software patterns.', experience: '1+ Year' },

  // Tools
  { name: 'Git & GitHub', category: 'tools', proficiency: 90, level: 'Expert', desc: 'Branching, PR workflows, merge conflict resolution, team collaboration.', experience: '2+ Years' },
  { name: 'Vite & Build Tools', category: 'tools', proficiency: 88, level: 'Advanced', desc: 'Vite config, bundle optimization, fast HMR dev server workflows.', experience: '2+ Years' },
  { name: 'Figma & UI Design', category: 'tools', proficiency: 80, level: 'Advanced', desc: 'UI prototyping, wireframes, design tokens, developer handoffs.', experience: '2+ Years' },
  { name: 'Vercel & Deployment', category: 'tools', proficiency: 85, level: 'Advanced', desc: 'CI/CD deployment pipelines, domain management, environment variables.', experience: '2+ Years' }
];

export default function SkillsPage() {
  usePortfolioMotion();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'frontend' | 'backend' | 'languages' | 'tools'>('all');
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fills = entry.target.querySelectorAll('.skill-bar-fill');
          fills.forEach((fill, i) => {
            setTimeout(() => {
              fill.classList.add('animate');
            }, i * 60);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    if (visualRef.current) observer.observe(visualRef.current);
    return () => observer.disconnect();
  }, [activeCategory, searchQuery]);

  const filteredSkills = skillsDatabase.filter(s => {
    const matchesCat = activeCategory === 'all' || s.category === activeCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="page-wrapper skills-page" style={{ paddingTop: '5.5rem', paddingBottom: '5rem' }}>
      {/* Header Banner */}
      <section className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span className="current">Skills</span>
          </div>
          <div className="page-header-content reveal">
            <div className="section-eyebrow"><Cpu size={14} /> Technology Matrix</div>
            <h1 className="page-title">
              Technical Stack & <span className="grad">Proficiencies</span>
            </h1>
            <p className="page-subtitle">
              A comprehensive breakdown of my engineering capabilities across frontend, backend, databases, languages, and modern dev tools.
            </p>
          </div>
        </div>
      </section>

      {/* Controls & Filter Bar */}
      <section className="section" style={{ padding: '2.5rem 0 1.5rem' }}>
        <div className="container">
          <div className="skills-controls card-glass" style={{ padding: '1.25rem 1.5rem', borderRadius: 'var(--r-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text"
                placeholder="Search skills by name or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.6rem',
                  borderRadius: 'var(--r-sm)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  fontFamily: 'inherit',
                  fontSize: '0.92rem'
                }}
              />
            </div>

            {/* Filter Tabs */}
            <div className="filter-wrap" style={{ margin: 0 }}>
              {[
                { id: 'all', label: 'All Skills' },
                { id: 'frontend', label: 'Frontend' },
                { id: 'backend', label: 'Backend' },
                { id: 'languages', label: 'Languages' },
                { id: 'tools', label: 'Tools' },
              ].map(cat => (
                <button
                  key={cat.id}
                  className={`filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id as any)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Matrix Grid */}
      <section className="section" style={{ padding: '1.5rem 0 4rem' }} ref={visualRef}>
        <div className="container">
          <div className="skills-matrix-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filteredSkills.map((skill) => (
              <div key={skill.name} className="card-glass skill-matrix-card reveal" style={{ padding: '1.5rem', borderRadius: 'var(--r-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {skill.category === 'frontend' && <Code size={18} className="grad-text" />}
                    {skill.category === 'backend' && <Server size={18} className="grad-text" />}
                    {skill.category === 'languages' && <Languages size={18} className="grad-text" />}
                    {skill.category === 'tools' && <Wrench size={18} className="grad-text" />}
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text)', margin: 0 }}>{skill.name}</h3>
                  </div>
                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', background: 'var(--primary-glow)', color: 'var(--primary)', fontWeight: 600 }}>
                    {skill.level}
                  </span>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-2)', lineHeight: 1.6, marginBottom: '1.25rem', minHeight: '2.8rem' }}>
                  {skill.desc}
                </p>

                {/* Progress Bar */}
                <div className="skill-bar-item" style={{ marginBottom: '0.5rem' }}>
                  <div className="skill-bar-track" style={{ height: '8px' }}>
                    <div 
                      className="skill-bar-fill animate"
                      style={{ '--progress': skill.proficiency / 100 } as React.CSSProperties}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>Experience: {skill.experience}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>{skill.proficiency}% Mastery</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Overview Cards */}
      <section className="section bg-elevated" style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="section-eyebrow">Engineering Standards</div>
          <h2 className="section-title reveal">How I write <span className="grad">code</span></h2>

          <div className="standards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
            <div className="card-glass reveal" style={{ padding: '1.75rem', borderRadius: 'var(--r-md)' }}>
              <CheckCircle2 size={24} className="grad-text" style={{ marginBottom: '1rem' }} />
              <h3>Strict Type Safety</h3>
              <p style={{ color: 'var(--text-2)', fontSize: '0.92rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
                Leveraging TypeScript to catch errors early at compile-time and enforce reliable interfaces across components and API models.
              </p>
            </div>

            <div className="card-glass reveal" style={{ padding: '1.75rem', borderRadius: 'var(--r-md)' }}>
              <Layers size={24} className="grad-text" style={{ marginBottom: '1rem' }} />
              <h3>Decoupled Architecture</h3>
              <p style={{ color: 'var(--text-2)', fontSize: '0.92rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
                Keeping presentation components isolated from business logic and data providers for seamless testing and scalability.
              </p>
            </div>

            <div className="card-glass reveal" style={{ padding: '1.75rem', borderRadius: 'var(--r-md)' }}>
              <Sparkles size={24} className="grad-text" style={{ marginBottom: '1rem' }} />
              <h3>Modern Web Performance</h3>
              <p style={{ color: 'var(--text-2)', fontSize: '0.92rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
                Optimizing bundle sizes, utilizing lazy-loaded React routes, image webp formats, and GPU-accelerated CSS animations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
