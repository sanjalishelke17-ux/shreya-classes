import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, Star, Users, Award, BookOpen, Clock, MapPin,
  Phone, ChevronRight, CheckCircle, MessageCircle, TrendingUp,
  Heart, Shield, Lightbulb, ArrowRight
} from 'lucide-react';
import api from '../utils/api';

// Animated counter hook
function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

// Intersection observer hook
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

const features = [
  { icon: Users, title: 'Individual Attention', desc: 'Small batch sizes ensure every student gets personal focus and doubts are cleared immediately.' },
  { icon: BookOpen, title: 'Excellent Study Material', desc: 'Carefully curated notes, practice papers and solved examples designed for board exam excellence.' },
  { icon: Award, title: 'Unmatched Coaching', desc: 'Years of experience helping 11th & 12th commerce students achieve top marks.' },
  { icon: TrendingUp, title: 'Regular Tests', desc: 'Weekly and monthly tests to track progress and prepare students for board exams.' },
  { icon: Lightbulb, title: 'Free Career Counseling', desc: 'Guidance on career paths after 12th — CA, MBA, B.Com, Banking and more.' },
  { icon: Shield, title: 'Affordable Fees', desc: 'Quality education shouldn\'t be a financial burden. Our fees are designed to be accessible.' },
];

const whyHomeList = [
  'Learn in a comfortable, distraction-free home environment',
  'Direct access to the teacher — no middlemen, no management',
  'Flexible timing that works around your schedule',
  'Feel free to ask any question without hesitation',
  'Parent can monitor progress closely',
];

