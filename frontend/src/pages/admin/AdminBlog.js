import React, { useEffect, useState } from 'react';
import { FileText, Plus, Trash2, Eye, EyeOff, X } from 'lucide-react';
import AdminLayout from './AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const categories = ['General','Study Tips','Career Guidance','Results','Announcements','Commerce News'];

export default function AdminBlog() {
  const [posts, setPosts]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [form, setForm] = useState({ title:'', content:'', excerpt:'', image_url:'', category:'General', is_published:false });

  const load = () => {
    api.get('/blog/all').then(r => setPosts(r.data)).catch(() => toast.error('Failed to load posts')).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title || !form.content) return toast.error('Title and content required.');
    setSaving(true);
    try {
      const res = await api.post('/blog', form);
      setPosts(prev => [res.data, ...prev]);
      setForm({ title:'', content:'', excerpt:'', image_url:'', category:'General', is_published:false });
      setShowForm(false);
      toast.success(form.is_published ? 'Post published!' : 'Draft saved!');
    } catch { toast.error('Failed to save post.'); }
    finally { setSaving(false); }
  };

  const togglePublish = async post => {
    try {
      const res = await api.put(`/blog/${post.id}`, { ...post, is_published: !post.is_published });
      setPosts(prev => prev.map(p => p.id === post.id ? res.data : p));
      toast.success(res.data.is_published ? 'Post published!' : 'Post unpublished.');
    } catch { toast.error('Failed to update.'); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await api.delete(`/blog/${id}`);
      setPosts(prev => prev.filter(p => p.id !== id));
      toast.success('Deleted.');
    } catch { toast.error('Failed to delete.'); }
  };

  return (
    <AdminLayout title="Blog">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500 text-sm">Write articles, study tips and career guidance posts.</p>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'New Post'}
        </button>
      </div>

      {/* Write form */}
      {showForm && (
        <div className="card p-6 mb-8 border-2 border-gold-200">
          <h3 className="font-bold text-navy-900 text-lg mb-5">Write New Post</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1">Title *</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                required className="input-field" placeholder="Post title" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="input-field">
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-1">Cover Image URL (optional)</label>
                <input value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))}
                  className="input-field" placeholder="https://..." />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1">Short Excerpt (shown in blog list)</label>
              <input value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))}
                className="input-field" placeholder="One-line summary of the post" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1">Content *</label>
              <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                required rows={8} className="input-field resize-none" placeholder="Write the full article here..." />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="is_pub" checked={form.is_published}
                onChange={e => setForm(p => ({ ...p, is_published: e.target.checked }))}
                className="w-4 h-4 accent-gold-500" />
              <label htmlFor="is_pub" className="text-sm font-medium text-navy-900">
                Publish immediately (uncheck to save as draft)
              </label>
            </div>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <div className="w-4 h-4 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" /> : <FileText className="w-4 h-4" />}
              {saving ? 'Saving...' : form.is_published ? 'Publish Post' : 'Save as Draft'}
            </button>
          </form>
        </div>
      )}

      {/* Posts list */}
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-navy-800 border-t-gold-400 rounded-full animate-spin" /></div>
      ) : posts.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No posts yet. Write your first post above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="card p-5 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="font-bold text-navy-900 truncate">{post.title}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${post.is_published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {post.is_published ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-xs bg-navy-50 text-navy-700 px-2 py-0.5 rounded-full">{post.category}</span>
                </div>
                {post.excerpt && <p className="text-gray-500 text-sm truncate">{post.excerpt}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(post.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => togglePublish(post)}
                  className={`p-2 rounded-lg transition-colors ${post.is_published ? 'text-yellow-600 hover:bg-yellow-50' : 'text-green-600 hover:bg-green-50'}`}
                  title={post.is_published ? 'Unpublish' : 'Publish'}>
                  {post.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button onClick={() => handleDelete(post.id)}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
