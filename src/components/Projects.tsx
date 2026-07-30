import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowLeft, ArrowRight, Sparkles, Layers } from 'lucide-react';
import { useCarousel } from '../hooks/useCarousel';
import { useScrollLock } from '../hooks/useScrollLock';
import ProjectProductModal from './ProjectProductModal';
import type { ExtendedProjectItem } from './ProjectProductModal';
import { EXTENDED_PROJECTS_DATA } from '../data/projectsData';

export default function Projects() {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<ExtendedProjectItem | null>(null);

  const filteredProjects = filter === 'all' 
    ? EXTENDED_PROJECTS_DATA 
    : EXTENDED_PROJECTS_DATA.filter(p => p.category.toLowerCase().includes(filter.toLowerCase()));

  const { sectionRef, scrollRef, activeIndex, scrollTo } = useCarousel(filteredProjects.length, '.carousel-card');

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

  return (
    <section id="projects" className="section" ref={sectionRef}>
      <div className="container">
        <div className="section-eyebrow"><Layers size={14} /> Live Product Showcase</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className="section-title reveal" style={{ margin: 0 }}>Featured <span className="grad">Products & Platforms</span></h2>
          <Link to="/projects" className="btn-outline reveal" style={{ padding: '0.6rem 1.25rem' }}>
            <span>View All Projects & Architecture Diagrams</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="filter-wrap reveal" style={{ marginTop: '1.5rem' }}>
          {['all', 'B2B SaaS', 'web tools', 'web', 'tools'].map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', marginTop: '2rem' }}>
        <div className="carousel-track" ref={scrollRef}>
          {filteredProjects.map((p, i) => (
            <div key={p.id} className={`carousel-card project-card reveal ${i === activeIndex ? 'active' : ''}`} onClick={() => setSelectedProject(p)}>
              <div className="proj-img">
                <img src={p.img} alt={p.title} className="proj-photo" loading="lazy" />
                <div className="proj-img-overlay" />
                <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
                  <span className="proj-cat-badge" style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', background: 'rgba(99,102,241,0.9)', color: '#fff', fontWeight: 600 }}>
                    {p.category.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="proj-body">
                <div className="proj-tags">
                  {p.tags.slice(0, 3).map(t => <span key={t}>{t}</span>)}
                </div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>

                {/* Quick performance metrics preview */}
                <div className="proj-mini-metrics">
                  {p.metrics.slice(0, 2).map((m, idx) => (
                    <div key={idx} className="mini-metric-chip">
                      <strong>{m.value}</strong> <span>{m.label}</span>
                    </div>
                  ))}
                </div>

                <div className="proj-btns" style={{ marginTop: '1rem' }}>
                  <button className="btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); setSelectedProject(p); }}>Product Showcase</button>
                  <a href={p.url} target="_blank" rel="noreferrer" className="btn-outline btn-sm" onClick={(e) => e.stopPropagation()}>
                    Live <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length > 1 && (
          <div className="container" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <button className="btn-outline" onClick={() => scrollTo(Math.max(0, activeIndex - 1))} style={{ padding: '0.5rem' }}>
              <ArrowLeft size={16} />
            </button>
            <button className="btn-outline" onClick={() => scrollTo(Math.min(filteredProjects.length - 1, activeIndex + 1))} style={{ padding: '0.5rem' }}>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="container text-center" style={{ marginTop: '3rem' }}>
        <Link to="/projects" className="btn-primary reveal" style={{ display: 'inline-flex', alignItems: 'center' }}>
          <span>Explore Complete Product Gallery</span>
          <Sparkles size={16} />
        </Link>
      </div>

      {/* Product Showcase Modal */}
      <ProjectProductModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </section>
  );
}
