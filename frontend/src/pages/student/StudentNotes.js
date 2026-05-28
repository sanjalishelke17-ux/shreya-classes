import React, { useEffect, useState } from 'react';
import { BookOpen, Download, Search, Filter } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const subjects = ['All', 'Accounts', 'Economics', 'Organisation of Commerce', 'Secretarial Practice', 'Mathematics & Statistics', 'English'];
const classes  = ['All', '11th Commerce', '12th Commerce'];

export default function StudentNotes() {
  const [notes, setNotes]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filterClass, setFilterClass]     = useState('All');
  const [filterSubject, setFilterSubject] = useState('All');

  useEffect(() => {
    const params = {};
    if (filterClass   !== 'All') params.class   = filterClass;
    if (filterSubject !== 'All') params.subject  = filterSubject;
    api.get('/notes', { params })
      .then(r => setNotes(r.data))
      .catch(() => toast.error('Failed to load notes'))
      .finally(() => setLoading(false));
  }, [filterClass, filterSubject]);

  const handleDownload = async (note) => {
    try {
      const res = await api.get(`/notes/${note.id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a   = document.createElement('a');
      a.href    = url;
      a.download = note.file_name || note.title;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Download started!');
    } catch {
      toast.error('Download failed. Please try again.');
    }
  };

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    (n.subject || '').toLowerCase().includes(search.toLowerCase())
  );

  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024)       return `${bytes} B`;
    if (bytes < 1024*1024)  return `${(bytes/1024).toFixed(1)} KB`;
    return `${(bytes/1024/1024).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="bg-navy-900 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <p className="text-gold-400 text-sm font-medium mb-1">Student Portal</p>
          <h1 className="font-serif text-3xl font-bold text-white">Study Notes</h1>
          <p className="text-gray-300 mt-2">Download your study material and notes.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              className="input-field pl-9" placeholder="Search notes by title or subject..." />
          </div>
          <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className="input-field sm:w-44">
            {classes.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="input-field sm:w-56">
            {subjects.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-navy-800 border-t-gold-400 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-bold text-navy-900 text-xl mb-2">No notes found</h3>
            <p className="text-gray-500">Notes will be uploaded by your teacher soon.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(note => (
              <div key={note.id} className="card p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-navy-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-navy-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-navy-900 truncate">{note.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {note.subject && (
                      <span className="text-xs bg-gold-50 text-gold-700 px-2 py-0.5 rounded-full font-medium">
                        {note.subject}
                      </span>
                    )}
                    {note.class && (
                      <span className="text-xs bg-navy-50 text-navy-700 px-2 py-0.5 rounded-full font-medium">
                        {note.class}
                      </span>
                    )}
                    {note.file_size && (
                      <span className="text-xs text-gray-400">{formatSize(note.file_size)}</span>
                    )}
                  </div>
                  {note.description && (
                    <p className="text-gray-500 text-sm mt-1 truncate">{note.description}</p>
                  )}
                </div>
                <button onClick={() => handleDownload(note)}
                  className="btn-primary flex items-center gap-2 text-sm py-2 px-4 flex-shrink-0">
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
