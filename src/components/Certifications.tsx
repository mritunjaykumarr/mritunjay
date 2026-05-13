import React, { useState } from 'react';

const certData = [
  { 
    id: 1, 
    title: 'Fullstack Completion', 
    issuer: 'Infosys — July 2024', 
    img: '/assets/fullstackC.png',
    icon: 'fa-certificate'
  },
  { 
    id: 2, 
    title: 'Basic Machine Learning', 
    issuer: 'Infosys — Sept 2024', 
    img: '/assets/machinelearningC.png',
    icon: 'fa-certificate'
  },
  { 
    id: 3, 
    title: 'Basic Deep Learning', 
    issuer: 'Design Institute — Sept 2024', 
    img: '/assets/deeplearningC.png',
    icon: 'fa-certificate'
  },
  { 
    id: 4, 
    title: 'Frontend Internship', 
    issuer: 'Completion Certificate', 
    img: '/assets/internshipC.png',
    icon: 'fa-certificate'
  }
];

export default function Certifications() {
  const [selectedCert, setSelectedCert] = useState<any>(null);

  return (
    <section id="certifications" className="section certs-section">
      <div className="container">
        <div className="section-eyebrow">05 · Recognition</div>
        <h2 className="section-title reveal">Verified <span className="grad">Credentials</span></h2>
        
        <div className="certs-grid">
          {certData.map((c) => (
            <div key={c.id} className="cert-card tilt-card reveal" onClick={() => setSelectedCert(c)}>
              <div className="cert-thumb">
                <img src={c.img} alt={c.title} className="cert-photo" />
                <div className="cert-overlay">
                  <i className="fa-solid fa-eye"></i>
                  <span>View Certificate</span>
                </div>
              </div>
              <div className="cert-body">
                <div className="cert-icon"><i className={`fa-solid ${c.icon}`}></i></div>
                <div>
                  <h4>{c.title}</h4>
                  <span>{c.issuer}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cert Modal */}
      {selectedCert && (
        <div className="modal-bg open" id="certModal" onClick={() => setSelectedCert(null)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{selectedCert.title}</h2>
              <div className="m-close" onClick={() => setSelectedCert(null)}>✕</div>
            </div>
            <div className="modal-body" style={{ padding: '10px' }}>
              <img src={selectedCert.img} alt={selectedCert.title} style={{ width: '100%', borderRadius: '12px', display: 'block' }} />
              <div style={{ marginTop: '16px', textAlign: 'center', color: 'var(--text2)' }}>
                {selectedCert.issuer}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
