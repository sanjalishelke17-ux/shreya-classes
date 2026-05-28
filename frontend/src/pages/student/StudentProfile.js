import React, { useState } from 'react';
import { User, Lock, Save, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function StudentProfile() {
  const { user, updateUser } = useAuth();
  const [tab, setTab]         = useState('profile');
  const [saving, setSaving]   = useState(false);

  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ current_password: '', new_password: '', confirm: '' });

  const handleProfileSave = async e => {
    e.preventDefault();
    if (!profile.name) return toast.error('Name is required.');
    setSaving(true);
    try {
      const res = await api.put('/students/me', profile);
      updateUser(res.data);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSave = async e => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm) return toast.error('Passwords do not match.');
    if (passwords.new_password.length < 6) return toast.error('Password must be at least 6 characters.');
    setSaving(true);
    try {
      await api.put('/students/me/password', {
        current_password: passwords.current_password,
        new_password: passwords.new_password,
      });
      setPasswords({ current_password: '', new_password: '', confirm: '' });
      toast.success('Password changed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="bg-navy-900 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="text-gold-400 text-sm font-medium mb-1">Student Portal</p>
          <h1 className="font-serif text-3xl font-bold text-white">My Profile</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {[
            { id: 'profile',  icon: User, label: 'Profile Details' },
            { id: 'password', icon: Lock, label: 'Change Password' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-gold-500 text-gold-600'
                  : 'border-transparent text-gray-500 hover:text-navy-800'
              }`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <div className="card p-8">
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gold-500 rounded-2xl flex items-center justify-center text-navy-900 font-bold text-2xl">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-navy-900 text-lg">{user?.name}</p>
                <p className="text-gray-500 text-sm">{user?.email}</p>
                {user?.class_enrolled && (
                  <p className="text-gold-600 text-sm font-medium">{user.class_enrolled}</p>
                )}
              </div>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-1">Full Name *</label>
                <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                  required className="input-field" placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-1">Phone Number</label>
                <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                  className="input-field" placeholder="10-digit mobile" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-1">Email</label>
                <input value={user?.email || ''} disabled className="input-field bg-gray-50 text-gray-400 cursor-not-allowed" />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed. Contact admin if needed.</p>
              </div>
              <button type="submit" disabled={saving}
                className="btn-primary flex items-center gap-2 py-3">
                {saving
                  ? <div className="w-4 h-4 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" />
                  : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {tab === 'password' && (
          <div className="card p-8">
            <form onSubmit={handlePasswordSave} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-1">Current Password *</label>
                <input type="password" value={passwords.current_password}
                  onChange={e => setPasswords(p => ({ ...p, current_password: e.target.value }))}
                  required className="input-field" placeholder="Your current password" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-1">New Password *</label>
                <input type="password" value={passwords.new_password}
                  onChange={e => setPasswords(p => ({ ...p, new_password: e.target.value }))}
                  required className="input-field" placeholder="Min 6 characters" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-1">Confirm New Password *</label>
                <input type="password" value={passwords.confirm}
                  onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                  required className="input-field" placeholder="Repeat new password" />
              </div>
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 py-3">
                {saving
                  ? <div className="w-4 h-4 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" />
                  : <CheckCircle className="w-4 h-4" />}
                {saving ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
