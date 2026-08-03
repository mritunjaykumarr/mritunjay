import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { 
  PieChart, Plus, Layers, ArrowLeft, FileText, CheckCircle, 
  PenTool, Upload, Loader2, X, Send, Save, Calendar, 
  Folder, Heart, Edit2, Trash2, Ghost, Clock
} from 'lucide-react';

export default function Dashboard() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [view, setView] = useState('dashboard'); // 'dashboard', 'compose', 'posts'
  const [formData, setFormData] = useState({ id: '', title: '', excerpt: '', body: '', type: 'Blog', category: 'General', cover: '' });
  const [uploading, setUploading] = useState(false);
  const [previewPost, setPreviewPost] = useState<any>(null);
  
  useEffect(() => {
    if (authenticated) {
      fetchPosts();
    }
  }, [authenticated]);

  const fetchPosts = async () => {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `blog/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-post')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-post')
        .getPublicUrl(filePath);

      setFormData({ ...formData, cover: publicUrl });
    } catch (error: any) {
      alert(`Upload Error: ${error.message || 'Check Supabase RLS Policies'}`);
      console.error(error);
    } finally {
      setUploading(false);
    }
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
    const payload = { ...formData, status };
    if (formData.id) {
      await supabase.from('posts').update(payload).eq('id', formData.id);
    } else {
      const { id, ...newPayload } = payload as any;
      await supabase.from('posts').insert(newPayload);
    }
    setFormData({ id: '', title: '', excerpt: '', body: '', type: 'Blog', category: 'General', cover: '' });
    setView('posts');
    fetchPosts();
  };

  const editPost = (p: any) => {
    setFormData(p);
    setView('compose');
  };

  const deletePost = async (id: string) => {
    if (confirm('Delete this post?')) {
      await supabase.from('posts').delete().eq('id', id);
      fetchPosts();
    }
  };

  if (!authenticated) {
    return (
      <div className="db-login-wrap">
        <form onSubmit={login} className="db-login-card">
          <div className="db-logo" style={{justifyContent: 'center', marginBottom: '32px'}}>
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
          
          <div style={{marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border)'}}>
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
              <h1 className="db-title">System <span className="grad">Overview</span></h1>
              <p className="db-subtitle">Real-time statistics and content metrics.</p>
            </header>
            
            <div className="db-grid">
              <div className="db-stat-card">
                <div className="db-stat-icon"><FileText size={20} /></div>
                <h3>Total Posts</h3>
                <div className="db-stat-val">{posts.length}</div>
              </div>
              <div className="db-stat-card">
                <div className="db-stat-icon" style={{color: 'var(--accent-2)'}}><CheckCircle size={20} /></div>
                <h3>Published</h3>
                <div className="db-stat-val" style={{color: 'var(--accent-2)'}}>{posts.filter(p => p.status === 'published').length}</div>
              </div>
              <div className="db-stat-card">
                <div className="db-stat-icon" style={{color: 'var(--accent)'}}><PenTool size={20} /></div>
                <h3>Drafts</h3>
                <div className="db-stat-val" style={{color: 'var(--accent)'}}>{posts.filter(p => p.status === 'draft').length}</div>
              </div>
            </div>
          </div>
        )}

        {view === 'compose' && (
          <div>
            <header className="db-header">
              <h1 className="db-title">{formData.id ? 'Refine' : 'Compose'} <span className="grad">Content</span></h1>
              <p className="db-subtitle">Draft your next extraordinary story.</p>
            </header>
            
            <div className="db-form-container" style={{maxWidth: '900px'}}>
              <div className="db-form-group">
                <label className="db-label">Headline</label>
                <input 
                  type="text" 
                  placeholder="Post Title" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  className="db-input" 
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="db-form-group">
                  <label className="db-label">Content Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="db-select">
                    <option value="Blog">Blog</option>
                    <option value="Article">Article</option>
                    <option value="News">News</option>
                  </select>
                </div>
                <div className="db-form-group">
                  <label className="db-label">Category</label>
                  <input type="text" placeholder="General" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="db-input" />
                </div>
              </div>

              <div className="db-form-group">
                <label className="db-label">Visual Asset (URL)</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" placeholder="https://..." value={formData.cover} onChange={e => setFormData({...formData, cover: e.target.value})} className="db-input" style={{flex: 1}} />
                  <label className="btn-outline" style={{ padding: '12px 20px', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />} 
                    {uploading ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
                  </label>
                </div>
                {formData.cover && (
                  <div style={{ marginTop: '10px', position: 'relative', width: '200px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img src={formData.cover} alt="Preview" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                    <button 
                      onClick={() => setFormData({...formData, cover: ''})}
                      style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '12px' }}
                      title="Remove Image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="db-form-group">
                <label className="db-label">Brief Summary</label>
                <textarea placeholder="Write a short excerpt..." value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} rows={2} className="db-textarea" />
              </div>
              
              <div className="db-form-group">
                <label className="db-label">Main Content (Rich Text / HTML)</label>
                <textarea placeholder="Start writing..." value={formData.body} onChange={e => setFormData({...formData, body: e.target.value})} rows={12} className="db-textarea" />
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={() => savePost('published')} className="btn-primary" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <Send size={16} /> Finalize & Publish
                </button>
                <button onClick={() => savePost('draft')} className="btn-outline" style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <Save size={16} /> Save Draft
                </button>
              </div>
            </div>
          </div>
        )}

        {previewPost && (
          <AnimatePresence>
            <motion.div 
              className="modal-bg open" 
              onClick={() => setPreviewPost(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="modal-box blog-read-modal" 
                onClick={e => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <button 
                  className="modal-close" 
                  onClick={() => setPreviewPost(null)}
                  aria-label="Close modal"
                ><X size={18} /></button>
                <div>
                  {previewPost.cover && <img src={previewPost.cover} className="blog-read-cover" alt="" />}
                  <div style={{ padding: '2rem' }}>
                    <div className={`blog-read-type blog-type-${previewPost.type?.toLowerCase()}`}>{previewPost.type || 'Blog'}</div>
                    <h1 className="blog-read-title" style={{ fontSize: '2.2rem', margin: '0.75rem 0' }}>{previewPost.title}</h1>
                    
                    <div className="blog-read-meta" style={{ display: 'flex', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                      <span><Folder size={14} /> {previewPost.category || 'General'}</span>
                      <span><Calendar size={14} /> {new Date(previewPost.created_at).toLocaleDateString()}</span>
                      <span><Clock size={14} /> {Math.max(1, Math.ceil((previewPost.body || '').replace(/<[^>]+>/g, ' ').split(/\s+/).length / 200))} min read</span>
                    </div>

                    <div className="blog-read-body" dangerouslySetInnerHTML={{ __html: previewPost.body }} style={{ fontSize: '1.05rem', lineHeight: 1.8 }} />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

        {view === 'posts' && (
          <div>
            <header className="db-header">
              <h1 className="db-title">Content <span className="grad">Vault</span></h1>
              <p className="db-subtitle">Manage and edit your existing publications.</p>
            </header>
            
            <div className="db-list">
              {posts.map(p => (
                <div key={p.id} className="db-post-card">
                  <div className="db-post-info">
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {p.title} 
                      <span className={`db-badge ${p.status}`}>
                        {p.status}
                      </span>
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '15px', marginTop: '4px' }}>
                      <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><Calendar size={12} /> {new Date(p.created_at).toLocaleDateString()}</span>
                      <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><Folder size={12} /> {p.type}</span>
                      <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><Heart size={12} /> {p.likes_count} likes</span>
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => editPost(p)} className="btn-outline btn-sm" style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Edit2 size={14} /> Edit
                    </button>
                    <button onClick={() => deletePost(p.id)} className="btn-outline btn-sm" style={{ padding: '8px 16px', fontSize: '0.8rem', color: '#ff4444', borderColor: '#ff4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {posts.length === 0 && (
                <div style={{textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)'}}>
                  <Ghost size={48} style={{opacity: 0.2, margin: '0 auto 20px'}} />
                  No posts found in the vault.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
