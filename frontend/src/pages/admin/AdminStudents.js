import React, { useEffect, useState } from 'react';
import { Users, Search, UserCheck, UserX, Phone, Mail } from 'lucide-react';
import AdminLayout from './AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');

  useEffect(() => {
    api.get('/students').then(r => setStudents(r.data)).catch(() => toast.error('Failed to load students')).finally(() => setLoading(false));
  }, []);

  const toggleActive = async (student) => {
    try {
      const res = await api.put(`/students/${student.id}`, { ...student, is_active: !student.is_active });
      setStudents(prev => prev.map(s => s.id === student.id ? { ...s, is_active: res.data.is_active } : s));
      toast.success(res.data.is_active ? 'Student activated' : 'Student deactivated');
    } catch { toast.error('Failed to update student'); }
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    (s.phone || '').includes(search)
  );

  return (
    <AdminLayout title="Students">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-9" placeholder="Search students..." />
        </div>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {filtered.length} student{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-navy-800 border-t-gold-400 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No students found.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-navy-900 text-white">
                <tr>
                  {['Name', 'Email', 'Phone', 'Class', 'Joined', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gold-100 rounded-full flex items-center justify-center text-gold-700 font-bold text-sm flex-shrink-0">
                          {s.name[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-navy-900">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <a href={`mailto:${s.email}`} className="flex items-center gap-1 hover:text-gold-600">
                        <Mail className="w-3 h-3" />{s.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {s.phone ? (
                        <a href={`tel:${s.phone}`} className="flex items-center gap-1 hover:text-gold-600">
                          <Phone className="w-3 h-3" />{s.phone}
                        </a>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {s.class_enrolled ? (
                        <span className="bg-navy-50 text-navy-700 text-xs px-2 py-1 rounded-full font-medium">{s.class_enrolled}</span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(s.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${
                        s.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {s.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(s)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          s.is_active
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={s.is_active ? 'Deactivate' : 'Activate'}>
                        {s.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
