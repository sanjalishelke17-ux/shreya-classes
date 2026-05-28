import React, { useEffect, useState, useRef } from 'react';
import { BookOpen, Upload, Trash2, Download } from 'lucide-react';
import AdminLayout from './AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const subjects = ['Accounts','Economics','Organisation of Commerce','Secretarial Practice','Mathematics & Statistics','English','General'];
const classes  = ['11th Commerce','12th Commerce','Both'];

export default function AdminNotes() {
  const [notes, setNotes]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', subject: '', class: '' });
  const fileRef = useRef();

  useEffect(() => {
    api.get('/notes').then(r => setNotes(r.data)).catch(() => toast.error('Failed to load notes')).finally(() => setLoading(false));
  }, []);

  const handleUpload = async e => {
    e.preventDefault();
    const file = fileRef.current?.files[0];
    if (!file) return toast.error('Please select a file.');
    if (!form.title) return toast.error('Title is required.');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      const res = await api.post('/notes', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setNotes(prev => [res.data, ...prev]);
      setForm({ title: '', description: '', subject: '', class: '' });
      if (fileRef.current) fileRef.current.value = '';
      toast.success('Notes uploaded!');
    } catch { toast.error('Upload failed.'); }
    finally { setUploading(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes(prev => prev.filter(n => n.id !== id));
      toast.success('Deleted.');
    } catch { toast.error('Failed to delete.'); }
  };

  const formatSize = bytes => {
    if (!bytes) return '';
    if (bytes < 1024*1024) return `${(bytes/1024).toFixed(0)} KB`;
    return `${(bytes/1024/1024).toFixed(1)} MB`;
  };

  return (
    <AdminLayout title="Notes / Study Material">
      {/* Upload form */}
      <div className="card p-6 mb-8 border-2 border-dashed border-gold-200">
        <h3 className="font-bold text-navy-900 text-lg mb-5 flex items-center gap-2">
          <Upload className="w-5 h-5 text-gold-500" /> Upload New Notes
        </h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1">Title *</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                required className="input-field" placeholder="e.g. Accounts Chapter 1 Notes" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1">Subject</label>
              <select value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="input-field">
                <option value="">Select subject</option>
                {subjects.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1">For Class</label>
              <select value={form.class} onChange={e => setForm(p => ({ ...p, class: e.target.value }))} className="input-field">
                <option value="">Select class</option>
                {classes.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1">File * (PDF, DOC, PPT — max 20MB)</label>
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                required className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-1">Description (optional)</label>
            <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="input-field" placeholder="Brief description of this material" />
          </div>
          <button type="submit" disabled={uploading} className="btn-primary flex items-center gap-2">
            {uploading ? <div className="w-4 h-4 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Uploading...' : 'Upload Notes'}
          </button>
        </form>
      </div>

      {/* Notes list */}
      <h3 className="font-bold text-navy-900 text-lg mb-4">Uploaded Notes</h3>
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-navy-800 border-t-gold-400 rounded-full animate-spin" /></div>
      ) : notes.length === 0 ? (
        <div className="card p-12 text-center">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No notes uploaded yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map(note => (
            <div key={note.id} className="card p-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-navy-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-navy-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-navy-900 truncate">{note.title}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {note.subject && <span className="text-xs bg-gold-50 text-gold-700 px-2 py-0.5 rounded-full">{note.subject}</span>}
                  {note.class   && <span className="text-xs bg-navy-50 text-navy-700 px-2 py-0.5 rounded-full">{note.class}</span>}
                  {note.file_size && <span className="text-xs text-gray-400">{formatSize(note.file_size)}</span>}
                  <span className="text-xs text-gray-400">{note.downloads || 0} downloads</span>
                </div>
              </div>
              <button onClick={() => handleDelete(note.id)}
                className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
