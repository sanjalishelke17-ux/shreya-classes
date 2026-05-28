import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, MapPin, Phone, CheckCircle, Target, Heart, Users, BookOpen, Award } from 'lucide-react';

const values = [
  { icon: Target, title: 'Our Mission', desc: 'To provide every commerce student in Talegaon Dabhade with the same quality of education that students in big cities receive — at an affordable price, with personal attention.' },
  { icon: Heart, title: 'Our Approach', desc: 'We believe every student learns differently. That\'s why we adapt our teaching style to each individual, ensuring no student is left behind.' },
  { icon: Users, title: 'Small Batches', desc: 'We keep batches intentionally small so that every student gets the teacher\'s full attention. Quality over quantity — always.' },
];

export default function About() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-navy-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-subheading text-gold-400">Our Story</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-6">
            About Shreya Commerce Classes
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            A home tuition centre in the heart of Talegaon Dabhade, dedicated to helping
            11th and 12th commerce students achieve their best.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="section-subheading">Who We Are</p>
              <h2 className="section-heading mb-6">Home Tuition with a Difference</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Shreya Commerce Classes was founded with one simple belief: every student
                  deserves personal attention and quality coaching — not just students who can
                  afford big institutes in the city.
                </p>
                <p>
                  Located at <strong className="text-navy-900">Harsha Apartment, Vatan Nagar, near Indrayani College, Talegaon Dabhade</strong>,
                  our home tuition centre provides an environment where students feel comfortable,
                  ask questions freely, and learn at their own pace.
                </p>
                <p>
                  With <strong className="text-navy-900">Shraddha Ghodekar</strong> as the dedicated teacher for all subjects,
                  students get consistency and depth of understanding that multiple teachers
                  can never provide.
                </p>
              </div>

              <div className="mt-8 space-y-3">
                {[
                  'Classes for 11th and 12th Commerce (all subjects)',
                  'Individual doubt-solving sessions',
                  'Regular unit tests and mock exams',
                  'Free career counseling included',
                  'Downloadable notes for enrolled students',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-navy-900 rounded-2xl p-8 text-white">
                <GraduationCap className="w-12 h-12 text-gold-400 mb-4" />
                <h3 className="font-serif text-2xl font-bold mb-3">Shraddha Ghodekar</h3>
                <p className="text-gold-400 font-semibold mb-3">Commerce Teacher — All Subjects</p>
                <p className="text-gray-300 leading-relaxed">
                  Experienced commerce educator specialising in 11th and 12th standard curriculum.
                  Teaches all subjects including Accounts, Economics, Organisation of Commerce,
                  Secretarial Practice, and Mathematics.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gold-50 border border-gold-200 rounded-2xl p-5 text-center">
                  <BookOpen className="w-8 h-8 text-gold-600 mx-auto mb-2" />
                  <p className="font-bold text-navy-900 text-2xl">All</p>
                  <p className="text-gray-600 text-sm">Commerce Subjects</p>
                </div>
                <div className="bg-navy-50 rounded-2xl p-5 text-center">
                  <Award className="w-8 h-8 text-navy-700 mx-auto mb-2" />
                  <p className="font-bold text-navy-900 text-2xl">200+</p>
                  <p className="text-gray-600 text-sm">Students Guided</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="section-subheading">Our Values</p>
            <h2 className="section-heading">What Drives Us</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div key={i} className="card p-8 text-center">
                <div className="w-16 h-16 bg-gold-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <v.icon className="w-8 h-8 text-gold-600" />
                </div>
                <h3 className="font-bold text-navy-900 text-xl mb-3">{v.title}</h3>
                <p className="text-gray-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subheading">Find Us</p>
            <h2 className="section-heading">Our Location</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="space-y-5">
                <div className="flex gap-4 p-5 rounded-2xl bg-navy-50">
                  <MapPin className="w-6 h-6 text-gold-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-navy-900 mb-1">Address</p>
                    <p className="text-gray-600">Harsha Apartment, Vatan Nagar,<br />
                    Near Indrayani College,<br />Talegaon Dabhade, Pune</p>
                  </div>
                </div>
                <div className="flex gap-4 p-5 rounded-2xl bg-navy-50">
                  <Phone className="w-6 h-6 text-gold-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-navy-900 mb-1">Phone & WhatsApp</p>
                    <a href="tel:9130136257" className="text-gold-600 hover:text-gold-500 font-medium">+91 91301 36257</a>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Link to="/contact" className="btn-navy">Get Directions</Link>
                <Link to="/admission" className="btn-primary">Apply Now</Link>
              </div>
            </div>
            {/* Google Maps embed */}
            <div className="rounded-2xl overflow-hidden shadow-lg h-80">
              <iframe
                title="Shreya Commerce Classes Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3778.9!2d73.7!3d18.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sIndrayani+College+Talegaon+Dabhade!5e0!3m2!1sen!2sin!4v1"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gold-500 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-navy-900 mb-4">Join Our Family</h2>
          <p className="text-navy-700 mb-8">Limited seats. Personal attention guaranteed.</p>
          <Link to="/admission" className="btn-navy py-4 px-10 text-lg">Apply for Admission</Link>
        </div>
      </section>
    </div>
  );
}
