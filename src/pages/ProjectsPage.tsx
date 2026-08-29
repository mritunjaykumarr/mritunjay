import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Search, Layers, X, Sparkles, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollLock } from '../hooks/useScrollLock';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO';
import ProjectProductModal from '../components/ProjectProductModal';
import type { ExtendedProjectItem } from '../components/ProjectProductModal';
import { EXTENDED_PROJECTS_DATA } from '../data/projectsData';

export default function ProjectsPage() {
  usePortfolioMotion();
  useSEO(SEO_CONFIGS.projects);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<ExtendedProjectItem | null>(null);

  useScrollLock(!!selectedProject);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProject) setSelectedProject(null);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [selectedProject]);

  const filteredProjects = useMemo(() => {
    return EXTENDED_PROJECTS_DATA.filter(p => {
      const matchesCategory = filterCategory === 'all' || p.category.toLowerCase().includes(filterCategory.toLowerCase());
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.desc.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [filterCategory, searchQuery]);

  return (
    <div className="page-wrapper projects-page" style={{ paddingTop: '6rem', paddingBottom: '5rem', background: '#000000', color: '#ffffff', minHeight: '100vh' }}>
      {/* Page Header */}
      <section className="page-header" style={{ padding: '2rem 0 3rem' }}>
        <div className="container">
          <div className="breadcrumb" style={{ fontSize: '0.82rem', color: '#888888', marginBottom: '1rem' }}>
            <Link to="/" style={{ color: '#888888', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#ffffff' }}>Projects</span>
          </div>

          <div className="page-header-content">
            <div className="badge-playful" style={{ marginBottom: '1rem' }}>
              <Layers size={13} />
              <span>Complete Product Portfolio</span>
            </div>
            <h1 className="page-title" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', fontWeight: 600, letterSpacing: '-0.04em', margin: '0.5rem 0 1rem' }}>
              Live Projects & <em>Product Architecture</em>
            </h1>
            <p className="page-subtitle" style={{ fontSize: '1.05rem', color: '#9a9a9a', maxWidth: '600px', lineHeight: 1.65 }}>
              Detailed case studies, metrics, problem-solved breakdowns, and live deployments for production applications and engineering tools.
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
            <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#666666' }} />
              <input
                type="text"
                placeholder="Search by product name, technology, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem', borderRadius: '8px',
                  background: 'rgba(5, 5, 5, 0.8)', border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff', fontSize: '0.88rem'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(255, 255, 255, 0.1)', border: 'none', borderRadius: '50%',
                    width: 22, height: 22, display: 'grid', placeItems: 'center', color: '#ffffff', cursor: 'pointer'
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {['all', 'web tools', 'web', 'tools'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilterCategory(f)}
                  className="nav-pill-item"
                  style={{
                    height: '34px', padding: '0 12px', fontSize: '0.78rem', textTransform: 'capitalize',
                    background: filterCategory === f ? 'linear-gradient(180deg, #ffffff 0%, #d5d5d5 100%)' : 'rgba(15, 15, 15, 0.8)',
                    color: filterCategory === f ? '#000000' : '#cccccc',
                    borderColor: filterCategory === f ? '#ffffff' : 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section" style={{ padding: '1rem 0 5rem' }}>
        <div className="container">
          {filteredProjects.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', background: '#0a0a0a', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px' }}>
              <Code2 size={36} style={{ margin: '0 auto 1rem', color: '#666666' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#ffffff' }}>No matching projects found</h3>
              <p style={{ color: '#888888', marginTop: '0.5rem', fontSize: '0.88rem' }}>Try refining your search query or switching category filters.</p>
              <button className="btn-secondary" onClick={() => { setSearchQuery(''); setFilterCategory('all'); }} style={{ marginTop: '1.25rem' }}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {filteredProjects.map((p, idx) => (
                <motion.div
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className="v3-project-card"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    background: 'rgba(10, 10, 10, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column'
                  }}
                >
                  <div style={{ position: 'relative', height: 210, overflow: 'hidden', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <img src={p.img} alt={p.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: 12, right: 12 }}>
                      <span style={{
                        padding: '4px 10px', borderRadius: '5px', fontSize: '0.72rem',
                        background: 'rgba(0, 0, 0, 0.8)', color: '#ffffff', fontWeight: 500,
                        border: '1px solid rgba(255, 255, 255, 0.2)', textTransform: 'uppercase'
                      }}>
                        {p.category}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                        {p.tags.slice(0, 3).map(t => (
                          <span key={t} style={{
                            fontSize: '0.72rem', padding: '0.2rem 0.55rem', borderRadius: '4px',
                            background: 'rgba(25, 25, 25, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', color: '#cccccc'
                          }}>
                            {t}
                          </span>
                        ))}
                      </div>

                      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.5rem' }}>{p.title}</h3>
                      <p style={{ color: '#9a9a9a', fontSize: '0.86rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>{p.desc}</p>
                    </div>

                    <div>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
                        {p.metrics.slice(0, 2).map((m, i) => (
                          <div key={i} style={{
                            padding: '4px 8px', borderRadius: '5px', background: 'rgba(18, 18, 18, 0.8)',
                            border: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.74rem'
                          }}>
                            <strong style={{ color: '#ffffff' }}>{m.value}</strong> <span style={{ color: '#888888' }}>{m.label}</span>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                        <button
                          className="btn-primary"
                          onClick={(e) => { e.stopPropagation(); setSelectedProject(p); }}
                          style={{ flex: 1, justifyContent: 'center', height: '38px', fontSize: '0.82rem', gap: '6px' }}
                        >
                          <Sparkles size={13} />
                          <span>Case Study</span>
                        </button>
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="btn-secondary"
                          style={{ height: '38px', padding: '0 14px', borderRadius: '7px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.82rem' }}
                          aria-label={`Visit live demo for ${p.title}`}
                        >
                          <span>Live</span>
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <ProjectProductModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
