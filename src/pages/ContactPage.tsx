import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SendHorizonal, MessageSquare, Mail, MapPin, Clock, ChevronDown, Sparkles, Heart } from 'lucide-react';
import { LinkedinIcon } from '../components/SocialIcons';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO';

export default function ContactPage() {
  usePortfolioMotion(); useSEO(SEO_CONFIGS.contact);
  const [status,setStatus]=useState(''); const [loading,setLoading]=useState(false);
  const [currentTime,setCurrentTime]=useState(new Date()); const [openFaq,setOpenFaq]=useState<number|null>(0);
  useEffect(()=>{ const t=setInterval(()=>setCurrentTime(new Date()),1000); return()=>clearInterval(t)},[]);
  const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault(); setLoading(true); setStatus('');
    const form=e.currentTarget; const data=Object.fromEntries(new FormData(form)); const json=JSON.stringify(data);
    try{
      const res=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:json});
      const result=await res.json();
      if(result.success){ setStatus('✓ Message sent successfully! I will respond within 24 hours.'); (form as HTMLFormElement).reset(); }
      else setStatus('Something went wrong. Please try again.');
    }catch{ setStatus('Something went wrong. Please try again.'); } finally{ setLoading(false); }
  };
  const contactFaqs=[
    {q:'What is your typical response time?',a:'I aim to respond to all inquiries within 12 to 24 hours.'},
    {q:'Are you available for remote work globally?',a:'Yes, I work seamlessly with international clients across various time zones via Async tools, Slack, WhatsApp, and GitHub.'},
    {q:'Can we schedule a discovery call?',a:'Absolutely! Send a quick message via the form or email, and I will share a direct calendar scheduling link.'}
  ];
  return (
    <div className="page-wrapper contact-page" style={{ paddingTop:'5.5rem', paddingBottom:'5rem', background:'var(--background)', position:'relative' }}>
      <div aria-hidden="true" style={{ position:'absolute', right:'5%', top:90, width:64, height:64, background:'var(--quaternary)', border:'2px solid var(--foreground)', borderRadius:'50%', boxShadow:'var(--shadow-pop)' }} />
      <section className="page-header" style={{ position:'relative', overflow:'clip' }}>
        <div className="container">
          <div className="breadcrumb" style={{ fontFamily:'var(--font-body)' }}><Link to="/">Home</Link><span>/</span><span className="current">Contact</span></div>
          <div className="page-header-content reveal playful-enter">
            <div className="badge-playful" style={{ background:'var(--secondary)', color:'white' }}><MessageSquare size={14} strokeWidth={2.5}/> Direct Communication</div>
            <h1 className="page-title" style={{ fontFamily:'var(--font-heading)', fontWeight:800, marginTop:'0.6rem' }}>Let&apos;s build something <span style={{ color:'var(--accent)' }}>extraordinary</span></h1>
            <p className="page-subtitle" style={{ fontFamily:'var(--font-body)', color:'var(--muted-foreground)' }}>Whether you have a specific project in mind, want to hire me, or simply wish to say hello, my inbox is always open.</p>
          </div>
        </div>
        <svg aria-hidden="true" viewBox="0 0 120 12" preserveAspectRatio="none" style={{ position:'absolute', bottom:0, left:0, width:'100%', height:12, color:'var(--foreground)' }}><path d="M0 6 Q15 0 30 6 T60 6 T90 6 T120 6" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round"/></svg>
      </section>

      <section className="section" style={{ padding:'3rem 0 4rem' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(340px, 1fr))', gap:'2.5rem' }}>
            <div className="reveal">
              <div className="card-sticker" style={{ padding:'1.5rem', marginBottom:'1.5rem', position:'relative', paddingTop:'2rem' }}>
                <div className="card-icon-circle quaternary" aria-hidden="true" style={{ position:'absolute', top:-14, left:18, background:'var(--quaternary)', border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)', width:32, height:32, display:'grid', placeItems:'center' }}><Heart size={14} strokeWidth={2.5}/></div>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <span style={{ width:12, height:12, borderRadius:'50%', background:'var(--quaternary)', border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)', display:'inline-block' }} />
                  <span style={{ fontWeight:800, fontSize:'0.95rem', fontFamily:'var(--font-heading)', color:'var(--foreground)' }}>Available for Select Projects</span>
                </div>
                <p style={{ fontSize:'0.85rem', color:'var(--muted-foreground)', marginTop:'0.5rem', lineHeight:1.5, fontFamily:'var(--font-body)' }}>Currently accepting new freelance projects, fullstack roles, and technical consultancies.</p>
              </div>

              <div className="card-sticker" style={{ padding:'2rem', marginBottom:'1.5rem' }}>
                <h3 style={{ fontSize:'1.15rem', fontFamily:'var(--font-heading)', fontWeight:800, marginBottom:'1.25rem', color:'var(--foreground)' }}>Direct Channels</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:'0.9rem' }}>
                  {[
                    {href:'mailto:me@mritify.online', label:'Direct / Founder Email', value:'me@mritify.online', Icon:Mail, bg:'var(--accent)'},
                    {href:'mailto:support@mritify.online', label:'Client & Technical Support', value:'support@mritify.online', Icon:Mail, bg:'var(--secondary)'},
                    {href:'mailto:info@mritify.online', label:'General Inquiries & Info', value:'info@mritify.online', Icon:Mail, bg:'var(--quaternary)'},
                    {href:'https://wa.me/919470880956', label:'WhatsApp / Phone', value:'+91 94708 80956', Icon:MessageSquare, bg:'var(--tertiary)'},
                    {href:'https://www.linkedin.com/in/mritunjay-kumar-22a7a828b', label:'LinkedIn', value:'Mritunjay Kumar', Icon:LinkedinIcon as any, bg:'var(--accent)'},
                  ].map(item=>(
                    <a key={item.value} href={item.href} target={item.href.startsWith('http')?'_blank':undefined} rel="noreferrer" style={{ display:'flex', alignItems:'center', gap:'12px', color:'var(--foreground)', textDecoration:'none', padding:'0.75rem', borderRadius:'var(--radius-md)', background:'var(--card)', border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)', transition:'transform 200ms var(--ease-bounce)' }}>
                      <div style={{ width:40, height:40, borderRadius:'50%', background:item.bg, border:'2px solid var(--foreground)', display:'grid', placeItems:'center', color: item.bg==='var(--tertiary)'?'var(--foreground)':'white', flexShrink:0, boxShadow:'var(--shadow-pop)' }}><item.Icon size={16} strokeWidth={2.5}/></div>
                      <div><div style={{ fontSize:'0.75rem', color:'var(--muted-foreground)', fontFamily:'var(--font-heading)', fontWeight:700, textTransform:'uppercase' }}>{item.label}</div><div style={{ fontWeight:800, fontSize:'0.9rem', fontFamily:'var(--font-body)' }}>{item.value}</div></div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="card-sticker" style={{ padding:'1.5rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', color:'var(--foreground)', fontFamily:'var(--font-heading)', fontWeight:700 }}><MapPin size={16} strokeWidth={2.5}/> Bihar / New Delhi, India</div>
                  <div style={{ fontSize:'0.75rem', color:'var(--muted-foreground)', display:'flex', alignItems:'center', gap:'4px', background:'var(--card)', border:'2px solid var(--foreground)', borderRadius:'9999px', padding:'0.25rem 0.6rem', boxShadow:'var(--shadow-pop)', fontFamily:'var(--font-heading)', fontWeight:700 }}><Clock size={12} strokeWidth={2.5}/> IST (UTC+5:30)</div>
                </div>
                <div style={{ marginTop:'0.75rem', fontSize:'1.25rem', fontWeight:800, color:'var(--accent)', fontFamily:'var(--font-heading)', background:'var(--card)', border:'2px solid var(--foreground)', borderRadius:'9999px', padding:'0.5rem 1rem', boxShadow:'var(--shadow-pop)', display:'inline-block' }}>{currentTime.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'})}</div>
              </div>
            </div>

            <div className="reveal reveal-right">
              <div className="card-sticker" style={{ padding:'2.5rem', background:'var(--card)' }}>
                <div className="badge-playful" style={{ background:'var(--tertiary)', marginBottom:'0.6rem' }}><Sparkles size={12} strokeWidth={2.5}/> Send a message</div>
                <h3 style={{ fontSize:'1.4rem', fontFamily:'var(--font-heading)', fontWeight:800, marginBottom:'0.5rem', color:'var(--foreground)' }}>Send a Direct Message</h3>
                <p style={{ color:'var(--muted-foreground)', fontSize:'0.9rem', marginBottom:'2rem', fontFamily:'var(--font-body)' }}>Fill out the form below and your message will land directly in my priority inbox.</p>
                <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
                  <input type="hidden" name="access_key" value="af71a9aa-dfeb-4439-a91b-afa7bc2e17d8" />
                  <div style={{ display:'grid', gap:'0.35rem' }}><label htmlFor="c-page-name" style={{ fontFamily:'var(--font-heading)', fontWeight:800, textTransform:'uppercase', fontSize:'0.7rem', letterSpacing:'0.06em' }}>Full Name</label><input type="text" name="name" placeholder="Ada Lovelace" required id="c-page-name" /></div>
                  <div style={{ display:'grid', gap:'0.35rem' }}><label htmlFor="c-page-email" style={{ fontFamily:'var(--font-heading)', fontWeight:800, textTransform:'uppercase', fontSize:'0.7rem', letterSpacing:'0.06em' }}>Email Address</label><input type="email" name="email" placeholder="ada@analytical.engine" required id="c-page-email" /></div>
                  <div style={{ display:'grid', gap:'0.35rem' }}><label htmlFor="c-page-subject" style={{ fontFamily:'var(--font-heading)', fontWeight:800, textTransform:'uppercase', fontSize:'0.7rem', letterSpacing:'0.06em' }}>Subject / Project Scope</label><input type="text" name="subject" placeholder="Landing page, AI assistant, audit..." id="c-page-subject" /></div>
                  <div style={{ display:'grid', gap:'0.35rem' }}><label htmlFor="c-page-message" style={{ fontFamily:'var(--font-heading)', fontWeight:800, textTransform:'uppercase', fontSize:'0.7rem', letterSpacing:'0.06em' }}>Your Message</label><textarea name="message" rows={5} placeholder="Tell me about your idea, timeline, and goals..." required id="c-page-message" /></div>
                  <button type="submit" className="btn-candy" disabled={loading} style={{ width:'100%', justifyContent:'center', marginTop:'0.5rem', opacity: loading?0.6:1 }}>
                    <span>{loading ? 'Sending...' : 'Send Message'}</span><span style={{ background:'white', borderRadius:'50%', width:24, height:24, display:'grid', placeItems:'center', border:'2px solid var(--foreground)' }}><SendHorizonal size={14} strokeWidth={2.5} color="var(--foreground)"/></span>
                  </button>
                  {status && <div style={{ marginTop:'0.75rem', textAlign:'center', padding:'0.8rem', borderRadius:'var(--radius-md)', background: status.includes('✓')?'var(--quaternary)':'var(--secondary)', border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)', fontFamily:'var(--font-heading)', fontWeight:700, color: status.includes('✓')?'var(--foreground)':'white', fontSize:'0.9rem' }}>{status}</div>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ padding:'4rem 0', background:'var(--muted)', borderTop:'2px solid var(--foreground)', borderBottom:'2px solid var(--foreground)' }}>
        <div className="container" style={{ maxWidth:800 }}>
          <div className="badge-playful" style={{ background:'var(--quaternary)' }}><Heart size={14} strokeWidth={2.5}/> Helpful Information</div>
          <h2 className="section-title" style={{ fontFamily:'var(--font-heading)', fontWeight:800, textAlign:'center', marginTop:'0.5rem' }}>Communication <span style={{ color:'var(--secondary)' }}>FAQs</span></h2>
          <div style={{ marginTop:'2rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
            {contactFaqs.map((faq, idx)=>(
              <div key={idx} onClick={()=>setOpenFaq(openFaq===idx?null:idx)} className="card-sticker" style={{ padding:'1.25rem 1.5rem', cursor:'pointer' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <h3 style={{ fontSize:'1rem', fontFamily:'var(--font-heading)', fontWeight:800, color:'var(--foreground)', margin:0 }}>{faq.q}</h3>
                  <span style={{ width:28, height:28, borderRadius:'50%', background: openFaq===idx?'var(--accent)':'var(--card)', color: openFaq===idx?'white':'var(--foreground)', border:'2px solid var(--foreground)', display:'grid', placeItems:'center', boxShadow:'var(--shadow-pop)', transform: openFaq===idx ? 'rotate(180deg)' : 'none', transition:'transform 200ms' }}><ChevronDown size={14} strokeWidth={2.5}/></span>
                </div>
                {openFaq===idx && <p style={{ marginTop:'0.75rem', color:'var(--muted-foreground)', fontSize:'0.9rem', lineHeight:1.6, paddingTop:'0.75rem', borderTop:'2px dashed var(--border)', fontFamily:'var(--font-body)' }}>{faq.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
