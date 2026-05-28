import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', class_enrolled: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const user = await register(form);
      toast.success('Account created! Welcome to Shreya Classes.');
      navigate('/portal');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-navy-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-gold-400" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-navy-900">Create Account</h1>
          <p className="text-gray-500 mt-2">Register as a student of Shreya Commerce Classes</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1">Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="Your full name" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-1">Phone *</label>
                <input name="phone" value={form.phone} onChange={handleChange} required className="input-field" placeholder="10-digit mobile" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-1">Class</label>
                <select name="class_enrolled" value={form.class_enrolled} onChange={handleChange} className="input-field">
                  <option value="">Select class</option>
                  <option value="11th Commerce">11th Commerce</option>
                  <option value="12th Commerce">12th Commerce</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1">Email Address *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1">Password *</label>
              <div className="relative">
                <input name="password" type={show ? 'text' : 'password'} value={form.password} onChange={handleChange} required className="input-field pr-12" placeholder="Min 6 characters" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-3 text-gray-400 hover:text-navy-800">
                  {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1">Confirm Password *</label>
              <input name="confirm" type="password" value={form.confirm} onChange={handleChange} required className="input-field" placeholder="Repeat password" />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 py-4 mt-2">
              {loading ? <div className="w-4 h-4 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" /> : <UserPlus className="w-4 h-4" />}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-gold-600 hover:text-gold-500 font-semibold">Login here</Link>
          </p>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          Only enrolled students can access notes. <Link to="/admission" className="text-gold-600">Apply for admission</Link> first.
        </p>
      </div>
    </div>
  );
}
