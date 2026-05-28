import React, { useEffect, useState } from 'react';
import { GraduationCap, Edit2, Save, X } from 'lucide-react';
import AdminLayout from './AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // course being edited
  const [form, setForm]       = useState({});

  useEffect(() => {
    api.get('/courses').then(r => setCourses(r.data)).catch(() => toast.error('Failed to load courses')).finally(() => setLoading(false));
  }, []);

  const startEdit = (course) => { setEditing(course.id); setForm({ ...course }); };
  const cancelEdit = () => { setEditing(null); setForm({}); };

  const handleSave = async () => {
    try {
      const res = await api.put(`/courses/${form.id}`, form);
      setCourses(prev => prev.map(c => c.id === form.id ? res.data : c));
      setEditing(null);
      toast.success('Course updated!');
    } catch { toast.error('Failed to update course.'); }
  };

  return (
    <AdminLayout title="Courses & Fees">
      <p className="text-gray-500 text-sm mb-6">
        Update course fees here. Changes appear immediately on the public Courses page.
      </p>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-navy-800 border-t-gold-400 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {courses.map(course => (
            <div key={course.id} className="card p-6">
              {editing === course.id ? (
                /* Edit mode */
                <div>
                  <h3 className="font-bold text-navy-900 text-lg mb-5">{course.name} — Editing</h3>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-navy-900 mb-1">Monthly Fee (₹)</label>
                      <input type="number" value={form.fees_monthly || ''} onChange={e => setForm(p => ({ ...p, fees_monthly: e.target.value }))}
                        className="input-field" placeholder="e.g. 1500 (leave blank to hide)" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy-900 mb-1">Yearly Fee (₹)</label>
                      <input type="number" value={form.fees_yearly || ''} onChange={e => setForm(p => ({ ...p, fees_yearly: e.target.value }))}
                        className="input-field" placeholder="e.g. 15000 (leave blank to hide)" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-navy-900 mb-1">Description</label>
                    <textarea value={form.description || ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                      rows={3} className="input-field resize-none" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-navy-900 mb-1">Duration</label>
                      <input value={form.duration || ''} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))}
                        className="input-field" placeholder="e.g. 1 Year" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy-900 mb-1">Batch Size</label>
                      <input value={form.batch_size || ''} onChange={e => setForm(p => ({ ...p, batch_size: e.target.value }))}
                        className="input-field" placeholder="e.g. Small Batch" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-5">
                    <input type="checkbox" id={`pop_${course.id}`} checked={!!form.popular}
                      onChange={e => setForm(p => ({ ...p, popular: e.target.checked }))}
                      className="w-4 h-4 accent-gold-500" />
                    <label htmlFor={`pop_${course.id}`} className="text-sm font-medium text-navy-900">
                      Mark as "Most Popular"
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                      <Save className="w-4 h-4" /> Save Changes
                    </button>
                    <button onClick={cancelEdit} className="btn-secondary flex items-center gap-2">
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View mode */
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <GraduationCap className="w-6 h-6 text-gold-500" />
                      <h3 className="font-bold text-navy-900 text-xl">{course.name}</h3>
                      {course.popular && (
                        <span className="text-xs bg-gold-100 text-gold-700 px-2 py-0.5 rounded-full font-semibold">Popular</span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mb-3">{course.description}</p>
                    <div className="flex flex-wrap gap-3">
                      <div className="bg-navy-50 rounded-xl px-4 py-2">
                        <p className="text-xs text-gray-400">Monthly Fee</p>
                        <p className="font-bold text-navy-900">
                          {course.fees_monthly ? `₹${Number(course.fees_monthly).toLocaleString('en-IN')}` : 'Not set'}
                        </p>
                      </div>
                      <div className="bg-gold-50 rounded-xl px-4 py-2">
                        <p className="text-xs text-gray-400">Yearly Fee</p>
                        <p className="font-bold text-navy-900">
                          {course.fees_yearly ? `₹${Number(course.fees_yearly).toLocaleString('en-IN')}` : 'Not set'}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-xl px-4 py-2">
                        <p className="text-xs text-gray-400">Duration</p>
                        <p className="font-bold text-navy-900">{course.duration}</p>
                      </div>
                    </div>
                    {(!course.fees_monthly && !course.fees_yearly) && (
                      <p className="text-orange-600 text-xs mt-2 font-medium">
                        ⚠ No fees set — website shows "Contact for Fee Details". Click Edit to add fees.
                      </p>
                    )}
                  </div>
                  <button onClick={() => startEdit(course)}
                    className="btn-navy flex items-center gap-2 text-sm flex-shrink-0">
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
