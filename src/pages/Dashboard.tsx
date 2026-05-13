import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [view, setView] = useState('dashboard'); // 'dashboard', 'compose', 'posts'
  const [formData, setFormData] = useState({ id: '', title: '', excerpt: '', body: '', type: 'Blog', category: 'General', cover: '' });
  
  useEffect(() => {
    if (authenticated) {
      fetchPosts();
    }
  }, [authenticated]);

  const fetchPosts = async () => {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (data) setPosts(data);
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
    alert(status === 'published' ? 'Post published!' : 'Draft saved!');
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
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <form onSubmit={login} style={{ background: 'var(--surface)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <h2 style={{ marginBottom: '20px' }}>Admin Login</h2>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" style={{ padding: '10px', width: '100%', marginBottom: '20px', background: 'var(--bg2)', border: '1px solid var(--border2)', color: 'white' }} />
          <button type="submit" className="btn-glow" style={{ width: '100%', justifyContent: 'center' }}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <aside style={{ width: '250px', background: 'var(--bg2)', borderRight: '1px solid var(--border)', padding: '20px' }}>
        <h2 style={{ marginBottom: '30px', color: 'var(--cyan)' }}>Admin Panel</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => setView('dashboard')} className={`btn-ghost ${view === 'dashboard' ? 'active' : ''}`} style={{justifyContent: 'flex-start'}}>Dashboard</button>
          <button onClick={() => { setFormData({ id: '', title: '', excerpt: '', body: '', type: 'Blog', category: 'General', cover: '' }); setView('compose'); }} className={`btn-ghost ${view === 'compose' ? 'active' : ''}`} style={{justifyContent: 'flex-start'}}>New Post</button>
          <button onClick={() => setView('posts')} className={`btn-ghost ${view === 'posts' ? 'active' : ''}`} style={{justifyContent: 'flex-start'}}>All Posts</button>
          <a href="/" className="btn-ghost" style={{justifyContent: 'flex-start', marginTop: '20px', color: 'var(--dim)'}}><i className="fa-solid fa-arrow-left"></i> Back to Site</a>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '40px' }}>
        {view === 'dashboard' && (
          <div>
            <h1>Overview</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '20px' }}>
              <div style={{ padding: '20px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h3>Total Posts</h3>
                <p style={{ fontSize: '2rem', color: 'var(--purple3)' }}>{posts.length}</p>
              </div>
              <div style={{ padding: '20px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h3>Published</h3>
                <p style={{ fontSize: '2rem', color: 'var(--cyan)' }}>{posts.filter(p => p.status === 'published').length}</p>
              </div>
              <div style={{ padding: '20px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h3>Drafts</h3>
                <p style={{ fontSize: '2rem', color: 'var(--muted)' }}>{posts.filter(p => p.status === 'draft').length}</p>
              </div>
            </div>
          </div>
        )}

        {view === 'compose' && (
          <div style={{ maxWidth: '800px' }}>
            <h1>{formData.id ? 'Edit Post' : 'New Post'}</h1>
            <input type="text" placeholder="Post Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '15px', marginBottom: '15px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white', borderRadius: '8px' }} />
            
            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ padding: '10px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white', borderRadius: '8px' }}>
                <option value="Blog">Blog</option>
                <option value="Article">Article</option>
                <option value="News">News</option>
              </select>
              <input type="text" placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ flex: 1, padding: '10px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white', borderRadius: '8px' }} />
            </div>

            <input type="text" placeholder="Cover Image URL" value={formData.cover} onChange={e => setFormData({...formData, cover: e.target.value})} style={{ width: '100%', padding: '15px', marginBottom: '15px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white', borderRadius: '8px' }} />
            
            <textarea placeholder="Short Excerpt" value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} rows={2} style={{ width: '100%', padding: '15px', marginBottom: '15px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white', borderRadius: '8px' }} />
            
            <textarea placeholder="Post Body (HTML allowed)" value={formData.body} onChange={e => setFormData({...formData, body: e.target.value})} rows={15} style={{ width: '100%', padding: '15px', marginBottom: '15px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'white', borderRadius: '8px' }} />

            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={() => savePost('published')} className="btn-glow">Publish</button>
              <button onClick={() => savePost('draft')} className="btn-ghost">Save Draft</button>
            </div>
          </div>
        )}

        {view === 'posts' && (
          <div>
            <h1>All Posts</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              {posts.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  <div>
                    <h3 style={{ marginBottom: '5px' }}>{p.title} <span style={{fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: p.status === 'published' ? 'rgba(6,182,212,0.2)' : 'rgba(124,58,237,0.2)', color: p.status === 'published' ? 'var(--cyan)' : 'var(--purple3)'}}>{p.status}</span></h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{new Date(p.created_at).toLocaleDateString()} · {p.type} · {p.likes_count} likes</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button onClick={() => editPost(p)} className="btn-ghost" style={{ padding: '5px 10px' }}>Edit</button>
                    <button onClick={() => deletePost(p.id)} className="btn-ghost" style={{ padding: '5px 10px', color: 'var(--red)' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
