import { useState } from 'react';
import { ExternalLink, X } from 'lucide-react';

const projectData = [
  {
    id: 1,
    category: 'web tools',
    title: 'Bulk Mail Sender',
    desc: 'Mass email platform with CSV upload, Gmail API, Node.js, and Express backend for high-volume campaigns.',
    img: '/assets/bulkmailP.png',
    url: 'https://www.bulkmailsender.online/',
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
    tags: ['Web'],
    fullDesc: 'Real-time messaging platform built with Node.js, Socket.io, and responsive frontend. Features room-based chat and live presence indicators.'
  },
];

export default function Projects() {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<typeof projectData[0] | null>(null);

  const filtered = filter === 'all' ? projectData : projectData.filter(p => p.category.includes(filter));

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-eyebrow">Projects</div>
        <h2 className="section-title reveal">Work I'm <span className="grad">proud of</span></h2>

        <div className="filter-wrap reveal">
          {['all', 'web', 'tools', 'design'].map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {filtered.map((p) => (
            <div key={p.id} className="project-card reveal">
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
                  <button className="btn-primary btn-sm" onClick={() => setSelectedProject(p)}>Preview</button>
                  <a href={p.url} target="_blank" rel="noreferrer" className="btn-outline btn-sm">
                    Live <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProject && (
        <div className="modal-bg open" onClick={() => setSelectedProject(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{selectedProject.title}</h2>
              <div className="m-close" onClick={() => setSelectedProject(null)}><X size={18} /></div>
            </div>
            <div className="modal-body">
              <p style={{ lineHeight: 1.8, color: 'var(--text-2)', marginBottom: '1.5rem' }}>{selectedProject.fullDesc}</p>
              <a href={selectedProject.url} target="_blank" rel="noreferrer" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <span>Visit Project</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
