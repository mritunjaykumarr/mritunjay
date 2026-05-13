import { useState } from 'react';

const projectData = [
  { 
    id: 1, 
    category: 'web tools', 
    title: 'Bulk Mail Sender', 
    desc: 'Mass email platform with CSV upload, Gmail API, Node.js, and Express backend for high-volume communication campaigns.', 
    img: '/assets/bulkmailP.png', 
    url: 'https://www.bulkmailsender.online/',
    tags: ['Web', 'Tools'],
    icon: 'fa-envelope-open-text',
    fullDesc: 'A web-based bulk email sender with CSV upload, Gmail API, Node.js, Express. Allows sending personalised emails to thousands of recipients from a CSV file.'
  },
  { 
    id: 2, 
    category: 'tools', 
    title: 'CLI Portfolio', 
    desc: 'Interactive terminal portfolio — run npx mritunjay-portfolio to explore skills, projects, and contact info in your terminal.', 
    img: '/assets/clip.png', 
    url: 'https://github.com/mritunjaykumarr/CLI-Portfolio.git',
    tags: ['Tools'],
    icon: 'fa-terminal',
    fullDesc: "Run 'npx mritunjay-portfolio' in any terminal to launch an interactive CLI portfolio. Features ASCII art, animated prompts, and navigable project info."
  },
  { 
    id: 3, 
    category: 'web', 
    title: 'Currency Converter', 
    desc: 'Real-time currency converter with live API integration, 150+ currencies, and a clean intuitive interface.', 
    img: '/assets/currencyP.png', 
    url: 'https://www.bulkmailsender.online/currency_converter.html',
    tags: ['Web'],
    icon: 'fa-coins',
    fullDesc: 'Real-time currency converter supporting 150+ currencies via live exchange-rate API. Features instant conversion and a clean UI.'
  },
  { 
    id: 4, 
    category: 'web design', 
    title: 'Ad-Free YouTube Player', 
    desc: 'Custom YouTube player with a clean UI, zero ads, and a distraction-free cinematic viewing experience.', 
    img: '/assets/adfree.png', 
    url: 'https://mritunjaykumar2.vercel.app/adfree.html',
    tags: ['Web', 'Design'],
    icon: 'fa-youtube',
    fullDesc: 'Custom YouTube player wrapper that strips all ads and recommendations. Built with JavaScript and YouTube IFrame API.'
  },
  { 
    id: 5, 
    category: 'web', 
    title: 'Chat App', 
    desc: 'Real-time messaging platform with WebSocket support, multi-room architecture, and a modern conversational UI.', 
    img: '/assets/chatapp.png', 
    url: 'https://mritunjaychatapp2.vercel.app',
    tags: ['Web'],
    icon: 'fa-comments',
    fullDesc: 'Real-time messaging platform built with Node.js, Socket.io, and responsive frontend. Features room-based chat and live presence indicators.'
  },
];

export default function Projects() {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const filtered = filter === 'all' ? projectData : projectData.filter(p => p.category.includes(filter));

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-eyebrow">04 · Projects</div>
        <h2 className="section-title reveal">Work I'm <span className="grad">proud of</span></h2>

        <div className="filter-wrap reveal">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`filter-btn ${filter === 'web' ? 'active' : ''}`} onClick={() => setFilter('web')}>Web</button>
          <button className={`filter-btn ${filter === 'tools' ? 'active' : ''}`} onClick={() => setFilter('tools')}>Tools</button>
          <button className={`filter-btn ${filter === 'design' ? 'active' : ''}`} onClick={() => setFilter('design')}>Design</button>
        </div>

        <div className="projects-grid">
          {filtered.map((p) => (
            <div key={p.id} className="project-card tilt-card reveal">
              <div className="proj-img">
                <img src={p.img} alt={p.title} className="proj-photo" />
                <div className="proj-img-overlay"></div>
              </div>
              <div className="proj-body">
                <div className="proj-tags">
                  {p.tags.map(t => <span key={t}>{t}</span>)}
                </div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="proj-btns">
                  <button className="btn-sm btn-glow preview-btn" onClick={() => setSelectedProject(p)}>Preview</button>
                  <a href={p.url} target="_blank" rel="noreferrer" className="btn-sm btn-ghost">Live <i className="fa-solid fa-arrow-up-right-from-square"></i></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <div className="modal-bg open" id="projectModal" onClick={() => setSelectedProject(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2 id="modalTitle">{selectedProject.title}</h2>
              <div className="m-close" onClick={() => setSelectedProject(null)}>✕</div>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '3rem', color: 'var(--cyan)' }}>
                <i className={`fa-solid ${selectedProject.icon}`}></i>
              </div>
              <p id="modalDesc" style={{ lineHeight: 1.8, color: 'var(--text2)' }}>{selectedProject.fullDesc}</p>
              <div style={{ marginTop: '24px' }}>
                <a href={selectedProject.url} target="_blank" rel="noreferrer" className="btn-glow" style={{ width: '100%', justifyContent: 'center' }}>
                  <span>Visit Project</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
