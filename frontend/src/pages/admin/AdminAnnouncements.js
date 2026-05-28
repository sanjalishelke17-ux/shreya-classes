import React, { useEffect, useState } from 'react';
import { Bell, Plus, Trash2, X } from 'lucide-react';
import AdminLayout from './AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const categories = ['General', 'Important', 'Exam', 'Holiday', 'Result'];

export default function AdminAnnouncements() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [form, setForm] = useState({ title: '', content: '', category: 'General', is_public: true });

  const load = () => {
    api.get('/announcements').then(r => setItems(r.data)).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title || !form.content) return toast.error('Title and content required.');
    setSaving(true);
    try {
      const res = await api.post('/announcements', form);
      setItems(prev => [res.data, ...prev]);
      setForm({ title: '', content: '', category: 'General', is_public: true });
      setShowForm(false);
      toast.success('Announcement posted!');
    } catch { toast.error('Failed to post.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await api.delete(`/announcements/${id}`);
      setItems(prev => prev.filter(a => a.id !== id));
      toast.success('Deleted.');
    } catch { toast.error('Failed to delete.'); }
  };

  return (
    <AdminLayout title="Announcements">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500 text-sm">Post notices and updates for students.</p>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'New Announcement'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-6 mb-6 border-2 border-gold-200">
          <h3 className="font-bold text-navy-900 text-lg mb-5">Post New Announcement</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1">Title *</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                required className="input-field" placeholder="Announcement title" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1">Content *</label>
              <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                required rows={4} className="input-field resize-none" placeholder="Announcement details..." />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="input-field">
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input type="checkbox" id="is_public" checked={form.is_public}
                  onChange={e => setForm(p => ({ ...p, is_public: e.target.checked }))}
                  className="w-4 h-4 accent-gold-500" />
                <label htmlFor="is_public" className="text-sm font-medium text-navy-900">
                  Show on public website (Home page)
                </label>
              </div>
            </div>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <div className="w-4 h-4 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" /> : <Bell className="w-4 h-4" />}
              {saving ? 'Posting...' : 'Post Announcement'}
            </button>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-navy-800 border-t-gold-400 rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="card p-12 text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No announcements yet. Post one above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="card p-5 flex gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-gold-700 bg-gold-50 px-2 py-0.5 rounded-full border border-gold-200">
                    {item.category}
                  </span>
                  {item.is_public && (
                    <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                      Public
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {new Date(item.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                  </span>
                </div>
                <h3 className="font-bold text-navy-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{item.content}</p>
              </div>
              <button onClick={() => handleDelete(item.id)}
                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors flex-shrink-0 self-start">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
