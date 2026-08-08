import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { DEFAULT_POSTS } from '../pages/BlogPage';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';

type Post = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  type?: string;
  cover?: string;
  created_at: string;
  status?: string;
  comments_count?: number;
};

export default function BlogFeed() {
  const [posts, setPosts] = useState<Post[]>(DEFAULT_POSTS as Post[]);
  const [loading] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const { data: postsData, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn("Supabase query error in feed, using defaults:", error);
      } else if (postsData && postsData.length > 0) {
        const { data: commentsData } = await supabase.from('comments').select('post_id');
        const counts: Record<string, number> = {};
        commentsData?.forEach((c: { post_id: string }) => { counts[c.post_id] = (counts[c.post_id] || 0) + 1; });

        const visiblePosts = postsData.filter(p => !p.status || p.status === 'published');
        if (visiblePosts.length > 0) {
          setPosts(visiblePosts.map((p: Post) => ({ ...p, comments_count: counts[p.id] || 0 })));
        }
      }
    } catch (err) {
      console.error("Failed to fetch posts in feed, using defaults:", err);
    }
  }, []);

  useEffect(() => {
    fetchPosts(); // eslint-disable-line react-hooks/set-state-in-effect
  }, [fetchPosts]);

  const readTime = (body: string) => Math.max(1, Math.ceil((body || '').replace(/<[^>]+>/g, ' ').split(/\s+/).length / 200));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const featuredVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  };

  const typeStyles: Record<string, { bg: string; color: string; border: string }> = {
    blog: { bg: 'var(--accent-soft)', color: 'var(--accent)', border: 'rgba(124, 92, 255, 0.3)' },
    article: { bg: 'var(--accent-2-soft)', color: 'var(--accent-2)', border: 'rgba(56, 189, 248, 0.3)' },
    news: { bg: 'var(--green-soft)', color: 'var(--green)', border: 'rgba(52, 211, 153, 0.3)' }
  };

  const getTypeStyle = (type?: string) => typeStyles[type?.toLowerCase() || 'blog'] || typeStyles.blog;

  return (
    <section className="section blog-section" id="blog">
      <div className="container">
        {/* Section Header */}
        <div className="blog-header reveal">
          <div className="blog-eyebrow">
            <BookOpen size={12} />
            <span>BLOG</span>
          </div>
          <h2 className="section-title blog-title">
            Latest <span className="grad">Insights</span>
          </h2>
          <p className="section-sub blog-desc">
            Thoughts, tutorials, AI engineering, full-stack development, automation, and real-world case studies.
          </p>
          <div className="blog-divider" />
        </div>

        {/* Bento Grid */}
        {loading ? (
          <div className="blog-grid bento-skeleton" aria-label="Loading blog posts">
            <motion.div className="bento-skeleton-card featured" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
            <motion.div className="bento-skeleton-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} />
            <motion.div className="bento-skeleton-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
            <motion.div className="bento-skeleton-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
            <motion.div className="bento-skeleton-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
            <motion.div className="bento-skeleton-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
          </div>
        ) : posts.length === 0 ? (
          <div className="blog-empty card-glass" style={{ padding: '4rem 2rem', borderRadius: 'var(--r-lg)', textAlign: 'center' }}>
            <h3>No posts found</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Check back soon for new articles and insights.</p>
          </div>
        ) : (
          <motion.div
            className="blog-grid bento-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            role="list"
            aria-label="Blog articles"
          >
            {posts.map((post, index) => {
              const isFeatured = index === 0;
              const typeStyle = getTypeStyle(post.type);

              if (isFeatured) {
                return (
                  <motion.article
                    key={post.id}
                    className="bento-card featured"
                    variants={featuredVariants}
                    role="listitem"
                    style={{
                      gridColumn: 'span 2',
                      gridRow: 'span 2',
                      borderColor: typeStyle.border
                    }}
                  >
                    {/* Cover Image */}
                    <div className="bento-card-cover">
                      {post.cover ? (
                        <img
                          src={post.cover}
                          alt={post.title}
                          className="bento-card-img"
                          loading="lazy"
                        />
                      ) : (
                        <div className="bento-card-placeholder">
                          <BookOpen size={48} style={{ color: typeStyle.color }} />
                        </div>
                      )}
                      <span
                        className="bento-type-badge"
                        style={{
                          background: typeStyle.bg,
                          color: typeStyle.color,
                          borderColor: typeStyle.border
                        }}
                      >
                        {post.type || 'Blog'}
                      </span>
                      <span className="bento-featured-badge">Featured</span>
                    </div>

                    {/* Content */}
                    <div className="bento-card-content featured-content">
                      <div className="bento-card-meta">
                        <span className="bento-meta-item">
                          <Calendar size={13} />
                          {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="bento-meta-divider" />
                        <span className="bento-meta-item">
                          <Clock size={13} />
                          {readTime(post.body)} min read
                        </span>
                      </div>

                      <h3 className="bento-card-title featured-title">{post.title}</h3>
                      <p className="bento-card-excerpt featured-excerpt">{post.excerpt}</p>

                      <Link
                        to="/blog"
                        className="bento-read-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/blog#${post.id}`;
                        }}
                      >
                        <span>Read Article</span>
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </motion.article>
                );
              }

              return (
                <motion.article
                  key={post.id}
                  className="bento-card"
                  variants={cardVariants}
                  role="listitem"
                  style={{ borderColor: typeStyle.border }}
                >
                  {/* Cover Image */}
                  <div className="bento-card-cover">
                    {post.cover ? (
                      <img
                        src={post.cover}
                        alt={post.title}
                        className="bento-card-img"
                        loading="lazy"
                      />
                    ) : (
                      <div className="bento-card-placeholder">
                        <BookOpen size={32} style={{ color: typeStyle.color }} />
                      </div>
                    )}
                    <span
                      className="bento-type-badge"
                      style={{
                        background: typeStyle.bg,
                        color: typeStyle.color,
                        borderColor: typeStyle.border
                      }}
                    >
                      {post.type || 'Blog'}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="bento-card-content">
                    <div className="bento-card-meta">
                      <span className="bento-meta-item">
                        <Calendar size={12} />
                        {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="bento-meta-divider" />
                      <span className="bento-meta-item">
                        <Clock size={12} />
                        {readTime(post.body)} min
                      </span>
                    </div>

                    <h3 className="bento-card-title">{post.title}</h3>
                    <p className="bento-card-excerpt">{post.excerpt}</p>

                    <Link
                      to="/blog"
                      className="bento-read-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/blog#${post.id}`;
                      }}
                    >
                      <span>Read</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        )}

        {/* CTA Button */}
        <div className="blog-cta-wrapper reveal">
          <Link to="/blog" className="btn-outline blog-cta-btn">
            <span>View All Articles</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}