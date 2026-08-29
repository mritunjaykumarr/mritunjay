import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, X, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useScrollLock } from '../hooks/useScrollLock';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO';

interface CertItem {
  id: number;
  title: string;
  issuer: string;
  date: string;
  img: string;
  credentialUrl?: string;
  skillsVerified: string[];
  desc: string;
}

const certsDatabase: CertItem[] = [
  { id: 1, title: 'Fullstack Web Development Completion', issuer: 'Infosys Springboard', date: 'July 2024', img: '/assets/fullstackC.png', credentialUrl: 'https://drive.google.com/file/d/1InESJ_ExHbQ5QjUo-ie3bvmDETT9v5Q3/view?usp=sharing', skillsVerified: ['React', 'Node.js', 'Express', 'JavaScript', 'REST APIs', 'Fullstack Architecture'], desc: 'Comprehensive specialization covering modern frontend engineering, server-side Node.js programming, RESTful API design, and database integration.' },
  { id: 2, title: 'Claude Code & AI In Action', issuer: 'Infosys Springboard', date: 'March 2026', img: '/assets/cert-6.png', credentialUrl: 'https://drive.google.com/file/d/1InESJ_ExHbQ5QjUo-ie3bvmDETT9v5Q3/view?usp=sharing', skillsVerified: ['AI Integration', 'LLM Prompting', 'Developer Workflows', 'Claude Code CLI'], desc: 'Practical certification on leveraging AI models, prompt engineering, agentic development tools, and building intelligent software features.' },
  { id: 3, title: 'Basic Machine Learning Fundamentals', issuer: 'Infosys Springboard', date: 'September 2024', img: '/assets/machinelearningC.png', credentialUrl: 'https://drive.google.com/file/d/1InESJ_ExHbQ5QjUo-ie3bvmDETT9v5Q3/view?usp=sharing', skillsVerified: ['Python', 'Supervised Learning', 'Model Training', 'Data Preprocessing'], desc: 'Foundational course on machine learning algorithms, linear regression, classification techniques, evaluation metrics, and Python data tools.' },
  { id: 4, title: 'Basic Deep Learning & Neural Networks', issuer: 'Design Institute', date: 'September 2024', img: '/assets/deeplearningC.png', credentialUrl: 'https://drive.google.com/file/d/1InESJ_ExHbQ5QjUo-ie3bvmDETT9v5Q3/view?usp=sharing', skillsVerified: ['Neural Networks', 'Activation Functions', 'Deep Learning Basics', 'Tensor Operations'], desc: 'Specialized training covering deep learning architectures, perceptrons, multi-layer neural networks, backpropagation, and AI applications.' },
  { id: 5, title: 'Frontend Developer Internship Completion', issuer: 'Digicaptain Technology', date: 'December 2026', img: '/assets/internshipC.png', credentialUrl: 'https://drive.google.com/file/d/1InESJ_ExHbQ5QjUo-ie3bvmDETT9v5Q3/view?usp=sharing', skillsVerified: ['Frontend Development', 'UI Motion', 'API Integration', 'Team Collaboration'], desc: 'Official internship completion certificate recognizing 3 months of hands-on production web engineering, UI development, and collaborative deliverables.' }
];

