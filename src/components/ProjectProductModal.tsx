import { useState } from 'react';
import { X, ExternalLink, Play, Image as ImageIcon, Cpu, CheckCircle2, Layers } from 'lucide-react';
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
  architecture: { client: string; api: string; services: string[]; database: string };
  problemSolved: { problem: string; solution: string; impact: string };
}

interface ProjectProductModalProps {
  project: ExtendedProjectItem | null;
  onClose: () => void;
}

export default function ProjectProductModal({ project, onClose }: ProjectProductModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'video' | 'architecture' | 'screenshots'>('overview');
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState(0);

  if (!project) return null;

  const galleryImages = project.screenshots && project.screenshots.length > 0 ? project.screenshots : [project.img, project.img, project.img];

  return (
    <div className="modal-overlay open" onClick={onClose} role="dialog" aria-modal="true">
      <div onClick={e => e.stopPropagation()} className="modal-box" style={{ maxWidth: '980px' }}>
        {/* Modal Top Bar */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#050505', gap: '1rem' }}>
          <div>
            <span style={{ display: 'inline-block', padding: '0.2rem 0.55rem', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.14)', fontSize: '0.72rem', textTransform: 'uppercase', color: '#ffffff', fontWeight: 500 }}>
              {project.category}
            </span>
            <h2 style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.35rem)', fontWeight: 600, color: '#ffffff', marginTop: '0.35rem', margin: '0.35rem 0 0.1rem' }}>
              {project.title}
            </h2>
            <p style={{ color: '#9a9a9a', fontSize: '0.82rem', margin: 0 }}>{project.tagline}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              width: 32, height: 32, borderRadius: '6px', background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)', display: 'grid', placeItems: 'center',
              color: '#ffffff', cursor: 'pointer', flexShrink: 0
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', padding: '0.65rem 1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', overflowX: 'auto', background: '#080808' }}>
          {[
            { id: 'overview', label: 'Overview & Metrics', Icon: Layers },
            { id: 'video', label: 'Video Demo', Icon: Play },
            { id: 'architecture', label: 'Architecture', Icon: Cpu },
            { id: 'screenshots', label: `Screenshots (${galleryImages.length})`, Icon: ImageIcon },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="nav-pill-item"
              style={{
                height: '32px', padding: '0 12px', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
                background: activeTab === tab.id ? 'linear-gradient(180deg, #ffffff 0%, #d5d5d5 100%)' : 'transparent',
                color: activeTab === tab.id ? '#000000' : '#cccccc',
                borderColor: activeTab === tab.id ? '#ffffff' : 'rgba(255, 255, 255, 0.1)'
              }}
            >
              <tab.Icon size={13} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '1.25rem', background: '#0a0a0a' }}>
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <img src={project.img} alt={project.title} style={{ width: '100%', display: 'block', maxHeight: 340, objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '5px', padding: '0.3rem 0.65rem', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#ffffff' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} /> Live System
                </div>
              </div>

              {/* Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                {project.metrics.map((m, i) => (
                  <div key={i} style={{ padding: '0.85rem', textAlign: 'center', background: '#121212', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>{m.value}</div>
                    <div style={{ fontSize: '0.72rem', color: '#888888', textTransform: 'uppercase', marginTop: '2px' }}>{m.label}</div>
                    {m.sub && <div style={{ fontSize: '0.68rem', color: '#666666', marginTop: '2px' }}>{m.sub}</div>}
                  </div>
                ))}
              </div>

              <div style={{ padding: '1.25rem', background: '#121212', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px' }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.5rem' }}>About the Architecture</h3>
                <p style={{ color: '#9a9a9a', lineHeight: 1.7, fontSize: '0.88rem', margin: 0 }}>{project.fullDesc}</p>
              </div>

              {/* Problem Solved */}
              <div style={{ padding: '1.25rem', background: '#121212', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px' }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.85rem' }}>Problem &amp; Impact</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
                  <div style={{ padding: '1rem', background: '#0a0a0a', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <h4 style={{ fontSize: '0.74rem', color: '#888888', textTransform: 'uppercase', margin: '0 0 0.35rem' }}>The Challenge</h4>
                    <p style={{ color: '#cccccc', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>{project.problemSolved.problem}</p>
                  </div>
                  <div style={{ padding: '1rem', background: '#0a0a0a', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <h4 style={{ fontSize: '0.74rem', color: '#888888', textTransform: 'uppercase', margin: '0 0 0.35rem' }}>Engineering Solution</h4>
                    <p style={{ color: '#cccccc', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>{project.problemSolved.solution}</p>
                  </div>
                  <div style={{ padding: '1rem', background: '#0a0a0a', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <h4 style={{ fontSize: '0.74rem', color: '#888888', textTransform: 'uppercase', margin: '0 0 0.35rem' }}>Business Impact</h4>
                    <p style={{ color: '#ffffff', fontSize: '0.85rem', margin: 0, lineHeight: 1.6, fontWeight: 500 }}>{project.problemSolved.impact}</p>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div style={{ padding: '1.25rem', background: '#121212', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px' }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.75rem' }}>Core Deliverables</h3>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {project.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.86rem', color: '#cccccc' }}>
                      <CheckCircle2 size={13} style={{ color: '#ffffff', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div style={{ padding: '1.25rem', background: '#121212', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px' }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.6rem' }}>Technology Stack</h3>
                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                  {project.stack.map(stk => (
                    <span key={stk} style={{ padding: '0.25rem 0.6rem', borderRadius: '4px', background: '#0a0a0a', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#cccccc', fontSize: '0.76rem' }}>
                      {stk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'video' && (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ borderRadius: '10px', overflow: 'hidden', background: '#000', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                {project.videoUrl ? (
                  <iframe src={project.videoUrl} title={`${project.title} Demo`} style={{ width: '100%', height: '380px', maxHeight: '55vh', border: 'none' }} allowFullScreen />
                ) : (
                  <div style={{ padding: '3rem', textAlign: 'center', color: '#888888' }}>
                    Video demo available directly at live URL.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ padding: '1.25rem', background: '#121212', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', marginBottom: '1rem' }}>System Architecture</h3>
                <div style={{ display: 'grid', gap: '0.85rem', fontSize: '0.86rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: '#888888' }}>Client Layer:</span>
                    <span style={{ color: '#ffffff', fontWeight: 500 }}>{project.architecture.client}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: '#888888' }}>API Routing:</span>
                    <span style={{ color: '#ffffff', fontWeight: 500 }}>{project.architecture.api}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: '#888888' }}>Database:</span>
                    <span style={{ color: '#ffffff', fontWeight: 500 }}>{project.architecture.database}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                    <span style={{ color: '#888888' }}>Connected Services:</span>
                    <span style={{ color: '#ffffff', fontWeight: 500 }}>{project.architecture.services.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'screenshots' && (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)', background: '#000' }}>
                <img src={galleryImages[selectedScreenshotIndex]} alt="Screenshot" style={{ width: '100%', display: 'block', maxHeight: 380, objectFit: 'contain' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedScreenshotIndex(i)}
                    style={{
                      width: 70, height: 46, borderRadius: '6px', overflow: 'hidden', padding: 0, flexShrink: 0,
                      border: selectedScreenshotIndex === i ? '2px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.15)',
                      cursor: 'pointer', background: '#000'
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div style={{ padding: '0.85rem 1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', background: '#050505' }}>
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '36px', fontSize: '0.82rem' }}
          >
            <GithubIcon size={14} />
            <span>GitHub Repo</span>
          </a>

          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '36px', fontSize: '0.82rem' }}
          >
            <span>Launch Live App</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
