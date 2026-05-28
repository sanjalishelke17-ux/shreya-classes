import React, { useEffect, useState } from 'react';
import { Star, Upload, CheckCircle, Award } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    student_name: '', year: '', percentage: '', review: '', rating: 5, stream: '12th Commerce'
  });

  useEffect(() => {
    api.get('/testimonials/approved').then(r => setTestimonials(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.student_name || !form.review || !form.percentage) {
      return toast.error('Please fill in all required fields');
    }
    if (Number(form.percentage) > 100 || Number(form.percentage) < 0) {
      return toast.error('Please enter a valid percentage');
    }
    setSubmitting(true);
    try {
      await api.post('/testimonials', form);
      setSubmitted(true);
      toast.success('Thank you! Your review will appear after approval.');
    } catch {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const StarSelector = () => (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button" onClick={() => setForm(p => ({ ...p, rating: s }))}>
          <Star className={`w-6 h-6 transition-colors ${s <= form.rating ? 'text-gold-400 fill-current' : 'text-gray-300'}`} />
        </button>
      ))}
    </div>
  );

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-navy-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-subheading text-gold-400">Student Stories</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-6">Testimonials</h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Real results from real students. See what our students achieved after joining Shreya Commerce Classes.
          </p>
        </div>
      </section>

      {/* Testimonial cards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-navy-800 border-t-gold-400 rounded-full animate-spin" />
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-20">
              <Award className="w-16 h-16 text-gold-300 mx-auto mb-4" />
              <h3 className="font-bold text-navy-900 text-xl mb-2">Be the First to Share!</h3>
              <p className="text-gray-500 mb-6">No testimonials yet. Are you a past student? Share your marks and experience below.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {testimonials.map((t) => (
                <div key={t.id} className="card p-6 flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-4 h-4 ${s <= (t.rating||5) ? 'text-gold-400 fill-current' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  {/* Review */}
                  <p className="text-gray-700 italic text-sm leading-relaxed flex-1 mb-4">"{t.review}"</p>
                  {/* Marks badge */}
                  {t.percentage && (
                    <div className="inline-flex items-center gap-2 bg-gold-50 border border-gold-200 rounded-xl px-4 py-2 mb-4 w-fit">
                      <Award className="w-4 h-4 text-gold-600" />
                      <div>
                        <p className="font-bold text-navy-900 text-lg leading-tight">{t.percentage}%</p>
                        <p className="text-gold-700 text-xs">{t.stream || '12th Commerce'} Board Result</p>
                      </div>
                    </div>
                  )}
                  {/* Student info */}
                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-navy-900 text-sm">{t.student_name}</p>
                      {t.year && <p className="text-gray-400 text-xs">Batch {t.year}</p>}
                    </div>
                    <div className="w-9 h-9 bg-navy-100 rounded-full flex items-center justify-center text-navy-800 font-bold text-sm">
                      {t.student_name?.[0]?.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Submit form CTA */}
          {!showForm ? (
            <div className="text-center">
              <div className="bg-navy-900 rounded-3xl p-10 max-w-2xl mx-auto">
                <Upload className="w-12 h-12 text-gold-400 mx-auto mb-4" />
                <h2 className="font-serif text-2xl font-bold text-white mb-3">Are You a Past Student?</h2>
                <p className="text-gray-300 mb-6">Share your 12th board marks and experience to help future students make the right choice.</p>
                <button onClick={() => setShowForm(true)} className="btn-primary">Share My Marks & Review</button>
              </div>
            </div>
          ) : submitted ? (
            <div className="text-center bg-white rounded-3xl p-10 max-w-2xl mx-auto shadow-lg">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="font-serif text-2xl font-bold text-navy-900 mb-3">Thank You!</h2>
              <p className="text-gray-600">Your review has been submitted for approval. Once approved, it will appear on this page.</p>
              <button onClick={() => { setSubmitted(false); setShowForm(false); }} className="btn-navy mt-6">Back to Testimonials</button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 max-w-2xl mx-auto shadow-lg">
              <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6">Share Your Experience</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy-900 mb-1">Your Name *</label>
                    <input name="student_name" value={form.student_name} onChange={handleChange} required className="input-field" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy-900 mb-1">Year of Passing *</label>
                    <select name="year" value={form.year} onChange={handleChange} required className="input-field">
                      <option value="">Select year</option>
                      {[2024,2023,2022,2021,2020,2019,2018].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy-900 mb-1">12th Board Percentage *</label>
                    <div className="relative">
                      <input name="percentage" type="number" min="0" max="100" step="0.01" value={form.percentage} onChange={handleChange} required className="input-field pr-8" placeholder="e.g. 87.60" />
                      <span className="absolute right-3 top-3 text-gray-400 font-bold">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy-900 mb-1">Stream</label>
                    <select name="stream" value={form.stream} onChange={handleChange} className="input-field">
                      <option value="12th Commerce">12th Commerce</option>
                      <option value="11th Commerce">11th Commerce</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-2">Your Rating</label>
                  <StarSelector />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-1">Your Review *</label>
                  <textarea name="review" value={form.review} onChange={handleChange} required rows={4} className="input-field resize-none"
                    placeholder="Share your experience — how did the tuition help you, what you liked, what improved your marks..." />
                </div>

                <div className="flex gap-3">
                  <button type="submit" disabled={submitting} className="flex-1 btn-primary flex items-center justify-center gap-2 py-3">
                    {submitting ? <><div className="w-4 h-4 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" /> Submitting...</> : 'Submit My Review'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary py-3 px-5">Cancel</button>
                </div>

                <p className="text-xs text-gray-400 text-center">
                  Your review will appear after approval by the admin. Fake/irrelevant reviews will not be approved.
                </p>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
