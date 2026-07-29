import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  supabase 
} from '../lib/supabase';
import { useScrollLock } from '../hooks/useScrollLock';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { 
  Heart, MessageCircle, ArrowRight, X, Calendar, 
  Clock, FolderOpen, FileEdit, Search, BookOpen 
} from 'lucide-react';

export default function BlogPage() {
  usePortfolioMotion();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePost, setActivePost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');

  useScrollLock(!!activePost);

  const [userLikes, setUserLikes] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem('user_likes') || '{}'); } catch { return {}; }
  });
  const [anonId] = useState(() => {
    let id = localStorage.getItem('anon_id');
    if (!id) { id = crypto.randomUUID(); localStorage.setItem('anon_id', id); }
    return id;
  });

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data: postsData } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsData) {
        const { data: commentsData } = await supabase.from('comments').select('post_id');
        const counts: Record<string, number> = {};
        commentsData?.forEach(c => { counts[c.post_id] = (counts[c.post_id] || 0) + 1; });
        
        const visiblePosts = postsData.filter(p => !p.status || p.status === 'published');
        setPosts(visiblePosts.map(p => ({ ...p, comments_count: counts[p.id] || 0 })));
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isLiked = userLikes[postId];
    const newLikes = { ...userLikes };
    if (isLiked) {
      delete newLikes[postId];
      await supabase.from('post_likes').delete().match({ post_id: postId, user_identifier: anonId });
      setPosts(posts.map(p => p.id === postId ? { ...p, likes_count: Math.max(0, p.likes_count - 1) } : p));
    } else {
      newLikes[postId] = true;
      await supabase.from('post_likes').insert({ post_id: postId, user_identifier: anonId });
      setPosts(posts.map(p => p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p));
    }
    setUserLikes(newLikes);
    localStorage.setItem('user_likes', JSON.stringify(newLikes));
  };

  const openPost = async (post: any) => {
    setActivePost(post);
    const { data } = await supabase.from('comments').select('*').eq('post_id', post.id).order('created_at', { ascending: true });
    if (data) setComments(data);
  };

  const closePost = () => {
    setActivePost(null);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activePost) closePost();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [activePost]);

  const handleComment = async (postId: string) => {
    if (!newComment.trim()) return;
    const commentData = { post_id: postId, author_name: 'Visitor', content: newComment.trim() };
    const { data } = await supabase.from('comments').insert(commentData).select().single();
    if (data) {
      setComments([...comments, data]);
      setNewComment('');
    }
  };

  const readTime = (body: string) => Math.max(1, Math.ceil((body || '').replace(/<[^>]+>/g, ' ').split(/\s+/).length / 200));

  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      const matchesCat = filterCategory === 'all' || p.type === filterCategory;
      const matchesSearch = (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (p.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (p.body || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [posts, filterCategory, searchQuery]);

  return (
    <div className="page-wrapper blog-page" style={{ paddingTop: '5.5rem', paddingBottom: '5rem' }}>
      {/* Header Banner */}
      <section className="page-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span className="current">Blog</span>
          </div>
          <div className="page-header-content reveal">
            <div className="section-eyebrow"><BookOpen size={14} /> Articles & Insights</div>
            <h1 className="page-title">
              Technical Writing & <span className="grad">Insights</span>
            </h1>
            <p className="page-subtitle">
              Articles on frontend performance, React architecture, AI integrations, CSS micro-interactions, and web development learnings.
            </p>
          </div>
        </div>
      </section>

      {/* Controls Bar */}
      <section className="section" style={{ padding: '2.5rem 0 1.5rem' }}>
        <div className="container">
          <div className="blog-controls card-glass" style={{ padding: '1.25rem 1.5rem', borderRadius: 'var(--r-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            
            {/* Search Bar */}
            <div style={{ position: 'relative', flex: '1', minWidth: '250px' }}>
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text"
                placeholder="Search articles by title or keyword..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.6rem',
                  borderRadius: 'var(--r-sm)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  fontFamily: 'inherit',
                  fontSize: '0.92rem'
                }}
              />
            </div>

            {/* Category Chips */}
            <div className="filter-wrap" style={{ margin: 0 }}>
              {['all', 'Blog', 'Article', 'News'].map(f => (
                <button
                  key={f}
                  className={`filter-btn ${filterCategory === f ? 'active' : ''}`}
                  onClick={() => setFilterCategory(f)}
                >
                  {f === 'all' ? 'All Posts' : f}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="section" style={{ padding: '1.5rem 0 4rem' }}>
        <div className="container">
          {loading ? (
            <div className="blog-loading" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              <div className="blog-skeleton" style={{ height: '300px' }} />
              <div className="blog-skeleton" style={{ height: '300px' }} />
              <div className="blog-skeleton" style={{ height: '300px' }} />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="card-glass text-center" style={{ padding: '4rem 2rem', borderRadius: 'var(--r-md)' }}>
              <FileEdit size={40} className="grad-text" style={{ margin: '0 auto 1rem' }} />
              <h3>No articles found</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>No articles match your current search query or filter.</p>
              <button className="btn-outline" onClick={() => { setSearchQuery(''); setFilterCategory('all'); }} style={{ marginTop: '1.5rem' }}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
              {filteredPosts.map((p) => (
                <div key={p.id} className="card-glass blog-card-grid reveal" style={{ borderRadius: 'var(--r-md)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  
                  {/* Card Cover */}
                  <div className="blog-card-cover" onClick={() => openPost(p)} style={{ position: 'relative', height: '200px', cursor: 'pointer' }}>
                    {p.cover ? (
                      <img src={p.cover} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                    ) : (
                      <div className="blog-card-img-ph" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                        <FileEdit size={32} />
                      </div>
                    )}
                    <span className={`blog-type-pill blog-type-${p.type?.toLowerCase()}`} style={{ position: 'absolute', top: '12px', left: '12px' }}>
                      {p.type || 'Blog'}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div className="blog-card-author-meta" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span><Calendar size={13} style={{ display: 'inline', marginRight: '4px' }} />{new Date(p.created_at).toLocaleDateString()}</span>
                      <span>·</span>
                      <span><Clock size={13} style={{ display: 'inline', marginRight: '4px' }} />{readTime(p.body)} min read</span>
                    </div>

                    <h3 onClick={() => openPost(p)} style={{ fontSize: '1.25rem', color: 'var(--text)', cursor: 'pointer', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                      {p.title}
                    </h3>

                    <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                      {p.excerpt}
                    </p>

                    {/* Social & Action Bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                      <div className="blog-card-actions" style={{ gap: '1rem' }}>
                        <button className={`blog-action-btn ${userLikes[p.id] ? 'liked' : ''}`} onClick={(e) => toggleLike(p.id, e)}>
                          <Heart size={16} fill={userLikes[p.id] ? 'currentColor' : 'none'} />
                          <span>{p.likes_count || 0}</span>
                        </button>
                        <button className="blog-action-btn" onClick={() => openPost(p)}>
                          <MessageCircle size={16} />
                          <span>{p.comments_count || 0}</span>
                        </button>
                      </div>

                      <button className="btn-outline btn-sm" onClick={() => openPost(p)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}>
                        Read <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Full Reader Modal */}
      {activePost && (
        <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && closePost()}>
          <div className="modal-box blog-read-modal" style={{ maxWidth: '850px', width: '92%', maxHeight: '90vh', overflowY: 'auto' }}>
            <button className="modal-close" onClick={closePost} aria-label="Close modal"><X size={18} /></button>
            <div>
              {activePost.cover && <img src={activePost.cover} className="blog-read-cover" alt="" style={{ width: '100%', maxHeight: '350px', objectFit: 'cover' }} />}
              <div style={{ padding: '2rem' }}>
                <div className={`blog-read-type blog-type-${activePost.type?.toLowerCase()}`}>{activePost.type || 'Blog'}</div>
                <h1 className="blog-read-title" style={{ fontSize: '2.2rem', margin: '0.75rem 0' }}>{activePost.title}</h1>
                
                <div className="blog-read-meta" style={{ display: 'flex', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                  <span><FolderOpen size={14} /> {activePost.category || 'General'}</span>
                  <span><Calendar size={14} /> {new Date(activePost.created_at).toLocaleDateString()}</span>
                  <span><Clock size={14} /> {readTime(activePost.body)} min read</span>
                </div>

                <div className="blog-read-body" dangerouslySetInnerHTML={{ __html: activePost.body }} style={{ fontSize: '1.05rem', lineHeight: 1.8 }} />

                <div className="blog-read-like-bar" style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
                  <button className={`like-btn--big ${userLikes[activePost.id] ? 'liked' : ''}`} onClick={() => toggleLike(activePost.id)}>
                    <span>{userLikes[activePost.id] ? '♥' : '♡'}</span>
                    <span>{userLikes[activePost.id] ? 'Liked' : 'Like this post'}</span>
                    <span className="like-count-pill">{activePost.likes_count || 0} likes</span>
                  </button>
                </div>

                {/* Comments Section */}
                <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--text)' }}>Comments ({comments.length})</h3>
                  
                  <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {comments.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No comments yet. Be the first to leave a thought!</p>
                    ) : (
                      comments.map(c => (
                        <div key={c.id} className="blog-comment-item">
                          <div className="blog-comment-item-avatar">{c.author_name.substring(0, 2).toUpperCase()}</div>
                          <div>
                            <div className="blog-comment-item-text"><strong>{c.author_name}</strong> {c.content}</div>
                            <div className="blog-comment-item-time">{new Date(c.created_at).toLocaleString()}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="blog-card-comment-input">
                    <div className="blog-comment-avatar">V</div>
                    <input 
                      type="text" 
                      className="blog-comment-field" 
                      placeholder="Write a comment..." 
                      value={newComment} 
                      onChange={e => setNewComment(e.target.value)} 
                      onKeyDown={e => e.key === 'Enter' && handleComment(activePost.id)} 
                    />
                    <button className={`blog-comment-post-btn ${newComment.trim() ? 'ready' : ''}`} onClick={() => handleComment(activePost.id)}>
                      Post
                    </button>
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
