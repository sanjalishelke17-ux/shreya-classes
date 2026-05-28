import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Send, GraduationCap, Phone } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const steps = ['Personal Details', 'Course Details', 'Submit'];

export default function Admission() {
  const [step, setStep]         = useState(0);
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', class: '', school: '', subjects: '', message: '',
  });

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const nextStep = () => {
    if (step === 0 && (!form.name || !form.phone)) return toast.error('Name and phone are required.');
    if (step === 1 && !form.class) return toast.error('Please select a class.');
    setStep(s => s + 1);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/admissions', form);
      setSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch {
      toast.error('Submission failed. Please call us directly.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16 px-4">
      <div className="max-w-md w-full card p-10 text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h2 className="font-serif text-3xl font-bold text-navy-900 mb-3">Application Received!</h2>
        <p className="text-gray-600 mb-2">Thank you, <strong>{form.name}</strong>!</p>
        <p className="text-gray-600 mb-6">
          We will call you on <strong>{form.phone}</strong> within 24 hours to confirm your admission.
        </p>
        <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-navy-800 font-medium">In the meantime, you can also:</p>
          <a href="https://wa.me/919130136257" target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 mt-2 text-green-600 font-semibold hover:text-green-500">
            WhatsApp us for faster response →
          </a>
        </div>
        <Link to="/" className="btn-navy w-full block text-center">Back to Home</Link>
      </div>
    </div>
  );

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-navy-900 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="section-subheading text-gold-400">Join Us</p>
          <h1 className="font-serif text-4xl font-bold text-white mb-3">Apply for Admission</h1>
          <p className="text-gray-300">Free application. We'll contact you within 24 hours.</p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-14">
        {/* Step indicator */}
        <div className="flex items-center justify-center mb-10">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  i <= step ? 'bg-gold-500 text-navy-900' : 'bg-gray-200 text-gray-500'
                }`}>{i + 1}</div>
                <span className={`text-xs mt-1 font-medium ${i <= step ? 'text-navy-900' : 'text-gray-400'}`}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-3 mb-4 rounded transition-all ${i < step ? 'bg-gold-400' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 0 — Personal */}
            {step === 0 && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="font-serif text-xl font-bold text-navy-900 mb-5">Personal Details</h2>
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-1">Student Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="Full name" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-navy-900 mb-1">Phone Number *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} required className="input-field" placeholder="10-digit mobile" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy-900 mb-1">Email (optional)</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-1">Current School / College</label>
                  <input name="school" value={form.school} onChange={handleChange} className="input-field" placeholder="School or college name" />
                </div>
                <button type="button" onClick={nextStep} className="w-full btn-primary py-3 mt-2">
                  Next Step →
                </button>
              </div>
            )}

            {/* Step 1 — Course */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="font-serif text-xl font-bold text-navy-900 mb-5">Course Details</h2>
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-1">Class Applying For *</label>
                  <select name="class" value={form.class} onChange={handleChange} required className="input-field">
                    <option value="">Select class</option>
                    <option value="11th Commerce">11th Commerce</option>
                    <option value="12th Commerce">12th Commerce</option>
                    <option value="Both">Both 11th & 12th</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-1">Subjects Needed</label>
                  <select name="subjects" value={form.subjects} onChange={handleChange} className="input-field">
                    <option value="">Select preference</option>
                    <option value="All Subjects">All Subjects</option>
                    <option value="Accounts">Accounts</option>
                    <option value="Economics">Economics</option>
                    <option value="OC + SP">OC + SP</option>
                    <option value="Maths">Mathematics & Statistics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-900 mb-1">Any specific requirements or questions?</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={4}
                    className="input-field resize-none"
                    placeholder="Any doubts about batch timing, fees, subjects..." />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(0)} className="btn-secondary flex-1 py-3">← Back</button>
                  <button type="button" onClick={nextStep} className="btn-primary flex-1 py-3">Next Step →</button>
                </div>
              </div>
            )}

            {/* Step 2 — Review & Submit */}
            {step === 2 && (
              <div className="animate-fade-in">
                <h2 className="font-serif text-xl font-bold text-navy-900 mb-5">Review & Submit</h2>
                <div className="bg-navy-50 rounded-2xl p-5 space-y-3 mb-6">
                  {[
                    { label: 'Name',    value: form.name },
                    { label: 'Phone',   value: form.phone },
                    { label: 'Email',   value: form.email || '—' },
                    { label: 'School',  value: form.school || '—' },
                    { label: 'Class',   value: form.class },
                    { label: 'Subjects', value: form.subjects || '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">{label}</span>
                      <span className="text-navy-900 font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 mb-6 text-sm text-navy-800">
                  <GraduationCap className="w-5 h-5 text-gold-600 inline mr-2" />
                  After submitting, we will call <strong>{form.phone}</strong> within 24 hours.
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">← Back</button>
                  <button type="submit" disabled={loading} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
                    {loading
                      ? <><div className="w-4 h-4 border-2 border-navy-800 border-t-transparent rounded-full animate-spin" /> Submitting...</>
                      : <><Send className="w-4 h-4" /> Submit Application</>
                    }
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Prefer to call directly?{' '}
          <a href="tel:9130136257" className="text-gold-600 font-semibold flex items-center gap-1 inline-flex">
            <Phone className="w-4 h-4" /> 9130136257
          </a>
        </p>
      </div>
    </div>
  );
}
