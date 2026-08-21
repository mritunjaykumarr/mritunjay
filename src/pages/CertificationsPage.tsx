import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Eye, X, ExternalLink, ShieldCheck, CheckCircle2, Star } from 'lucide-react';
import { useScrollLock } from '../hooks/useScrollLock';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO';
interface CertItem { id:number; title:string; issuer:string; date:string; img:string; credentialUrl?:string; skillsVerified:string[]; desc:string; }
const certsDatabase: CertItem[] = [
  { id:1, title:'Fullstack Web Development Completion', issuer:'Infosys Springboard', date:'July 2024', img:'/assets/fullstackC.png', credentialUrl:'https://drive.google.com/file/d/1InESJ_ExHbQ5QjUo-ie3bvmDETT9v5Q3/view?usp=sharing', skillsVerified:['React','Node.js','Express','JavaScript','REST APIs','Fullstack Architecture'], desc:'Comprehensive specialization covering modern frontend engineering, server-side Node.js programming, RESTful API design, and database integration.' },
  { id:2, title:'Claude Code & AI In Action', issuer:'Infosys Springboard', date:'March 2026', img:'/assets/cert-6.png', credentialUrl:'https://drive.google.com/file/d/1InESJ_ExHbQ5QjUo-ie3bvmDETT9v5Q3/view?usp=sharing', skillsVerified:['AI Integration','LLM Prompting','Developer Workflows','Claude Code CLI'], desc:'Practical certification on leveraging AI models, prompt engineering, agentic development tools, and building intelligent software features.' },
  { id:3, title:'Basic Machine Learning Fundamentals', issuer:'Infosys Springboard', date:'September 2024', img:'/assets/machinelearningC.png', credentialUrl:'https://drive.google.com/file/d/1InESJ_ExHbQ5QjUo-ie3bvmDETT9v5Q3/view?usp=sharing', skillsVerified:['Python','Supervised Learning','Model Training','Data Preprocessing'], desc:'Foundational course on machine learning algorithms, linear regression, classification techniques, evaluation metrics, and Python data tools.' },
  { id:4, title:'Basic Deep Learning & Neural Networks', issuer:'Design Institute', date:'September 2024', img:'/assets/deeplearningC.png', credentialUrl:'https://drive.google.com/file/d/1InESJ_ExHbQ5QjUo-ie3bvmDETT9v5Q3/view?usp=sharing', skillsVerified:['Neural Networks','Activation Functions','Deep Learning Basics','Tensor Operations'], desc:'Specialized training covering deep learning architectures, perceptrons, multi-layer neural networks, backpropagation, and AI applications.' },
  { id:5, title:'Frontend Developer Internship Completion', issuer:'Digicaptain Technology', date:'December 2026', img:'/assets/internshipC.png', credentialUrl:'https://drive.google.com/file/d/1InESJ_ExHbQ5QjUo-ie3bvmDETT9v5Q3/view?usp=sharing', skillsVerified:['Frontend Development','UI Motion','API Integration','Team Collaboration'], desc:'Official internship completion certificate recognizing 3 months of hands-on production web engineering, UI development, and collaborative deliverables.' }
];
// Playful: cert cards as sticker with icon half-out, confetti badge, modal hard shadow pill
export default function CertificationsPage() {
  usePortfolioMotion(); useSEO(SEO_CONFIGS.certifications);
  const [selectedCert, setSelectedCert] = useState<CertItem | null>(null);
  useScrollLock(!!selectedCert);
  useEffect(()=>{ const h=(e:KeyboardEvent)=>{ if(e.key==='Escape'&&selectedCert) setSelectedCert(null)}; window.addEventListener('keydown',h); return()=>window.removeEventListener('keydown',h)},[selectedCert]);
  return (
    <div className="page-wrapper certs-page" style={{ paddingTop:'5.5rem', paddingBottom:'5rem', background:'var(--background)', position:'relative' }}>
      <div aria-hidden="true" style={{ position:'absolute', right:'5%', top:90, width:64, height:64, background:'var(--tertiary)', border:'2px solid var(--foreground)', borderRadius:'50%', boxShadow:'var(--shadow-pop)' }} />
      <section className="page-header" style={{ position:'relative', overflow:'clip' }}>
        <div className="container">
          <div className="breadcrumb" style={{ fontFamily:'var(--font-body)' }}><Link to="/">Home</Link><span>/</span><span className="current">Certifications</span></div>
          <div className="page-header-content reveal playful-enter">
            <div className="badge-playful" style={{ background:'var(--quaternary)' }}><ShieldCheck size={14} strokeWidth={2.5}/> Verified Credentials</div>
            <h1 className="page-title" style={{ fontFamily:'var(--font-heading)', fontWeight:800, marginTop:'0.6rem' }}>Certifications & <span style={{ color:'var(--accent)' }}>Accreditations</span></h1>
            <p className="page-subtitle" style={{ fontFamily:'var(--font-body)', color:'var(--muted-foreground)' }}>Verified certifications from Infosys Springboard, Design Institute, and industrial tech internships validating my technical skills.</p>
          </div>
        </div>
        <svg aria-hidden="true" viewBox="0 0 120 12" preserveAspectRatio="none" style={{ position:'absolute', bottom:0, left:0, width:'100%', height:12, color:'var(--foreground)' }}><path d="M0 6 Q15 0 30 6 T60 6 T90 6 T120 6" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round"/></svg>
      </section>

      <section className="section" style={{ padding:'3rem 0 5rem' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'1.5rem' }}>
            {certsDatabase.map((cert, idx)=>(
              <div key={cert.id} onClick={()=>setSelectedCert(cert)} className="card-sticker" style={{ overflow:'hidden', cursor:'pointer', padding:0, position:'relative', transform: idx%2===0?'rotate(-0.2deg)':'rotate(0.2deg)' }}>
                <div style={{ position:'absolute', top:12, left:12, zIndex:2, background:'var(--card)', border:'2px solid var(--foreground)', borderRadius:'9999px', padding:'0.25rem 0.6rem', fontFamily:'var(--font-heading)', fontWeight:800, fontSize:'0.7rem', boxShadow:'var(--shadow-pop)', display:'flex', alignItems:'center', gap:4, color:'var(--foreground)' }}>
                  <Award size={12} strokeWidth={2.5}/> {cert.issuer}
                </div>
                <div style={{ position:'relative', height:220, background:'var(--muted)', borderBottom:'2px solid var(--foreground)', overflow:'hidden' }}>
                  <img src={cert.img} alt={cert.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} loading="lazy" />
                  <div style={{ position:'absolute', inset:0, background:'rgba(30,41,59,0.0)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', opacity:0, transition:'opacity 200ms', color:'white', gap:8 }} className="cert-overlay">
                    <Eye size={24} strokeWidth={2.5}/>
                    <span style={{ fontWeight:800, fontSize:'0.85rem', fontFamily:'var(--font-heading)', background:'var(--card)', color:'var(--foreground)', border:'2px solid var(--foreground)', borderRadius:'9999px', padding:'0.35rem 0.9rem', boxShadow:'var(--shadow-pop)' }}>Click to Preview</span>
                  </div>
                </div>
                <div style={{ padding:'1.5rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.5rem' }}>
                    <span style={{ fontSize:'0.75rem', color:'var(--muted-foreground)', fontFamily:'var(--font-body)', fontWeight:600 }}>{cert.date}</span>
                    <span style={{ width:28, height:28, borderRadius:'50%', background: idx%3===0?'var(--accent)': idx%3===1?'var(--secondary)':'var(--tertiary)', border:'2px solid var(--foreground)', display:'grid', placeItems:'center', color: idx%3===2?'var(--foreground)':'white' }}><Star size={12} strokeWidth={2.5} fill="currentColor"/></span>
                  </div>
                  <h3 style={{ fontSize:'1.15rem', fontFamily:'var(--font-heading)', fontWeight:800, color:'var(--foreground)', marginBottom:'0.6rem', lineHeight:1.3 }}>{cert.title}</h3>
                  <p style={{ fontSize:'0.85rem', color:'var(--muted-foreground)', lineHeight:1.6, marginBottom:'1rem', fontFamily:'var(--font-body)' }}>{cert.desc}</p>
                  <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
                    {cert.skillsVerified.slice(0,4).map(skill=>(<span key={skill} style={{ fontSize:'0.7rem', fontWeight:700, padding:'0.25rem 0.6rem', borderRadius:'9999px', background:'var(--muted)', border:'2px solid var(--foreground)', fontFamily:'var(--font-heading)', boxShadow:'var(--shadow-pop)' }}>{skill}</span>))}
                    {cert.skillsVerified.length>4 && <span style={{ fontSize:'0.7rem', fontWeight:800, padding:'0.25rem 0.6rem', borderRadius:'9999px', background:'var(--tertiary)', border:'2px solid var(--foreground)', fontFamily:'var(--font-heading)' }}>+{cert.skillsVerified.length-4} more</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedCert && (
        <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(30,41,59,0.6)', backdropFilter:'blur(8px)', display:'grid', placeItems:'center', padding:'1rem' }} onClick={()=>setSelectedCert(null)}>
          <div className="card-sticker" onClick={e=>e.stopPropagation()} style={{ maxWidth:850, width:'96%', maxHeight:'90vh', overflowY:'auto', padding:'1.5rem', background:'var(--card)', position:'relative' }}>
            <button onClick={()=>setSelectedCert(null)} aria-label="Close" style={{ position:'absolute', top:12, right:12, width:36, height:36, borderRadius:'50%', background:'var(--card)', border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)', display:'grid', placeItems:'center', cursor:'pointer' }}><X size={16} strokeWidth={2.5}/></button>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:'1rem', marginBottom:'1rem', paddingRight:'2.5rem' }}>
              <div>
                <h2 style={{ fontSize:'1.4rem', fontFamily:'var(--font-heading)', fontWeight:800, color:'var(--foreground)' }}>{selectedCert.title}</h2>
                <div style={{ fontSize:'0.85rem', color:'var(--accent)', fontWeight:800, fontFamily:'var(--font-heading)', marginTop:'0.2rem' }}>{selectedCert.issuer} — {selectedCert.date}</div>
              </div>
            </div>
            <div style={{ borderRadius:'var(--radius-md)', overflow:'hidden', border:'2px solid var(--foreground)', background:'#000', boxShadow:'var(--shadow-pop)' }}>
              <img src={selectedCert.img} alt={selectedCert.title} style={{ width:'100%', display:'block', maxHeight:550, objectFit:'contain' }} />
            </div>
            <div style={{ marginTop:'1.25rem' }}>
              <h4 style={{ fontSize:'0.8rem', fontFamily:'var(--font-heading)', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--foreground)', marginBottom:'0.5rem' }}>Verified Competencies:</h4>
              <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                {selectedCert.skillsVerified.map(skill=>(
                  <span key={skill} style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'0.4rem 0.8rem', borderRadius:'9999px', background:'var(--card)', border:'2px solid var(--foreground)', color:'var(--foreground)', fontSize:'0.8rem', fontWeight:700, fontFamily:'var(--font-heading)', boxShadow:'var(--shadow-pop)' }}><CheckCircle2 size={13} strokeWidth={2.5}/> {skill}</span>
                ))}
              </div>
            </div>
            {selectedCert.credentialUrl && (
              <div style={{ marginTop:'1.5rem', textAlign:'right' }}>
                <a href={selectedCert.credentialUrl} target="_blank" rel="noreferrer" className="btn-candy" style={{ display:'inline-flex', alignItems:'center', gap:'8px', textDecoration:'none' }}>
                  <span>Verify Credential Document</span><span style={{ background:'white', borderRadius:'50%', width:22, height:22, display:'grid', placeItems:'center', border:'2px solid var(--foreground)' }}><ExternalLink size={12} strokeWidth={2.5} color="var(--foreground)"/></span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
