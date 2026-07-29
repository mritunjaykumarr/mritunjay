import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Heart, MessageCircle, Send, Maximize2, ArrowRight, X, Calendar, Clock, FolderOpen, FileEdit } from 'lucide-react';

export default function BlogFeed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [activePost, setActivePost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
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
        
        // Filter out drafts on the client side to avoid schema errors if the column is missing
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
    document.body.style.overflow = 'hidden';
    const { data } = await supabase.from('comments').select('*').eq('post_id', post.id).order('created_at', { ascending: true });
    if (data) setComments(data);
  };

  const closePost = () => {
    setActivePost(null);
    document.body.style.overflow = '';
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

  const filteredPosts = filter === 'all' ? posts : posts.filter(p => p.type === filter);
  const readTime = (body: string) => Math.max(1, Math.ceil((body || '').replace(/<[^>]+>/g, ' ').split(/\s+/).length / 200));

  return (
    <section className="section blog-section" id="blog">
      <div className="container">
        <div className="section-eyebrow">Blog</div>
        <h2 className="section-title reveal">Latest <span className="grad">Intelligence</span></h2>

        <div className="blog-filter-row reveal">
          {['all', 'Blog', 'Article', 'News'].map(f => (
            <button key={f} className={`blog-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="blog-loading">
            <div className="blog-skeleton" />
            <div className="blog-skeleton" style={{ height: '120px' }} />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="blog-empty"><h3>No posts found</h3></div>
        ) : (
          <div className="blog-grid horizontal-scroll" style={{ paddingBottom: '2rem' }}>
            {filteredPosts.map((p) => (
              <div key={p.id} className="blog-card">
                <div className="blog-card-header">
                  <div className="blog-card-avatar">MK</div>
                  <div className="blog-card-author-info">
                    <div className="blog-card-author-name">mritunjaykumar</div>
                    <div className="blog-card-author-meta">
                      <span className={`blog-type-pill blog-type-${p.type?.toLowerCase()}`}>{p.type || 'Blog'}</span>
                      <span>·</span>
                      <span>{new Date(p.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button className="blog-card-more-btn" onClick={() => openPost(p)} aria-label="Expand post">
                    <Maximize2 size={16} />
                  </button>
                </div>

                <div className="blog-card-cover" onClick={() => openPost(p)}>
                  {p.cover ? (
                    <img src={p.cover} alt={p.title} className="blog-card-img" loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="blog-card-img-ph"><FileEdit size={32} /></div>
                  )}
                </div>

                <div className="blog-card-actions">
                  <button className={`blog-action-btn ${userLikes[p.id] ? 'liked' : ''}`} onClick={(e) => toggleLike(p.id, e)}>
                    <Heart size={18} fill={userLikes[p.id] ? 'currentColor' : 'none'} />
                    <span>{p.likes_count || 0}</span>
                  </button>
                  <button className="blog-action-btn" onClick={() => openPost(p)}>
                    <MessageCircle size={18} />
                    <span>{p.comments_count || 0}</span>
                  </button>
                  <button className="blog-action-btn" onClick={async () => {
                    try {
                      await navigator.share({ title: p.title, url: window.location.href });
                      const newCount = (p.shares_count || 0) + 1;
                      await supabase.from('posts').update({ shares_count: newCount }).eq('id', p.id);
                      setPosts(posts.map(post => post.id === p.id ? { ...post, shares_count: newCount } : post));
                    } catch { /* share cancelled */ }
                  }}>
                    <Send size={18} />
                    <span>{p.shares_count || 0}</span>
                  </button>
                </div>

                {p.likes_count > 0 && (
                  <div className="blog-card-like-summary">
                    {userLikes[p.id] ? (
                      p.likes_count === 1 ? <span>Liked by <strong>you</strong></span> : <span>Liked by <strong>you</strong> and <strong>{p.likes_count - 1} others</strong></span>
                    ) : (
                      <span><strong>{p.likes_count}</strong> {p.likes_count === 1 ? 'like' : 'likes'}</span>
                    )}
                  </div>
                )}

                <div className="blog-card-body">
                  <div className="blog-card-caption">
                    <strong>mritunjaykumar</strong> {p.title} — {p.excerpt}
                  </div>
                  <button className="blog-card-read-link" onClick={() => openPost(p)}>
                    Read full post <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activePost && (
        <div className="modal-overlay open" onClick={(e) => e.target === e.currentTarget && closePost()}>
          <div className="modal-box blog-read-modal">
            <button className="modal-close" onClick={closePost} aria-label="Close"><X size={18} /></button>
            <div>
              {activePost.cover && <img src={activePost.cover} className="blog-read-cover" alt="" />}
              <div style={{ padding: '1.75rem 2rem 2rem' }}>
                <div className={`blog-read-type blog-type-${activePost.type?.toLowerCase()}`}>{activePost.type || 'Blog'}</div>
                <h1 className="blog-read-title">{activePost.title}</h1>
                <div className="blog-read-meta">
                  <span><FolderOpen size={14} /> {activePost.category || 'General'}</span>
                  <span><Calendar size={14} /> {new Date(activePost.created_at).toLocaleDateString()}</span>
                  <span><Clock size={14} /> {readTime(activePost.body)} min read</span>
                </div>
                <div className="blog-read-body" dangerouslySetInnerHTML={{ __html: activePost.body }} />

                <div className="blog-read-like-bar">
                  <button className={`like-btn--big ${userLikes[activePost.id] ? 'liked' : ''}`} onClick={() => toggleLike(activePost.id)}>
                    <span>{userLikes[activePost.id] ? '♥' : '♡'}</span>
                    <span>{userLikes[activePost.id] ? 'Liked' : 'Like this post'}</span>
                    <span className="like-count-pill">{activePost.likes_count || 0} likes</span>
                  </button>
                </div>

                <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Comments ({comments.length})</h3>
                  <div style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '1rem' }}>
                    {comments.map(c => (
                      <div key={c.id} className="blog-comment-item">
                        <div className="blog-comment-item-avatar">{c.author_name.substring(0, 2).toUpperCase()}</div>
                        <div>
                          <div className="blog-comment-item-text"><strong>{c.author_name}</strong> {c.content}</div>
                          <div className="blog-comment-item-time">{new Date(c.created_at).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="blog-card-comment-input">
                    <div className="blog-comment-avatar">V</div>
                    <input type="text" className="blog-comment-field" placeholder="Add a comment..." value={newComment} onChange={e => setNewComment(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleComment(activePost.id)} />
                    <button className={`blog-comment-post-btn ${newComment.trim() ? 'ready' : ''}`} onClick={() => handleComment(activePost.id)}>Post</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
