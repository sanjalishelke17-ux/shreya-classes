import React, { useEffect, useState } from 'react';
import { Images, X } from 'lucide-react';
import api from '../utils/api';

const categories = ['All', 'Classroom', 'Results', 'Events', 'General'];

export default function Gallery() {
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('All');
  const [lightbox, setLightbox]   = useState(null);

  useEffect(() => {
    api.get('/gallery')
      .then(r => setItems(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? items : items.filter(i => i.category === filter);

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-navy-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-subheading text-gold-400">Our Moments</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-6">Gallery</h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            A glimpse into classroom life, student achievements and memorable moments.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  filter === c
                    ? 'bg-navy-900 text-gold-400'
                    : 'bg-white text-gray-600 hover:bg-navy-50 border border-gray-200'
                }`}>
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-navy-800 border-t-gold-400 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Images className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-bold text-navy-900 text-xl mb-2">No photos yet</h3>
              <p className="text-gray-500">Photos will be added soon.</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {filtered.map(item => (
                <div key={item.id}
                  className="break-inside-avoid card overflow-hidden cursor-pointer group"
                  onClick={() => setLightbox(item)}>
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image_url.startsWith('/') ? `http://localhost:5000${item.image_url}` : item.image_url}
                      alt={item.title || 'Gallery'}
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/40 transition-all duration-300 flex items-center justify-center">
                      <Images className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  {item.title && (
                    <div className="p-3">
                      <p className="font-semibold text-navy-900 text-sm">{item.title}</p>
                      {item.description && <p className="text-gray-500 text-xs mt-1">{item.description}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white hover:text-gold-400 transition-colors">
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-4xl max-h-screen" onClick={e => e.stopPropagation()}>
            <img
              src={lightbox.image_url.startsWith('/') ? `http://localhost:5000${lightbox.image_url}` : lightbox.image_url}
              alt={lightbox.title || 'Gallery'}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
            {lightbox.title && (
              <p className="text-white text-center font-semibold mt-3">{lightbox.title}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
