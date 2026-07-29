import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, X, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useCarousel } from '../hooks/useCarousel';
import { useScrollLock } from '../hooks/useScrollLock';

const projectData = [
  {
    id: 1,
    category: 'web tools',
    title: 'Bulk Mail Sender',
    desc: 'Mass email platform with CSV upload, Gmail API, Node.js, and Express backend for high-volume campaigns.',
    img: '/assets/bulkmailP.png',
    url: 'https://www.bulkmailsender.online/',
    github: 'https://github.com/mritunjaykumarr',
    tags: ['Web', 'Tools'],
    fullDesc: 'A web-based bulk email sender with CSV upload, Gmail API, Node.js, Express. Allows sending personalised emails to thousands of recipients from a CSV file.'
  },
  {
    id: 2,
    category: 'tools',
    title: 'CLI Portfolio',
    desc: 'Interactive terminal portfolio — run npx mritunjay-portfolio to explore skills, projects, and contact info.',
    img: '/assets/clip.png',
    url: 'https://github.com/mritunjaykumarr/CLI-Portfolio.git',
    github: 'https://github.com/mritunjaykumarr/CLI-Portfolio.git',
    tags: ['Tools'],
    fullDesc: "Run 'npx mritunjay-portfolio' in any terminal to launch an interactive CLI portfolio. Features ASCII art, animated prompts, and navigable project info."
  },
  {
    id: 3,
    category: 'web',
    title: 'Currency Converter',
    desc: 'Real-time currency converter with live API integration, 150+ currencies, and clean interface.',
    img: '/assets/currencyP.png',
    url: 'https://www.bulkmailsender.online/currency_converter.html',
    github: 'https://github.com/mritunjaykumarr',
    tags: ['Web'],
    fullDesc: 'Real-time currency converter supporting 150+ currencies via live exchange-rate API. Features instant conversion and a clean UI.'
  },
  {
    id: 4,
    category: 'web design',
    title: 'Ad-Free YouTube Player',
    desc: 'Custom YouTube player with clean UI, zero ads, and distraction-free cinematic viewing.',
    img: '/assets/adfree.png',
    url: 'https://mritunjaykumar2.vercel.app/adfree.html',
    github: 'https://github.com/mritunjaykumarr',
    tags: ['Web', 'Design'],
    fullDesc: 'Custom YouTube player wrapper that strips all ads and recommendations. Built with JavaScript and YouTube IFrame API.'
  },
  {
    id: 5,
    category: 'web',
    title: 'Chat App',
    desc: 'Real-time messaging platform with WebSocket support, multi-room architecture, and modern UI.',
    img: '/assets/chatapp.png',
    url: 'https://chat-app-peach-eight.vercel.app',
    github: 'https://github.com/mritunjaykumarr',
    tags: ['Web'],
    fullDesc: 'Real-time messaging platform built with Node.js, Socket.io, and responsive frontend. Features room-based chat and live presence indicators.'
  },
];

export default function Projects() {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<typeof projectData[0] | null>(null);

  const filteredProjects = filter === 'all' 
    ? projectData 
    : projectData.filter(p => p.category.includes(filter));

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
        <div className="section-eyebrow">Projects Overview</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 className="section-title reveal" style={{ margin: 0 }}>Work I'm <span className="grad">proud of</span></h2>
          <Link to="/projects" className="btn-outline reveal" style={{ padding: '0.6rem 1.25rem' }}>
            <span>View All Projects & Case Studies</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="filter-wrap reveal" style={{ marginTop: '1.5rem' }}>
          {['all', 'web', 'tools', 'design'].map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
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
              </div>
              <div className="proj-body">
                <div className="proj-tags">
                  {p.tags.map(t => <span key={t}>{t}</span>)}
                </div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="proj-btns">
                  <button className="btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); setSelectedProject(p); }}>Preview</button>
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
          <span>Explore Complete Projects Gallery</span>
          <Sparkles size={16} />
        </Link>
      </div>

      {selectedProject && (
        <div className="modal-overlay open" onClick={() => setSelectedProject(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', padding: 0, overflow: 'hidden' }}>
            <button className="modal-close" onClick={() => setSelectedProject(null)} aria-label="Close modal"><X size={18} /></button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 0 }}>
              <img src={selectedProject.img} alt={selectedProject.title} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
              <div style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{selectedProject.title}</h2>
                <div className="proj-tags" style={{ marginBottom: '1.5rem' }}>
                  {selectedProject.tags.map(t => <span key={t}>{t}</span>)}
                </div>
                <p style={{ lineHeight: 1.8, color: 'var(--text-2)', marginBottom: '2rem' }}>{selectedProject.fullDesc}</p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <a href={selectedProject.url} target="_blank" rel="noreferrer" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    <span>Live Demo</span>
                    <ExternalLink size={16} />
                  </a>
                  <Link to="/projects" className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
                    <span>Full Case Study</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
