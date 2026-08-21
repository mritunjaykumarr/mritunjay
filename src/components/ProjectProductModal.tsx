import { useState } from 'react';
import { X, ExternalLink, Play, Pause, Image as ImageIcon, Cpu, CheckCircle2, AlertCircle, Layers, Code2, ShieldCheck, Zap, Star } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
export interface ExtendedProjectItem {
  id:number; category:string; title:string; tagline:string; desc:string; img:string; videoUrl?:string; screenshots?:string[]; url:string; github:string; tags:string[]; fullDesc:string; features:string[]; metrics:{label:string;value:string;sub?:string}[]; stack:string[]; architecture:{client:string; api:string; services:string[]; database:string}; problemSolved:{problem:string; solution:string; impact:string};
}
interface ProjectProductModalProps { project: ExtendedProjectItem | null; onClose:()=>void; }
// Playful: modal as sticker card with hard 2px border + pop shadow, header pill, tabs as pill pills, metrics as confetti badges
export default function ProjectProductModal({ project, onClose }: ProjectProductModalProps) {
  const [activeTab,setActiveTab]=useState<'overview'|'video'|'architecture'|'screenshots'>('overview');
  const [isPlayingVideo,setIsPlayingVideo]=useState(true);
  const [selectedScreenshotIndex,setSelectedScreenshotIndex]=useState(0);
  if(!project) return null;
  const galleryImages=project.screenshots && project.screenshots.length>0 ? project.screenshots : [project.img,project.img,project.img];
  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(30,41,59,0.6)', backdropFilter:'blur(8px)', display:'grid', placeItems:'center', padding:'1rem' }} onClick={onClose} role="dialog" aria-modal="true">
      <div className="card-sticker" onClick={e=>e.stopPropagation()} style={{ maxWidth:1020, width:'94%', maxHeight:'92vh', padding:0, overflow:'hidden', display:'flex', flexDirection:'column', background:'var(--card)', position:'relative' }}>
        <div style={{ padding:'1.25rem 1.5rem', borderBottom:'2px solid var(--foreground)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'var(--muted)', gap:'1rem' }}>
          <div>
            <span style={{ display:'inline-flex', padding:'0.3rem 0.7rem', borderRadius:'9999px', background:'var(--tertiary)', border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)', fontFamily:'var(--font-heading)', fontWeight:800, fontSize:'0.7rem', textTransform:'uppercase' }}>{project.category}</span>
            <h2 style={{ fontFamily:'var(--font-heading)', fontWeight:800, fontSize:'1.3rem', color:'var(--foreground)', marginTop:'0.4rem' }}>{project.title}</h2>
            <p style={{ fontFamily:'var(--font-body)', color:'var(--muted-foreground)', fontSize:'0.9rem' }}>{project.tagline}</p>
          </div>
          <button onClick={onClose} aria-label="Close modal" style={{ width:36, height:36, borderRadius:'50%', background:'var(--card)', border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)', display:'grid', placeItems:'center', cursor:'pointer', flexShrink:0 }}><X size={16} strokeWidth={2.5}/></button>
        </div>

        <div style={{ display:'flex', gap:'0.5rem', padding:'0.75rem 1rem', borderBottom:'2px solid var(--foreground)', overflowX:'auto', background:'var(--background)', flexWrap:'wrap' }}>
          {[
            {id:'overview', label:'Overview & Metrics', Icon:Layers, color:'var(--accent)'},
            {id:'video', label:'Video Demo', Icon:Play, color:'var(--secondary)'},
            {id:'architecture', label:'Architecture', Icon:Cpu, color:'var(--quaternary)'},
            {id:'screenshots', label:`Screenshots (${galleryImages.length})`, Icon:ImageIcon, color:'var(--tertiary)'},
          ].map(tab=>(
            <button key={tab.id} onClick={()=>setActiveTab(tab.id as any)} style={{
              display:'flex', alignItems:'center', gap:'6px', padding:'0.5rem 0.9rem', borderRadius:'9999px', border:'2px solid var(--foreground)', fontFamily:'var(--font-heading)', fontWeight:700, fontSize:'0.8rem',
              background: activeTab===tab.id ? tab.color : 'var(--card)', color: activeTab===tab.id && tab.color!=='var(--tertiary)' ? 'white' : 'var(--foreground)',
              boxShadow: activeTab===tab.id ? 'var(--shadow-pop)' : 'none', cursor:'pointer', whiteSpace:'nowrap'
            }}><tab.Icon size={14} strokeWidth={2.5}/>{tab.label}</button>
          ))}
        </div>

        <div style={{ overflowY:'auto', flex:1, padding:'1.25rem', background:'var(--background)' }}>
          {activeTab==='overview' && (
            <div style={{ display:'grid', gap:'1.5rem' }}>
              <div style={{ position:'relative', borderRadius:'var(--radius-lg)', overflow:'hidden', border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)' }}>
                <img src={project.img} alt={project.title} style={{ width:'100%', display:'block', maxHeight:380, objectFit:'cover' }} />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(30,41,59,0.4), transparent)' }} />
                <div style={{ position:'absolute', top:12, left:12, background:'var(--card)', border:'2px solid var(--foreground)', borderRadius:'9999px', padding:'0.4rem 0.8rem', boxShadow:'var(--shadow-pop)', display:'flex', alignItems:'center', gap:'6px', fontFamily:'var(--font-heading)', fontWeight:800, fontSize:'0.7rem' }}>
                  <span style={{ width:8, height:8, borderRadius:'50%', background:'var(--quaternary)', border:'2px solid var(--foreground)', display:'inline-block' }}/> Live Product
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))', gap:'1rem' }}>
                {project.metrics.map((m,i)=>(
                  <div key={i} className="card-sticker" style={{ padding:'1rem', textAlign:'center', background: i%3===0?'var(--accent)': i%3===1?'var(--secondary)':'var(--tertiary)', color: i%3===2?'var(--foreground)':'white', border:'2px solid var(--foreground)' }}>
                    <div style={{ fontSize:'1.5rem', fontFamily:'var(--font-heading)', fontWeight:800 }}>{m.value}</div>
                    <div style={{ fontSize:'0.75rem', fontFamily:'var(--font-heading)', fontWeight:700, textTransform:'uppercase', opacity:0.9 }}>{m.label}</div>
                    {m.sub && <div style={{ fontSize:'0.7rem', marginTop:'0.25rem', opacity:0.85 }}>{m.sub}</div>}
                  </div>
                ))}
              </div>

              <div className="card-sticker" style={{ padding:'1.5rem' }}>
                <h3 style={{ fontFamily:'var(--font-heading)', fontWeight:800, display:'flex', alignItems:'center', gap:'8px' }}><Star size={18} strokeWidth={2.5} color="var(--accent)"/> About the Platform</h3>
                <p style={{ color:'var(--muted-foreground)', lineHeight:1.7, marginTop:'0.6rem', fontFamily:'var(--font-body)' }}>{project.fullDesc}</p>
              </div>

              <div className="card-sticker" style={{ padding:'1.5rem', background:'var(--muted)' }}>
                <h3 style={{ fontFamily:'var(--font-heading)', fontWeight:800, display:'flex', gap:'8px', alignItems:'center' }}><AlertCircle size={18} strokeWidth={2.5} color="var(--secondary)"/> Problem Solved</h3>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px,1fr))', gap:'1rem', marginTop:'1rem' }}>
                  <div className="card-sticker" style={{ padding:'1rem', background:'var(--card)' }}><h4 style={{ fontFamily:'var(--font-heading)', fontWeight:800, fontSize:'0.85rem', color:'var(--secondary)', textTransform:'uppercase' }}>The Challenge</h4><p style={{ fontFamily:'var(--font-body)', color:'var(--muted-foreground)', fontSize:'0.9rem', marginTop:'0.4rem' }}>{project.problemSolved.problem}</p></div>
                  <div className="card-sticker" style={{ padding:'1rem', background:'var(--card)' }}><h4 style={{ fontFamily:'var(--font-heading)', fontWeight:800, fontSize:'0.85rem', color:'var(--accent)', textTransform:'uppercase' }}>Engineering Solution</h4><p style={{ fontFamily:'var(--font-body)', color:'var(--muted-foreground)', fontSize:'0.9rem', marginTop:'0.4rem' }}>{project.problemSolved.solution}</p></div>
                  <div className="card-sticker" style={{ padding:'1rem', background:'var(--tertiary)' }}><h4 style={{ fontFamily:'var(--font-heading)', fontWeight:800, fontSize:'0.85rem', color:'var(--foreground)', textTransform:'uppercase' }}>Business Impact</h4><p style={{ fontFamily:'var(--font-body)', color:'var(--foreground)', fontSize:'0.9rem', marginTop:'0.4rem', fontWeight:500 }}>{project.problemSolved.impact}</p></div>
                </div>
              </div>

              <div className="card-sticker" style={{ padding:'1.5rem' }}>
                <h3 style={{ fontFamily:'var(--font-heading)', fontWeight:800, display:'flex', gap:'8px', alignItems:'center' }}><Zap size={18} strokeWidth={2.5} color="var(--tertiary)"/> Key Features & Capabilities</h3>
                <div style={{ display:'grid', gap:'0.6rem', marginTop:'1rem' }}>
                  {project.features.map((feat,idx)=>(
                    <div key={idx} style={{ display:'flex', gap:'10px', alignItems:'center', background:'var(--card)', border:'2px solid var(--foreground)', borderRadius:'9999px', padding:'0.6rem 0.9rem', boxShadow:'var(--shadow-pop)', fontFamily:'var(--font-body)', fontSize:'0.9rem' }}>
                      <span style={{ width:22, height:22, borderRadius:'50%', background: idx%3===0?'var(--accent)': idx%3===1?'var(--quaternary)':'var(--secondary)', border:'2px solid var(--foreground)', display:'grid', placeItems:'center', flexShrink:0 }}><CheckCircle2 size={12} strokeWidth={2.5} color="white"/></span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-sticker" style={{ padding:'1.5rem' }}>
                <h3 style={{ fontFamily:'var(--font-heading)', fontWeight:800, display:'flex', gap:'8px', alignItems:'center' }}><Code2 size={18} strokeWidth={2.5} color="var(--accent)"/> Tech Stack</h3>
                <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginTop:'0.75rem' }}>
                  {project.stack.map(stk=>(<span key={stk} style={{ padding:'0.4rem 0.8rem', borderRadius:'9999px', background:'var(--card)', border:'2px solid var(--foreground)', fontFamily:'var(--font-heading)', fontWeight:700, fontSize:'0.8rem', boxShadow:'var(--shadow-pop)' }}>{stk}</span>))}
                </div>
              </div>
            </div>
          )}

          {activeTab==='video' && (
            <div style={{ display:'grid', gap:'1rem' }}>
              <div className="card-sticker" style={{ padding:0, overflow:'hidden' }}>
                {project.videoUrl ? <iframe src={project.videoUrl} title={`${project.title} Video Demo`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ width:'100%', height:400, border:'none', display:'block' }}/> :
                  <div style={{ position:'relative', height:360, background:'var(--muted)', display:'grid', placeItems:'center' }}>
                    <img src={project.img} alt="Demo poster" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.3 }} />
                    <button onClick={()=>setIsPlayingVideo(!isPlayingVideo)} style={{ position:'relative', width:64, height:64, borderRadius:'50%', background:'var(--accent)', border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)', display:'grid', placeItems:'center', color:'white', cursor:'pointer' }}>{isPlayingVideo?<Pause size={24} strokeWidth={2.5}/>:<Play size={24} strokeWidth={2.5}/>}</button>
                    <div style={{ position:'absolute', bottom:12, left:12, right:12, background:'var(--card)', border:'2px solid var(--foreground)', borderRadius:'var(--radius-md)', padding:'0.75rem', boxShadow:'var(--shadow-pop)', textAlign:'center' }}>
                      <span style={{ background:'var(--secondary)', color:'white', borderRadius:'9999px', padding:'0.2rem 0.6rem', fontFamily:'var(--font-heading)', fontWeight:800, fontSize:'0.65rem', border:'2px solid var(--foreground)' }}>SIMULATED DEMO</span>
                      <h4 style={{ fontFamily:'var(--font-heading)', fontWeight:800, marginTop:'0.4rem' }}>{project.title} Walkthrough</h4>
                      <p style={{ fontFamily:'var(--font-body)', color:'var(--muted-foreground)', fontSize:'0.85rem' }}>Interactive product flow & live feature demonstrations</p>
                    </div>
                  </div>
                }
              </div>
              <div style={{ display:'flex', gap:'8px', alignItems:'center', background:'var(--quaternary)', border:'2px solid var(--foreground)', borderRadius:'9999px', padding:'0.6rem 1rem', boxShadow:'var(--shadow-pop)', fontFamily:'var(--font-heading)', fontWeight:700, fontSize:'0.85rem' }}>
                <ShieldCheck size={16} strokeWidth={2.5}/> Verified live build demo — interactive preview available at production link.
              </div>
            </div>
          )}

          {activeTab==='architecture' && (
            <div className="card-sticker" style={{ padding:'1.5rem', background:'var(--muted)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem', marginBottom:'1rem' }}>
                <h4 style={{ fontFamily:'var(--font-heading)', fontWeight:800, display:'flex', gap:'8px', alignItems:'center' }}><Cpu size={18} strokeWidth={2.5} color="var(--accent)"/> System Architecture Flow</h4>
                <span style={{ background:'var(--tertiary)', border:'2px solid var(--foreground)', borderRadius:'9999px', padding:'0.3rem 0.7rem', fontFamily:'var(--font-heading)', fontWeight:800, fontSize:'0.7rem', boxShadow:'var(--shadow-pop)' }}>End-to-End Pipeline</span>
              </div>
              <div style={{ display:'grid', gap:'1rem' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr auto 1fr auto 1fr', gap:'0.75rem', alignItems:'center' }}>
                  <div className="card-sticker" style={{ padding:'1rem', textAlign:'center', background:'var(--accent)', color:'white' }}><span style={{ fontSize:'0.65rem', fontWeight:800, letterSpacing:'0.06em', opacity:0.9 }}>CLIENT LAYER</span><h5 style={{ fontFamily:'var(--font-heading)', fontWeight:800, margin:'0.3rem 0' }}>{project.architecture.client}</h5><p style={{ fontSize:'0.8rem', opacity:0.9 }}>Responsive SPA & PWA</p></div>
                  <div style={{ fontWeight:800, fontSize:'1.2rem', color:'var(--foreground)' }}>→</div>
                  <div className="card-sticker" style={{ padding:'1rem', textAlign:'center', background:'var(--secondary)', color:'white' }}><span style={{ fontSize:'0.65rem', fontWeight:800, letterSpacing:'0.06em', opacity:0.9 }}>API GATEWAY</span><h5 style={{ fontFamily:'var(--font-heading)', fontWeight:800, margin:'0.3rem 0' }}>{project.architecture.api}</h5><p style={{ fontSize:'0.8rem', opacity:0.9 }}>REST & WebSocket routing</p></div>
                  <div style={{ fontWeight:800, fontSize:'1.2rem', color:'var(--foreground)' }}>→</div>
                  <div className="card-sticker" style={{ padding:'1rem', textAlign:'center', background:'var(--card)' }}><span style={{ fontSize:'0.65rem', fontWeight:800, letterSpacing:'0.06em', color:'var(--muted-foreground)' }}>CORE SERVICES</span><div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', justifyContent:'center', marginTop:'0.5rem' }}>{project.architecture.services.map((srv,idx)=>(<span key={idx} style={{ padding:'0.25rem 0.5rem', borderRadius:'9999px', background: idx%2===0?'var(--quaternary)':'var(--tertiary)', border:'2px solid var(--foreground)', fontSize:'0.65rem', fontWeight:700, fontFamily:'var(--font-heading)' }}>{srv}</span>))}</div></div>
                  <div style={{ fontWeight:800, fontSize:'1.2rem', color:'var(--foreground)' }}>→</div>
                  <div className="card-sticker" style={{ padding:'1rem', textAlign:'center', background:'var(--foreground)', color:'white' }}><span style={{ fontSize:'0.65rem', fontWeight:800, letterSpacing:'0.06em', opacity:0.8 }}>DATA PERSISTENCE</span><h5 style={{ fontFamily:'var(--font-heading)', fontWeight:800, margin:'0.3rem 0' }}>{project.architecture.database}</h5><p style={{ fontSize:'0.8rem', opacity:0.8 }}>High availability & caching</p></div>
                </div>
              </div>
            </div>
          )}

          {activeTab==='screenshots' && (
            <div style={{ display:'grid', gap:'1rem' }}>
              <div style={{ borderRadius:'var(--radius-lg)', overflow:'hidden', border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)' }}><img src={galleryImages[selectedScreenshotIndex]} alt={`${project.title} Screenshot ${selectedScreenshotIndex+1}`} style={{ width:'100%', display:'block', maxHeight:500, objectFit:'contain', background:'var(--muted)' }} /></div>
              <div style={{ display:'flex', gap:'0.6rem', overflowX:'auto', padding:'0.5rem 0' }}>
                {galleryImages.map((img,idx)=>(
                  <button key={idx} onClick={()=>setSelectedScreenshotIndex(idx)} style={{ flexShrink:0, width:100, height:70, borderRadius:'var(--radius-md)', overflow:'hidden', border: selectedScreenshotIndex===idx?'2px solid var(--accent)':'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)', cursor:'pointer', opacity: selectedScreenshotIndex===idx?1:0.7 }}>
                    <img src={img} alt={`Thumb ${idx+1}`} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ padding:'1rem 1.25rem', borderTop:'2px solid var(--foreground)', display:'flex', gap:'0.75rem', background:'var(--muted)', flexWrap:'wrap' }}>
          <a href={project.url} target="_blank" rel="noreferrer" className="btn-candy" style={{ flex:1, justifyContent:'center', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'0.5rem' }}>
            <span>Launch Live Demo</span><span style={{ background:'white', borderRadius:'50%', width:22, height:22, display:'grid', placeItems:'center', border:'2px solid var(--foreground)' }}><ExternalLink size={12} strokeWidth={2.5} color="var(--foreground)"/></span>
          </a>
          <a href={project.github} target="_blank" rel="noreferrer" className="btn-secondary" style={{ flex:1, justifyContent:'center', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'0.5rem' }}>
            <GithubIcon size={16} strokeWidth={2.5}/> <span>View GitHub Code</span>
          </a>
        </div>
      </div>
    </div>
  );
}
