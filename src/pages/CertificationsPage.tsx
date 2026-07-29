import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Eye, X, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useScrollLock } from '../hooks/useScrollLock';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';

export interface CertItem {
  id: number;
  title: string;
  issuer: string;
  date: string;
  img: string;
  credentialUrl?: string;
  skillsVerified: string[];
  desc: string;
}

export const certsDatabase: CertItem[] = [
  {
    id: 1,
    title: 'Fullstack Web Development Completion',
    issuer: 'Infosys Springboard',
    date: 'July 2024',
    img: '/assets/fullstackC.png',
    credentialUrl: 'https://drive.google.com/file/d/1InESJ_ExHbQ5QjUo-ie3bvmDETT9v5Q3/view?usp=sharing',
    skillsVerified: ['React', 'Node.js', 'Express', 'JavaScript', 'REST APIs', 'Fullstack Architecture'],
    desc: 'Comprehensive specialization covering modern frontend engineering, server-side Node.js programming, RESTful API design, and database integration.'
  },
  {
    id: 2,
    title: 'Claude Code & AI In Action',
    issuer: 'Infosys Springboard',
    date: 'March 2026',
    img: '/assets/cert-6.png',
    credentialUrl: 'https://drive.google.com/file/d/1InESJ_ExHbQ5QjUo-ie3bvmDETT9v5Q3/view?usp=sharing',
    skillsVerified: ['AI Integration', 'LLM Prompting', 'Developer Workflows', 'Claude Code CLI'],
    desc: 'Practical certification on leveraging AI models, prompt engineering, agentic development tools, and building intelligent software features.'
  },
  {
    id: 3,
    title: 'Basic Machine Learning Fundamentals',
    issuer: 'Infosys Springboard',
    date: 'September 2024',
    img: '/assets/machinelearningC.png',
    credentialUrl: 'https://drive.google.com/file/d/1InESJ_ExHbQ5QjUo-ie3bvmDETT9v5Q3/view?usp=sharing',
    skillsVerified: ['Python', 'Supervised Learning', 'Model Training', 'Data Preprocessing'],
    desc: 'Foundational course on machine learning algorithms, linear regression, classification techniques, evaluation metrics, and Python data tools.'
  },
  {
    id: 4,
    title: 'Basic Deep Learning & Neural Networks',
    issuer: 'Design Institute',
    date: 'September 2024',
    img: '/assets/deeplearningC.png',
    credentialUrl: 'https://drive.google.com/file/d/1InESJ_ExHbQ5QjUo-ie3bvmDETT9v5Q3/view?usp=sharing',
    skillsVerified: ['Neural Networks', 'Activation Functions', 'Deep Learning Basics', 'Tensor Operations'],
    desc: 'Specialized training covering deep learning architectures, perceptrons, multi-layer neural networks, backpropagation, and AI applications.'
  },
  {
    id: 5,
    title: 'Frontend Developer Internship Completion',
    issuer: 'Digicaptain Technology',
    date: 'December 2026',
    img: '/assets/internshipC.png',
    credentialUrl: 'https://drive.google.com/file/d/1InESJ_ExHbQ5QjUo-ie3bvmDETT9v5Q3/view?usp=sharing',
    skillsVerified: ['Frontend Development', 'UI Motion', 'API Integration', 'Team Collaboration'],
    desc: 'Official internship completion certificate recognizing 3 months of hands-on production web engineering, UI development, and collaborative deliverables.'
  }
];

export default function CertificationsPage() {
  usePortfolioMotion();
  const [selectedCert, setSelectedCert] = useState<CertItem | null>(null);

  useScrollLock(!!selectedCert);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedCert) {
        setSelectedCert(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedCert]);

  return (
    <div className="page-wrapper certs-page" style={{ paddingTop: '5.5rem', paddingBottom: '5rem' }}>
      {/* Header Banner */}
      <section className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span className="current">Certifications</span>
          </div>
          <div className="page-header-content reveal">
            <div className="section-eyebrow"><ShieldCheck size={14} /> Verified Credentials</div>
            <h1 className="page-title">
              Certifications & <span className="grad">Accreditations</span>
            </h1>
            <p className="page-subtitle">
              Verified certifications from Infosys Springboard, Design Institute, and industrial tech internships validating my technical skills.
            </p>
          </div>
        </div>
      </section>

      {/* Certificates Grid */}
      <section className="section" style={{ padding: '3rem 0 5rem' }}>
        <div className="container">
          <div className="certs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
            {certsDatabase.map((cert) => (
              <div 
                key={cert.id} 
                className="card-glass cert-card-full reveal"
                onClick={() => setSelectedCert(cert)}
                style={{ cursor: 'pointer', borderRadius: 'var(--r-md)', overflow: 'hidden' }}
              >
                {/* Thumb */}
                <div className="cert-thumb" style={{ position: 'relative', height: '220px', background: 'var(--bg-elevated)' }}>
                  <img src={cert.img} alt={cert.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  <div className="cert-overlay" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', gap: '8px' }}>
                    <Eye size={24} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Click to Preview High-Res</span>
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Award size={14} /> {cert.issuer}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cert.date}</span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text)', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                    {cert.title}
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-2)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    {cert.desc}
                  </p>

                  <div className="proj-tags" style={{ marginTop: '0.5rem' }}>
                    {cert.skillsVerified.slice(0, 4).map(skill => (
                      <span key={skill}>{skill}</span>
                    ))}
                    {cert.skillsVerified.length > 4 && (
                      <span>+{cert.skillsVerified.length - 4} more</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* High-Res Certificate Modal */}
      {selectedCert && (
        <div className="modal-bg open" onClick={() => setSelectedCert(null)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '850px', padding: '1.5rem' }}>
            <div className="modal-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--text)' }}>{selectedCert.title}</h2>
                <div style={{ fontSize: '0.88rem', color: 'var(--primary)', fontWeight: 600 }}>{selectedCert.issuer} — {selectedCert.date}</div>
              </div>
              <div className="m-close" onClick={() => setSelectedCert(null)} style={{ cursor: 'pointer', padding: '0.5rem' }}>
                <X size={20} />
              </div>
            </div>

            <div className="modal-body" style={{ padding: 0 }}>
              <div style={{ borderRadius: 'var(--r-sm)', overflow: 'hidden', border: '1px solid var(--border)', background: '#000' }}>
                <img src={selectedCert.img} alt={selectedCert.title} style={{ width: '100%', display: 'block', maxHeight: '550px', objectFit: 'contain' }} />
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Verified Competencies:</h4>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {selectedCert.skillsVerified.map(skill => (
                    <span key={skill} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0.3rem 0.75rem', borderRadius: '15px', background: 'var(--primary-glow)', color: 'var(--primary)', fontSize: '0.82rem', fontWeight: 500 }}>
                      <CheckCircle2 size={13} /> {skill}
                    </span>
                  ))}
                </div>
              </div>

              {selectedCert.credentialUrl && (
                <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                  <a href={selectedCert.credentialUrl} target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span>Verify Credential Document</span>
                    <ExternalLink size={15} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
