import { Link } from 'react-router-dom';
import { Briefcase, GraduationCap, Calendar, MapPin, CheckCircle, ArrowRight, Download, Sparkles } from 'lucide-react';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO';
export default function ExperiencePage() {
  usePortfolioMotion(); useSEO(SEO_CONFIGS.experience);
  const experiences = [
    {
      id:1, role:'Fullstack Developer', company:'Epigroww Global', location:'New Delhi, India', period:'Present', type:'Full-time',
      desc:'Leading frontend architecture and fullstack feature development for client web platforms and high-traffic applications.',
      highlights:['Designed responsive web apps with React 19, TypeScript, and custom design systems.','Engineered backend APIs with Node.js, Express, Supabase for real-time flow.','Optimized load speeds by 40% using code-splitting, lazy loading.','Built dashboards and customer tools cross-functionally.'],
      skills:['React','TypeScript','Node.js','Express','Supabase','CSS3','REST APIs']
    },
    {
      id:2, role:'Software Developer Intern', company:'Digicaptain Technology', location:'Noida, India', period:'2026 (3 Months)', type:'Internship',
      desc:'Assisted in building client-facing web pages, widgets, and internal utilities.',
      highlights:['Built UI components to strict design guidelines.','Integrated third-party APIs and async transforms.','Git/GitHub workflows, standups, code reviews.','Fixed cross-browser and a11y issues.'],
      skills:['JavaScript (ES6+)','HTML5','CSS3','Sass','Git','GitHub','Vercel']
    }
  ];
  const education=[{id:1, degree:'Bachelor of Computer Applications (BCA)', institution:'State University', location:'India', period:'2023 - 2026', details:'Core CS foundations, software development principles, modern web systems.', coursework:['Data Structures & Algorithms','Database Systems (SQL)','Web Technologies','Software Engineering','OOP']}];
  return (
    <div className="page-wrapper experience-page" style={{ paddingTop:'5.5rem', paddingBottom:'5rem', background:'var(--background)', position:'relative' }}>
      <div aria-hidden="true" style={{ position:'absolute', left:'4%', top:90, width:48, height:48, background:'var(--quaternary)', border:'2px solid var(--foreground)', borderRadius:'50%', boxShadow:'var(--shadow-pop)' }} />
      <section className="page-header" style={{ position:'relative', overflow:'clip' }}>
        <div className="container">
          <div className="breadcrumb" style={{ fontFamily:'var(--font-body)' }}><Link to="/">Home</Link><span>/</span><span className="current">Experience</span></div>
          <div className="page-header-content reveal playful-enter">
            <div className="badge-playful" style={{ background:'var(--accent)', color:'white' }}><Briefcase size={14} strokeWidth={2.5}/> Career & Education</div>
            <h1 className="page-title" style={{ fontFamily:'var(--font-heading)', fontWeight:800, marginTop:'0.6rem' }}>Professional <span style={{ color:'var(--secondary)' }}>Journey & Milestones</span></h1>
            <p className="page-subtitle" style={{ fontFamily:'var(--font-body)', color:'var(--muted-foreground)' }}>A comprehensive view of my software engineering experience, roles, academic foundation, and technical accomplishments.</p>
          </div>
        </div>
        <svg aria-hidden="true" viewBox="0 0 120 12" preserveAspectRatio="none" style={{ position:'absolute', bottom:0, left:0, width:'100%', height:12, color:'var(--foreground)' }}><path d="M0 6 Q15 0 30 6 T60 6 T90 6 T120 6" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round"/></svg>
      </section>

      <section className="section" style={{ padding:'3rem 0' }}>
        <div className="container">
          <div className="badge-playful" style={{ background:'var(--tertiary)' }}><Sparkles size={14} strokeWidth={2.5}/> Work History</div>
          <h2 className="section-title" style={{ fontFamily:'var(--font-heading)', fontWeight:800, marginTop:'0.5rem' }}>Production <span style={{ color:'var(--accent)' }}>Experience</span></h2>
          <div style={{ marginTop:'2.5rem', display:'flex', flexDirection:'column', gap:'2rem', position:'relative', paddingLeft:'1rem' }}>
            {/* dashed line */}
            <div aria-hidden="true" style={{ position:'absolute', left:18, top:20, bottom:20, width:0, borderLeft:'3px dashed var(--foreground)', opacity:0.15 }} />
            {experiences.map((exp, idx)=>(
              <div key={exp.id} className="card-sticker" style={{ padding:'2rem', paddingLeft:'2.5rem', position:'relative', transform: idx===1?'rotate(0.3deg)':undefined }}>
                <div aria-hidden="true" style={{ position:'absolute', left:-14, top:18, width:28, height:28, borderRadius:'50%', background: idx===0?'var(--accent)':'var(--secondary)', border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)', display:'grid', placeItems:'center', color:'white' }}>
                  <Briefcase size={14} strokeWidth={2.5}/>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem' }}>
                  <div>
                    <span style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'0.3rem 0.7rem', borderRadius:'9999px', background:'var(--tertiary)', border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)', fontFamily:'var(--font-heading)', fontWeight:800, fontSize:'0.7rem', textTransform:'uppercase' }}><Briefcase size={12} strokeWidth={2.5}/> {exp.type}</span>
                    <h3 style={{ fontSize:'1.35rem', fontFamily:'var(--font-heading)', fontWeight:800, marginTop:'0.6rem', color:'var(--foreground)' }}>{exp.role}</h3>
                    <div style={{ fontSize:'1rem', color:'var(--accent)', fontWeight:800, marginTop:'0.2rem', fontFamily:'var(--font-heading)' }}>{exp.company}</div>
                  </div>
                  <div style={{ textAlign:'right', fontSize:'0.85rem', color:'var(--muted-foreground)', fontFamily:'var(--font-body)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'6px', justifyContent:'flex-end', background:'var(--card)', border:'2px solid var(--foreground)', borderRadius:'9999px', padding:'0.3rem 0.6rem', boxShadow:'var(--shadow-pop)', fontWeight:700 }}><Calendar size={14} strokeWidth={2.5}/> {exp.period}</div>
                    <div style={{ display:'flex', alignItems:'center', gap:'6px', justifyContent:'flex-end', marginTop:'0.5rem' }}><MapPin size={14} strokeWidth={2.5}/> {exp.location}</div>
                  </div>
                </div>
                <p style={{ marginTop:'1.25rem', color:'var(--muted-foreground)', lineHeight:1.7, fontSize:'1rem', fontFamily:'var(--font-body)' }}>{exp.desc}</p>
                <div style={{ marginTop:'1.25rem' }}>
                  <h4 style={{ fontSize:'0.8rem', fontFamily:'var(--font-heading)', fontWeight:800, color:'var(--foreground)', marginBottom:'0.75rem', textTransform:'uppercase', letterSpacing:'0.06em' }}>Key Contributions & Impact:</h4>
                  <ul style={{ display:'grid', gap:'0.6rem', listStyle:'none', padding:0 }}>
                    {exp.highlights.map((h,i)=>(
                      <li key={i} style={{ display:'flex', gap:'10px', alignItems:'flex-start', color:'var(--muted-foreground)', fontSize:'0.92rem', fontFamily:'var(--font-body)' }}>
                        <span style={{ width:22, height:22, borderRadius:'50%', background:'var(--quaternary)', border:'2px solid var(--foreground)', display:'grid', placeItems:'center', flexShrink:0, marginTop:2 }}><CheckCircle size={12} strokeWidth={2.5} color="var(--foreground)"/></span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ marginTop:'1.5rem', paddingTop:'1rem', borderTop:'2px dashed var(--border)', display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
                  {exp.skills.map(skill=>(<span key={skill} style={{ padding:'0.35rem 0.7rem', borderRadius:'9999px', background:'var(--muted)', border:'2px solid var(--foreground)', fontFamily:'var(--font-heading)', fontWeight:700, fontSize:'0.75rem', boxShadow:'var(--shadow-pop)' }}>{skill}</span>))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ padding:'4rem 0', background:'var(--muted)', borderTop:'2px solid var(--foreground)', borderBottom:'2px solid var(--foreground)' }}>
        <div className="container">
          <div className="badge-playful" style={{ background:'var(--quaternary)' }}><GraduationCap size={14} strokeWidth={2.5}/> Academic Background</div>
          <h2 className="section-title" style={{ fontFamily:'var(--font-heading)', fontWeight:800, marginTop:'0.5rem' }}>Education & <span style={{ color:'var(--secondary)' }}>Studies</span></h2>
          <div style={{ marginTop:'2rem', display:'grid', gap:'1.5rem' }}>
            {education.map(edu=>(
              <div key={edu.id} className="card-sticker" style={{ padding:'2rem', position:'relative', paddingTop:'2.2rem' }}>
                <div className="card-icon-circle" aria-hidden="true" style={{ position:'absolute', top:-16, left:20, width:44, height:44, background:'var(--accent)', border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)', display:'grid', placeItems:'center', color:'white' }}><GraduationCap size={20} strokeWidth={2.5}/></div>
                <h3 style={{ fontSize:'1.25rem', fontFamily:'var(--font-heading)', fontWeight:800, color:'var(--foreground)' }}>{edu.degree}</h3>
                <div style={{ color:'var(--muted-foreground)', fontSize:'0.9rem', marginTop:'0.2rem', fontFamily:'var(--font-body)' }}>{edu.institution} • {edu.period}</div>
                <p style={{ marginTop:'1rem', color:'var(--muted-foreground)', lineHeight:1.7, fontFamily:'var(--font-body)' }}>{edu.details}</p>
                <div style={{ marginTop:'1.25rem' }}>
                  <h4 style={{ fontSize:'0.8rem', fontFamily:'var(--font-heading)', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--foreground)', marginBottom:'0.5rem' }}>Core Modules:</h4>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
                    {edu.coursework.map(c=>(<span key={c} style={{ fontSize:'0.75rem', padding:'0.4rem 0.75rem', borderRadius:'9999px', background:'var(--card)', border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)', color:'var(--foreground)', fontFamily:'var(--font-heading)', fontWeight:700 }}>{c}</span>))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ padding:'4rem 0' }}>
        <div className="container" style={{ textAlign:'center' }}>
          <div className="card-sticker" style={{ padding:'3rem 2rem', textAlign:'center', maxWidth:700, margin:'0 auto', position:'relative' }}>
            <div aria-hidden="true" style={{ position:'absolute', right:-12, top:-12, width:32, height:32, background:'var(--secondary)', border:'2px solid var(--foreground)', borderRadius:'50%', boxShadow:'var(--shadow-pop)', transform:'rotate(12deg)' }} />
            <h2 style={{ fontSize:'1.85rem', fontFamily:'var(--font-heading)', fontWeight:800 }}>Want to see what I&apos;ve <span style={{ color:'var(--accent)' }}>built?</span></h2>
            <p style={{ color:'var(--muted-foreground)', maxWidth:600, margin:'1rem auto 2rem', fontFamily:'var(--font-body)' }}>Explore my full projects gallery containing live web applications, CLI utilities, and open-source tools.</p>
            <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
              <Link to="/projects" className="btn-candy" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'0.5rem' }}><span>Browse Portfolio Gallery</span><span style={{ background:'white', borderRadius:'50%', width:24, height:24, display:'grid', placeItems:'center', border:'2px solid var(--foreground)' }}><ArrowRight size={14} strokeWidth={2.5} color="var(--foreground)"/></span></Link>
              <a href="https://drive.google.com/file/d/1InESJ_ExHbQ5QjUo-ie3bvmDETT9v5Q3/view?usp=sharing" target="_blank" rel="noreferrer" className="btn-secondary" style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', textDecoration:'none' }}><Download size={15} strokeWidth={2.5}/><span>Download Resume</span></a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
