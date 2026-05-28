import React, { useEffect, useState } from 'react';
import { Bell, Calendar } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const categoryColors = {
  Important: 'bg-red-50 text-red-700 border-red-200',
  Exam:      'bg-orange-50 text-orange-700 border-orange-200',
  Holiday:   'bg-green-50 text-green-700 border-green-200',
  General:   'bg-blue-50 text-blue-700 border-blue-200',
};

export default function StudentAnnouncements() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/announcements')
      .then(r => setItems(r.data))
      .catch(() => toast.error('Failed to load announcements'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="bg-navy-900 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-gold-400 text-sm font-medium mb-1">Student Portal</p>
          <h1 className="font-serif text-3xl font-bold text-white">Announcements</h1>
          <p className="text-gray-300 mt-2">Latest updates and notices from your class.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-navy-800 border-t-gold-400 rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-bold text-navy-900 text-xl mb-2">No announcements yet</h3>
            <p className="text-gray-500">New notices will appear here.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {items.map(item => {
              const colorClass = categoryColors[item.category] || categoryColors.General;
              return (
                <div key={item.id} className="card p-6 border-l-4 border-l-gold-400">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${colorClass}`}>
                      {item.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </span>
                  </div>
                  <h3 className="font-bold text-navy-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{item.content}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
