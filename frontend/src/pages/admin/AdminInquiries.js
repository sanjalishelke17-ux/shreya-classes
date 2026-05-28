import React, { useEffect, useState } from 'react';
import { MessageSquare, Phone, Mail, ChevronDown } from 'lucide-react';
import AdminLayout from './AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const statuses = ['new','contacted','enrolled','closed'];
const statusColors = {
  new:       'bg-blue-50 text-blue-700',
  contacted: 'bg-yellow-50 text-yellow-700',
  enrolled:  'bg-green-50 text-green-700',
  closed:    'bg-gray-100 text-gray-500',
};

export default function AdminInquiries() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/inquiries').then(r => setItems(r.data)).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status, notes) => {
    try {
      const res = await api.put(`/inquiries/${id}`, { status, notes });
      setItems(prev => prev.map(i => i.id === id ? res.data : i));
      toast.success('Updated!');
    } catch { toast.error('Failed to update.'); }
  };

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter);

  return (
    <AdminLayout title="Inquiries">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', ...statuses].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
              filter === s ? 'bg-navy-900 text-gold-400' : 'bg-white border border-gray-200 text-gray-600 hover:border-gold-300'
            }`}>
            {s} {s === 'all' ? `(${items.length})` : `(${items.filter(i => i.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-navy-800 border-t-gold-400 rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No inquiries in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(inq => (
            <div key={inq.id} className="card overflow-hidden">
              {/* Header row */}
              <div className="p-5 flex flex-wrap items-center gap-4 cursor-pointer"
                onClick={() => setExpanded(expanded === inq.id ? null : inq.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-bold text-navy-900">{inq.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[inq.status]}`}>
                      {inq.status}
                    </span>
                    {inq.class && <span className="text-xs bg-navy-50 text-navy-700 px-2 py-0.5 rounded-full">{inq.class}</span>}
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                    <a href={`tel:${inq.phone}`} className="flex items-center gap-1 hover:text-gold-600" onClick={e => e.stopPropagation()}>
                      <Phone className="w-3 h-3" />{inq.phone}
                    </a>
                    {inq.email && (
                      <a href={`mailto:${inq.email}`} className="flex items-center gap-1 hover:text-gold-600" onClick={e => e.stopPropagation()}>
                        <Mail className="w-3 h-3" />{inq.email}
                      </a>
                    )}
                    <span className="text-xs text-gray-400">{new Date(inq.created_at).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${expanded === inq.id ? 'rotate-180' : ''}`} />
              </div>

              {/* Expanded details */}
              {expanded === inq.id && (
                <div className="border-t border-gray-100 p-5 bg-gray-50 space-y-4">
                  {inq.message && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Message</p>
                      <p className="text-gray-700 text-sm">{inq.message}</p>
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Update Status</p>
                      <select value={inq.status}
                        onChange={e => updateStatus(inq.id, e.target.value, inq.notes)}
                        className="input-field text-sm">
                        {statuses.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Internal Notes</p>
                      <input defaultValue={inq.notes || ''} className="input-field text-sm"
                        placeholder="Add notes (e.g. called, left voicemail)"
                        onBlur={e => updateStatus(inq.id, inq.status, e.target.value)} />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <a href={`tel:${inq.phone}`} className="btn-primary text-sm flex items-center gap-2 py-2 px-4">
                      <Phone className="w-3 h-3" /> Call Now
                    </a>
                    <a href={`https://wa.me/91${inq.phone}`} target="_blank" rel="noopener noreferrer"
                      className="btn-navy text-sm flex items-center gap-2 py-2 px-4">
                      WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
