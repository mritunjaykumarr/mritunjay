import { useState } from 'react';
import { 
  X, ExternalLink, Play, Pause, Image as ImageIcon, Cpu, 
  CheckCircle2, AlertCircle, Layers, Code2, ShieldCheck, Zap 
} from 'lucide-react';
import { GithubIcon } from './SocialIcons';

export interface ExtendedProjectItem {
  id: number;
  category: string;
  title: string;
  tagline: string;
  desc: string;
  img: string;
  videoUrl?: string;
  screenshots?: string[];
  url: string;
  github: string;
  tags: string[];
  fullDesc: string;
  features: string[];
  metrics: { label: string; value: string; sub?: string }[];
  stack: string[];
  architecture: {
    client: string;
    api: string;
    services: string[];
    database: string;
  };
  problemSolved: {
    problem: string;
    solution: string;
    impact: string;
  };
}

interface ProjectProductModalProps {
  project: ExtendedProjectItem | null;
  onClose: () => void;
}

export default function ProjectProductModal({ project, onClose }: ProjectProductModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'video' | 'architecture' | 'screenshots'>('overview');
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState(0);

  if (!project) return null;

  const galleryImages = project.screenshots && project.screenshots.length > 0
    ? project.screenshots
    : [project.img, project.img, project.img];

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div 
        className="modal-box product-showcase-modal card-glass" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '1020px',
          width: '94%',
          maxHeight: '92vh',
          padding: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 'var(--r-lg)',
          border: '1px solid var(--border-glow)',
        }}
      >
        {/* Header Bar */}
        <div className="product-modal-header">
          <div className="product-modal-title-group">
            <span className="product-badge">{project.category.toUpperCase()}</span>
            <h2>{project.title}</h2>
            <p className="product-tagline">{project.tagline}</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="product-modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Layers size={15} /> Overview & Metrics
          </button>
          <button 
            className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`}
            onClick={() => setActiveTab('video')}
          >
            <Play size={15} /> Video Demo
          </button>
          <button 
            className={`tab-btn ${activeTab === 'architecture' ? 'active' : ''}`}
            onClick={() => setActiveTab('architecture')}
          >
            <Cpu size={15} /> Architecture Diagram
          </button>
          <button 
            className={`tab-btn ${activeTab === 'screenshots' ? 'active' : ''}`}
            onClick={() => setActiveTab('screenshots')}
          >
            <ImageIcon size={15} /> Screenshots Gallery ({galleryImages.length})
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="product-modal-body">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="product-tab-content reveal-content">
              {/* Media Preview Stage */}
              <div className="product-stage">
                <img src={project.img} alt={project.title} className="product-stage-img" />
                <div className="product-stage-overlay">
                  <div className="status-indicator">
                    <span className="status-dot-pulse" />
                    <span>Live Product</span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics Grid */}
              <div className="metrics-grid">
                {project.metrics.map((m, i) => (
                  <div key={i} className="metric-card">
                    <div className="metric-val">{m.value}</div>
                    <div className="metric-lbl">{m.label}</div>
                    {m.sub && <div className="metric-sub">{m.sub}</div>}
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="product-section">
                <h3>About the Platform</h3>
                <p className="product-desc-text">{project.fullDesc}</p>
              </div>

              {/* Problems Solved Matrix */}
              <div className="product-section problem-solved-card">
                <h3><AlertCircle size={18} className="text-warning" /> Problem Solved</h3>
                <div className="problem-grid">
                  <div className="prob-box prob-challenge">
                    <h4>The Challenge</h4>
                    <p>{project.problemSolved.problem}</p>
                  </div>
                  <div className="prob-box prob-solution">
                    <h4>Engineering Solution</h4>
                    <p>{project.problemSolved.solution}</p>
                  </div>
                  <div className="prob-box prob-impact">
                    <h4>Business Impact</h4>
                    <p>{project.problemSolved.impact}</p>
                  </div>
                </div>
              </div>

              {/* Core Features */}
              <div className="product-section">
                <h3><Zap size={18} className="text-primary" /> Key Features & Capabilities</h3>
                <div className="features-list-grid">
                  {project.features.map((feat, idx) => (
                    <div key={idx} className="feature-item-card">
                      <CheckCircle2 size={16} className="text-success" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack Badges */}
              <div className="product-section">
                <h3><Code2 size={18} className="text-accent" /> Tech Stack</h3>
                <div className="tech-badges-wrap">
                  {project.stack.map((stk) => (
                    <span key={stk} className="tech-badge-item">
                      {stk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VIDEO DEMO */}
          {activeTab === 'video' && (
            <div className="product-tab-content reveal-content">
              <div className="video-demo-container card-glass">
                {project.videoUrl ? (
                  <iframe 
                    src={project.videoUrl} 
                    title={`${project.title} Video Demo`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="video-iframe"
                  />
                ) : (
                  <div className="simulated-video-player">
                    <img src={project.img} alt="Demo poster" className="video-poster" />
                    <div className="video-player-overlay">
                      <button 
                        onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                        className="play-pause-btn"
                        aria-label="Play/Pause Video"
                      >
                        {isPlayingVideo ? <Pause size={28} /> : <Play size={28} />}
                      </button>
                      <div className="video-player-info">
                        <span className="video-badge-live">SIMULATED DEMO</span>
                        <h4>{project.title} Walkthrough</h4>
                        <p>Interactive product flow & live feature demonstrations</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="video-caption">
                <ShieldCheck size={16} className="text-success" />
                <span>Verified live build demo — interactive preview available at production link.</span>
              </div>
            </div>
          )}

          {/* TAB 3: ARCHITECTURE DIAGRAM */}
          {activeTab === 'architecture' && (
            <div className="product-tab-content reveal-content">
              <div className="architecture-diagram-card card-glass">
                <div className="diagram-header">
                  <h4><Cpu size={18} /> System Architecture Flow</h4>
                  <span className="diagram-tag">End-to-End Pipeline</span>
                </div>
                
                <div className="architecture-nodes-flow">
                  {/* Client Layer */}
                  <div className="arch-node arch-node-client">
                    <span className="node-layer">CLIENT LAYER</span>
                    <h5>{project.architecture.client}</h5>
                    <p>Responsive Single Page Application & Progressive UI</p>
                  </div>

                  <div className="arch-arrow">→</div>

                  {/* API Gateway */}
                  <div className="arch-node arch-node-api">
                    <span className="node-layer">API GATEWAY</span>
                    <h5>{project.architecture.api}</h5>
                    <p>REST & WebSocket routing with rate limiting</p>
                  </div>

                  <div className="arch-arrow">→</div>

                  {/* Services Layer */}
                  <div className="arch-node arch-node-services">
                    <span className="node-layer">CORE SERVICES</span>
                    <div className="sub-services-tags">
                      {project.architecture.services.map((srv, idx) => (
                        <span key={idx} className="srv-chip">{srv}</span>
                      ))}
                    </div>
                  </div>

                  <div className="arch-arrow">→</div>

                  {/* Database / Storage */}
                  <div className="arch-node arch-node-db">
                    <span className="node-layer">DATA PERSISTENCE</span>
                    <h5>{project.architecture.database}</h5>
                    <p>High availability persistence & caching</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SCREENSHOTS GALLERY */}
          {activeTab === 'screenshots' && (
            <div className="product-tab-content reveal-content">
              <div className="gallery-main-view">
                <img 
                  src={galleryImages[selectedScreenshotIndex]} 
                  alt={`${project.title} Screenshot ${selectedScreenshotIndex + 1}`}
                  className="gallery-active-img"
                />
              </div>
              <div className="gallery-thumbs-row">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedScreenshotIndex(idx)}
                    className={`gallery-thumb-btn ${selectedScreenshotIndex === idx ? 'active' : ''}`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="product-modal-footer">
          <a 
            href={project.url} 
            target="_blank" 
            rel="noreferrer" 
            className="btn-primary"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <span>Launch Live Demo</span>
            <ExternalLink size={16} />
          </a>
          <a 
            href={project.github} 
            target="_blank" 
            rel="noreferrer" 
            className="btn-outline"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <GithubIcon size={16} />
            <span>View GitHub Code</span>
          </a>
        </div>
      </div>
    </div>
  );
}
