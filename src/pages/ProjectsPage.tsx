import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ExternalLink, Search, Layers, X, Sparkles, Code2, 
  Zap, Cpu 
} from 'lucide-react';
import { GithubIcon } from '../components/SocialIcons';
import { useScrollLock } from '../hooks/useScrollLock';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';

export interface ProjectItem {
  id: number;
  category: string;
  title: string;
  desc: string;
  img: string;
  url: string;
  github: string;
  tags: string[];
  fullDesc: string;
  features: string[];
  metrics: { label: string; value: string }[];
  stack: string[];
}

export const allProjects: ProjectItem[] = [
  {
    id: 1,
    category: 'web tools',
    title: 'Bulk Mail Sender',
    desc: 'Mass email platform with CSV upload, Gmail API, Node.js, and Express backend for high-volume campaigns.',
    img: '/assets/bulkmailP.png',
    url: 'https://www.bulkmailsender.online/',
    github: 'https://github.com/mritunjaykumarr',
    tags: ['Web', 'Tools', 'Node.js'],
    fullDesc: 'A fullstack web application designed for high-deliverability bulk email marketing campaigns. Users can import CSV recipient lists, customize HTML templates with dynamic placeholders, and send personalized emails through Gmail API and Node.js.',
    features: [
      'CSV file parsing and recipient verification',
      'Dynamic HTML template engine with variable insertion',
      'Gmail API & Nodemailer transport with retry logic',
      'Real-time delivery logs and bounce tracking'
    ],
    metrics: [
      { label: 'Emails Processed', value: '10,000+' },
      { label: 'Deliverability Rate', value: '99.2%' },
      { label: 'Avg Batch Speed', value: '50/sec' }
    ],
    stack: ['Node.js', 'Express', 'Gmail API', 'JavaScript', 'HTML5/CSS3']
  },
  {
    id: 2,
    category: 'tools',
    title: 'Interactive CLI Portfolio',
    desc: 'Terminal portfolio — run npx mritunjay-portfolio to explore skills, projects, and contact info directly in your terminal.',
    img: '/assets/clip.png',
    url: 'https://github.com/mritunjaykumarr/CLI-Portfolio.git',
    github: 'https://github.com/mritunjaykumarr/CLI-Portfolio.git',
    tags: ['Tools', 'CLI', 'Node.js'],
    fullDesc: 'An interactive command-line interface portfolio built for developers and terminal enthusiasts. Users can run `npx mritunjay-portfolio` anywhere to browse interactive menus, ASCII art, project highlights, and execute quick terminal commands.',
    features: [
      'Custom ASCII banner art and gradient color theme',
      'Interactive arrow-key navigable terminal prompt UI',
      'Instant links to live projects, social profiles, and resume',
      'Zero configuration setup — runs globally via npx'
    ],
    metrics: [
      { label: 'NPM Executions', value: '1,500+' },
      { label: 'Package Size', value: '24 KB' },
      { label: 'Node Version', value: '18+' }
    ],
    stack: ['Node.js', 'Inquirer.js', 'Chalk', 'Gradient-String', 'NPM']
  },
  {
    id: 3,
    category: 'web',
    title: 'Real-Time Currency Converter',
    desc: 'Real-time currency converter with live API integration, 150+ currencies, conversion history, and clean UI.',
    img: '/assets/currencyP.png',
    url: 'https://www.bulkmailsender.online/currency_converter.html',
    github: 'https://github.com/mritunjaykumarr',
    tags: ['Web', 'API'],
    fullDesc: 'A lightning-fast exchange-rate web tool fetching live market rates across 150+ international currencies. Includes instant double-swap, historical calculation, and responsive layout for mobile and desktop.',
    features: [
      'Live exchange rate feed from financial REST APIs',
      'Instant conversion as user types with debounced caching',
      'Currency search dropdown with flags and ISO codes',
      'Offline fallback support with recent exchange rates'
    ],
    metrics: [
      { label: 'Supported Currencies', value: '150+' },
      { label: 'API Latency', value: '<120ms' },
      { label: 'Uptime', value: '99.9%' }
    ],
    stack: ['JavaScript', 'ExchangeRate API', 'CSS Grid', 'LocalCache']
  },
  {
    id: 4,
    category: 'web design',
    title: 'Ad-Free YouTube Experience',
    desc: 'Custom YouTube player with clean minimalist UI, zero advertisements, distraction-free viewing, and custom playback controls.',
    img: '/assets/adfree.png',
    url: 'https://mritunjaykumar2.vercel.app/adfree.html',
    github: 'https://github.com/mritunjaykumarr',
    tags: ['Web', 'Design', 'Media'],
    fullDesc: 'A clean front-end YouTube viewing experience engineered to eliminate pre-roll ads, recommended sidebar distractions, and pop-up overlays while maintaining high-definition video playback control.',
    features: [
      'Clean iframe YouTube player integration',
      'Custom theater mode and full-screen controls',
      'Dark ambient background mode with soft glow backdrop',
      'Instant URL search and playlist queue support'
    ],
    metrics: [
      { label: 'Ads Blocked', value: '100%' },
      { label: 'Load Time', value: '0.4s' },
      { label: 'Distraction Level', value: 'Zero' }
    ],
    stack: ['JavaScript', 'YouTube IFrame API', 'CSS Variables', 'HTML5']
  },
  {
    id: 5,
    category: 'web',
    title: 'Multi-Room Chat App',
    desc: 'Real-time messaging platform with WebSocket support, multi-room architecture, user presence, and modern UI.',
    img: '/assets/chatapp.png',
    url: 'https://chat-app-peach-eight.vercel.app',
    github: 'https://github.com/mritunjaykumarr',
    tags: ['Web', 'Sockets', 'Realtime'],
    fullDesc: 'A full-duplex real-time chat application allowing users to create custom chat rooms, send instant messages, see active online status, and broadcast media links.',
    features: [
      'WebSocket & Socket.io two-way connection',
      'Dynamic room creation and join codes',
      'Live typing indicators and user presence list',
      'Message timestamping and auto-scroll functionality'
    ],
    metrics: [
      { label: 'Message Speed', value: '<20ms' },
      { label: 'Concurrent Users', value: '100+' },
      { label: 'Socket Latency', value: 'Realtime' }
    ],
    stack: ['Node.js', 'Socket.io', 'React', 'CSS Flexbox']
  }
];