export default function Home() {
  const [statsRef, statsInView] = useInView();
  const [announcements, setAnnouncements] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  const students = useCounter(200, 2000, statsInView);
  const results   = useCounter(95,  2000, statsInView);
  const years     = useCounter(8,   2000, statsInView);
  const score     = useCounter(98,  2000, statsInView);

  useEffect(() => {
    api.get('/announcements/public').then(r => setAnnouncements(r.data.slice(0, 3))).catch(() => {});
    api.get('/testimonials/approved').then(r => setTestimonials(r.data.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div className="overflow-x-hidden">

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen bg-navy-900 flex items-center pt-16">
        {/* Background pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-gold-500/5 blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl" />
          {/* Decorative grid */}
          <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e8b02a" strokeWidth="0.5"/>
            </pattern></defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-4 py-2 mb-6">
                <MapPin className="w-4 h-4 text-gold-400" />
                <span className="text-gold-400 text-sm font-medium">Talegaon Dabhade, Pune</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Excel in Commerce
                <span className="block text-gold-400">with Personal</span>
                <span className="block">Attention</span>
              </h1>

              <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg">
                Premium home tuition for 11th & 12th Commerce students. Small batches,
                individual focus, and proven results — right at Talegaon Dabhade.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link to="/admission" className="btn-primary flex items-center gap-2">
                  Apply for Admission <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="https://wa.me/919130136257" target="_blank" rel="noopener noreferrer"
                  className="btn-secondary flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> WhatsApp Us
                </a>
              </div>

              <div className="flex flex-wrap gap-6">
                {[
                  { label: '11th Commerce', desc: 'All Subjects' },
                  { label: '12th Commerce', desc: 'All Subjects' },
                  { label: 'Home Tuition', desc: 'Talegaon' },
                ].map(b => (
                  <div key={b.label} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-gold-400 flex-shrink-0" />
                    <div>
                      <p className="text-white font-semibold text-sm">{b.label}</p>
                      <p className="text-gray-400 text-xs">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero card */}
            <div className="animate-fade-in lg:flex lg:justify-end">
              <div className="relative max-w-sm mx-auto">
                <div className="bg-navy-800 border border-navy-700 rounded-3xl p-8 shadow-2xl">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-float">
                      <GraduationCap className="w-10 h-10 text-navy-900" />
                    </div>
                    <h2 className="font-serif text-xl font-bold text-white">Shraddha Ghodekar</h2>
                    <p className="text-gold-400 text-sm font-medium mt-1">Commerce Expert • All Subjects</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {whyHomeList.slice(0,3).map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-300 text-sm">{item}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-navy-900 rounded-xl p-3 text-center">
                      <p className="text-gold-400 font-bold text-xl">11th</p>
                      <p className="text-gray-400 text-xs">Commerce</p>
                    </div>
                    <div className="bg-navy-900 rounded-xl p-3 text-center">
                      <p className="text-gold-400 font-bold text-xl">12th</p>
                      <p className="text-gray-400 text-xs">Commerce</p>
                    </div>
                  </div>

                  <a href="tel:9130136257"
                    className="flex items-center justify-center gap-2 mt-5 w-full btn-primary py-3">
                    <Phone className="w-4 h-4" /> Call Now: 9130136257
                  </a>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-gold-500 text-navy-900 rounded-2xl px-4 py-2 shadow-lg">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-current" />)}
                  </div>
                  <p className="text-xs font-bold mt-0.5">Trusted by 200+ students</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section ref={statsRef} className="bg-gold-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: students, suffix: '+', label: 'Students Taught' },
              { value: results, suffix: '%', label: 'Pass Rate' },
              { value: years, suffix: '+', label: 'Years Experience' },
              { value: score, suffix: '%', label: 'Top Score Achieved' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="font-serif text-5xl font-bold text-navy-900">
                  {stat.value}{stat.suffix}
                </p>
                <p className="text-navy-700 font-semibold mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY HOME TUITION ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-subheading">Why Choose Us</p>
              <h2 className="section-heading mb-6">Why Home Tuition is Better</h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                At Shreya Commerce Classes, learning happens in a comfortable home environment in
                Talegaon Dabhade. No large classrooms, no getting lost in the crowd — just focused,
                personal teaching that gets results.
              </p>
              <div className="space-y-4">
                {whyHomeList.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gold-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-gold-600" />
                    </div>
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
              <Link to="/about" className="inline-flex items-center gap-2 btn-navy mt-8">
                Learn More About Us <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-navy-900 rounded-2xl p-6 text-white">
                  <Heart className="w-8 h-8 text-gold-400 mb-3" />
                  <h3 className="font-semibold mb-2">Personal Care</h3>
                  <p className="text-gray-400 text-sm">Every student matters. Your success is our mission.</p>
                </div>
                <div className="bg-gold-500 rounded-2xl p-6">
                  <BookOpen className="w-8 h-8 text-navy-900 mb-3" />
                  <h3 className="font-bold text-navy-900 mb-2">Quality Notes</h3>
                  <p className="text-navy-700 text-sm">Specially prepared study material for Commerce.</p>
                </div>
              </div>
              <div className="space-y-4 mt-6">
                <div className="bg-gold-50 border border-gold-200 rounded-2xl p-6">
                  <Clock className="w-8 h-8 text-gold-600 mb-3" />
                  <h3 className="font-bold text-navy-900 mb-2">Flexible Timing</h3>
                  <p className="text-gray-600 text-sm">Batches scheduled to fit your daily routine.</p>
                </div>
                <div className="bg-navy-800 rounded-2xl p-6 text-white">
                  <Award className="w-8 h-8 text-gold-400 mb-3" />
                  <h3 className="font-semibold mb-2">Proven Results</h3>
                  <p className="text-gray-400 text-sm">Students achieving 80%+ in board exams consistently.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-subheading">What We Offer</p>
            <h2 className="section-heading">Everything You Need to Excel</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card p-6 group hover:border-gold-200 border border-transparent">
                <div className="w-12 h-12 bg-navy-100 group-hover:bg-gold-100 rounded-xl flex items-center justify-center mb-4 transition-colors">
                  <f.icon className="w-6 h-6 text-navy-800 group-hover:text-gold-600 transition-colors" />
                </div>
                <h3 className="font-bold text-navy-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ANNOUNCEMENTS ===== */}
      {announcements.length > 0 && (
        <section className="py-16 bg-navy-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="section-subheading">Latest Updates</p>
                <h2 className="section-heading">Announcements</h2>
              </div>
              <Link to="/portal/announcements" className="text-gold-600 hover:text-gold-500 font-medium flex items-center gap-1 text-sm">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {announcements.map((ann) => (
                <div key={ann.id} className="card p-5 border-l-4 border-l-gold-400">
                  <span className="text-xs font-semibold text-gold-600 bg-gold-50 px-2 py-1 rounded-full">
                    {ann.category || 'General'}
                  </span>
                  <h3 className="font-bold text-navy-900 mt-3 mb-2">{ann.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{ann.content}</p>
                  <p className="text-gray-400 text-xs mt-3">
                    {new Date(ann.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== TESTIMONIALS PREVIEW ===== */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="section-subheading">Student Stories</p>
              <h2 className="section-heading">What Our Students Say</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="card p-6 bg-navy-50">
                  <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-4 h-4 ${s <= (t.rating||5) ? 'text-gold-400 fill-current' : 'text-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">"{t.review}"</p>
                  <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-navy-900 text-sm">{t.student_name}</p>
                      {t.percentage && (
                        <p className="text-gold-600 text-xs font-semibold">12th: {t.percentage}%</p>
                      )}
                    </div>
                    {t.year && <span className="text-xs text-gray-400">Batch {t.year}</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/testimonials" className="btn-navy inline-flex items-center gap-2">
                View All Reviews <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA ===== */}
      <section className="bg-navy-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float">
            <GraduationCap className="w-8 h-8 text-navy-900" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join Shreya Commerce Classes and get the personal attention you deserve.
            Limited seats available for 2024-25 batch.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/admission" className="btn-primary flex items-center gap-2 py-4 px-8 text-lg">
              Apply Now — It's Free <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="tel:9130136257" className="btn-secondary flex items-center gap-2 py-4 px-8 text-lg">
              <Phone className="w-5 h-5" /> 9130136257
            </a>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            <MapPin className="w-4 h-4 inline mr-1" />
            Harsha Apartment, Vatan Nagar, Near Indrayani College, Talegaon Dabhade
          </p>
        </div>
      </section>
    </div>
  );
}
