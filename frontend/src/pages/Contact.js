import React, { useState } from 'react';
import { MapPin, Phone, MessageCircle, Send, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', class: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return toast.error('Name and phone are required');
    setLoading(true);
    try {
      await api.post('/inquiries', form);
      setDone(true);
      toast.success('Inquiry sent! We will contact you soon.');
    } catch {
      toast.error('Failed to send. Please call us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16">
      <section className="bg-navy-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-subheading text-gold-400">Get In Touch</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-6">Contact Us</h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Have questions? We're here to help. Call, WhatsApp, or fill the form below.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: info */}
            <div>
              <h2 className="section-heading mb-8">How to Reach Us</h2>
              <div className="space-y-6">
                <a href="tel:9130136257" className="flex gap-4 p-5 card hover:border-gold-200 border border-transparent group">
                  <div className="w-12 h-12 bg-gold-100 group-hover:bg-gold-500 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                    <Phone className="w-6 h-6 text-gold-600 group-hover:text-navy-900 transition-colors" />
                  </div>
                  <div>
                    <p className="font-bold text-navy-900">Phone</p>
                    <p className="text-gold-600 font-semibold text-lg">+91 91301 36257</p>
                    <p className="text-gray-500 text-sm">Mon–Sat, 9 AM – 7 PM</p>
                  </div>
                </a>

                <a href="https://wa.me/919130136257" target="_blank" rel="noopener noreferrer" className="flex gap-4 p-5 card hover:border-green-200 border border-transparent group">
                  <div className="w-12 h-12 bg-green-100 group-hover:bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                    <MessageCircle className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-bold text-navy-900">WhatsApp</p>
                    <p className="text-green-600 font-semibold text-lg">+91 91301 36257</p>
                    <p className="text-gray-500 text-sm">Message us anytime</p>
                  </div>
                </a>

                <div className="flex gap-4 p-5 card">
                  <div className="w-12 h-12 bg-navy-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-navy-700" />
                  </div>
                  <div>
                    <p className="font-bold text-navy-900">Address</p>
                    <p className="text-gray-600 leading-relaxed">
                      Harsha Apartment, Vatan Nagar,<br />
                      Near Indrayani College,<br />
                      Talegaon Dabhade, Pune
                    </p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="rounded-2xl overflow-hidden shadow-lg h-60 mt-6">
                <iframe
                  title="Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3779!2d73.68!3d18.74!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sIndrayani+College+Talegaon!5e0!3m2!1sen!2sin!4v1"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Right: form */}
            <div className="card p-8">
              {done ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="font-bold text-navy-900 text-xl mb-2">Inquiry Sent!</h3>
                  <p className="text-gray-600 mb-6">We will contact you within 24 hours. You can also call us directly at <a href="tel:9130136257" className="text-gold-600 font-semibold">9130136257</a>.</p>
                  <button onClick={() => { setDone(false); setForm({ name:'',phone:'',email:'',class:'',subject:'',message:'' }); }} className="btn-navy">Send Another Inquiry</button>
                </div>
              ) : (
                <>
                  <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-navy-900 mb-1">Your Name *</label>
                        <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="Full name" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-navy-900 mb-1">Phone Number *</label>
                        <input name="phone" value={form.phone} onChange={handleChange} required className="input-field" placeholder="10-digit mobile" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy-900 mb-1">Email (optional)</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field" placeholder="your@email.com" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-navy-900 mb-1">Interested In</label>
                        <select name="class" value={form.class} onChange={handleChange} className="input-field">
                          <option value="">Select class</option>
                          <option value="11th Commerce">11th Commerce</option>
                          <option value="12th Commerce">12th Commerce</option>
                          <option value="Both">Both 11th & 12th</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-navy-900 mb-1">Subject</label>
                        <select name="subject" value={form.subject} onChange={handleChange} className="input-field">
                          <option value="">Select subject</option>
                          <option value="All Subjects">All Subjects</option>
                          <option value="Accounts">Accounts</option>
                          <option value="Economics">Economics</option>
                          <option value="OC">Organisation of Commerce</option>
                          <option value="SP">Secretarial Practice</option>
                          <option value="Maths">Mathematics & Statistics</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-navy-900 mb-1">Message (optional)</label>
                      <textarea name="message" value={form.message} onChange={handleChange} rows={4} className="input-field resize-none" placeholder="Any questions or specific requirements..." />
                    </div>
                    <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 py-4">
                      {loading ? (
                        <><div className="w-4 h-4 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" /> Sending...</>
                      ) : (
                        <><Send className="w-4 h-4" /> Send Inquiry</>
                      )}
                    </button>
                    <p className="text-xs text-gray-400 text-center">
                      Or call/WhatsApp directly: <a href="tel:9130136257" className="text-gold-600 font-medium">9130136257</a>
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
