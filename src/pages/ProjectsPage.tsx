import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Search, Layers, X, Sparkles, Code2 } from 'lucide-react';
import { useScrollLock } from '../hooks/useScrollLock';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO';
import ProjectProductModal from '../components/ProjectProductModal';
import type { ExtendedProjectItem } from '../components/ProjectProductModal';
import { EXTENDED_PROJECTS_DATA } from '../data/projectsData';

// Playful: every card is sticker card with hard shadow, filter pills rotate accent/secondary/tertiary, search input playful focus shadow
export default function ProjectsPage() {
  usePortfolioMotion();
  useSEO(SEO_CONFIGS.projects);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<ExtendedProjectItem | null>(null);
  useScrollLock(!!selectedProject);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape' && selectedProject) setSelectedProject(null); };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, [selectedProject]);
  const filteredProjects = useMemo(() => {
    return EXTENDED_PROJECTS_DATA.filter(p => {
      const matchesCategory = filterCategory === 'all' || p.category.toLowerCase().includes(filterCategory.toLowerCase());
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.desc.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [filterCategory, searchQuery]);

  return (
    <div className="page-wrapper projects-page" style={{ paddingTop: '5.5rem', paddingBottom: '5rem', background:'var(--background)', position:'relative' }}>
      {/* confetti behind header */}
      <div aria-hidden="true" style={{ position:'absolute', right:'5%', top:90, width:72, height:72, background:'var(--tertiary)', border:'2px solid var(--foreground)', borderRadius:'50%', boxShadow:'var(--shadow-pop)' }} />
      <section className="page-header" style={{ position:'relative', overflow:'clip' }}>
        <div className="container">
          <div className="breadcrumb" style={{ fontFamily:'var(--font-body)' }}><Link to="/">Home</Link><span>/</span><span className="current">Projects</span></div>
          <div className="page-header-content reveal playful-enter">
            <div className="badge-playful" style={{ background:'var(--accent)', color:'white' }}><Layers size={14} strokeWidth={2.5}/> Complete Product Gallery</div>
            <h1 className="page-title" style={{ fontFamily:'var(--font-heading)', fontWeight:800, marginTop:'0.6rem' }}>
              Live Projects & <span style={{ color:'var(--accent)' }}>Product Showcase</span>
            </h1>
            <p className="page-subtitle" style={{ fontFamily:'var(--font-body)', color:'var(--muted-foreground)' }}>
              Detailed case studies, architecture diagrams, video demos, performance metrics, and problem-solved breakdowns for production SaaS applications.
            </p>
          </div>
        </div>
        <svg aria-hidden="true" viewBox="0 0 120 12" preserveAspectRatio="none" style={{ position:'absolute', bottom:0, left:0, width:'100%', height:12, color:'var(--foreground)' }}><path d="M0 6 Q15 0 30 6 T60 6 T90 6 T120 6" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round"/></svg>
      </section>

      <section className="section" style={{ padding:'2.5rem 0 1.5rem' }}>
        <div className="container">
          <div className="card-sticker" style={{ padding:'1.25rem 1.5rem', display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
            <div className="search-box" style={{ position:'relative', flex:'1', minWidth:'200px' }}>
              <Search size={18} strokeWidth={2.5} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:'var(--muted-foreground)' }} />
              <input type="text" placeholder="Search by product name, technology, or domain..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}
                style={{ width:'100%', padding:'0.75rem 1rem 0.75rem 2.6rem', borderRadius:'var(--radius-md)', background:'var(--input)', border:'2px solid var(--foreground)', color:'var(--foreground)', fontFamily:'var(--font-body)', fontSize:'0.92rem', boxShadow:'var(--shadow-pop)' }} />
              {searchQuery && (<button onClick={()=>setSearchQuery('')} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'white', border:'2px solid var(--foreground)', borderRadius:'50%', width:26, height:26, display:'grid', placeItems:'center', cursor:'pointer' }}><X size={14} strokeWidth={2.5}/></button>)}
            </div>
            <div className="filter-wrap" style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', margin:0 }}>
              {['all','B2B SaaS','web tools','web','tools'].map(f => (
                <button key={f} onClick={()=>setFilterCategory(f)}
                  style={{
                    padding:'0.5rem 1rem', borderRadius:'var(--radius-full)', border:'2px solid var(--foreground)', fontFamily:'var(--font-heading)', fontWeight:700, fontSize:'0.8rem',
                    background: filterCategory===f ? (f==='all'?'var(--accent)': f==='B2B SaaS'?'var(--secondary)':'var(--tertiary)') : 'var(--card)',
                    color: filterCategory===f ? (f==='all' ? 'white' : 'var(--foreground)') : 'var(--foreground)',
                    boxShadow: filterCategory===f ? 'var(--shadow-pop)' : 'none', cursor:'pointer', textTransform:'capitalize'
                  }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ padding:'1.5rem 0 4rem' }}>
        <div className="container">
          {filteredProjects.length===0 ? (
            <div className="card-sticker text-center" style={{ padding:'4rem 2rem', textAlign:'center' }}>
              <Code2 size={40} strokeWidth={2.5} style={{ margin:'0 auto 1rem', color:'var(--accent)' }} />
              <h3 style={{ fontFamily:'var(--font-heading)', fontWeight:800 }}>No matching projects found</h3>
              <p style={{ color:'var(--muted-foreground)', marginTop:'0.5rem', fontFamily:'var(--font-body)' }}>Try refining your search query or switching filters.</p>
              <button className="btn-secondary" onClick={()=>{setSearchQuery(''); setFilterCategory('all');}} style={{ marginTop:'1.5rem' }}>Reset Filters</button>
            </div>
          ) : (
            <div className="projects-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))', gap:'2rem' }}>
              {filteredProjects.map((p, idx) => (
                <div key={p.id} onClick={()=>setSelectedProject(p)} className="card-sticker" style={{ overflow:'hidden', cursor:'pointer', position:'relative', padding:0, transform: idx%2===0 ? 'rotate(-0.3deg)' : 'rotate(0.3deg)' }}>
                  {/* icon half-out */}
                  <div className="card-icon-circle" aria-hidden="true" style={{ position:'absolute', top:-14, left:16, width:36, height:36, borderRadius:'50%', background: idx%3===0?'var(--accent)': idx%3===1?'var(--secondary)':'var(--quaternary)', border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)', display:'grid', placeItems:'center', color: idx%3===0 ? 'white' : 'var(--foreground)', zIndex:2 }}>
                    <Code2 size={16} strokeWidth={2.5} />
                  </div>
                  <div className="proj-img" style={{ position:'relative', height:220, overflow:'hidden', borderBottom:'2px solid var(--foreground)' }}>
                    <img src={p.img} alt={p.title} loading="lazy" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(30,41,59,0.12), transparent)' }} />
                    <div style={{ position:'absolute', top:12, right:12, zIndex:2 }}>
                      <span style={{ padding:'4px 10px', borderRadius:'9999px', fontSize:'0.7rem', background:'var(--card)', color:'var(--foreground)', fontWeight:800, border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)', fontFamily:'var(--font-heading)', textTransform:'uppercase' }}>{p.category}</span>
                    </div>
                  </div>
                  <div className="proj-body" style={{ padding:'1.5rem' }}>
                    <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginBottom:'0.75rem' }}>
                      {p.tags.slice(0,3).map(t => <span key={t} style={{ fontSize:'0.7rem', fontWeight:700, padding:'0.25rem 0.6rem', borderRadius:'9999px', background:'var(--muted)', border:'1px solid var(--foreground)', fontFamily:'var(--font-heading)' }}>{t}</span>)}
                    </div>
                    <h3 style={{ fontSize:'1.25rem', fontFamily:'var(--font-heading)', fontWeight:800, color:'var(--foreground)', marginBottom:'0.5rem' }}>{p.title}</h3>
                    <p style={{ color:'var(--muted-foreground)', fontSize:'0.9rem', lineHeight:1.6, marginBottom:'1rem', fontFamily:'var(--font-body)' }}>{p.desc}</p>
                    <div style={{ display:'flex', gap:'8px', marginBottom:'1.25rem' }}>
                      {p.metrics.slice(0,2).map((m,i)=>(<div key={i} style={{ padding:'6px 10px', borderRadius:'9999px', background:'var(--card)', border:'2px solid var(--foreground)', fontSize:'0.75rem', boxShadow:'var(--shadow-pop)', fontFamily:'var(--font-body)' }}><strong style={{ color: i===0?'var(--accent)':'var(--secondary)' }}>{m.value}</strong> <span style={{ color:'var(--muted-foreground)' }}>{m.label}</span></div>))}
                    </div>
                    <div style={{ display:'flex', gap:'0.75rem' }}>
                      <button className="btn-candy" onClick={(e)=>{e.stopPropagation(); setSelectedProject(p);}} style={{ flex:1, justifyContent:'center', fontSize:'0.85rem' }}>
                        <span>Product Showcase</span><span style={{ background:'white', borderRadius:'50%', width:22, height:22, display:'grid', placeItems:'center', border:'2px solid var(--foreground)' }}><Sparkles size={12} strokeWidth={2.5} color="var(--foreground)"/></span>
                      </button>
                      <a href={p.url} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} style={{ width:44, height:44, borderRadius:'50%', background:'var(--card)', border:'2px solid var(--foreground)', display:'grid', placeItems:'center', boxShadow:'var(--shadow-pop)', color:'var(--foreground)' }} aria-label="Live Demo"><ExternalLink size={16} strokeWidth={2.5}/></a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <ProjectProductModal project={selectedProject} onClose={()=>setSelectedProject(null)} />
    </div>
  );
}
