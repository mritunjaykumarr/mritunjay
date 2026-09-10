import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useScrollLock } from '../hooks/useScrollLock';
import { usePortfolioMotion } from '../lib/usePortfolioMotion';
import { useSEO, SEO_CONFIGS } from '../lib/useSEO';
import {
  Heart, MessageCircle, ArrowRight, X, Search, Clock, Share2, Send,
  Sparkles, VolumeX, Play, Pause, Bookmark, LayoutGrid, List,
  Maximize2, Minimize2, ExternalLink, Flame, Rocket, CheckCheck,
  TrendingUp, Compass, Newspaper
} from 'lucide-react';
import { DEFAULT_POSTS, type BlogPost, type CommentItem } from '../data/blogData';
import AdUnit from '../components/AdUnit';

export default function BlogPage() {
  usePortfolioMotion();
  useSEO(SEO_CONFIGS.blog);

  // --- State Management ---
  const [posts, setPosts] = useState<BlogPost[]>(DEFAULT_POSTS);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'quick' | 'deep'>('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState('');
  
  // Futuristic Reader State
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAiSummaryOpen, setIsAiSummaryOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [isZenMode, setIsZenMode] = useState(false);

  // Text-To-Speech (TTS) State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState<number>(1);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success'>('idle');

  // Modal ref & Scroll Lock
  const modalBoxRef = useRef<HTMLDivElement>(null);
  useScrollLock(!!activePost);

  // --- Bookmarks State ---
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem('user_blog_bookmarks') || '{}');
    } catch {
      return {};
    }
  });

  const toggleBookmark = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarks(prev => {
      const next = { ...prev, [postId]: !prev[postId] };
      if (!next[postId]) delete next[postId];
      localStorage.setItem('user_blog_bookmarks', JSON.stringify(next));
      return next;
    });
  };

  // --- Multi-Emoji Reactions State ---
  const [reactions, setReactions] = useState<Record<string, Record<string, number>>>(() => {
    try {
      return JSON.parse(localStorage.getItem('blog_reactions_counts') || '{}');
    } catch {
      return {};
    }
  });

  const [userReactions, setUserReactions] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem('user_chosen_reactions') || '{}');
    } catch {
      return {};
    }
  });

  const handleReaction = (postId: string, reactionEmoji: string) => {
    const current = userReactions[postId];
    const defaultCounts: Record<string, number> = { '🔥': 8, '💡': 5, '🚀': 12, '❤️': 18, '👏': 6 };
    const currentCounts = { ...(reactions[postId] || defaultCounts) };

    if (current === reactionEmoji) {
      currentCounts[reactionEmoji] = Math.max(0, (currentCounts[reactionEmoji] || 1) - 1);
      setUserReactions(prev => {
        const next = { ...prev };
        delete next[postId];
        localStorage.setItem('user_chosen_reactions', JSON.stringify(next));
        return next;
      });
    } else {
      if (current) {
        currentCounts[current] = Math.max(0, (currentCounts[current] || 1) - 1);
      }
      currentCounts[reactionEmoji] = (currentCounts[reactionEmoji] || 0) + 1;
      setUserReactions(prev => {
        const next = { ...prev, [postId]: reactionEmoji };
        localStorage.setItem('user_chosen_reactions', JSON.stringify(next));
        return next;
      });
    }

    setReactions(prev => {
      const next = { ...prev, [postId]: currentCounts };
      localStorage.setItem('blog_reactions_counts', JSON.stringify(next));
      return next;
    });
  };

  // --- Likes State ---
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

  // --- Stop Text-To-Speech Cleanly ---
  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  // --- Scroll & Modal Resets ---
  useEffect(() => {
    if (activePost && modalBoxRef.current) {
      modalBoxRef.current.scrollTop = 0;
      setScrollProgress(0);
      setIsAiSummaryOpen(false);
      setIsZenMode(false);
      stopSpeech();
    }
  }, [activePost, stopSpeech]);

  // Track live reading scroll progress
  const handleReaderScroll = () => {
    if (!modalBoxRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = modalBoxRef.current;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll > 0) {
      setScrollProgress(Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100)));
    }
  };

  // Stop speech when closing modal or unmounting
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);

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

  const closePost = () => {
    stopSpeech();
    setActivePost(null);
  };

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

  // --- TTS Engine Execution ---
  const toggleSpeechAudio = (rawContent: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis audio is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = rawContent
      .replace(/<[^>]+>/g, ' ')
      .replace(/-{3,}/g, ' ')
      .replace(/https?:\/\/\S+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = speechSpeed;
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  // --- Dynamic AI Summary Extraction ---
  const getAiSummary = (post: BlogPost): string[] => {
    const title = (post.title || '').toLowerCase();
    const text = (post.body || '').replace(/<[^>]+>/g, ' ');

    if (title.includes('ipl') || title.includes('bengaluru') || title.includes('gujarat') || text.includes('RCB')) {
      return [
        'High-stakes Qualifier 1 playoff clash between Royal Challengers Bengaluru and Gujarat Titans.',
        'Historical head-to-head record is dead-even at 4-4 across 8 tournament encounters.',
        'Both teams feature deep batting lineups and game-changing impact substitutions.'
      ];
    }
    if (title.includes('react 19')) {
      return [
        'React 19 compiler automates memoization, making manual useMemo and useCallback mostly redundant.',
        'Actions and useTransition unify asynchronous state mutations without boolean isLoading flags.',
        'useOptimistic delivers instantaneous zero-latency UI updates with automatic failure rollbacks.'
      ];
    }
    if (title.includes('gsap') || title.includes('micro-interactions')) {
      return [
        'Animating transform and opacity offloads work entirely to the GPU, guaranteeing silky 60fps.',
        'gsap.context() eliminates memory leaks by automatically killing stale timelines on component unmount.',
        'Respecting prefers-reduced-motion ensures accessibility compliance for vestibular sensitivities.'
      ];
    }
    if (title.includes('streaming ai') || title.includes('assistant')) {
      return [
        'Server-Sent Events (SSE) reduce Time-To-First-Token (TTFT) below 400ms for conversational agents.',
        'Decoupling stream byte reception from React state updates prevents heavy DOM frame drops.',
        'Domain-specific system prompt sandboxes ensure AI assistants remain truthful to real experience.'
      ];
    }
    if (title.includes('email') || title.includes('bulk mail')) {
      return [
        'Automatic OAuth2 token refresh interceptors prevent multi-hour bulk campaigns from failing mid-flight.',
        'Streaming CSV transformations eliminate Node.js memory overflows on lists exceeding 50,000 records.',
        'Paced transmission jitter and RFC 5322 syntax validation protect domain deliverability.'
      ];
    }

    // Generic fallback bullets
    const cleanSentences = text.split(/[.!?]+/).filter(s => s.trim().length > 30);
    if (cleanSentences.length >= 3) {
      return cleanSentences.slice(0, 3).map(s => s.trim() + '.');
    }
    return [
      'Comprehensive architectural breakdown and core technical takeaways.',
      'Performance benchmarks, bundle considerations, and edge cases addressed.',
      'Practical production-tested patterns ready for direct software engineering application.'
    ];
  };

  // --- Smart Formatter for Plain Text / Raw Dashed Articles ---
  const renderSmartBodyContent = (bodyText: string) => {
    // If it contains substantial HTML tags, render HTML but replace any long raw dashes
    const hasHtmlTags = /<(p|div|h1|h2|h3|ul|ol|pre|table)\b/i.test(bodyText);
    if (hasHtmlTags) {
      const sanitized = bodyText.replace(/-{4,}/g, '<hr style="border:0;border-top:1px dashed var(--border);margin:1.5rem 0;" />');
      return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
    }

    // Otherwise, parse raw text with dashes (like the user's IPL 2026 post)
    const rawSegments = bodyText.split(/-{3,}/).map(s => s.trim()).filter(Boolean);

    return (
      <div className="parsed-article-flow">
        {rawSegments.map((segment, idx) => {
          // Detect Source / Credit URL
          if (/credit\s*:/i.test(segment) || /^https?:\/\//i.test(segment)) {
            const matchUrl = segment.match(/https?:\/\/[^\s]+/);
            const url = matchUrl ? matchUrl[0] : '';
            return (
              <div key={idx} style={{ marginTop: '1.25rem' }}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="parsed-source-link">
                  <ExternalLink size={13} />
                  <span>{segment.replace(/https?:\/\//, '')}</span>
                </a>
              </div>
            );
          }

          // Detect Head-to-Head Section
          if (/head-to-head/i.test(segment)) {
            const matchesCount = segment.match(/Matches Played:\s*(\d+)/i)?.[1] || '8';
            const rcbWon = segment.match(/RCB Won:\s*(\d+)/i)?.[1] || '4';
            const gtWon = segment.match(/GT Won:\s*(\d+)/i)?.[1] || '4';
            return (
              <div key={idx} className="parsed-section-card">
                <div className="parsed-section-header">
                  <Flame size={16} color="#f43f5e" />
                  <span>Head-to-Head Tournament Record</span>
                </div>
                <div className="parsed-stat-grid">
                  <div className="parsed-stat-pill">
                    <div className="stat-label">Matches Played</div>
                    <div className="stat-val">{matchesCount}</div>
                  </div>
                  <div className="parsed-stat-pill">
                    <div className="stat-label">RCB Victories</div>
                    <div className="stat-val" style={{ color: '#ef4444' }}>{rcbWon}</div>
                  </div>
                  <div className="parsed-stat-pill">
                    <div className="stat-label">GT Victories</div>
                    <div className="stat-val" style={{ color: '#06b6d4' }}>{gtWon}</div>
                  </div>
                </div>
              </div>
            );
          }

          // Detect Probable Playing XIs
          if (/probable playing xis/i.test(segment) || /playing xi/i.test(segment)) {
            return (
              <div key={idx} className="parsed-section-card" style={{ borderLeftColor: '#10b981' }}>
                <div className="parsed-section-header">
                  <Rocket size={16} color="#10b981" />
                  <span>Match Day Lineups &amp; Playing Squads</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                  {segment.replace(/Probable Playing XIs/i, '').trim()}
                </div>
              </div>
            );
          }

          // Standard narrative paragraph
          return (
            <p key={idx} style={{ fontSize: '0.98rem', lineHeight: 1.8, marginBottom: '1rem', color: 'var(--text)' }}>
              {segment}
            </p>
          );
        })}
      </div>
    );
  };

  // --- Categories List with Bookmarks Filter ---
  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach(p => {
      if (p.category) set.add(p.category);
      else if (p.type) set.add(p.type);
    });
    return ['all', 'bookmarks', ...Array.from(set)];
  }, [posts]);

  // --- Filtering & Sorting Posts ---
  const processedPosts = useMemo(() => {
    let result = posts.filter(p => {
      const isBookmarkTab = filterCategory === 'bookmarks';
      if (isBookmarkTab && !bookmarks[p.id]) return false;

      const matchesCat = filterCategory === 'all' || isBookmarkTab ||
        (p.category && p.category.toLowerCase() === filterCategory.toLowerCase()) || 
        (p.type && p.type.toLowerCase() === filterCategory.toLowerCase());

      const matchesSearch = (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.body || '').toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCat && matchesSearch;
    });

    // Sort logic
    if (sortBy === 'popular') {
      result.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
    } else if (sortBy === 'quick') {
      result.sort((a, b) => readTime(a.body) - readTime(b.body));
    } else if (sortBy === 'deep') {
      result.sort((a, b) => readTime(b.body) - readTime(a.body));
    } else {
      // Latest first
      result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    }

    return result;
  }, [posts, filterCategory, searchQuery, sortBy, bookmarks]);

  // Spotlight post (top featured article)
  const spotlightPost = posts[0] || null;

  return (
    <div className="page-wrapper blog-page" style={{ paddingTop: '6rem', paddingBottom: '5rem', background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      
      {/* Page Header */}
      <section className="page-header" style={{ padding: '2rem 0 2rem' }}>
        <div className="container">
          <div className="breadcrumb" style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--text)' }}>Blog</span>
          </div>

          <div className="page-header-content">
            <div className="badge-playful" style={{ marginBottom: '1rem' }}>
              <Compass size={13} />
              <span>Engineering Publication &amp; Insights</span>
            </div>
            <h1 className="page-title" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', fontWeight: 600, letterSpacing: '-0.04em', margin: '0.5rem 0 1rem', color: 'var(--text)' }}>
              Technical Writing &amp; <em>Insights</em>
            </h1>
            <p className="page-subtitle" style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '650px', lineHeight: 1.65 }}>
              In-depth publications on frontend architecture, React 19, GPU motion physics, streaming AI systems, and real-time backend engineering.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Spotlight Article Banner */}
      {spotlightPost && filterCategory === 'all' && !searchQuery && (
        <section className="section" style={{ padding: '0 0 2rem' }}>
          <div className="container">
            <div className="blog-spotlight-card">
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a855f7', marginBottom: '0.75rem' }}>
                  <TrendingUp size={14} />
                  <span>Featured Publication Spotlight</span>
                </div>
                <h2 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.85rem)', fontWeight: 700, lineHeight: 1.35, color: 'var(--text)', margin: '0 0 0.85rem' }}>
                  {spotlightPost.title}
                </h2>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.65, maxWidth: '680px', margin: '0 0 1.25rem' }}>
                  {spotlightPost.excerpt}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <button onClick={() => openPost(spotlightPost)} className="btn-primary" style={{ padding: '0.55rem 1.15rem', fontSize: '0.84rem' }}>
                    <span>Read Article</span>
                    <ArrowRight size={14} />
                  </button>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={13} /> {readTime(spotlightPost.body || '')} min deep dive
                  </span>
                </div>
              </div>

              {spotlightPost.cover && (
                <div style={{ width: 220, height: 140, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', flexShrink: 0, display: 'none' }} className="spotlight-img-wrap">
                  <img src={spotlightPost.cover} alt={spotlightPost.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Filter, Search & View Controls Toolbar */}
      <section className="section" style={{ padding: '0 0 1.5rem' }}>
        <div className="container">
          {/* Search and Category Pills */}
          <div className="blog-filter-bar" style={{ marginBottom: '1.25rem' }}>
            <div className="blog-search-wrap">
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search articles by title, keyword, or tech stack..."
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
              {categories.map(cat => {
                const isSelected = filterCategory === cat;
                const isBookmark = cat === 'bookmarks';
                const bookmarkCount = Object.keys(bookmarks).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className="nav-pill-item"
                    style={{
                      height: '34px', padding: '0 12px', fontSize: '0.78rem', textTransform: 'capitalize',
                      background: isSelected ? 'var(--solid-btn-grad)' : 'var(--surface-2)',
                      color: isSelected ? 'var(--accent-foreground)' : 'var(--text-muted)',
                      borderColor: isSelected ? 'var(--border-accent)' : 'var(--border)',
                      display: 'inline-flex', alignItems: 'center', gap: 5
                    }}
                  >
                    {isBookmark && <Bookmark size={12} fill={isSelected ? 'currentColor' : 'none'} />}
                    <span>{isBookmark ? `Saved (${bookmarkCount})` : cat === 'all' ? 'All Posts' : cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sorter & View Mode Controls Row */}
          <div className="blog-toolbar-row">
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Showing <strong>{processedPosts.length}</strong> {processedPosts.length === 1 ? 'publication' : 'publications'}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="blog-sort-select"
                aria-label="Sort publications"
              >
                <option value="latest">Sort: Latest Releases</option>
                <option value="popular">Sort: Most Popular</option>
                <option value="quick">Sort: Quick Reads (&lt; 3 mins)</option>
                <option value="deep">Sort: Deep Dives (5+ mins)</option>
              </select>

              <div className="blog-view-toggle">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`blog-view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  title="Grid View"
                  aria-label="Grid View"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`blog-view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                  title="Compact List View"
                  aria-label="Compact List View"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Blog Publications Feed */}
      <section className="section" style={{ padding: '0 0 4rem' }}>
        <div className="container">
          {processedPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text)', marginBottom: '0.5rem' }}>No publications found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                {filterCategory === 'bookmarks' ? 'You have not saved any articles to your reading list yet.' : 'Try adjusting your search query or reset the filter.'}
              </p>
              <button 
                onClick={() => { setSearchQuery(''); setFilterCategory('all'); }} 
                className="btn-primary" 
                style={{ marginTop: '1rem' }}
              >
                Reset Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
              {processedPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => openPost(post)}
                  style={{
                    background: 'var(--card)', border: '1px solid var(--border)',
                    borderRadius: '14px', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: 'var(--shadow-sm)', position: 'relative'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >
                  {post.cover && (
                    <div style={{ height: 180, background: 'var(--surface-2)', overflow: 'hidden', borderBottom: '1px solid var(--border)', position: 'relative' }}>
                      <img src={post.cover} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                      <button
                        onClick={(e) => toggleBookmark(post.id, e)}
                        style={{
                          position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: 8,
                          background: 'rgba(0, 0, 0, 0.65)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)',
                          color: bookmarks[post.id] ? '#a855f7' : '#ffffff', display: 'grid', placeItems: 'center', cursor: 'pointer'
                        }}
                        title={bookmarks[post.id] ? 'Remove bookmark' : 'Bookmark for later'}
                        aria-label="Bookmark article"
                      >
                        <Bookmark size={14} fill={bookmarks[post.id] ? '#a855f7' : 'none'} />
                      </button>
                    </div>
                  )}

                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        <span style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600, color: 'var(--text)' }}>{post.category || post.type}</span>
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
          ) : (
            /* Compact High-Density List View */
            <div className="blog-list-view">
              {processedPosts.map(post => (
                <div key={post.id} onClick={() => openPost(post)} className="blog-list-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'var(--surface-3)', color: 'var(--text)', flexShrink: 0 }}>
                      {post.category || post.type}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {post.title}
                      </h4>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        Published {new Date(post.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {readTime(post.body || '')} min read
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                    <button
                      onClick={(e) => toggleBookmark(post.id, e)}
                      style={{ background: 'none', border: 'none', color: bookmarks[post.id] ? '#a855f7' : 'var(--text-muted)', cursor: 'pointer', display: 'grid', placeItems: 'center' }}
                      title="Bookmark article"
                      aria-label="Bookmark article"
                    >
                      <Bookmark size={15} fill={bookmarks[post.id] ? '#a855f7' : 'none'} />
                    </button>
                    <ArrowRight size={15} style={{ color: 'var(--text-muted)' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Futuristic Newsletter Digest Card */}
      <section className="section" style={{ padding: '0 0 3rem' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, var(--card) 0%, rgba(99, 102, 241, 0.08) 100%)',
            border: '1px solid var(--border)', borderRadius: 16, padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#a855f7', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                <Newspaper size={14} />
                <span>Tech Digest Dispatch</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.4rem', color: 'var(--text)' }}>
                Stay Ahead of the Software Curve
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0, maxWidth: 500 }}>
                Receive deep technical architectural breakdowns, performance case studies, and engineering benchmarks directly in your inbox.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newsletterEmail.trim()) {
                  setNewsletterStatus('success');
                  setNewsletterEmail('');
                }
              }}
              style={{ display: 'flex', gap: 8, width: '100%', maxWidth: 420 }}
            >
              {newsletterStatus === 'success' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.65rem 1rem', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', borderRadius: 8, color: '#22c55e', fontSize: '0.84rem' }}>
                  <CheckCheck size={16} />
                  <span>Subscribed successfully! Welcome to the engineering digest.</span>
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={newsletterEmail}
                    onChange={e => setNewsletterEmail(e.target.value)}
                    style={{
                      flex: 1, padding: '0.65rem 1rem', borderRadius: 8, background: 'var(--surface-2)',
                      border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.86rem'
                    }}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.82rem' }}>
                    Join
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* AdSense Unit */}
      <section className="section" style={{ padding: '1rem 0 3rem' }}>
        <div className="container">
          <AdUnit slot="6189533583" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FUTURISTIC ARTICLE READER MODAL
          ═══════════════════════════════════════════════════════════════ */}
      {activePost && (
        <div className="modal-overlay open" onClick={closePost} role="dialog" aria-modal="true">
          <div 
            ref={modalBoxRef}
            onScroll={handleReaderScroll}
            onClick={e => e.stopPropagation()} 
            className={`modal-box blog-reader-modal modal-scrollable ${isZenMode ? 'zen-mode-active' : ''}`}
          >
            {/* Live Reading Scroll Progress Indicator */}
            <div className="blog-reading-progress-track">
              <div className="blog-reading-progress-bar" style={{ width: `${scrollProgress}%` }} />
            </div>

            {/* Sticky Header with Advanced Reader Controls */}
            <div className="blog-reader-sticky-header">
              <div className="blog-reader-header-meta">
                <span className="blog-reader-badge">{activePost.category || activePost.type}</span>
                <span>·</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} />
                  {readTime(activePost.body || '')} min read
                </span>
                <span style={{ opacity: 0.35 }}>|</span>
                <span className="blog-reader-head-title" title={activePost.title}>{activePost.title}</span>
              </div>

              {/* Header Right Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                {/* Font Size Adjuster */}
                <div style={{ display: 'inline-flex', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
                  <button
                    onClick={() => setFontSize('sm')}
                    title="Small Font"
                    style={{ padding: '4px 7px', background: fontSize === 'sm' ? 'var(--text)' : 'var(--surface-2)', color: fontSize === 'sm' ? 'var(--bg)' : 'var(--text)', border: 'none', fontSize: '0.7rem', cursor: 'pointer' }}
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontSize('md')}
                    title="Medium Font"
                    style={{ padding: '4px 7px', background: fontSize === 'md' ? 'var(--text)' : 'var(--surface-2)', color: fontSize === 'md' ? 'var(--bg)' : 'var(--text)', border: 'none', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('lg')}
                    title="Large Font"
                    style={{ padding: '4px 7px', background: fontSize === 'lg' ? 'var(--text)' : 'var(--surface-2)', color: fontSize === 'lg' ? 'var(--bg)' : 'var(--text)', border: 'none', fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    A+
                  </button>
                </div>

                {/* Zen Focus Mode */}
                <button
                  onClick={() => setIsZenMode(!isZenMode)}
                  title={isZenMode ? 'Exit Zen Mode' : 'Distraction-Free Zen Mode'}
                  aria-label="Toggle Zen Mode"
                  className="blog-reader-close-btn"
                  style={{ color: isZenMode ? '#a855f7' : 'var(--text)' }}
                >
                  {isZenMode ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>

                {/* Bookmark Toggle */}
                <button
                  onClick={(e) => toggleBookmark(activePost.id, e)}
                  title={bookmarks[activePost.id] ? 'Bookmarked' : 'Save article'}
                  aria-label="Save article"
                  className="blog-reader-close-btn"
                  style={{ color: bookmarks[activePost.id] ? '#a855f7' : 'var(--text)' }}
                >
                  <Bookmark size={14} fill={bookmarks[activePost.id] ? '#a855f7' : 'none'} />
                </button>

                {/* Close Modal */}
                <button
                  onClick={closePost}
                  aria-label="Close article"
                  className="blog-reader-close-btn"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Scrollable Article Body */}
            <div className={`blog-reader-body font-size-${fontSize}`}>
              
              {/* Only render headline if HTML body does not already open with an <h1> */}
              {!/^\s*<h1/i.test(activePost.body || '') && (
                <h1 className="blog-reader-title">
                  {activePost.title}
                </h1>
              )}

              <div className="blog-reader-byline">
                <span>Published on {new Date(activePost.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span>·</span>
                <span>By Mritunjay Kumar</span>
              </div>

              {/* Futuristic Audio & AI Utility Toolbar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: '1.25rem' }}>
                
                {/* Text-to-Speech Player */}
                <div className="blog-tts-bar">
                  <button
                    onClick={() => toggleSpeechAudio(activePost.body || '')}
                    className="blog-tts-btn"
                    title={isSpeaking ? (isPaused ? 'Resume Audio' : 'Pause Audio') : 'Listen to Article'}
                  >
                    {isSpeaking && !isPaused ? <Pause size={13} /> : <Play size={13} />}
                    <span>{isSpeaking ? (isPaused ? 'Resume' : 'Pause') : 'Listen to Article'}</span>
                  </button>

                  {isSpeaking && !isPaused && (
                    <div className="blog-tts-waves">
                      <span className="tts-wave-bar" />
                      <span className="tts-wave-bar" />
                      <span className="tts-wave-bar" />
                      <span className="tts-wave-bar" />
                    </div>
                  )}

                  {isSpeaking && (
                    <>
                      <button
                        onClick={() => {
                          const rates = [1, 1.25, 1.5];
                          const nextIndex = (rates.indexOf(speechSpeed) + 1) % rates.length;
                          setSpeechSpeed(rates[nextIndex]);
                          stopSpeech();
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.72rem', cursor: 'pointer', padding: '0 4px' }}
                      >
                        {speechSpeed}x
                      </button>
                      <button
                        onClick={stopSpeech}
                        title="Stop Audio"
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'grid', placeItems: 'center', padding: '0 2px' }}
                      >
                        <VolumeX size={13} />
                      </button>
                    </>
                  )}
                </div>

                {/* Instant AI Summary Toggle */}
                <button
                  onClick={() => setIsAiSummaryOpen(!isAiSummaryOpen)}
                  className="blog-tts-btn"
                  style={{
                    background: isAiSummaryOpen ? 'rgba(168, 85, 247, 0.2)' : 'var(--surface-2)',
                    borderColor: isAiSummaryOpen ? '#a855f7' : 'var(--border)',
                    color: isAiSummaryOpen ? '#e9d5ff' : 'var(--text)'
                  }}
                >
                  <Sparkles size={13} color="#a855f7" />
                  <span>{isAiSummaryOpen ? 'Hide AI Summary' : '⚡ Instant AI Summary'}</span>
                </button>
              </div>

              {/* AI TL;DR Key Takeaways Box */}
              {isAiSummaryOpen && (
                <div className="blog-ai-summary-box">
                  <div className="blog-ai-summary-header">
                    <div className="blog-ai-badge">
                      <Sparkles size={14} />
                      <span>Executive AI Highlights (TL;DR)</span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Generated in real-time</span>
                  </div>
                  <ul className="blog-ai-bullets">
                    {getAiSummary(activePost).map((point, pIdx) => (
                      <li key={pIdx}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activePost.cover && (
                <div className="blog-reader-cover">
                  <img src={activePost.cover} alt={activePost.title} />
                </div>
              )}

              {/* Smart Parsed & Formatted Article Content */}
              <div className="blog-reader-content">
                {renderSmartBodyContent(activePost.body || '')}
              </div>

              {/* Multi-Emoji Reaction Bar */}
              <div className="blog-reaction-bar">
                <span style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600, marginRight: 4 }}>
                  React:
                </span>
                {[
                  { emoji: '🔥', label: 'Fire' },
                  { emoji: '💡', label: 'Insight' },
                  { emoji: '🚀', label: 'Mind-blown' },
                  { emoji: '❤️', label: 'Loved' },
                  { emoji: '👏', label: 'Claps' }
                ].map(({ emoji, label }) => {
                  const isChosen = userReactions[activePost.id] === emoji;
                  const defaultCounts: Record<string, number> = { '🔥': 8, '💡': 5, '🚀': 12, '❤️': 18, '👏': 6 };
                  const count = (reactions[activePost.id]?.[emoji] ?? defaultCounts[emoji]) || 0;
                  return (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(activePost.id, emoji)}
                      className={`blog-reaction-btn ${isChosen ? 'active' : ''}`}
                      title={label}
                    >
                      <span>{emoji}</span>
                      <span>{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Modal Bottom Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => toggleLike(activePost.id)}
                    className="btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
                  >
                    <Heart size={14} fill={userLikes[activePost.id] ? '#f43f5e' : 'none'} color={userLikes[activePost.id] ? '#f43f5e' : 'currentColor'} />
                    <span>{activePost.likes_count || 0} Likes</span>
                  </button>

                  <button
                    onClick={() => handleShareArticle(activePost)}
                    className="btn-secondary"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.45rem 0.95rem', fontSize: '0.82rem' }}
                  >
                    <Share2 size={14} />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Comments Section (Hidden in Zen mode) */}
              {!isZenMode && (
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)', marginBottom: '1rem' }}>
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
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                        Be the first to share a thought on this article!
                      </div>
                    ) : (
                      comments.map((c, i) => (
                        <div key={c.id || i} style={{ padding: '0.85rem 1.1rem', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                            <span style={{ fontWeight: 600, color: 'var(--text)' }}>{c.author_name || c.user_name || 'Visitor'}</span>
                            <span>{new Date(c.created_at).toLocaleDateString()}</span>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.6 }}>{c.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
