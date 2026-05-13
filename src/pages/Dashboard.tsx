import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [view, setView] = useState('dashboard'); // 'dashboard', 'compose', 'posts'
  const [formData, setFormData] = useState({ id: '', title: '', excerpt: '', body: '', type: 'Blog', category: 'General', cover: '' });
  const [uploading, setUploading] = useState(false);
  
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
      // Check if bucket exists first to give better error
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      if (bucketError) throw bucketError;
      
      const hasBucket = buckets.find(b => b.name === 'blog-images');
      if (!hasBucket) {
        const foundNames = buckets.map(b => b.name).join(', ') || 'None';
        alert(`Bucket "blog-images" not found! Your project only has: ${foundNames}. Please create it in Supabase.`);
        setUploading(false);
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `blog/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, cover: publicUrl });
    } catch (error: any) {
      alert(`Error: ${error.message || 'Upload failed'}`);
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'mritunjay2025') {
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
          <button type="submit" className="btn-glow" style={{ width: '100%', justifyContent: 'center' }}>
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
            <i className="fa-solid fa-chart-pie"></i> Overview
          </button>
          <button onClick={() => { setFormData({ id: '', title: '', excerpt: '', body: '', type: 'Blog', category: 'General', cover: '' }); setView('compose'); }} className={`db-nav-btn ${view === 'compose' ? 'active' : ''}`}>
            <i className="fa-solid fa-plus"></i> New Post
          </button>
          <button onClick={() => setView('posts')} className={`db-nav-btn ${view === 'posts' ? 'active' : ''}`}>
            <i className="fa-solid fa-layer-group"></i> All Content
          </button>
          
          <div style={{marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--border)'}}>
            <a href="/" className="db-nav-btn">
              <i className="fa-solid fa-arrow-left"></i> Live Site
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
                <i className="fa-solid fa-newspaper db-stat-icon"></i>
                <h3>Total Posts</h3>
                <div className="db-stat-val">{posts.length}</div>
              </div>
              <div className="db-stat-card">
                <i className="fa-solid fa-circle-check db-stat-icon" style={{color: 'var(--cyan)'}}></i>
                <h3>Published</h3>
                <div className="db-stat-val" style={{color: 'var(--cyan)'}}>{posts.filter(p => p.status === 'published').length}</div>
              </div>
              <div className="db-stat-card">
                <i className="fa-solid fa-pen-nib db-stat-icon" style={{color: 'var(--purple3)'}}></i>
                <h3>Drafts</h3>
                <div className="db-stat-val" style={{color: 'var(--purple3)'}}>{posts.filter(p => p.status === 'draft').length}</div>
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
                  <label className="btn-ghost" style={{ padding: '12px 20px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    <i className={`fa-solid ${uploading ? 'fa-spinner fa-spin' : 'fa-upload'}`}></i> {uploading ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
                  </label>
                </div>
                {formData.cover && (
                  <div style={{ marginTop: '10px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', width: '200px', height: '120px' }}>
                    <img src={formData.cover} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                <button onClick={() => savePost('published')} className="btn-glow">
                  <i className="fa-solid fa-paper-plane"></i> Finalize & Publish
                </button>
                <button onClick={() => savePost('draft')} className="btn-ghost">
                  <i className="fa-solid fa-floppy-disk"></i> Save Draft
                </button>
              </div>
            </div>
          </div>
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
                    <h4>
                      {p.title} 
                      <span className={`db-badge ${p.status}`}>
                        {p.status}
                      </span>
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'flex', gap: '15px' }}>
                      <span><i className="fa-regular fa-calendar"></i> {new Date(p.created_at).toLocaleDateString()}</span>
                      <span><i className="fa-regular fa-folder"></i> {p.type}</span>
                      <span><i className="fa-regular fa-heart"></i> {p.likes_count} likes</span>
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => editPost(p)} className="btn-ghost" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                      <i className="fa-solid fa-pen"></i> Edit
                    </button>
                    <button onClick={() => deletePost(p.id)} className="btn-ghost" style={{ padding: '8px 16px', fontSize: '0.8rem', color: '#ff4444' }}>
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
              {posts.length === 0 && (
                <div style={{textAlign: 'center', padding: '100px 0', color: 'var(--muted)'}}>
                  <i className="fa-solid fa-ghost" style={{fontSize: '3rem', marginBottom: '20px', display: 'block', opacity: 0.2}}></i>
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
