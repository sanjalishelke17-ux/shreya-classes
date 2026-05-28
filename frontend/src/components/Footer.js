import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, MapPin, Phone, Mail, Instagram, Facebook, Youtube, Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gold-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-navy-900" />
              </div>
              <div>
                <p className="text-white font-bold font-serif">Shreya Commerce</p>
                <p className="text-gold-400 text-xs">Classes</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Premium home tuition for 11th & 12th Commerce students. Individual attention,
              excellent study material & free career counseling.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-lg bg-navy-800 hover:bg-gold-500 hover:text-navy-900 flex items-center justify-center transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-navy-800 hover:bg-gold-500 hover:text-navy-900 flex items-center justify-center transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-navy-800 hover:bg-gold-500 hover:text-navy-900 flex items-center justify-center transition-all">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', to: '/' },
                { label: 'About Us', to: '/about' },
                { label: 'Courses', to: '/courses' },
                { label: 'Faculty', to: '/faculty' },
                { label: 'Testimonials', to: '/testimonials' },
                { label: 'Blog', to: '/blog' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-400 hover:text-gold-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Student */}
          <div>
            <h3 className="text-white font-semibold mb-4">Student Area</h3>
            <ul className="space-y-2">
              {[
                { label: 'Apply for Admission', to: '/admission' },
                { label: 'Student Login', to: '/login' },
                { label: 'Student Portal', to: '/portal' },
                { label: 'Download Notes', to: '/portal/notes' },
                { label: 'Announcements', to: '/portal/announcements' },
                { label: 'Contact Us', to: '/contact' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-400 hover:text-gold-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <MapPin className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-400">
                  Harsha Apartment, Vatan Nagar,<br />
                  Near Indrayani College,<br />
                  Talegaon Dabhade, Pune
                </p>
              </div>
              <a href="tel:9130136257" className="flex gap-3 hover:text-gold-400 transition-colors">
                <Phone className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm">+91 91301 36257</p>
              </a>
              <a href="https://wa.me/919130136257" className="flex gap-3 hover:text-gold-400 transition-colors">
                <svg className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <p className="text-sm">WhatsApp Us</p>
              </a>
              <a href="mailto:admin@shreyaclasses.com" className="flex gap-3 hover:text-gold-400 transition-colors">
                <Mail className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm">admin@shreyaclasses.com</p>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            © {year} Shreya Commerce Classes. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-400" /> for students of Talegaon Dabhade
          </p>
        </div>
      </div>
    </footer>
  );
}
