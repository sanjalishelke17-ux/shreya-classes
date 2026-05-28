import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  GraduationCap, LayoutDashboard, Users, BookOpen, FileText,
  Images, MessageSquare, Bell, Star, BookMarked, LogOut, Menu, Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin',               icon: LayoutDashboard, label: 'Dashboard',      end: true },
  { to: '/admin/students',      icon: Users,           label: 'Students' },
  { to: '/admin/courses',       icon: GraduationCap,   label: 'Courses & Fees' },
  { to: '/admin/notes',         icon: BookOpen,        label: 'Notes / Files' },
  { to: '/admin/announcements', icon: Bell,            label: 'Announcements' },
  { to: '/admin/blog',          icon: FileText,        label: 'Blog' },
  { to: '/admin/gallery',       icon: Images,          label: 'Gallery' },
  { to: '/admin/inquiries',     icon: MessageSquare,   label: 'Inquiries' },
  { to: '/admin/testimonials',  icon: Star,            label: 'Testimonials' },
  { to: '/admin/settings',      icon: Settings,        label: 'Settings' },
];

export default function AdminLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-navy-800">
        <div className="w-9 h-9 bg-gold-500 rounded-lg flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-navy-900" />
        </div>
        <div>
          <p className="text-white font-bold text-sm font-serif leading-tight">Shreya Classes</p>
          <p className="text-gold-400 text-xs">Admin Panel</p>
        </div>
      </div>

      {/* Admin user info */}
      <div className="px-5 py-3 border-b border-navy-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center text-navy-900 font-bold text-sm">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-white text-xs font-semibold">{user?.name}</p>
            <p className="text-gray-400 text-xs">Administrator</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gold-500 text-navy-900'
                  : 'text-gray-300 hover:bg-navy-800 hover:text-white'
              }`
            }>
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-navy-800 space-y-1">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-navy-800 transition-colors">
          <BookMarked className="w-4 h-4" /> View Website
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-900/20 transition-colors">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden lg:flex flex-col w-64 bg-navy-900 fixed top-0 left-0 h-full z-30">
        <Sidebar />
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-navy-900 z-50">
            <Sidebar />
          </aside>
        </div>
      )}

      <main className="flex-1 lg:ml-64">
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-navy-800">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-bold text-navy-900 text-xl">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-gold-50 text-gold-700 px-3 py-1 rounded-full font-medium border border-gold-200">
              Admin
            </span>
            <Link to="/admin/settings" className="text-gray-400 hover:text-navy-800 transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
