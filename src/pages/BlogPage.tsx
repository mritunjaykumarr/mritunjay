import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useScrollLock } from '../hooks/useScrollLock';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO';
import { Heart, MessageCircle, ArrowRight, X, Calendar, Clock, FolderOpen, FileEdit, Search, BookOpen, Sparkles } from 'lucide-react';
import { DEFAULT_POSTS, type BlogPost, type CommentItem } from '../data/blogData';
import AdUnit from '../components/AdUnit';

// Playful: blog cards as sticker cards with half-out icon, filter pills confetti, header confetti
export default function BlogPage() {
  usePortfolioMotion(); useSEO(SEO_CONFIGS.blog);
  const [posts, setPosts] = useState<BlogPost[]>(DEFAULT_POSTS);
  const [loading] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState('');
  useScrollLock(!!activePost);
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>(()=>{ try{return JSON.parse(localStorage.getItem('user_likes')||'{}')}catch{return{}}});
  const [anonId] = useState(()=>{let id=localStorage.getItem('anon_id'); if(!id){id=crypto.randomUUID(); localStorage.setItem('anon_id',id)} return id});
  const fetchPosts = useCallback(async()=>{
    try{
      const {data:postsData,error}=await supabase.from('posts').select('*').order('created_at',{ascending:false});
      if(!error && postsData && postsData.length>0){
        const {data:commentsData}=await supabase.from('comments').select('post_id');
        const counts:Record<string,number>={}; commentsData?.forEach((c:{post_id:string})=>{counts[c.post_id]=(counts[c.post_id]||0)+1});
        const visible=postsData.filter((p:{status?:string})=>!p.status||p.status==='published');
        if(visible.length>0) setPosts(visible.map((p:BlogPost)=>({ ...p, comments_count: counts[p.id]||0 })));
      }
    }catch(err){ console.error(err)}
  },[]);
  useEffect(()=>{ const t=setTimeout(()=>fetchPosts(),0); return()=>clearTimeout(t)},[fetchPosts]);
  const toggleLike = async(postId:string,e?:React.MouseEvent)=>{
    if(e) e.stopPropagation();
    const isLiked=userLikes[postId]; const newLikes={...userLikes};
    if(isLiked){ delete newLikes[postId]; if(!postId.startsWith('default-')) await supabase.from('post_likes').delete().match({post_id:postId,user_identifier:anonId}); setPosts(posts.map(p=>p.id===postId?{...p,likes_count:Math.max(0,p.likes_count-1)}:p));}
    else{ newLikes[postId]=true; if(!postId.startsWith('default-')) await supabase.from('post_likes').insert({post_id:postId,user_identifier:anonId}); setPosts(posts.map(p=>p.id===postId?{...p,likes_count:p.likes_count+1}:p));}
    setUserLikes(newLikes); localStorage.setItem('user_likes',JSON.stringify(newLikes));
  };
  const openPost=async(post:BlogPost)=>{
    setActivePost(post);
    if(!post.id.startsWith('default-')){
      const {data}=await supabase.from('comments').select('*').eq('post_id',post.id).order('created_at',{ascending:true});
      if(data) setComments(data);
    } else setComments([]);
  };
  const closePost=()=>setActivePost(null);
  useEffect(()=>{ const h=(e:KeyboardEvent)=>{ if(e.key==='Escape'&&activePost) closePost()}; window.addEventListener('keydown',h); return()=>window.removeEventListener('keydown',h)},[activePost]);
  const handleComment=async(postId:string)=>{
    if(!newComment.trim()) return;
    const commentData={post_id:postId,author_name:'Visitor',content:newComment.trim(),created_at:new Date().toISOString()};
    if(!postId.startsWith('default-')){
      const {data}=await supabase.from('comments').insert(commentData).select().single();
      if(data){ setComments([...comments,data]); setNewComment('');}
    } else { setComments([...comments,{id:'temp-'+Date.now(),...commentData}]); setNewComment('');}
  };
  const readTime=(body:string)=>Math.max(1,Math.ceil((body||'').replace(/<[^>]+>/g,' ').split(/\s+/).length/200));
  const filteredPosts=useMemo(()=>posts.filter(p=>{
    const matchesCat=filterCategory==='all'||p.type===filterCategory;
    const matchesSearch=(p.title||'').toLowerCase().includes(searchQuery.toLowerCase())||(p.excerpt||'').toLowerCase().includes(searchQuery.toLowerCase())||(p.body||'').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat&&matchesSearch;
  }),[posts,filterCategory,searchQuery]);

  return (
    <div className="page-wrapper blog-page" style={{ paddingTop:'5.5rem', paddingBottom:'5rem', background:'var(--background)', position:'relative' }}>
      <div aria-hidden="true" style={{ position:'absolute', right:'5%', top:90, width:56, height:56, background:'var(--quaternary)', border:'2px solid var(--foreground)', borderRadius:'50%', boxShadow:'var(--shadow-pop)' }} />
      <section className="page-header" style={{ position:'relative', overflow:'clip' }}>
        <div className="container">
          <div className="breadcrumb" style={{ fontFamily:'var(--font-body)' }}><Link to="/">Home</Link><span>/</span><span className="current">Blog</span></div>
          <div className="page-header-content playful-enter">
            <div className="badge-playful" style={{ background:'var(--secondary)', color:'white' }}><BookOpen size={14} strokeWidth={2.5}/> Articles & Insights</div>
            <h1 className="page-title" style={{ fontFamily:'var(--font-heading)', fontWeight:800, marginTop:'0.6rem' }}>Technical Writing & <span style={{ color:'var(--accent)' }}>Insights</span></h1>
            <p className="page-subtitle" style={{ fontFamily:'var(--font-body)', color:'var(--muted-foreground)' }}>Articles on frontend performance, React architecture, AI integrations, CSS micro-interactions, and web development learnings.</p>
          </div>
        </div>
        <svg aria-hidden="true" viewBox="0 0 120 12" preserveAspectRatio="none" style={{ position:'absolute', bottom:0, left:0, width:'100%', height:12, color:'var(--foreground)' }}><path d="M0 6 Q15 0 30 6 T60 6 T90 6 T120 6" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round"/></svg>
      </section>

      <section className="section" style={{ padding:'2.5rem 0 1.5rem' }}>
        <div className="container">
          <div className="card-sticker" style={{ padding:'1.25rem 1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
            <div style={{ position:'relative', flex:1, minWidth:'180px' }}>
              <Search size={18} strokeWidth={2.5} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--muted-foreground)' }} />
              <input type="text" placeholder="Search articles by title or keyword..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
                style={{ width:'100%', padding:'0.75rem 1rem 0.75rem 2.6rem', borderRadius:'var(--radius-md)', background:'var(--input)', border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)', color:'var(--foreground)', fontFamily:'var(--font-body)', fontSize:'0.92rem' }} />
            </div>
            <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', margin:0 }}>
              {['all','Blog','Article','News'].map(f=>(
                <button key={f} onClick={()=>setFilterCategory(f)}
                  style={{
                    padding:'0.5rem 1rem', borderRadius:'var(--radius-full)', border:'2px solid var(--foreground)', fontFamily:'var(--font-heading)', fontWeight:700, fontSize:'0.8rem',
                    background: filterCategory===f ? (f==='Blog'?'var(--accent)': f==='Article'?'var(--secondary)': f==='News'?'var(--tertiary)':'var(--accent)') : 'var(--card)',
                    color: filterCategory===f ? (f==='News' ? 'var(--foreground)' : 'white') : 'var(--foreground)',
                    boxShadow: filterCategory===f ? 'var(--shadow-pop)' : 'none', cursor:'pointer'
                  }}>
                  {f==='all'?'All Posts':f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ padding:'1.5rem 0 4rem' }}>
        <div className="container">
          {loading ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:'1.5rem' }}>
              <div className="card-sticker" style={{ height:300 }} /><div className="card-sticker" style={{ height:300 }} /><div className="card-sticker" style={{ height:300 }} />
            </div>
          ) : filteredPosts.length===0 ? (
            <div className="card-sticker" style={{ padding:'4rem 2rem', textAlign:'center' }}>
              <FileEdit size={40} strokeWidth={2.5} style={{ margin:'0 auto 1rem', color:'var(--accent)' }} />
              <h3 style={{ fontFamily:'var(--font-heading)', fontWeight:800 }}>No articles found</h3>
              <p style={{ color:'var(--muted-foreground)', marginTop:'0.5rem', fontFamily:'var(--font-body)' }}>No articles match your current search query or filter.</p>
              <button className="btn-secondary" onClick={()=>{setSearchQuery(''); setFilterCategory('all');}} style={{ marginTop:'1.5rem' }}>Reset Filters</button>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))', gap:'2rem' }}>
              {filteredPosts.map((p, idx)=>(
                <div key={p.id} className="card-sticker" style={{ overflow:'hidden', display:'flex', flexDirection:'column', position:'relative', padding:0, transform: idx%2===0 ? 'rotate(-0.2deg)' : 'rotate(0.2deg)' }}>
                  <div onClick={()=>openPost(p)} style={{ position:'relative', height:200, cursor:'pointer', borderBottom:'2px solid var(--foreground)', overflow:'hidden' }}>
                    {p.cover ? <img src={p.cover} alt={p.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} loading="lazy" /> : <div style={{ height:'100%', display:'grid', placeItems:'center', background:'var(--muted)', color:'var(--muted-foreground)' }}><FileEdit size={32} strokeWidth={2.5}/></div>}
                    <span style={{ position:'absolute', top:12, left:12, background: idx%3===0?'var(--accent)': idx%3===1?'var(--secondary)':'var(--tertiary)', color: idx%3===2?'var(--foreground)':'white', border:'2px solid var(--foreground)', borderRadius:'9999px', padding:'0.25rem 0.7rem', fontFamily:'var(--font-heading)', fontWeight:800, fontSize:'0.7rem', boxShadow:'var(--shadow-pop)', textTransform:'uppercase' }}>{p.type||'Blog'}</span>
                    <div className="card-icon-circle" aria-hidden="true" style={{ position:'absolute', top:12, right:12, width:32, height:32, background:'var(--card)', border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)', display:'grid', placeItems:'center' }}><Sparkles size={14} strokeWidth={2.5} color="var(--foreground)"/></div>
                  </div>
                  <div style={{ padding:'1.5rem', flex:1, display:'flex', flexDirection:'column' }}>
                    <div style={{ fontSize:'0.8rem', color:'var(--muted-foreground)', marginBottom:'0.5rem', display:'flex', alignItems:'center', gap:'8px', fontFamily:'var(--font-body)' }}>
                      <span><Calendar size={13} strokeWidth={2.5} style={{display:'inline',marginRight:4}}/>{new Date(p.created_at).toLocaleDateString()}</span><span>·</span><span><Clock size={13} strokeWidth={2.5} style={{display:'inline',marginRight:4}}/>{readTime(p.body)} min read</span>
                    </div>
                    <h3 onClick={()=>openPost(p)} style={{ fontSize:'1.2rem', fontFamily:'var(--font-heading)', fontWeight:800, color:'var(--foreground)', cursor:'pointer', marginBottom:'0.75rem', lineHeight:1.3 }}>{p.title}</h3>
                    <p style={{ color:'var(--muted-foreground)', fontSize:'0.9rem', lineHeight:1.6, marginBottom:'1.25rem', flex:1, fontFamily:'var(--font-body)' }}>{p.excerpt}</p>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:'1rem', borderTop:'2px solid var(--foreground)', marginTop:'auto' }}>
                      <div style={{ display:'flex', gap:'1rem' }}>
                        <button onClick={(e)=>toggleLike(p.id,e)} style={{ display:'flex', alignItems:'center', gap:'6px', background:'var(--card)', border:'2px solid var(--foreground)', borderRadius:'9999px', padding:'0.3rem 0.7rem', boxShadow:'var(--shadow-pop)', fontFamily:'var(--font-heading)', fontWeight:700, fontSize:'0.8rem', cursor:'pointer', color: userLikes[p.id]?'var(--secondary)':'var(--foreground)' }}><Heart size={14} fill={userLikes[p.id]?'currentColor':'none'} strokeWidth={2.5}/><span>{p.likes_count||0}</span></button>
                        <button onClick={()=>openPost(p)} style={{ display:'flex', alignItems:'center', gap:'6px', background:'var(--card)', border:'2px solid var(--foreground)', borderRadius:'9999px', padding:'0.3rem 0.7rem', boxShadow:'var(--shadow-pop)', fontFamily:'var(--font-heading)', fontWeight:700, fontSize:'0.8rem', cursor:'pointer' }}><MessageCircle size={14} strokeWidth={2.5}/><span>{p.comments_count||0}</span></button>
                      </div>
                      <button className="btn-secondary" onClick={()=>openPost(p)} style={{ padding:'0.4rem 0.8rem', fontSize:'0.8rem', minHeight:36 }}>Read <ArrowRight size={13} strokeWidth={2.5}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* AdSense — after content-rich posts grid, not inside modal, labeled */}
      <section className="section" style={{ padding: '2rem 0' }}>
        <div className="container">
          <AdUnit slot="6189533583" />
        </div>
      </section>

      {activePost && (
        <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(30,41,59,0.6)', backdropFilter:'blur(8px)', display:'grid', placeItems:'center', padding:'1rem' }} onClick={(e)=>e.target===e.currentTarget && closePost()}>
          <div className="card-sticker" style={{ maxWidth:850, width:'92%', maxHeight:'90vh', overflowY:'auto', padding:0, background:'var(--card)' }}>
            <button onClick={closePost} aria-label="Close modal" style={{ position:'absolute', top:12, right:12, width:36, height:36, borderRadius:'50%', background:'var(--card)', border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)', display:'grid', placeItems:'center', cursor:'pointer', zIndex:2 }}><X size={16} strokeWidth={2.5}/></button>
            <div>
              {activePost.cover && <img src={activePost.cover} alt="" style={{ width:'100%', maxHeight:350, objectFit:'cover', borderBottom:'2px solid var(--foreground)' }} />}
              <div style={{ padding:'2rem' }}>
                <div style={{ display:'inline-flex', padding:'0.35rem 0.8rem', borderRadius:'9999px', background:'var(--tertiary)', border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)', fontFamily:'var(--font-heading)', fontWeight:800, fontSize:'0.7rem', textTransform:'uppercase' }}>{activePost.type||'Blog'}</div>
                <h1 style={{ fontSize:'2rem', fontFamily:'var(--font-heading)', fontWeight:800, margin:'0.75rem 0', color:'var(--foreground)' }}>{activePost.title}</h1>
                <div style={{ display:'flex', gap:'1.25rem', color:'var(--muted-foreground)', fontSize:'0.85rem', marginBottom:'2rem', fontFamily:'var(--font-body)', flexWrap:'wrap' }}>
                  <span><FolderOpen size={14} strokeWidth={2.5}/> {activePost.category||'General'}</span>
                  <span><Calendar size={14} strokeWidth={2.5}/> {new Date(activePost.created_at).toLocaleDateString()}</span>
                  <span><Clock size={14} strokeWidth={2.5}/> {readTime(activePost.body)} min read</span>
                </div>
                <div dangerouslySetInnerHTML={{__html:activePost.body}} style={{ fontSize:'1.02rem', lineHeight:1.8, fontFamily:'var(--font-body)', color:'var(--foreground)' }} />
                <div style={{ marginTop:'2rem', display:'flex', justifyContent:'center' }}>
                  <button onClick={()=>toggleLike(activePost.id)} style={{ display:'flex', alignItems:'center', gap:'0.6rem', padding:'0.7rem 1.2rem', borderRadius:'9999px', background: userLikes[activePost.id]?'var(--secondary)':'var(--card)', color: userLikes[activePost.id]?'white':'var(--foreground)', border:'2px solid var(--foreground)', boxShadow:'var(--shadow-pop)', fontFamily:'var(--font-heading)', fontWeight:700, cursor:'pointer' }}>
                    <span>{userLikes[activePost.id]?'♥':'♡'}</span><span>{userLikes[activePost.id]?'Liked':'Like this post'}</span><span style={{ background:'white', color:'var(--foreground)', borderRadius:'9999px', padding:'0.2rem 0.6rem', fontSize:'0.75rem', border:'1px solid var(--foreground)' }}>{activePost.likes_count||0} likes</span>
                  </button>
                </div>
                <div style={{ marginTop:'2rem', borderTop:'2px solid var(--foreground)', paddingTop:'1.5rem' }}>
                  <h3 style={{ fontSize:'1.15rem', fontFamily:'var(--font-heading)', fontWeight:800, marginBottom:'1rem' }}>Comments ({comments.length})</h3>
                  <div style={{ maxHeight:300, overflowY:'auto', marginBottom:'1.5rem', display:'grid', gap:'1rem' }}>
                    {comments.length===0 ? <p style={{ color:'var(--muted-foreground)', fontSize:'0.9rem', fontFamily:'var(--font-body)' }}>No comments yet. Be the first to leave a thought!</p> :
                      comments.map(c=>{
                        const name=(c.author_name||(c as any).user_name||'Visitor');
                        return (
                          <div key={c.id} style={{ display:'flex', gap:'0.75rem', alignItems:'flex-start', background:'var(--muted)', border:'2px solid var(--foreground)', borderRadius:'12px', padding:'0.75rem', boxShadow:'var(--shadow-pop)' }}>
                            <div style={{ width:32, height:32, borderRadius:'50%', background:'var(--accent)', border:'2px solid var(--foreground)', display:'grid', placeItems:'center', color:'white', fontWeight:800, fontSize:'0.75rem', flexShrink:0 }}>{name.substring(0,2).toUpperCase()}</div>
                            <div><div style={{ fontFamily:'var(--font-body)', fontSize:'0.9rem' }}><strong style={{ fontFamily:'var(--font-heading)' }}>{name}</strong> {c.content}</div><div style={{ fontSize:'0.75rem', color:'var(--muted-foreground)', marginTop:'0.25rem' }}>{new Date(c.created_at).toLocaleString()}</div></div>
                          </div>
                        )
                      })
                    }
                  </div>
                  <div style={{ display:'flex', gap:'0.6rem', alignItems:'center', background:'var(--card)', border:'2px solid var(--foreground)', borderRadius:'9999px', padding:'0.4rem 0.6rem 0.4rem 0.6rem', boxShadow:'var(--shadow-pop)' }}>
                    <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--tertiary)', border:'2px solid var(--foreground)', display:'grid', placeItems:'center', fontWeight:800, fontSize:'0.7rem' }}>V</div>
                    <input type="text" placeholder="Write a comment..." value={newComment} onChange={e=>setNewComment(e.target.value)} onKeyDown={e=>e.key==='Enter' && handleComment(activePost.id)} style={{ flex:1, border:'none', outline:'none', fontFamily:'var(--font-body)', background:'transparent' }} />
                    <button onClick={()=>handleComment(activePost.id)} style={{ padding:'0.5rem 1rem', borderRadius:'9999px', background: newComment.trim()?'var(--accent)':'var(--muted)', color: newComment.trim()?'white':'var(--muted-foreground)', border:'2px solid var(--foreground)', fontFamily:'var(--font-heading)', fontWeight:700, cursor:'pointer', boxShadow:'var(--shadow-pop)' }}>Post</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
