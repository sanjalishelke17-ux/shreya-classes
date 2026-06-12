import React, { useState, useEffect } from "react";
import { Save, Lock, Globe, Phone, Mail, Eye, EyeOff } from 'lucide-react';
import AdminLayout from './AdminLayout';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';


export default function AdminSettings() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('account');
  const [saving, setSaving] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ current_password: '', new_password: '', confirm: '' });

  const [contact, setContact] = useState({
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    instagram: '',
    facebook: '',
    youtube: '',
  });
  useEffect(() => {
    console.log("Settings page loaded");
  }, []);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await api.get('/settings');

      setContact({
        phone: res.data.phone || '',
        whatsapp: res.data.whatsapp || '',
        email: res.data.email || '',
        address: res.data.address || '',
        instagram: res.data.instagram || '',
        facebook: res.data.facebook || '',
        youtube: res.data.youtube || '',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);

      await api.put('/settings', contact);

      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleProfileSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/students/me', profile);
      updateUser(res.data);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile.'); }
    finally { setSaving(false); }
  };

  const handlePasswordSave = async e => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm)
      return toast.error('Passwords do not match.');
    if (passwords.new_password.length < 6)
      return toast.error('Password must be at least 6 characters.');
    setSaving(true);
    try {
      await api.put('/students/me/password', {
        current_password: passwords.current_password,
        new_password: passwords.new_password,
      });
      setPasswords({ current_password: '', new_password: '', confirm: '' });
      toast.success('Password changed! Use new password next login.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally { setSaving(false); }
  };

  const tabs = [
    { id: 'account', icon: Lock, label: 'Account & Password' },
    { id: 'contact', icon: Phone, label: 'Contact Info' },
    { id: 'social', icon: Globe, label: 'Social Media' },
  ];

  return (
    <AdminLayout title="Settings">
      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 mb-8 border-b border-gray-200">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${tab === t.id
              ? 'border-gold-500 text-gold-600'
              : 'border-transparent text-gray-500 hover:text-navy-800'
              }`}>
            <t.icon className="w-4 h-4" />{t.label}
          </button>
        ))}
      </div>

      {/* Account & Password */}
      {tab === 'account' && (
        <div className="space-y-6 max-w-xl">
          {/* Profile */}
          <div className="card p-6">
            <h3 className="font-bold text-navy-900 text-lg mb-5">Admin Profile</h3>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-1">Name</label>
                <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                  className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-1">Phone</label>
                <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                  className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-1">Email</label>
                <input value={user?.email || ''} disabled className="input-field bg-gray-50 text-gray-400 cursor-not-allowed" />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
              </div>
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? <div className="w-4 h-4 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                Save Profile
              </button>
            </form>
          </div>

          {/* Change password */}
          <div className="card p-6">
            <h3 className="font-bold text-navy-900 text-lg mb-2">Change Password</h3>
            <p className="text-sm text-gray-500 mb-5">
              Current default password is <span className="font-mono font-bold text-navy-900">Admin@1234</span>. Change it now for security.
            </p>
            <form onSubmit={handlePasswordSave} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-1">Current Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={passwords.current_password}
                    onChange={e => setPasswords(p => ({ ...p, current_password: e.target.value }))}
                    required className="input-field pr-10" placeholder="Current password" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-3 text-gray-400">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-1">New Password</label>
                <input type="password" value={passwords.new_password}
                  onChange={e => setPasswords(p => ({ ...p, new_password: e.target.value }))}
                  required className="input-field" placeholder="Min 6 characters" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-1">Confirm New Password</label>
                <input type="password" value={passwords.confirm}
                  onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                  required className="input-field" placeholder="Repeat new password" />
              </div>
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? <div className="w-4 h-4 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" /> : <Lock className="w-4 h-4" />}
                Change Password
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Contact Info */}
      {tab === 'contact' && (
        <div className="card p-6 max-w-xl">
          <h3 className="font-bold text-navy-900 text-lg mb-2">Contact Information</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1">
                <Phone className="w-4 h-4 inline mr-1" />Phone Number
              </label>
              <input value={contact.phone} onChange={e => setContact(p => ({ ...p, phone: e.target.value }))}
                className="input-field" placeholder="9130136257" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1">WhatsApp Number</label>
              <input value={contact.whatsapp} onChange={e => setContact(p => ({ ...p, whatsapp: e.target.value }))}
                className="input-field" placeholder="9130136257" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1">
                <Mail className="w-4 h-4 inline mr-1" />Email Address
              </label>
              <input type="email" value={contact.email} onChange={e => setContact(p => ({ ...p, email: e.target.value }))}
                className="input-field" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-900 mb-1">Address</label>
              <textarea value={contact.address} onChange={e => setContact(p => ({ ...p, address: e.target.value }))}
                rows={3} className="input-field resize-none" />
            </div>

            <button
              onClick={saveSettings}
              disabled={saving}
              className="btn-primary flex items-center gap-2 mt-4"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Contact Settings
            </button>
          </div>
        </div>
      )}

      {/* Social Media */}
      {tab === 'social' && (
        <div className="card p-6 max-w-xl">
          <h3 className="font-bold text-navy-900 text-lg mb-2">Social Media Links</h3>

          <div className="space-y-4">
            {[
              { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/shreyaclasses' },
              { key: 'facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/shreyaclasses' },
              { key: 'youtube', label: 'YouTube URL', placeholder: 'https://youtube.com/@shreyaclasses' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-navy-900 mb-1">{label}</label>
                <input
                  value={contact[key]}
                  onChange={e => setContact(p => ({ ...p, [key]: e.target.value }))}
                  className="input-field"
                  placeholder={placeholder}
                />
              </div>
            ))}
          </div>

        </div>
      )}
    </AdminLayout>
  );
}
