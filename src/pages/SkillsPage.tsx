import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Code, Server, Languages, Wrench, Search, Sparkles, Cpu, Layers, CheckCircle2, Star } from 'lucide-react';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO';

interface SkillItem {
  name: string;
  category: 'frontend' | 'backend' | 'languages' | 'tools';
  proficiency: number;
  level: 'Expert' | 'Advanced' | 'Proficient';
  desc: string;
  experience: string;
}

const skillsDatabase: SkillItem[] = [
  { name: 'HTML5 & CSS3', category: 'frontend', proficiency: 95, level: 'Expert', desc: 'Semantic markup, modern layout math (Flex/Grid), accessibility (WCAG), CSS animations.', experience: '2+ Years' },
  { name: 'JavaScript (ES6+)', category: 'frontend', proficiency: 90, level: 'Expert', desc: 'Async execution, closures, DOM manipulation, ES modules, Web APIs.', experience: '2+ Years' },
  { name: 'React 19', category: 'frontend', proficiency: 88, level: 'Advanced', desc: 'Hooks, custom state management, component architecture, lazy loading, context.', experience: '2+ Years' },
  { name: 'TypeScript', category: 'frontend', proficiency: 82, level: 'Advanced', desc: 'Strict typing, generics, interfaces, type-safe API client integration.', experience: '1.5+ Years' },
  { name: 'Sass / SCSS', category: 'frontend', proficiency: 85, level: 'Advanced', desc: 'Modular styling, mixins, custom utility classes, CSS custom properties.', experience: '2+ Years' },
  { name: 'Responsive & Motion UI', category: 'frontend', proficiency: 92, level: 'Expert', desc: 'Fluid layout breakpoints, mobile-first design, GSAP scroll triggers, CSS keyframes.', experience: '2+ Years' },
  { name: 'Node.js', category: 'backend', proficiency: 82, level: 'Advanced', desc: 'Event loop asynchronous servers, file streaming, CLI scripts, NPM modules.', experience: '2+ Years' },
  { name: 'Express.js', category: 'backend', proficiency: 80, level: 'Advanced', desc: 'RESTful API routing, middleware stacks, CORS handling, error handling.', experience: '2+ Years' },
  { name: 'Supabase', category: 'backend', proficiency: 84, level: 'Advanced', desc: 'PostgreSQL database modeling, authentication, storage buckets, row-level security.', experience: '1+ Year' },
  { name: 'PostgreSQL', category: 'backend', proficiency: 75, level: 'Proficient', desc: 'Relational schema design, indexes, SQL queries, join operations.', experience: '1+ Year' },
  { name: 'MongoDB', category: 'backend', proficiency: 72, level: 'Proficient', desc: 'Document schemas, aggregation pipelines, Mongoose ODM.', experience: '1+ Year' },
  { name: 'WebSockets & Socket.io', category: 'backend', proficiency: 78, level: 'Proficient', desc: 'Real-time duplex messaging, channel subscription, presence event broadcasting.', experience: '1+ Year' },
  { name: 'Java', category: 'languages', proficiency: 75, level: 'Proficient', desc: 'Object-oriented programming, data structures, collections framework.', experience: '2+ Years' },
  { name: 'Python', category: 'languages', proficiency: 70, level: 'Proficient', desc: 'Scripting, basic data processing, machine learning concepts.', experience: '1+ Year' },
  { name: 'C#', category: 'languages', proficiency: 68, level: 'Proficient', desc: '.NET basics, object-oriented software patterns.', experience: '1+ Year' },
  { name: 'Git & GitHub', category: 'tools', proficiency: 90, level: 'Expert', desc: 'Branching, PR workflows, merge conflict resolution, team collaboration.', experience: '2+ Years' },
  { name: 'Vite & Build Tools', category: 'tools', proficiency: 88, level: 'Advanced', desc: 'Vite config, bundle optimization, fast HMR dev server workflows.', experience: '2+ Years' },
  { name: 'Figma & UI Design', category: 'tools', proficiency: 80, level: 'Advanced', desc: 'UI prototyping, wireframes, design tokens, developer handoffs.', experience: '2+ Years' },
  { name: 'Vercel & Deployment', category: 'tools', proficiency: 85, level: 'Advanced', desc: 'CI/CD deployment pipelines, domain management, environment variables.', experience: '2+ Years' }
];