export default function ProjectsPage() {
  usePortfolioMotion();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

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
    return allProjects.filter(p => {
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
            <div className="section-eyebrow"><Layers size={14} /> Complete Portfolio</div>
            <h1 className="page-title">
              Featured Work & <span className="grad">Case Studies</span>
            </h1>
            <p className="page-subtitle">
              Explore my full collection of production web applications, open-source utilities, developer CLI tools, and UI experiments.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="section" style={{ padding: '2.5rem 0 1.5rem' }}>
        <div className="container">
          <div className="projects-controls-bar card-glass" style={{ padding: '1.25rem 1.5rem', borderRadius: 'var(--r-md)', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            
            {/* Search Input */}
            <div className="search-box" style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search by title, technology, or category..."
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
              {['all', 'web', 'tools', 'design'].map(f => (
                <button 
                  key={f} 
                  className={`filter-btn ${filterCategory === f ? 'active' : ''}`}
                  onClick={() => setFilterCategory(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
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
            <div className="projects-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
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
                      <span className="proj-cat-badge" style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', color: '#fff', fontWeight: 600 }}>
                        {p.category.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="proj-body" style={{ padding: '1.5rem' }}>
                    <div className="proj-tags" style={{ marginBottom: '0.75rem' }}>
                      {p.tags.map(t => <span key={t}>{t}</span>)}
                    </div>
                    <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--text)' }}>{p.title}</h3>
                    <p style={{ color: 'var(--text-2)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>{p.desc}</p>
                    
                    <div className="proj-btns" style={{ display: 'flex', gap: '0.75rem' }}>
                      <button 
                        className="btn-primary btn-sm" 
                        onClick={(e) => { e.stopPropagation(); setSelectedProject(p); }}
                        style={{ flex: 1, justifyContent: 'center' }}
                      >
                        <span>Case Study</span>
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

      {/* Case Study Modal / Drawer */}
      {selectedProject && (
        <div className="modal-overlay open" onClick={() => setSelectedProject(null)}>
          <div 
            className="modal-box case-study-modal" 
            onClick={(e) => e.stopPropagation()} 
            style={{ maxWidth: '900px', width: '92%', padding: 0, overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
          >
            {/* Modal Header */}
            <div style={{ position: 'relative', height: '280px', flexShrink: 0 }}>
              <img src={selectedProject.img} alt={selectedProject.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-elevated) 0%, transparent 100%)' }} />
              <button 
                className="modal-close" 
                onClick={() => setSelectedProject(null)} 
                aria-label="Close case study"
                style={{ top: '16px', right: '16px', zIndex: 10 }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content Scrollable */}
            <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span className="proj-cat-badge" style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', background: 'var(--primary-glow)', color: 'var(--primary)', fontWeight: 600 }}>
                  {selectedProject.category.toUpperCase()}
                </span>
                <div className="proj-tags" style={{ margin: 0 }}>
                  {selectedProject.tags.map(t => <span key={t}>{t}</span>)}
                </div>
              </div>

              <h2 style={{ fontSize: '2rem', marginTop: '0.75rem', marginBottom: '1rem', color: 'var(--text)' }}>
                {selectedProject.title}
              </h2>

              <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-2)', marginBottom: '2rem' }}>
                {selectedProject.fullDesc}
              </p>

              {/* Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {selectedProject.metrics.map((m, idx) => (
                  <div key={idx} className="card-glass" style={{ padding: '1rem', textAlign: 'center', borderRadius: 'var(--r-sm)' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--primary)' }}>{m.value}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Key Features List */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={18} className="grad-text" /> Core Capabilities & Features
                </h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {selectedProject.features.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: 'var(--text-2)', fontSize: '0.95rem' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technology Stack Tags */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Cpu size={18} className="grad-text" /> Architecture & Technologies
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {selectedProject.stack.map(stk => (
                    <span key={stk} style={{ padding: '0.4rem 0.85rem', borderRadius: '20px', background: 'var(--card-bg)', border: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text)' }}>
                      {stk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href={selectedProject.url} target="_blank" rel="noreferrer" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  <span>Launch Live Demo</span>
                  <ExternalLink size={16} />
                </a>
                <a href={selectedProject.github} target="_blank" rel="noreferrer" className="btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
                  <GithubIcon size={16} />
                  <span>View Source Code</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
