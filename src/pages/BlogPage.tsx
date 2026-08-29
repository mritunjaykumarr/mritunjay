import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useScrollLock } from '../hooks/useScrollLock';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO';
import { Heart, MessageCircle, ArrowRight, X, Search, BookOpen } from 'lucide-react';
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

  const fetchPosts = useCallback(async () => {
    // 1. Read local vault posts first
    let currentPosts: BlogPost[] = DEFAULT_POSTS;
    try {
      const localStr = localStorage.getItem('admin_local_posts');
      if (localStr) {
        const parsed = JSON.parse(localStr);
        const published = parsed.filter((p: { status?: string }) => !p.status || p.status === 'published');
        if (published.length > 0) {
          currentPosts = [...published, ...DEFAULT_POSTS.filter(dp => !published.some((lp: BlogPost) => lp.id === dp.id))];
          setPosts(currentPosts);
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
          setPosts([...live, ...currentPosts.filter(cp => !live.some(lp => lp.id === cp.id))]);
        }
      }
    } catch (err) {
      console.warn('Live Supabase query skipped (offline/unreachable):', err);
    }
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
      if (!postId.startsWith('default-')) await supabase.from('post_likes').delete().match({ post_id: postId, user_identifier: anonId });
      setPosts(posts.map(p => p.id === postId ? { ...p, likes_count: Math.max(0, p.likes_count - 1) } : p));
    } else {
      newLikes[postId] = true;
      if (!postId.startsWith('default-')) await supabase.from('post_likes').insert({ post_id: postId, user_identifier: anonId });
      setPosts(posts.map(p => p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p));
    }
    setUserLikes(newLikes);
    localStorage.setItem('user_likes', JSON.stringify(newLikes));
  };

  const openPost = async (post: BlogPost) => {
    setActivePost(post);
    if (!post.id.startsWith('default-')) {
      const { data } = await supabase.from('comments').select('*').eq('post_id', post.id).order('created_at', { ascending: true });
      if (data) setComments(data);
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
      const { data } = await supabase.from('comments').insert(commentData).select().single();
      if (data) {
        setComments([...comments, data]);
        setNewComment('');
      }
    } else {
      setComments([...comments, { id: 'temp-' + Date.now(), ...commentData }]);
      setNewComment('');
    }
  };

  const readTime = (body: string) => Math.max(1, Math.ceil((body || '').replace(/<[^>]+>/g, ' ').split(/\s+/).length / 200));

  const filteredPosts = useMemo(() => posts.filter(p => {
    const matchesCat = filterCategory === 'all' || p.type === filterCategory || p.category === filterCategory;
    const matchesSearch = (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || (p.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase()) || (p.body || '').toLowerCase().includes(searchQuery.toLowerCase());
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
              <span>Articles &amp; Insights</span>
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
            <div className="blog-search-wrap" style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
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

            <div className="blog-filter-chips" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {['all', 'Blog', 'Article', 'News'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilterCategory(f)}
                  className="nav-pill-item"
                  style={{
                    height: '34px', padding: '0 12px', fontSize: '0.78rem', textTransform: 'capitalize',
                    background: filterCategory === f ? 'var(--solid-btn-grad)' : 'var(--surface-2)',
                    color: filterCategory === f ? 'var(--accent-foreground)' : 'var(--text-muted)',
                    borderColor: filterCategory === f ? 'var(--border-accent)' : 'var(--border)'
                  }}
                >
                  {f === 'all' ? 'All Posts' : f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Cards Grid */}
      <section className="section" style={{ padding: '1rem 0 4rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => openPost(post)}
                style={{
                  background: 'var(--card)', border: '1px solid var(--border)',
                  borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column'
                }}
              >
                {post.cover && (
                  <div style={{ height: 190, background: 'var(--surface-2)', overflow: 'hidden', borderBottom: '1px solid var(--border)' }}>
                    <img src={post.cover} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  </div>
                )}

                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}>{post.type}</span>
                      <span>{readTime(post.body || '')} min read</span>
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
        </div>
      </section>

      {/* AdSense Unit */}
      <section className="section" style={{ padding: '2rem 0' }}>
        <div className="container">
          <AdUnit slot="6189533583" />
        </div>
      </section>

      {/* Article Reader Modal */}
      {activePost && (
        <div className="modal-overlay open" onClick={closePost}>
          <div onClick={e => e.stopPropagation()} className="modal-box" style={{ maxWidth: 750, width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem', position: 'relative' }}>
            <button
              onClick={closePost}
              aria-label="Close"
              style={{
                position: 'absolute', top: 14, right: 14, width: 32, height: 32,
                borderRadius: '6px', background: 'var(--surface-2)', border: '1px solid var(--border)',
                display: 'grid', placeItems: 'center', color: 'var(--text)', cursor: 'pointer', zIndex: 10
              }}
            >
              <X size={16} />
            </button>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {activePost.type} · {readTime(activePost.body || '')} min read
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 600, color: 'var(--text)', margin: '0 0 1rem', lineHeight: 1.3 }}>
              {activePost.title}
            </h2>

            {activePost.cover && (
              <div style={{ borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
                <img src={activePost.cover} alt="" style={{ width: '100%', maxHeight: 300, objectFit: 'cover' }} />
              </div>
            )}

            <div
              style={{ color: 'var(--text-2)', fontSize: '0.94rem', lineHeight: 1.8, marginBottom: '2rem' }}
              dangerouslySetInnerHTML={{ __html: activePost.body }}
            />

            {/* Comments */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>
                Comments ({comments.length})
              </h4>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  style={{
                    flex: 1, padding: '0.6rem 0.85rem', borderRadius: '6px',
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                    color: 'var(--text)', fontSize: '0.86rem'
                  }}
                />
                <button
                  className="btn-primary"
                  onClick={() => handleComment(activePost.id)}
                  style={{ height: '36px', padding: '0 14px', fontSize: '0.8rem' }}
                >
                  Post
                </button>
              </div>

              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {comments.map((c) => (
                  <div key={c.id} style={{ padding: '0.85rem', background: 'var(--surface-2)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>{c.author_name}</span>
                      <span>{new Date(c.created_at).toLocaleDateString()}</span>
                    </div>
                    <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', margin: 0 }}>{c.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
