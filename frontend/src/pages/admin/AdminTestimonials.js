import React, { useEffect, useState } from 'react';
import { Star, CheckCircle, Trash2, Award } from 'lucide-react';
import AdminLayout from './AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminTestimonials() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('pending');

  useEffect(() => {
    api.get('/testimonials').then(r => setItems(r.data)).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  const approve = async id => {
    try {
      const res = await api.put(`/testimonials/${id}/approve`);
      setItems(prev => prev.map(t => t.id === id ? res.data : t));
      toast.success('Approved! Now showing on website.');
    } catch { toast.error('Failed to approve.'); }
  };

  const remove = async id => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await api.delete(`/testimonials/${id}`);
      setItems(prev => prev.filter(t => t.id !== id));
      toast.success('Deleted.');
    } catch { toast.error('Failed to delete.'); }
  };

  const filtered = filter === 'pending'
    ? items.filter(t => !t.is_approved)
    : filter === 'approved'
    ? items.filter(t => t.is_approved)
    : items;

  return (
    <AdminLayout title="Testimonials">
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'pending',  label: `Pending (${items.filter(t => !t.is_approved).length})` },
          { id: 'approved', label: `Approved (${items.filter(t => t.is_approved).length})` },
          { id: 'all',      label: `All (${items.length})` },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              filter === f.id ? 'bg-navy-900 text-gold-400' : 'bg-white border border-gray-200 text-gray-600 hover:border-gold-300'
            }`}>{f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-navy-800 border-t-gold-400 rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No testimonials here.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map(t => (
            <div key={t.id} className={`card p-6 ${!t.is_approved ? 'border-2 border-yellow-200' : 'border-2 border-green-200'}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-bold text-navy-900">{t.student_name}</p>
                  <p className="text-xs text-gray-400">Batch {t.year}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${t.is_approved ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                  {t.is_approved ? 'Approved' : 'Pending'}
                </span>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-2">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-4 h-4 ${s <= (t.rating||5) ? 'text-gold-400 fill-current' : 'text-gray-200'}`} />
                ))}
              </div>

              <p className="text-gray-700 text-sm italic mb-3">"{t.review}"</p>

              {t.percentage && (
                <div className="flex items-center gap-2 bg-gold-50 border border-gold-200 rounded-lg px-3 py-2 mb-4 w-fit">
                  <Award className="w-4 h-4 text-gold-600" />
                  <span className="font-bold text-navy-900">{t.percentage}%</span>
                  <span className="text-xs text-gold-700">{t.stream}</span>
                </div>
              )}

              <div className="flex gap-2 mt-2">
                {!t.is_approved && (
                  <button onClick={() => approve(t.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm py-2 rounded-lg transition-colors">
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                )}
                <button onClick={() => remove(t.id)}
                  className={`flex items-center justify-center gap-2 text-sm py-2 px-3 rounded-lg transition-colors ${
                    t.is_approved
                      ? 'flex-1 bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}>
                  <Trash2 className="w-4 h-4" />
                  {t.is_approved ? 'Remove' : ''}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