export default function SkillsPage() {
  usePortfolioMotion();
  useSEO(SEO_CONFIGS.skills);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'frontend' | 'backend' | 'languages' | 'tools'>('all');
  const visualRef = useRef<HTMLDivElement>(null);

  const filteredSkills = skillsDatabase.filter(s => {
    const matchesCat = activeCategory === 'all' || s.category === activeCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="page-wrapper skills-page" style={{ paddingTop: '6rem', paddingBottom: '5rem', background: '#000000', color: '#ffffff', minHeight: '100vh' }}>
      <section className="page-header" style={{ padding: '2rem 0 3rem' }}>
        <div className="container">
          <div className="breadcrumb" style={{ fontSize: '0.82rem', color: '#888888', marginBottom: '1rem' }}>
            <Link to="/" style={{ color: '#888888', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#ffffff' }}>Skills</span>
          </div>

          <div className="page-header-content">
            <div className="badge-playful" style={{ marginBottom: '1rem' }}>
              <Cpu size={13} />
              <span>Technology Matrix</span>
            </div>
            <h1 className="page-title" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', fontWeight: 600, letterSpacing: '-0.04em', margin: '0.5rem 0 1rem' }}>
              Technical Stack & <em>Engineering Range</em>
            </h1>
            <p className="page-subtitle" style={{ fontSize: '1.05rem', color: '#9a9a9a', maxWidth: '600px', lineHeight: 1.65 }}>
              A comprehensive overview of my capabilities across frontend architecture, backend systems, databases, programming languages, and cloud deployment pipelines.
            </p>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="section" style={{ padding: '0 0 2rem' }}>
        <div className="container">
          <div style={{
            padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
            background: 'rgba(12, 12, 12, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px'
          }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#666666' }} />
              <input
                type="text"
                placeholder="Search skills by name or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem', borderRadius: '8px',
                  background: 'rgba(5, 5, 5, 0.8)', border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff', fontSize: '0.88rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All Skills' },
                { id: 'frontend', label: 'Frontend' },
                { id: 'backend', label: 'Backend' },
                { id: 'languages', label: 'Languages' },
                { id: 'tools', label: 'Tools' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className="nav-pill-item"
                  style={{
                    height: '34px', padding: '0 12px', fontSize: '0.78rem', textTransform: 'capitalize',
                    background: activeCategory === cat.id ? 'linear-gradient(180deg, #ffffff 0%, #d5d5d5 100%)' : 'rgba(15, 15, 15, 0.8)',
                    color: activeCategory === cat.id ? '#000000' : '#cccccc',
                    borderColor: activeCategory === cat.id ? '#ffffff' : 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Cards Grid */}
      <section className="section" style={{ padding: '1rem 0 4rem' }} ref={visualRef}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {filteredSkills.map((skill) => (
              <div
                key={skill.name}
                style={{
                  padding: '1.5rem', background: 'rgba(10, 10, 10, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(25, 25, 25, 0.8)', border: '1px solid rgba(255, 255, 255, 0.12)', display: 'grid', placeItems: 'center', color: '#ffffff' }}>
                        {skill.category === 'frontend' && <Code size={14} />}
                        {skill.category === 'backend' && <Server size={14} />}
                        {skill.category === 'languages' && <Languages size={14} />}
                        {skill.category === 'tools' && <Wrench size={14} />}
                      </div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', margin: 0 }}>{skill.name}</h3>
                    </div>
                    <span style={{
                      fontSize: '0.72rem', padding: '0.2rem 0.55rem', borderRadius: '4px',
                      background: 'rgba(25, 25, 25, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#cccccc'
                    }}>
                      {skill.level}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#9a9a9a', lineHeight: 1.6, marginBottom: '1.25rem', minHeight: '2.8rem' }}>
                    {skill.desc}
                  </p>
                </div>

                <div>
                  <div style={{ height: 4, background: 'rgba(255, 255, 255, 0.08)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${skill.proficiency}%`, background: '#ffffff', borderRadius: 2 }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#777777', marginTop: '0.5rem' }}>
                    <span>Experience: {skill.experience}</span>
                    <span style={{ color: '#ffffff', fontWeight: 500 }}>{skill.proficiency}% Proficiency</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engineering Standards */}
      <section className="section" style={{ padding: '4rem 0', background: '#050505', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div className="container">
          <div className="badge-playful" style={{ marginBottom: '1rem' }}>
            <Star size={13} />
            <span>Engineering Standards</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 600, color: '#ffffff', margin: '0 0 2rem' }}>
            Principles for building <em>clean systems.</em>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            <div style={{ padding: '1.75rem', background: '#0a0a0a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.14)', display: 'grid', placeItems: 'center', color: '#ffffff', marginBottom: '1rem' }}>
                <CheckCircle2 size={16} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.5rem' }}>Strict Type Safety</h3>
              <p style={{ color: '#9a9a9a', fontSize: '0.86rem', lineHeight: 1.6, margin: 0 }}>
                Leveraging TypeScript to catch errors at compile-time and enforce reliable interfaces across components and API models.
              </p>
            </div>

            <div style={{ padding: '1.75rem', background: '#0a0a0a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.14)', display: 'grid', placeItems: 'center', color: '#ffffff', marginBottom: '1rem' }}>
                <Layers size={16} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.5rem' }}>Decoupled Architecture</h3>
              <p style={{ color: '#9a9a9a', fontSize: '0.86rem', lineHeight: 1.6, margin: 0 }}>
                Keeping presentation components isolated from business logic and data providers for seamless testing and scalability.
              </p>
            </div>

            <div style={{ padding: '1.75rem', background: '#0a0a0a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.14)', display: 'grid', placeItems: 'center', color: '#ffffff', marginBottom: '1rem' }}>
                <Sparkles size={16} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.5rem' }}>Performance Optimization</h3>
              <p style={{ color: '#9a9a9a', fontSize: '0.86rem', lineHeight: 1.6, margin: 0 }}>
                Optimizing bundle sizes, utilizing lazy-loaded React routes, image webp formats, and GPU-accelerated CSS animations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
