import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useScrollLock } from '../hooks/useScrollLock';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO';
import { Heart, MessageCircle, ArrowRight, X, Search, BookOpen, Clock, Share2, Send } from 'lucide-react';
import { DEFAULT_POSTS, type BlogPost, type CommentItem } from '../data/blogData';
import AdUnit from '../components/AdUnit';

export default function BlogPage() {
  usePortfolioMotion();
  useSEO(SEO_CONFIGS.blog);
  const [posts, setPosts] = useState<BlogPost[]>(DEFAULT_POSTS);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState('');
  useScrollLock(!!activePost);

  const [userLikes, setUserLikes] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem('user_likes') || '{}');
    } catch {
      return {};
    }
  });

  const [anonId] = useState(() => {
    let id = localStorage.getItem('anon_id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('anon_id', id);
    }
    return id;
  });

  // Deduplicate and merge posts cleanly
  const deduplicatePosts = (postList: BlogPost[]): BlogPost[] => {
    const seenIds = new Set<string>();
    const seenTitles = new Set<string>();
    const result: BlogPost[] = [];

    for (const p of postList) {
      if (!p || !p.title) continue;
      const normalizedTitle = p.title.toLowerCase().trim();
      if (!seenIds.has(p.id) && !seenTitles.has(normalizedTitle)) {
        seenIds.add(p.id);
        seenTitles.add(normalizedTitle);
        result.push(p);
      }
    }
    return result;
  };

  const fetchPosts = useCallback(async () => {
    let mergedList: BlogPost[] = [...DEFAULT_POSTS];

    // 1. Read local vault posts
    try {
      const localStr = localStorage.getItem('admin_local_posts');
      if (localStr) {
        const parsed = JSON.parse(localStr);
        if (Array.isArray(parsed)) {
          const published = parsed.filter((p: { status?: string }) => !p.status || p.status === 'published');
          if (published.length > 0) {
            mergedList = [...published, ...mergedList];
          }
        }
      }
    } catch {
      // ignore
    }

    // 2. Attempt Supabase live sync
    try {
      const { data: postsData, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      if (!error && postsData && postsData.length > 0) {
        const { data: commentsData } = await supabase.from('comments').select('post_id');
        const counts: Record<string, number> = {};
        commentsData?.forEach((c: { post_id: string }) => { counts[c.post_id] = (counts[c.post_id] || 0) + 1; });
        const visible = postsData.filter((p: { status?: string }) => !p.status || p.status === 'published');
        if (visible.length > 0) {
          const live = visible.map((p: BlogPost) => ({ ...p, comments_count: counts[p.id] || 0 }));
          mergedList = [...live, ...mergedList];
        }
      }
    } catch (err) {
      console.warn('Live Supabase query skipped (offline/unreachable):', err);
    }

    setPosts(deduplicatePosts(mergedList));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchPosts(), 0);
    return () => clearTimeout(t);
  }, [fetchPosts]);

  const toggleLike = async (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isLiked = userLikes[postId];
    const newLikes = { ...userLikes };
    if (isLiked) {
      delete newLikes[postId];
      if (!postId.startsWith('default-')) {
        try {
          await supabase.from('post_likes').delete().match({ post_id: postId, user_identifier: anonId });
        } catch {
          // ignore
        }
      }
      setPosts(posts.map(p => p.id === postId ? { ...p, likes_count: Math.max(0, (p.likes_count || 1) - 1) } : p));
    } else {
      newLikes[postId] = true;
      if (!postId.startsWith('default-')) {
        try {
          await supabase.from('post_likes').insert({ post_id: postId, user_identifier: anonId });
        } catch {
          // ignore
        }
      }
      setPosts(posts.map(p => p.id === postId ? { ...p, likes_count: (p.likes_count || 0) + 1 } : p));
    }
    setUserLikes(newLikes);
    localStorage.setItem('user_likes', JSON.stringify(newLikes));
  };

  const openPost = async (post: BlogPost) => {
    setActivePost(post);
    if (!post.id.startsWith('default-')) {
      try {
        const { data } = await supabase.from('comments').select('*').eq('post_id', post.id).order('created_at', { ascending: true });
        if (data) setComments(data);
      } catch {
        setComments([]);
      }
    } else {
      setComments([]);
    }
  };

  const closePost = () => setActivePost(null);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activePost) closePost();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [activePost]);

  const handleComment = async (postId: string) => {
    if (!newComment.trim()) return;
    const commentData = { post_id: postId, author_name: 'Visitor', content: newComment.trim(), created_at: new Date().toISOString() };
    if (!postId.startsWith('default-')) {
      try {
        const { data } = await supabase.from('comments').insert(commentData).select().single();
        if (data) {
          setComments([...comments, data]);
          setNewComment('');
        }
      } catch {
        setComments([...comments, { id: 'temp-' + Date.now(), ...commentData }]);
        setNewComment('');
      }
    } else {
      setComments([...comments, { id: 'temp-' + Date.now(), ...commentData }]);
      setNewComment('');
    }
  };

  const handleShareArticle = (post: BlogPost) => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: post.title, text: post.excerpt, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${post.title}\n${url}`);
      alert('Article link copied to clipboard!');
    }
  };

  const readTime = (body: string) => Math.max(1, Math.ceil((body || '').replace(/<[^>]+>/g, ' ').split(/\s+/).length / 200));

  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach(p => {
      if (p.category) set.add(p.category);
      else if (p.type) set.add(p.type);
    });
    return ['all', ...Array.from(set)];
  }, [posts]);

  const filteredPosts = useMemo(() => posts.filter(p => {
    const matchesCat = filterCategory === 'all' || 
      (p.category && p.category.toLowerCase() === filterCategory.toLowerCase()) || 
      (p.type && p.type.toLowerCase() === filterCategory.toLowerCase());
    const matchesSearch = (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.body || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  }), [posts, filterCategory, searchQuery]);

  return (
    <div className="page-wrapper blog-page" style={{ paddingTop: '6rem', paddingBottom: '5rem', background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      {/* Page Header */}
      <section className="page-header" style={{ padding: '2rem 0 3rem' }}>
        <div className="container">
          <div className="breadcrumb" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--text)' }}>Blog</span>
          </div>

          <div className="page-header-content">
            <div className="badge-playful" style={{ marginBottom: '1rem' }}>
              <BookOpen size={13} />
              <span>Articles &amp; Engineering Notes</span>
            </div>
            <h1 className="page-title" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', fontWeight: 600, letterSpacing: '-0.04em', margin: '0.5rem 0 1rem', color: 'var(--text)' }}>
              Technical Writing &amp; <em>Insights</em>
            </h1>
            <p className="page-subtitle" style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '600px', lineHeight: 1.65 }}>
              In-depth articles on frontend performance, React 19 architecture, AI system design, and software engineering discipline.
            </p>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="section" style={{ padding: '0 0 2rem' }}>
        <div className="container">
          <div className="blog-filter-bar">
            <div className="blog-search-wrap">
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search articles by title or keyword..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem', borderRadius: '8px',
                  background: 'var(--surface-2)', border: '1px solid var(--border)',
                  color: 'var(--text)', fontSize: '0.88rem'
                }}
              />
            </div>

            <div className="blog-filter-chips">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className="nav-pill-item"
                  style={{
                    height: '34px', padding: '0 12px', fontSize: '0.78rem', textTransform: 'capitalize',
                    background: filterCategory === cat ? 'var(--solid-btn-grad)' : 'var(--surface-2)',
                    color: filterCategory === cat ? 'var(--accent-foreground)' : 'var(--text-muted)',
                    borderColor: filterCategory === cat ? 'var(--border-accent)' : 'var(--border)'
                  }}
                >
                  {cat === 'all' ? 'All Posts' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Cards Grid */}
      <section className="section" style={{ padding: '1rem 0 4rem' }}>
        <div className="container">
          {filteredPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text)', marginBottom: '0.5rem' }}>No articles match your search</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Try searching another keyword or reset the category filter.</p>
              <button 
                onClick={() => { setSearchQuery(''); setFilterCategory('all'); }} 
                className="btn-primary" 
                style={{ marginTop: '1rem' }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => openPost(post)}
                  style={{
                    background: 'var(--card)', border: '1px solid var(--border)',
                    borderRadius: '14px', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >
                  {post.cover && (
                    <div style={{ height: 180, background: 'var(--surface-2)', overflow: 'hidden', borderBottom: '1px solid var(--border)' }}>
                      <img src={post.cover} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                    </div>
                  )}

                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500, color: 'var(--text)' }}>{post.category || post.type}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {readTime(post.body || '')} min read
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text)', margin: '0 0 0.5rem', lineHeight: 1.4 }}>
                        {post.title}
                      </h3>
                      <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                        {post.excerpt}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <button
                          onClick={(e) => toggleLike(post.id, e)}
                          style={{ display: 'flex', alignItems: 'center', gap: '4px', color: userLikes[post.id] ? '#f43f5e' : 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                          aria-label="Like post"
                        >
                          <Heart size={14} fill={userLikes[post.id] ? '#f43f5e' : 'none'} />
                          <span>{post.likes_count || 0}</span>
                        </button>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MessageCircle size={14} />
                          <span>{post.comments_count || 0}</span>
                        </span>
                      </div>

                      <span style={{ fontSize: '0.82rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                        Read Article <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* AdSense Unit */}
      <section className="section" style={{ padding: '1rem 0 3rem' }}>
        <div className="container">
          <AdUnit slot="6189533583" />
        </div>
      </section>

      {/* Article Reader Modal */}
      {activePost && (
        <div className="modal-overlay open" onClick={closePost} role="dialog" aria-modal="true">
          <div 
            onClick={e => e.stopPropagation()} 
            className="modal-box" 
            style={{ 
              maxWidth: 780, 
              width: '100%', 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              padding: 'clamp(1.25rem, 3vw, 2rem)', 
              position: 'relative',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <button
              onClick={closePost}
              aria-label="Close article"
              style={{
                position: 'absolute', top: 14, right: 14, width: 32, height: 32,
                borderRadius: '6px', background: 'var(--surface-2)', border: '1px solid var(--border)',
                display: 'grid', placeItems: 'center', color: 'var(--text)', cursor: 'pointer', zIndex: 10
              }}
            >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <span>{activePost.category || activePost.type}</span>
              <span>·</span>
              <span>{readTime(activePost.body || '')} min read</span>
            </div>

            <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.85rem)', fontWeight: 600, color: 'var(--text)', margin: '0 0 1rem', lineHeight: 1.3, paddingRight: '2rem' }}>
              {activePost.title}
            </h2>

            {activePost.cover && (
              <div style={{ borderRadius: '10px', overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
                <img src={activePost.cover} alt="" style={{ width: '100%', maxHeight: 320, objectFit: 'cover' }} />
              </div>
            )}

            <div 
              style={{ 
                color: 'var(--text)', fontSize: '0.95rem', lineHeight: 1.75,
                borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1.5rem' 
              }}
              dangerouslySetInnerHTML={{ __html: activePost.body }}
            />

            {/* Modal Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => toggleLike(activePost.id)}
                  className="btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
                >
                  <Heart size={14} fill={userLikes[activePost.id] ? '#f43f5e' : 'none'} color={userLikes[activePost.id] ? '#f43f5e' : 'currentColor'} />
                  <span>{activePost.likes_count || 0} Likes</span>
                </button>

                <button
                  onClick={() => handleShareArticle(activePost)}
                  className="btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
                >
                  <Share2 size={14} />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>
                Discussion &amp; Feedback ({comments.length})
              </h3>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
                <input
                  type="text"
                  placeholder="Add a thought or question on this post..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleComment(activePost.id); }}
                  style={{
                    flex: 1, padding: '0.65rem 0.85rem', borderRadius: '8px',
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                    color: 'var(--text)', fontSize: '0.85rem'
                  }}
                />
                <button
                  onClick={() => handleComment(activePost.id)}
                  disabled={!newComment.trim()}
                  className="btn-primary"
                  style={{ padding: '0.65rem 1rem', fontSize: '0.82rem' }}
                >
                  <Send size={14} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {comments.length === 0 ? (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Be the first to share a thought on this article!
                  </div>
                ) : (
                  comments.map((c, i) => (
                    <div key={c.id || i} style={{ padding: '0.75rem 1rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text)' }}>{c.author_name || c.user_name || 'Visitor'}</span>
                        <span>{new Date(c.created_at).toLocaleDateString()}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.5 }}>{c.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
