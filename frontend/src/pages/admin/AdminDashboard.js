import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, MessageSquare, Star, Bell, BookOpen, TrendingUp, ChevronRight } from 'lucide-react';
import AdminLayout from './AdminLayout';
import api from '../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats]   = useState({ students: 0, inquiries: 0, testimonials: 0, notes: 0 });
  const [recent, setRecent] = useState({ inquiries: [], announcements: [] });

  useEffect(() => {
    const load = async () => {
      try {
        const [students, inquiries, testimonials, notes, announcements] = await Promise.allSettled([
          api.get('/students'),
          api.get('/inquiries'),
          api.get('/testimonials'),
          api.get('/notes'),
          api.get('/announcements'),
        ]);
        setStats({
          students:     students.value?.data?.length     || 0,
          inquiries:    inquiries.value?.data?.length    || 0,
          testimonials: testimonials.value?.data?.filter(t => !t.is_approved).length || 0,
          notes:        notes.value?.data?.length        || 0,
        });
        setRecent({
          inquiries:     inquiries.value?.data?.slice(0, 5)     || [],
          announcements: announcements.value?.data?.slice(0, 3) || [],
        });
      } catch {}
    };
    load();
  }, []);

  const statCards = [
    { icon: Users,        label: 'Total Students',      value: stats.students,     to: '/admin/students',     color: 'bg-blue-50 text-blue-700' },
    { icon: MessageSquare,label: 'Total Inquiries',     value: stats.inquiries,    to: '/admin/inquiries',    color: 'bg-green-50 text-green-700' },
    { icon: Star,         label: 'Pending Reviews',     value: stats.testimonials, to: '/admin/testimonials', color: 'bg-yellow-50 text-yellow-700' },
    { icon: BookOpen,     label: 'Notes Uploaded',      value: stats.notes,        to: '/admin/notes',        color: 'bg-purple-50 text-purple-700' },
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {statCards.map((s, i) => (
          <Link key={i} to={s.to} className="card p-6 flex items-center gap-4 hover:border-gold-200 border border-transparent group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-navy-900">{s.value}</p>
              <p className="text-gray-500 text-sm">{s.label}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gold-400 ml-auto transition-colors" />
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent inquiries */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-navy-900 text-lg">Recent Inquiries</h2>
            <Link to="/admin/inquiries" className="text-gold-600 text-sm font-medium hover:text-gold-500">
              View all →
            </Link>
          </div>
          {recent.inquiries.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No inquiries yet.</p>
          ) : (
            <div className="space-y-3">
              {recent.inquiries.map(inq => (
                <div key={inq.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-semibold text-navy-900 text-sm">{inq.name}</p>
                    <p className="text-gray-400 text-xs">{inq.phone} — {inq.class || 'Not specified'}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    inq.status === 'new'       ? 'bg-blue-50 text-blue-700' :
                    inq.status === 'contacted' ? 'bg-yellow-50 text-yellow-700' :
                    inq.status === 'enrolled'  ? 'bg-green-50 text-green-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>{inq.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="card p-6">
          <h2 className="font-bold text-navy-900 text-lg mb-5">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { to: '/admin/announcements', icon: Bell,         label: 'Post New Announcement',   color: 'text-blue-600 bg-blue-50' },
              { to: '/admin/notes',         icon: BookOpen,     label: 'Upload Study Notes',      color: 'text-purple-600 bg-purple-50' },
              { to: '/admin/courses',       icon: TrendingUp,   label: 'Update Course Fees',      color: 'text-gold-600 bg-gold-50' },
              { to: '/admin/testimonials',  icon: Star,         label: 'Review Testimonials',     color: 'text-yellow-600 bg-yellow-50' },
              { to: '/admin/blog',          icon: MessageSquare,label: 'Write Blog Post',         color: 'text-green-600 bg-green-50' },
            ].map((action, i) => (
              <Link key={i} to={action.to}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${action.color}`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <span className="font-medium text-navy-900 text-sm group-hover:text-gold-600 transition-colors">
                  {action.label}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
