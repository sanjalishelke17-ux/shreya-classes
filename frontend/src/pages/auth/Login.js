import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, LogIn, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [tab, setTab]         = useState('student'); // 'student' | 'admin'
  const [form, setForm]       = useState({ email: '', password: '' });
  const [show, setShow]       = useState(false);
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  // Pre-fill admin credentials when switching to admin tab
  const switchTab = (newTab) => {
    setTab(newTab);
    setForm({ email: '', password: '' });
  };

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill in all fields.');
    setLoading(true);
    try {
      const user = await login(form.email.trim(), form.password);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/portal');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Check email and password.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors ${
            tab === 'admin' ? 'bg-gold-500' : 'bg-navy-900'
          }`}>
            {tab === 'admin'
              ? <Shield className="w-8 h-8 text-navy-900" />
              : <GraduationCap className="w-8 h-8 text-gold-400" />
            }
          </div>
          <h1 className="font-serif text-3xl font-bold text-navy-900">
            {tab === 'admin' ? 'Admin Login' : 'Student Login'}
          </h1>
          <p className="text-gray-500 mt-2">
            {tab === 'admin' ? 'Access the admin dashboard' : 'Access your portal, notes & announcements'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-xl border border-gray-200 p-1 bg-white mb-6">
          <button
            onClick={() => switchTab('student')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === 'student'
                ? 'bg-navy-900 text-gold-400 shadow-sm'
                : 'text-gray-500 hover:text-navy-800'
            }`}>
            <GraduationCap className="w-4 h-4" /> Student
          </button>
          <button
            onClick={() => switchTab('admin')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === 'admin'
                ? 'bg-gold-500 text-navy-900 shadow-sm'
                : 'text-gray-500 hover:text-navy-800'
            }`}>
            <Shield className="w-4 h-4" /> Admin
          </button>
        </div>

        {/* Admin hint box */}
        {tab === 'admin' && (
          <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 mb-4">
            <p className="text-sm font-semibold text-navy-900 mb-1">Default Admin Credentials</p>
            <p className="text-xs text-gray-600">Email: <span className="font-mono font-bold">admin@shreyaclasses.com</span></p>
            <p className="text-xs text-gray-600">Password: <span className="font-mono font-bold">Admin@1234</span></p>
            <p className="text-xs text-gray-400 mt-2">Change this after first login in Admin → Settings.</p>
          </div>
        )}

        {/* Login form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1">Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="input-field"
                placeholder={tab === 'admin' ? 'admin@shreyaclasses.com' : 'your@email.com'}
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={show ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="input-field pr-12"
                  placeholder="Your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-navy-800">
                  {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-lg font-semibold transition-all ${
                tab === 'admin'
                  ? 'bg-gold-500 hover:bg-gold-400 text-navy-900'
                  : 'btn-primary'
              }`}>
              {loading
                ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                : <LogIn className="w-4 h-4" />
              }
              {loading ? 'Logging in...' : tab === 'admin' ? 'Login as Admin' : 'Login'}
            </button>
          </form>

          {tab === 'student' && (
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-gold-600 hover:text-gold-500 font-semibold">
                  Create Account
                </Link>
              </p>
              <p className="text-sm text-gray-500">
                Want to join?{' '}
                <Link to="/admission" className="text-navy-800 hover:text-gold-600 font-semibold">
                  Apply for Admission
                </Link>
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Having trouble? Call:{' '}
          <a href="tel:9130136257" className="text-gold-600 font-medium">9130136257</a>
        </p>
      </div>
    </div>
  );
}
