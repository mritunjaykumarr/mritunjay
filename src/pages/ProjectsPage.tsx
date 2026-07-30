import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Search, Layers, X, Sparkles, Code2 } from 'lucide-react';
import { useScrollLock } from '../hooks/useScrollLock';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import ProjectProductModal from '../components/ProjectProductModal';
import type { ExtendedProjectItem } from '../components/ProjectProductModal';
import { EXTENDED_PROJECTS_DATA } from '../data/projectsData';

export default function ProjectsPage() {
  usePortfolioMotion();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<ExtendedProjectItem | null>(null);

  useScrollLock(!!selectedProject);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProject) {
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedProject]);

  const filteredProjects = useMemo(() => {
    return EXTENDED_PROJECTS_DATA.filter(p => {
      const matchesCategory = filterCategory === 'all' || p.category.toLowerCase().includes(filterCategory.toLowerCase());
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [filterCategory, searchQuery]);

  return (
    <div className="page-wrapper projects-page" style={{ paddingTop: '5.5rem', paddingBottom: '5rem' }}>
      {/* Header Banner */}
      <section className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span className="current">Projects</span>
          </div>
          <div className="page-header-content reveal">
            <div className="section-eyebrow"><Layers size={14} /> Complete Product Gallery</div>
            <h1 className="page-title">
              Live Projects & <span className="grad">Product Showcase</span>
            </h1>
            <p className="page-subtitle">
              Detailed case studies, architecture diagrams, video demos, performance metrics, and problem-solved breakdowns for Mritunjay's production SaaS applications.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="section" style={{ padding: '2.5rem 0 1.5rem' }}>
        <div className="container">
          <div className="projects-controls-bar card-glass" style={{ padding: '1.25rem 1.5rem', borderRadius: 'var(--r-md)', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            
            {/* Search Input */}
            <div className="search-box" style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search by product name, technology, or domain..."
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
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="filter-wrap" style={{ margin: 0 }}>
              {['all', 'B2B SaaS', 'web tools', 'web', 'tools'].map(f => (
                <button 
                  key={f} 
                  className={`filter-btn ${filterCategory === f ? 'active' : ''}`}
                  onClick={() => setFilterCategory(f)}
                >
                  {f}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Projects Grid Gallery */}
      <section className="section" style={{ padding: '1.5rem 0 4rem' }}>
        <div className="container">
          {filteredProjects.length === 0 ? (
            <div className="card-glass text-center" style={{ padding: '4rem 2rem', borderRadius: 'var(--r-md)' }}>
              <Code2 size={40} className="grad-text" style={{ margin: '0 auto 1rem' }} />
              <h3>No matching projects found</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Try refining your search query or switching filters.</p>
              <button className="btn-outline" onClick={() => { setSearchQuery(''); setFilterCategory('all'); }} style={{ marginTop: '1.5rem' }}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
              {filteredProjects.map((p) => (
                <div 
                  key={p.id} 
                  className="project-card card-glass reveal" 
                  onClick={() => setSelectedProject(p)}
                  style={{ cursor: 'pointer', borderRadius: 'var(--r-md)', overflow: 'hidden', transition: 'all 0.3s ease' }}
                >
                  <div className="proj-img" style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                    <img src={p.img} alt={p.title} className="proj-photo" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div className="proj-img-overlay" />
                    <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
                      <span className="proj-cat-badge" style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', background: 'rgba(99,102,241,0.9)', color: '#fff', fontWeight: 600 }}>
                        {p.category.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="proj-body" style={{ padding: '1.5rem' }}>
                    <div className="proj-tags" style={{ marginBottom: '0.75rem' }}>
                      {p.tags.slice(0, 3).map(t => <span key={t}>{t}</span>)}
                    </div>
                    <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: 'var(--text)' }}>{p.title}</h3>
                    <p style={{ color: 'var(--text-2)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>{p.desc}</p>
                    
                    {/* Performance metrics pills */}
                    <div className="proj-mini-metrics" style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
                      {p.metrics.slice(0, 2).map((m, idx) => (
                        <div key={idx} style={{ padding: '4px 8px', borderRadius: '6px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontSize: '0.75rem' }}>
                          <strong style={{ color: 'var(--primary)' }}>{m.value}</strong> <span style={{ color: 'var(--text-muted)' }}>{m.label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="proj-btns" style={{ display: 'flex', gap: '0.75rem' }}>
                      <button 
                        className="btn-primary btn-sm" 
                        onClick={(e) => { e.stopPropagation(); setSelectedProject(p); }}
                        style={{ flex: 1, justifyContent: 'center' }}
                      >
                        <span>Product Showcase</span>
                        <Sparkles size={14} />
                      </button>
                      <a 
                        href={p.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn-outline btn-sm"
                        onClick={(e) => e.stopPropagation()}
                        style={{ padding: '0.5rem 0.85rem' }}
                        aria-label="Live Demo"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Showcase Modal */}
      <ProjectProductModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  );
}
