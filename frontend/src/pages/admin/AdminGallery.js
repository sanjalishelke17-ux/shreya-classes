import React, { useEffect, useState, useRef } from 'react';
import { Images, Upload, Trash2 } from 'lucide-react';
import AdminLayout from './AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const categories = ['General','Classroom','Results','Events','Study Material'];

export default function AdminGallery() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title:'', description:'', category:'General' });
  const fileRef = useRef();

  useEffect(() => {
    api.get('/gallery').then(r => setItems(r.data)).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  const handleUpload = async e => {
    e.preventDefault();
    const file = fileRef.current?.files[0];
    if (!file) return toast.error('Please select an image.');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      const res = await api.post('/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setItems(prev => [res.data, ...prev]);
      setForm({ title:'', description:'', category:'General' });
      if (fileRef.current) fileRef.current.value = '';
      toast.success('Image uploaded!');
    } catch { toast.error('Upload failed.'); }
    finally { setUploading(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      setItems(prev => prev.filter(i => i.id !== id));
      toast.success('Deleted.');
    } catch { toast.error('Failed to delete.'); }
  };

  return (
    <AdminLayout title="Gallery">
      {/* Upload form */}
      <div className="card p-6 mb-8 border-2 border-dashed border-gold-200">
        <h3 className="font-bold text-navy-900 text-lg mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-gold-500" /> Upload New Image
        </h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1">Title (optional)</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                className="input-field" placeholder="Image title" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1">Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="input-field">
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1">Image * (JPG/PNG — max 5MB)</label>
              <input ref={fileRef} type="file" accept="image/*" required className="input-field" />
            </div>
          </div>
          <button type="submit" disabled={uploading} className="btn-primary flex items-center gap-2">
            {uploading ? <div className="w-4 h-4 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
      </div>

      {/* Gallery grid */}
      <h3 className="font-bold text-navy-900 text-lg mb-4">Gallery Images ({items.length})</h3>
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-navy-800 border-t-gold-400 rounded-full animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="card p-12 text-center">
          <Images className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No images yet. Upload one above.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="card overflow-hidden group">
              <div className="relative h-40 overflow-hidden">
                <img
                  src={item.image_url.startsWith('/') ? `http://localhost:5000${item.image_url}` : item.image_url}
                  alt={item.title || 'Gallery'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/50 transition-all flex items-center justify-center">
                  <button onClick={() => handleDelete(item.id)}
                    className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full transition-opacity hover:bg-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                {item.title && <p className="font-semibold text-navy-900 text-sm truncate">{item.title}</p>}
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
