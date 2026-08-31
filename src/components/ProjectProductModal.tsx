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
      <div 
        onClick={e => e.stopPropagation()} 
        className="modal-box" 
        style={{ 
          maxWidth: '980px',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}
      >
        {/* Modal Top Bar */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-2)', gap: '1rem' }}>
          <div>
            <span style={{ display: 'inline-block', padding: '0.2rem 0.55rem', borderRadius: '4px', background: 'var(--surface-3)', border: '1px solid var(--border)', fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text)', fontWeight: 500 }}>
              {project.category}
            </span>
            <h2 style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.35rem)', fontWeight: 600, color: 'var(--text)', marginTop: '0.35rem', margin: '0.35rem 0 0.1rem' }}>
              {project.title}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>{project.tagline}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              width: 32, height: 32, borderRadius: '6px', background: 'var(--surface-3)',
              border: '1px solid var(--border)', display: 'grid', placeItems: 'center',
              color: 'var(--text)', cursor: 'pointer', flexShrink: 0
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', padding: '0.65rem 1.25rem', borderBottom: '1px solid var(--border)', overflowX: 'auto', background: 'var(--surface)' }}>
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
                background: activeTab === tab.id ? 'var(--solid-btn-grad)' : 'var(--surface-2)',
                color: activeTab === tab.id ? 'var(--accent-foreground)' : 'var(--text-muted)',
                borderColor: activeTab === tab.id ? 'var(--border-accent)' : 'var(--border)'
              }}
            >
              <tab.Icon size={13} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '1.25rem', background: 'var(--card)' }}>
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <img src={project.img} alt={project.title} style={{ width: '100%', display: 'block', maxHeight: 340, objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--bg-overlay, var(--surface))', border: '1px solid var(--border)', borderRadius: '5px', padding: '0.3rem 0.65rem', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--text)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} /> Live System
                </div>
              </div>

              {/* Metrics Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                {project.metrics.map((m, i) => (
                  <div key={i} style={{ padding: '0.85rem', textAlign: 'center', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text)' }}>{m.value}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>{m.label}</div>
                    {m.sub && <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '2px' }}>{m.sub}</div>}
                  </div>
                ))}
              </div>

              <div style={{ padding: '1.25rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '10px' }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.5rem' }}>About the Architecture</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.88rem', margin: 0 }}>{project.fullDesc}</p>
              </div>

              {/* Problem Solved */}
              <div style={{ padding: '1.25rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '10px' }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.85rem' }}>Problem &amp; Impact</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
                  <div style={{ padding: '1rem', background: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <h4 style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 0.35rem' }}>The Challenge</h4>
                    <p style={{ color: 'var(--text)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>{project.problemSolved.problem}</p>
                  </div>
                  <div style={{ padding: '1rem', background: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <h4 style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 0.35rem' }}>Engineering Solution</h4>
                    <p style={{ color: 'var(--text)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>{project.problemSolved.solution}</p>
                  </div>
                  <div style={{ padding: '1rem', background: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <h4 style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: '0 0 0.35rem' }}>Business Impact</h4>
                    <p style={{ color: 'var(--text)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6, fontWeight: 500 }}>{project.problemSolved.impact}</p>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div style={{ padding: '1.25rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '10px' }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem' }}>Core Deliverables</h3>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {project.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.86rem', color: 'var(--text)' }}>
                      <CheckCircle2 size={13} style={{ color: 'var(--text)', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div style={{ padding: '1.25rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '10px' }}>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text)', marginBottom: '0.6rem' }}>Technology Stack</h3>
                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                  {project.stack.map(stk => (
                    <span key={stk} style={{ padding: '0.25rem 0.6rem', borderRadius: '4px', background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.76rem' }}>
                      {stk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'video' && (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ borderRadius: '10px', overflow: 'hidden', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                {project.videoUrl ? (
                  <iframe src={project.videoUrl} title={`${project.title} Demo`} style={{ width: '100%', height: '380px', maxHeight: '55vh', border: 'none' }} allowFullScreen />
                ) : (
                  <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Video demo available directly at live URL.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ padding: '1.25rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '10px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>System Architecture</h3>
                <div style={{ display: 'grid', gap: '0.85rem', fontSize: '0.86rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Client Layer:</span>
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>{project.architecture.client}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>API Routing:</span>
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>{project.architecture.api}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Database:</span>
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>{project.architecture.database}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Connected Services:</span>
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>{project.architecture.services.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'screenshots' && (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                <img src={galleryImages[selectedScreenshotIndex]} alt="Screenshot" style={{ width: '100%', display: 'block', maxHeight: 380, objectFit: 'contain' }} />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedScreenshotIndex(i)}
                    style={{
                      width: 70, height: 46, borderRadius: '6px', overflow: 'hidden', padding: 0, flexShrink: 0,
                      border: selectedScreenshotIndex === i ? '2px solid var(--accent)' : '1px solid var(--border)',
                      cursor: 'pointer', background: 'var(--surface-2)'
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
        <div style={{ padding: '0.85rem 1.25rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', background: 'var(--surface-2)' }}>
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
