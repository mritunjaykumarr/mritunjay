import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { 
  PieChart, Plus, Layers, ArrowLeft, FileText, CheckCircle, 
  PenTool, Upload, Loader2, Send, Save, Calendar, 
  Folder, Heart, Edit2, Trash2, Ghost, Globe
} from 'lucide-react';
import { DEFAULT_POSTS } from '../data/blogData';

type Post = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  type: string;
  category: string;
  cover: string;
  status?: string;
  created_at: string;
  likes_count: number;
};

type FormData = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  type: string;
  category: string;
  cover: string;
};

export default function Dashboard() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const localStr = localStorage.getItem('admin_local_posts');
      if (localStr) {
        const parsed = JSON.parse(localStr);
        if (parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_POSTS.map(p => ({ ...p, status: 'published' }));
  });
  const [view, setView] = useState('dashboard');
  const [formData, setFormData] = useState<FormData>({ id: '', title: '', excerpt: '', body: '', type: 'Blog', category: 'General', cover: '' });
  const [uploading, setUploading] = useState(false);
  
  const deduplicate = (list: Post[]): Post[] => {
    const ids = new Set<string>();
    const titles = new Set<string>();
    const out: Post[] = [];
    for (const p of list) {
      if (!p || !p.title) continue;
      const t = p.title.toLowerCase().trim();
      if (!ids.has(p.id) && !titles.has(t)) {
        ids.add(p.id);
        titles.add(t);
        out.push(p);
      }
    }
    return out;
  };

  const fetchPosts = useCallback(async () => {
    // Check local storage first
    let currentPosts: Post[] = [];
    try {
      const localStr = localStorage.getItem('admin_local_posts');
      if (localStr) currentPosts = JSON.parse(localStr);
    } catch {
      // ignore
    }

    if (currentPosts.length === 0) {
      currentPosts = DEFAULT_POSTS.map(p => ({ ...p, status: 'published' }));
    }

    // Try Supabase fetch
    try {
      const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        const livePosts = data as Post[];
        const merged = deduplicate([...livePosts, ...currentPosts]);
        setPosts(merged);
        localStorage.setItem('admin_local_posts', JSON.stringify(merged));
        return;
      }
    } catch (err) {
      console.warn('Supabase offline or unreachable. Using local vault storage.', err);
    }

    const deduped = deduplicate(currentPosts);
    setPosts(deduped);
    localStorage.setItem('admin_local_posts', JSON.stringify(deduped));
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchPosts();
    }
  }, [authenticated, fetchPosts]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    // Try Supabase Storage first
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `blog/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-post')
        .upload(filePath, file);

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('blog-post')
          .getPublicUrl(filePath);
        setFormData({ ...formData, cover: publicUrl });
        setUploading(false);
        return;
      }
    } catch {
      // ignore and fall back to FileReader Base64
    }

    // Fallback: Read file as Data URL / Base64
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData({ ...formData, cover: event.target.result as string });
      }
      setUploading(false);
    };
    reader.onerror = () => {
      alert('Failed to read image file');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Mritunjay') {
      setAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  const savePost = async (status: string) => {
    const postId = formData.id || `post-${Date.now()}`;
    const newPost: Post = {
      id: postId,
      title: formData.title || 'Untitled Publication',
      excerpt: formData.excerpt || '',
      body: formData.body || '',
      type: formData.type || 'Blog',
      category: formData.category || 'General',
      cover: formData.cover || '',
      status: status,
      created_at: new Date().toISOString(),
      likes_count: 0
    };

    // 1. Update Local Storage instantly
    const updated = formData.id
      ? posts.map(p => p.id === formData.id ? { ...p, ...newPost } : p)
      : [newPost, ...posts];

    setPosts(updated);
    localStorage.setItem('admin_local_posts', JSON.stringify(updated));

    // 2. Attempt Supabase sync
    try {
      const payload = { ...formData, status };
      if (formData.id) {
        await supabase.from('posts').update(payload).eq('id', formData.id);
      } else {
        const { id, ...newPayload } = payload;
        void id;
        await supabase.from('posts').insert([newPayload]);
      }
    } catch (err) {
      console.warn('Saved to local vault (Supabase sync pending):', err);
    }

    setFormData({ id: '', title: '', excerpt: '', body: '', type: 'Blog', category: 'General', cover: '' });
    setView('posts');
    alert(`Post saved as ${status} successfully!`);
  };

  const editPost = (p: Post) => {
    setFormData(p);
    setView('compose');
  };

  const deletePost = async (id: string) => {
    if (confirm('Delete this post?')) {
      const updated = posts.filter(p => p.id !== id);
      setPosts(updated);
      localStorage.setItem('admin_local_posts', JSON.stringify(updated));
      try {
        await supabase.from('posts').delete().eq('id', id);
      } catch {
        // ignore
      }
    }
  };

  if (!authenticated) {
    return (
      <div className="db-login-wrap" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
        <form onSubmit={login} className="db-login-card">
          <div className="db-logo" style={{ justifyContent: 'center', marginBottom: '32px' }}>
            <span className="db-logo-dot"></span>
            MRITUNJAY ADMIN
          </div>
          <div className="db-form-group">
            <label className="db-label">Access Credentials</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="Enter password..." 
              className="db-input"
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Initialize Access
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="db-layout">
      <aside className="db-sidebar">
        <div className="db-logo">
          <span className="db-logo-dot"></span>
          ADMIN PANEL
        </div>
        
        <nav className="db-nav">
          <button onClick={() => setView('dashboard')} className={`db-nav-btn ${view === 'dashboard' ? 'active' : ''}`}>
            <PieChart size={16} /> Overview
          </button>
          <button onClick={() => { setFormData({ id: '', title: '', excerpt: '', body: '', type: 'Blog', category: 'General', cover: '' }); setView('compose'); }} className={`db-nav-btn ${view === 'compose' ? 'active' : ''}`}>
            <Plus size={16} /> New Post
          </button>
          <button onClick={() => setView('posts')} className={`db-nav-btn ${view === 'posts' ? 'active' : ''}`}>
            <Layers size={16} /> All Content
          </button>
          
          <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            <a href="/domain-checker" className="db-nav-btn" style={{ marginBottom: '8px' }}>
              <Globe size={16} /> Domain Checker
            </a>
            <a href="/" className="db-nav-btn">
              <ArrowLeft size={16} /> Live Site
            </a>
          </div>
        </nav>
      </aside>

      <main className="db-content">
        {view === 'dashboard' && (
          <div>
            <header className="db-header">
              <h1 className="db-title">System Overview</h1>
              <p className="db-subtitle">Real-time statistics and content metrics.</p>
            </header>
            
            <div className="db-grid">
              <div className="db-stat-card">
                <div className="db-stat-icon"><FileText size={20} /></div>
                <h3>Total Posts</h3>
                <div className="db-stat-val">{posts.length}</div>
              </div>
              <div className="db-stat-card">
                <div className="db-stat-icon"><CheckCircle size={20} /></div>
                <h3>Published</h3>
                <div className="db-stat-val">{posts.filter(p => p.status === 'published').length}</div>
              </div>
              <div className="db-stat-card">
                <div className="db-stat-icon"><PenTool size={20} /></div>
                <h3>Drafts</h3>
                <div className="db-stat-val">{posts.filter(p => p.status === 'draft').length}</div>
              </div>
            </div>
          </div>
        )}

        {view === 'compose' && (
          <div>
            <header className="db-header">
              <h1 className="db-title">{formData.id ? 'Refine' : 'Compose'} Content</h1>
              <p className="db-subtitle">Draft your next story or technical publication.</p>
            </header>
            
            <div className="db-form-container" style={{ maxWidth: '900px' }}>
              <div className="db-form-group">
                <label className="db-label">Headline</label>
                <input 
                  type="text" 
                  placeholder="Post Title" 
                  value={formData.title} 
                  onChange={e => setFormData({ ...formData, title: e.target.value })} 
                  className="db-input" 
                />
              </div>
              
              <div className="input-row-dual">
                <div className="db-form-group">
                  <label className="db-label">Content Type</label>
                  <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="db-select">
                    <option value="Blog">Blog</option>
                    <option value="Article">Article</option>
                    <option value="News">News</option>
                  </select>
                </div>
                
                <div className="db-form-group">
                  <label className="db-label">Category</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Engineering, AI Strategy" 
                    value={formData.category} 
                    onChange={e => setFormData({ ...formData, category: e.target.value })} 
                    className="db-input" 
                  />
                </div>
              </div>

              <div className="db-form-group">
                <label className="db-label">Excerpt / Summary</label>
                <textarea 
                  rows={3} 
                  placeholder="Brief synopsis..." 
                  value={formData.excerpt} 
                  onChange={e => setFormData({ ...formData, excerpt: e.target.value })} 
                  className="db-textarea" 
                />
              </div>

              <div className="db-form-group">
                <label className="db-label">Cover Artwork</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input 
                    type="text" 
                    placeholder="Image URL or upload below..." 
                    value={formData.cover} 
                    onChange={e => setFormData({ ...formData, cover: e.target.value })} 
                    className="db-input" 
                    style={{ flex: '1', minWidth: '200px' }} 
                  />
                  <label className="btn-secondary" style={{ cursor: 'pointer', height: '42px', padding: '0 16px', display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                    {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />} 
                    Upload
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                </div>
                {formData.cover && (
                  <div style={{ marginTop: '10px', borderRadius: '8px', overflow: 'hidden', height: '140px', maxWidth: '100%', width: '220px', border: '1px solid var(--border)' }}>
                    <img src={formData.cover} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>

              <div className="db-form-group">
                <label className="db-label">Article Body (Supports HTML & Markdown)</label>
                <textarea 
                  rows={10} 
                  placeholder="Write full article body..." 
                  value={formData.body} 
                  onChange={e => setFormData({ ...formData, body: e.target.value })} 
                  className="db-textarea" 
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
                <button onClick={() => savePost('published')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Send size={16} /> Publish Post
                </button>
                <button onClick={() => savePost('draft')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Save size={16} /> Save Draft
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'posts' && (
          <div>
            <header className="db-header">
              <h1 className="db-title">Content Vault</h1>
              <p className="db-subtitle">Manage and edit your existing publications.</p>
            </header>
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              {posts.map(p => (
                <div key={p.id} style={{ padding: '1.25rem', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text)', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {p.title}
                      <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: p.status === 'published' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)', color: p.status === 'published' ? '#22c55e' : '#eab308' }}>
                        {p.status || 'published'}
                      </span>
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '15px', margin: 0 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {new Date(p.created_at).toLocaleDateString()}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Folder size={12} /> {p.type}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Heart size={12} /> {p.likes_count || 0} likes</span>
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => editPost(p)} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Edit2 size={13} /> Edit
                    </button>
                    <button onClick={() => deletePost(p.id)} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem', color: '#ff4444', borderColor: 'rgba(255, 68, 68, 0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              ))}
              {posts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                  <Ghost size={40} style={{ opacity: 0.3, margin: '0 auto 15px' }} />
                  <p>No posts found in the vault.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
