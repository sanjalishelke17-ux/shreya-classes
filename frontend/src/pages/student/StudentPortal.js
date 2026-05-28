import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Bell, User, CreditCard, GraduationCap, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const portalLinks = [
  { to: '/portal/notes',         icon: BookOpen,    label: 'My Notes',          desc: 'Download study material' },
  { to: '/portal/announcements', icon: Bell,        label: 'Announcements',     desc: 'Latest updates from class' },
  { to: '/portal/fees',          icon: CreditCard,  label: 'Fee Payment',       desc: 'Pay fees online' },
  { to: '/portal/profile',       icon: User,        label: 'My Profile',        desc: 'Update your details' },
];

export default function StudentPortal() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-navy-900 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gold-500 rounded-2xl flex items-center justify-center text-navy-900 font-bold text-2xl font-serif">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-gold-400 text-sm font-medium">Welcome back</p>
              <h1 className="font-serif text-3xl font-bold text-white">{user?.name}</h1>
              {user?.class_enrolled && (
                <p className="text-gray-300 text-sm mt-1 flex items-center gap-1">
                  <GraduationCap className="w-4 h-4" /> {user.class_enrolled}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="font-bold text-navy-900 text-xl mb-6">Student Portal</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {portalLinks.map(link => (
            <Link key={link.to} to={link.to}
              className="card p-6 flex items-center gap-5 group hover:border-gold-200 border border-transparent">
              <div className="w-14 h-14 bg-navy-100 group-hover:bg-gold-100 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors">
                <link.icon className="w-7 h-7 text-navy-700 group-hover:text-gold-600 transition-colors" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors">{link.label}</p>
                <p className="text-gray-500 text-sm mt-0.5">{link.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gold-400 transition-colors" />
            </Link>
          ))}
        </div>

        <div className="mt-8 bg-navy-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-lg">Need help?</p>
            <p className="text-gray-300 text-sm">Call or WhatsApp your teacher directly.</p>
          </div>
          <a href="tel:9130136257" className="btn-primary whitespace-nowrap">
            Call 9130136257
          </a>
        </div>
      </div>
    </div>
  );
}
