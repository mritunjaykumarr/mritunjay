import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Code, Server, Languages, Wrench, Search, Sparkles, Cpu, Layers, CheckCircle2, Star } from 'lucide-react';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO';
interface SkillItem { name:string; category:'frontend'|'backend'|'languages'|'tools'; proficiency:number; level:'Expert'|'Advanced'|'Proficient'; desc:string; experience:string; }
const skillsDatabase: SkillItem[] = [
  { name:'HTML5 & CSS3', category:'frontend', proficiency:95, level:'Expert', desc:'Semantic markup, modern layout math (Flex/Grid), accessibility (WCAG), CSS animations.', experience:'2+ Years' },
  { name:'JavaScript (ES6+)', category:'frontend', proficiency:90, level:'Expert', desc:'Async execution, closures, DOM manipulation, ES modules, Web APIs.', experience:'2+ Years' },
  { name:'React 19', category:'frontend', proficiency:88, level:'Advanced', desc:'Hooks, custom state management, component architecture, lazy loading, context.', experience:'2+ Years' },
  { name:'TypeScript', category:'frontend', proficiency:82, level:'Advanced', desc:'Strict typing, generics, interfaces, type-safe API client integration.', experience:'1.5+ Years' },
  { name:'Sass / SCSS', category:'frontend', proficiency:85, level:'Advanced', desc:'Modular styling, mixins, custom utility classes, CSS custom properties.', experience:'2+ Years' },
  { name:'Responsive & Motion UI', category:'frontend', proficiency:92, level:'Expert', desc:'Fluid layout breakpoints, mobile-first design, GSAP scroll triggers, CSS keyframes.', experience:'2+ Years' },
  { name:'Node.js', category:'backend', proficiency:82, level:'Advanced', desc:'Event loop asynchronous servers, file streaming, CLI scripts, NPM modules.', experience:'2+ Years' },
  { name:'Express.js', category:'backend', proficiency:80, level:'Advanced', desc:'RESTful API routing, middleware stacks, CORS handling, error handling.', experience:'2+ Years' },
  { name:'Supabase', category:'backend', proficiency:84, level:'Advanced', desc:'PostgreSQL database modeling, authentication, storage buckets, row-level security.', experience:'1+ Year' },
  { name:'PostgreSQL', category:'backend', proficiency:75, level:'Proficient', desc:'Relational schema design, indexes, SQL queries, join operations.', experience:'1+ Year' },
  { name:'MongoDB', category:'backend', proficiency:72, level:'Proficient', desc:'Document schemas, aggregation pipelines, Mongoose ODM.', experience:'1+ Year' },
  { name:'WebSockets & Socket.io', category:'backend', proficiency:78, level:'Proficient', desc:'Real-time duplex messaging, channel subscription, presence event broadcasting.', experience:'1+ Year' },
  { name:'Java', category:'languages', proficiency:75, level:'Proficient', desc:'Object-oriented programming, data structures, collections framework.', experience:'2+ Years' },
  { name:'Python', category:'languages', proficiency:70, level:'Proficient', desc:'Scripting, basic data processing, machine learning concepts.', experience:'1+ Year' },
  { name:'C#', category:'languages', proficiency:68, level:'Proficient', desc:'.NET basics, object-oriented software patterns.', experience:'1+ Year' },
  { name:'Git & GitHub', category:'tools', proficiency:90, level:'Expert', desc:'Branching, PR workflows, merge conflict resolution, team collaboration.', experience:'2+ Years' },
  { name:'Vite & Build Tools', category:'tools', proficiency:88, level:'Advanced', desc:'Vite config, bundle optimization, fast HMR dev server workflows.', experience:'2+ Years' },
  { name:'Figma & UI Design', category:'tools', proficiency:80, level:'Advanced', desc:'UI prototyping, wireframes, design tokens, developer handoffs.', experience:'2+ Years' },
  { name:'Vercel & Deployment', category:'tools', proficiency:85, level:'Advanced', desc:'CI/CD deployment pipelines, domain management, environment variables.', experience:'2+ Years' }
];
// Playful: sticker cards with pop hard shadow, progress as thick 2px border bar with confetti fill, filter pills confetti
export default function SkillsPage() {
  usePortfolioMotion(); useSEO(SEO_CONFIGS.skills);
  const [searchQuery,setSearchQuery]=useState(''); const [activeCategory,setActiveCategory]=useState<'all'|'frontend'|'backend'|'languages'|'tools'>('all');
  const visualRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const fills=entry.target.querySelectorAll('.skill-bar-fill');
          fills.forEach((fill,i)=> setTimeout(()=>fill.classList.add('animate'), i*60));
          observer.disconnect();
        }
      });
    },{threshold:0.2});
    if(visualRef.current) observer.observe(visualRef.current);
    return()=>observer.disconnect();
  },[activeCategory,searchQuery]);
  const filteredSkills=skillsDatabase.filter(s=>{
    const matchesCat=activeCategory==='all'||s.category===activeCategory;
    const matchesSearch=s.name.toLowerCase().includes(searchQuery.toLowerCase())||s.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat&&matchesSearch;
  });
  return (
    <div className="page-wrapper skills-page" style={{ paddingTop:'5.5rem', paddingBottom:'5rem', background:'var(--background)', position:'relative' }}>
      <div aria-hidden="true" style={{ position:'absolute', right:'4%', top:100, width:80, height:80, background:'var(--quaternary)', border:'2px solid var(--foreground)', borderRadius:'50%', boxShadow:'var(--shadow-pop)' }} />
      <section className="page-header" style={{ position:'relative', overflow:'clip' }}>
        <div className="container">
          <div className="breadcrumb" style={{ fontFamily:'var(--font-body)' }}><Link to="/">Home</Link><span>/</span><span className="current">Skills</span></div>
          <div className="page-header-content reveal playful-enter">
            <div className="badge-playful" style={{ background:'var(--secondary)', color:'white' }}><Cpu size={14} strokeWidth={2.5}/> Technology Matrix</div>
            <h1 className="page-title" style={{ fontFamily:'var(--font-heading)', fontWeight:800, marginTop:'0.6rem' }}>Technical Stack & <span style={{ color:'var(--accent)' }}>Proficiencies</span></h1>
            <p className="page-subtitle" style={{ fontFamily:'var(--font-body)', color:'var(--muted-foreground)' }}>A comprehensive breakdown of my engineering capabilities across frontend, backend, databases, languages, and modern dev tools.</p>
          </div>
        </div>
        <svg aria-hidden="true" viewBox="0 0 120 12" preserveAspectRatio="none" style={{ position:'absolute', bottom:0, left:0, width:'100%', height:12, color:'var(--foreground)' }}><path d="M0 6 Q15 0 30 6 T60 6 T90 6 T120 6" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round"/></svg>
      </section>

      <section className="section" style={{ padding:'2.5rem 0 1.5rem' }}>
        <div className="container">
          <div className="card-sticker" style={{ padding:'1.25rem 1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
            <div style={{ position:'relative', flex:1, minWidth:'180px' }}>
              <Search size={18} strokeWidth={2.5} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--muted-foreground)' }} />
              <input type="text" placeholder="Search skills by name or keyword..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}
                style={{ width:'100%', padding:'0.75rem 1rem 0.75rem 2.6rem', borderRadius:'var(--radius-md)', background:'var(--input)', border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)', color:'var(--foreground)', fontFamily:'var(--font-body)', fontSize:'0.92rem' }} />
            </div>
            <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', margin:0 }}>
              {[
                {id:'all',label:'All Skills',color:'var(--accent)'},
                {id:'frontend',label:'Frontend',color:'var(--secondary)'},
                {id:'backend',label:'Backend',color:'var(--quaternary)'},
                {id:'languages',label:'Languages',color:'var(--tertiary)'},
                {id:'tools',label:'Tools',color:'var(--accent)'},
              ].map(cat=>(
                <button key={cat.id} onClick={()=>setActiveCategory(cat.id as any)}
                  style={{
                    padding:'0.5rem 1rem', borderRadius:'9999px', border:'2px solid var(--foreground)', fontFamily:'var(--font-heading)', fontWeight:700, fontSize:'0.8rem',
                    background: activeCategory===cat.id ? cat.color : 'var(--card)',
                    color: activeCategory===cat.id ? (cat.color==='var(--accent)' ? 'white' : 'var(--foreground)') : 'var(--foreground)',
                    boxShadow: activeCategory===cat.id ? 'var(--shadow-pop)' : 'none', cursor:'pointer'
                  }}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ padding:'1.5rem 0 4rem' }} ref={visualRef}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:'1.5rem' }}>
            {filteredSkills.map((skill, idx)=>(
              <div key={skill.name} className="card-sticker" style={{ padding:'1.5rem', position:'relative', paddingTop:'1.8rem', transform: idx%3===1?'rotate(0.3deg)': idx%3===2?'rotate(-0.3deg)':undefined }}>
                <div className="card-icon-circle" aria-hidden="true" style={{ position:'absolute', top:-14, left:18, width:34, height:34, borderRadius:'50%', background: skill.category==='frontend'?'var(--accent)': skill.category==='backend'?'var(--secondary)': skill.category==='languages'?'var(--tertiary)':'var(--quaternary)', border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)', display:'grid', placeItems:'center', color: skill.category==='languages'?'var(--foreground)':'white' }}>
                  {skill.category==='frontend'&&<Code size={16} strokeWidth={2.5}/>}
                  {skill.category==='backend'&&<Server size={16} strokeWidth={2.5}/>}
                  {skill.category==='languages'&&<Languages size={16} strokeWidth={2.5} color="var(--foreground)"/>}
                  {skill.category==='tools'&&<Wrench size={16} strokeWidth={2.5}/>}
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.75rem' }}>
                  <h3 style={{ fontSize:'1.05rem', fontFamily:'var(--font-heading)', fontWeight:800, color:'var(--foreground)', margin:0 }}>{skill.name}</h3>
                  <span style={{ fontSize:'0.7rem', padding:'0.25rem 0.6rem', borderRadius:'9999px', background: skill.level==='Expert'?'var(--accent)': skill.level==='Advanced'?'var(--secondary)':'var(--tertiary)', color: skill.level==='Proficient'?'var(--foreground)':'white', fontWeight:800, border:'2px solid var(--foreground)', fontFamily:'var(--font-heading)', boxShadow:'var(--shadow-pop)' }}>{skill.level}</span>
                </div>
                <p style={{ fontSize:'0.85rem', color:'var(--muted-foreground)', lineHeight:1.6, marginBottom:'1.25rem', minHeight:'2.8rem', fontFamily:'var(--font-body)' }}>{skill.desc}</p>
                <div style={{ height:12, background:'var(--muted)', border:'2px solid var(--foreground)', borderRadius:'9999px', overflow:'hidden', boxShadow:'var(--shadow-pop)', padding:2 }}>
                  <div className="skill-bar-fill" style={{ height:'100%', width:`${skill.proficiency}%`, background: idx%4===0?'var(--accent)': idx%4===1?'var(--secondary)': idx%4===2?'var(--quaternary)':'var(--tertiary)', borderRadius:'9999px', border:'1px solid var(--foreground)', transition:'width 700ms var(--ease-bounce)' }} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.8rem', color:'var(--muted-foreground)', marginTop:'0.6rem', fontFamily:'var(--font-body)' }}>
                  <span>Experience: {skill.experience}</span><span style={{ fontWeight:700, color:'var(--foreground)', fontFamily:'var(--font-heading)' }}>{skill.proficiency}% Mastery</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ padding:'4rem 0', background:'var(--muted)', borderTop:'2px solid var(--foreground)', borderBottom:'2px solid var(--foreground)', position:'relative' }}>
        <div className="container">
          <div className="badge-playful" style={{ background:'var(--tertiary)' }}><Star size={14} strokeWidth={2.5}/> Engineering Standards</div>
          <h2 className="section-title" style={{ fontFamily:'var(--font-heading)', fontWeight:800, marginTop:'0.5rem' }}>How I write <span style={{ color:'var(--accent)' }}>code</span></h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:'1.5rem', marginTop:'2rem' }}>
            <div className="card-sticker" style={{ padding:'1.75rem', paddingTop:'2.5rem', position:'relative' }}>
              <div className="card-icon-circle" aria-hidden="true" style={{ background:'var(--accent)', border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)' }}><CheckCircle2 size={18} strokeWidth={2.5} color="white"/></div>
              <h3 style={{ fontFamily:'var(--font-heading)', fontWeight:800 }}>Strict Type Safety</h3>
              <p style={{ color:'var(--muted-foreground)', fontSize:'0.9rem', marginTop:'0.5rem', lineHeight:1.6, fontFamily:'var(--font-body)' }}>Leveraging TypeScript to catch errors early at compile-time and enforce reliable interfaces across components and API models.</p>
            </div>
            <div className="card-sticker" style={{ padding:'1.75rem', paddingTop:'2.5rem', position:'relative', transform:'rotate(0.4deg)' }}>
              <div className="card-icon-circle secondary" aria-hidden="true" style={{ background:'var(--secondary)', border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)' }}><Layers size={18} strokeWidth={2.5} color="var(--foreground)"/></div>
              <h3 style={{ fontFamily:'var(--font-heading)', fontWeight:800 }}>Decoupled Architecture</h3>
              <p style={{ color:'var(--muted-foreground)', fontSize:'0.9rem', marginTop:'0.5rem', lineHeight:1.6, fontFamily:'var(--font-body)' }}>Keeping presentation components isolated from business logic and data providers for seamless testing and scalability.</p>
            </div>
            <div className="card-sticker" style={{ padding:'1.75rem', paddingTop:'2.5rem', position:'relative', transform:'rotate(-0.4deg)' }}>
              <div className="card-icon-circle tertiary" aria-hidden="true" style={{ background:'var(--tertiary)', border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)' }}><Sparkles size={18} strokeWidth={2.5} color="var(--foreground)"/></div>
              <h3 style={{ fontFamily:'var(--font-heading)', fontWeight:800 }}>Modern Web Performance</h3>
              <p style={{ color:'var(--muted-foreground)', fontSize:'0.9rem', marginTop:'0.5rem', lineHeight:1.6, fontFamily:'var(--font-body)' }}>Optimizing bundle sizes, utilizing lazy-loaded React routes, image webp formats, and GPU-accelerated CSS animations.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
