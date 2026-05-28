import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Award, CheckCircle, Star, Phone } from 'lucide-react';

const subjects = [
  { name: 'Accounts',                      std: '11th & 12th' },
  { name: 'Economics',                     std: '11th & 12th' },
  { name: 'Organisation of Commerce (OC)', std: '11th & 12th' },
  { name: 'Secretarial Practice (SP)',     std: '11th & 12th' },
  { name: 'Mathematics & Statistics',      std: '11th & 12th' },
  { name: 'English',                       std: '11th & 12th' },
];

export default function Faculty() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-navy-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-subheading text-gold-400">Meet Your Teacher</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-6">Our Faculty</h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            One dedicated teacher. All subjects. Consistent coaching that builds real understanding.
          </p>
        </div>
      </section>

      {/* Teacher profile */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Card */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-72 h-72 bg-gradient-to-br from-navy-800 to-navy-900 rounded-3xl flex flex-col items-center justify-center shadow-2xl">
                  <div className="w-24 h-24 bg-gold-500 rounded-2xl flex items-center justify-center mb-4 animate-float">
                    <GraduationCap className="w-12 h-12 text-navy-900" />
                  </div>
                  <p className="font-serif text-2xl font-bold text-white">Shraddha</p>
                  <p className="font-serif text-2xl font-bold text-white">Ghodekar</p>
                  <div className="flex gap-1 mt-3">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-gold-400 fill-current" />)}
                  </div>
                </div>
                {/* Badge */}
                <div className="absolute -bottom-4 -right-4 bg-gold-500 text-navy-900 rounded-2xl px-4 py-2 shadow-lg text-center">
                  <p className="font-bold text-sm">All Subjects</p>
                  <p className="text-xs font-medium">11th & 12th Commerce</p>
                </div>
              </div>
            </div>

            {/* Info */}
            <div>
              <p className="section-subheading">Commerce Educator</p>
              <h2 className="font-serif text-3xl font-bold text-navy-900 mb-2">Shraddha Ghodekar</h2>
              <p className="text-gold-600 font-semibold mb-5">Home Tuition Teacher • Talegaon Dabhade, Pune</p>

              <p className="text-gray-600 leading-relaxed mb-6">
                An experienced commerce educator providing home tuition for 11th and 12th standard
                students in Talegaon Dabhade. Shraddha teaches all commerce subjects herself,
                ensuring complete consistency and continuity for every student throughout their
                two-year journey.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  'Dedicated teacher for all commerce subjects',
                  'Individual attention to every student',
                  'Specially prepared study notes and material',
                  'Regular tests and feedback sessions',
                  'Free career counseling for students and parents',
                  'Comfortable home learning environment',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <a href="tel:9130136257" className="btn-primary flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Call: 9130136257
                </a>
                <Link to="/admission" className="btn-navy">Apply Now</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subheading">Curriculum</p>
            <h2 className="section-heading">Subjects Taught</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {subjects.map((s, i) => (
              <div key={i} className="card p-6 flex items-center gap-4 group hover:border-gold-200 border border-transparent">
                <div className="w-12 h-12 bg-gold-100 group-hover:bg-gold-500 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                  <BookOpen className="w-6 h-6 text-gold-600 group-hover:text-navy-900 transition-colors" />
                </div>
                <div>
                  <p className="font-bold text-navy-900">{s.name}</p>
                  <p className="text-sm text-gray-500">{s.std}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why single teacher */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-14 h-14 text-gold-400 mx-auto mb-5" />
          <h2 className="font-serif text-3xl font-bold text-white mb-4">
            Why One Teacher for All Subjects?
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            When one teacher handles all subjects, she understands each student completely —
            their strengths, weak areas, and learning speed. She can connect concepts across
            subjects, track overall progress, and give targeted help. Multiple teachers mean
            multiple blind spots. One dedicated teacher means complete ownership of your success.
          </p>
          <Link to="/admission" className="btn-primary py-4 px-10 text-lg">Join Now</Link>
        </div>
      </section>
    </div>
  );
}
