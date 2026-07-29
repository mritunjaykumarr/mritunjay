import { useState } from 'react';
import { Award, Eye, X } from 'lucide-react';

const certData = [
  { id: 1, title: 'Fullstack Completion', issuer: 'Infosys — July 2024', img: '/assets/fullstackC.png' },
  { id: 2, title: 'Claude Code In Action', issuer: 'Infosys — March 2026', img: '/assets/cert-6.png' },
  { id: 3, title: 'Basic Machine Learning', issuer: 'Infosys — Sept 2024', img: '/assets/machinelearningC.png' },
  { id: 4, title: 'Basic Deep Learning', issuer: 'Design Institute — Sept 2024', img: '/assets/deeplearningC.png' },
  { id: 5, title: 'Frontend Internship', issuer: 'Completion Certificate', img: '/assets/internshipC.png' },
];

export default function Certifications() {
  const [selectedCert, setSelectedCert] = useState<typeof certData[0] | null>(null);

  return (
    <section id="certifications" className="section certs-section">
      <div className="container">
        <div className="section-eyebrow">Recognition</div>
        <h2 className="section-title reveal">Verified <span className="grad">Credentials</span></h2>

        <div className="certs-grid">
          {certData.map((c) => (
            <div key={c.id} className="cert-card reveal" onClick={() => setSelectedCert(c)}>
              <div className="cert-thumb">
                <img src={c.img} alt={c.title} className="cert-photo" loading="lazy" />
                <div className="cert-overlay">
                  <Eye size={20} />
                  <span>View Certificate</span>
                </div>
              </div>
              <div className="cert-body">
                <div className="cert-icon"><Award size={16} /></div>
                <div>
                  <h4>{c.title}</h4>
                  <span>{c.issuer}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCert && (
        <div className="modal-bg open" onClick={() => setSelectedCert(null)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{selectedCert.title}</h2>
              <div className="m-close" onClick={() => setSelectedCert(null)}><X size={18} /></div>
            </div>
            <div className="modal-body" style={{ padding: '0.75rem' }}>
              <img src={selectedCert.img} alt={selectedCert.title} style={{ width: '100%', borderRadius: 'var(--r-sm)', display: 'block' }} />
              <div style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-2)', fontSize: '0.85rem' }}>
                {selectedCert.issuer}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