export default function CertificationsPage() {
  usePortfolioMotion();
  useSEO(SEO_CONFIGS.certifications);
  const [selectedCert, setSelectedCert] = useState<CertItem | null>(null);

  useScrollLock(!!selectedCert);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedCert) setSelectedCert(null);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [selectedCert]);

  return (
    <div className="page-wrapper certs-page" style={{ paddingTop: '6rem', paddingBottom: '5rem', background: '#000000', color: '#ffffff', minHeight: '100vh' }}>
      {/* Page Header */}
      <section className="page-header" style={{ padding: '2rem 0 3rem' }}>
        <div className="container">
          <div className="breadcrumb" style={{ fontSize: '0.82rem', color: '#888888', marginBottom: '1rem' }}>
            <Link to="/" style={{ color: '#888888', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#ffffff' }}>Certifications</span>
          </div>

          <div className="page-header-content">
            <div className="badge-playful" style={{ marginBottom: '1rem' }}>
              <ShieldCheck size={13} />
              <span>Verified Credentials</span>
            </div>
            <h1 className="page-title" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', fontWeight: 600, letterSpacing: '-0.04em', margin: '0.5rem 0 1rem' }}>
              Certifications &amp; <em>Accreditations</em>
            </h1>
            <p className="page-subtitle" style={{ fontSize: '1.05rem', color: '#9a9a9a', maxWidth: '600px', lineHeight: 1.65 }}>
              Verified credentials from Infosys Springboard, Design Institute, and industrial engineering internships validating full-stack and AI competencies.
            </p>
          </div>
        </div>
      </section>

      {/* Certifications Grid */}
      <section className="section" style={{ padding: '2rem 0 5rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {certsDatabase.map((cert) => (
              <div
                key={cert.id}
                onClick={() => setSelectedCert(cert)}
                style={{
                  background: 'rgba(10, 10, 10, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column'
                }}
              >
                <div style={{ position: 'relative', height: 200, background: '#050505', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                  <img src={cert.img} alt={cert.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.75)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '5px', padding: '0.2rem 0.55rem', fontSize: '0.72rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Award size={12} /> {cert.issuer}
                  </div>
                </div>

                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#888888' }}>{cert.date}</span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff', margin: '0.35rem 0 0.5rem' }}>{cert.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#9a9a9a', lineHeight: 1.6, marginBottom: '1rem' }}>{cert.desc}</p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {cert.skillsVerified.slice(0, 4).map(skill => (
                      <span key={skill} style={{
                        fontSize: '0.72rem', padding: '0.2rem 0.55rem', borderRadius: '4px',
                        background: 'rgba(25, 25, 25, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', color: '#cccccc'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Preview */}
      {selectedCert && (
        <div className="modal-overlay open" onClick={() => setSelectedCert(null)}>
          <div onClick={e => e.stopPropagation()} className="modal-box" style={{ maxWidth: 800, width: '100%', maxHeight: '90vh', padding: '1.5rem', background: '#0a0a0a', border: '1px solid rgba(255, 255, 255, 0.14)', borderRadius: '14px', position: 'relative', overflowY: 'auto' }}>
            <button
              onClick={() => setSelectedCert(null)}
              aria-label="Close"
              style={{
                position: 'absolute', top: 14, right: 14, width: 32, height: 32,
                borderRadius: '6px', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#ffffff', display: 'grid', placeItems: 'center', cursor: 'pointer', zIndex: 10
              }}
            >
              <X size={16} />
            </button>

            <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.12)', marginBottom: '1.25rem', background: '#000' }}>
              <img src={selectedCert.img} alt={selectedCert.title} style={{ width: '100%', maxHeight: 360, objectFit: 'contain', display: 'block' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#888888' }}>{selectedCert.issuer} · {selectedCert.date}</span>
                <h2 style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)', fontWeight: 600, color: '#ffffff', margin: '0.25rem 0' }}>{selectedCert.title}</h2>
              </div>
              {selectedCert.credentialUrl && (
                <a href={selectedCert.credentialUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ height: '36px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span>Verify Credential</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888888', marginBottom: '0.6rem' }}>
                Verified Competencies:
              </h4>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {selectedCert.skillsVerified.map(skill => (
                  <span key={skill} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.3rem 0.65rem',
                    borderRadius: '5px', background: '#141414', border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff', fontSize: '0.78rem'
                  }}>
                    <CheckCircle2 size={12} /> {skill}
                  </span>
                ))}
              </div>
            </div>

            {selectedCert.credentialUrl && (
              <div style={{ textAlign: 'right' }}>
                <a href={selectedCert.credentialUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                  <span>Verify Credential Document</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
