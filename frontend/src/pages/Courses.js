import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle,
  Phone,
  ArrowRight,
  Clock,
  Users
} from 'lucide-react';
import api from '../utils/api';

const defaultCourses = [
  {
    id: 1,
    name: '11th Commerce',
    description:
      'Foundation year for commerce students. Strong base in all subjects with individual attention and regular tests.',
    subjects: [
      'Accounts',
      'Economics',
      'Organisation of Commerce (OC)',
      'Secretarial Practice (SP)',
      'Mathematics & Statistics',
      'English'
    ],
    duration: '1 Year',
    batch_size: 'Small Batch',
    fees_monthly: null,
    fees_yearly: null,
    badge: 'Standard XI'
  },
  {
    id: 2,
    name: '12th Commerce',
    description:
      'Board exam preparation with focused coaching, mock tests, and in-depth coverage of entire syllabus.',
    subjects: [
      'Accounts',
      'Economics',
      'Organisation of Commerce (OC)',
      'Secretarial Practice (SP)',
      'Mathematics & Statistics',
      'English'
    ],
    duration: '1 Year',
    batch_size: 'Small Batch',
    fees_monthly: null,
    fees_yearly: null,
    badge: 'Standard XII',
    popular: true
  }
];

export default function Courses() {
  const [courses, setCourses] = useState(defaultCourses);

  useEffect(() => {
    api
      .get('/courses')
      .then((r) => {
        if (r.data?.length) {
          setCourses(r.data);
        }
      })
      .catch(() => {
        console.log('Using default courses');
      });
  }, []);

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-navy-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-subheading text-gold-400">
            What We Teach
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-6">
            Our Courses
          </h1>

          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Comprehensive coaching for 11th and 12th Commerce —
            all subjects covered by a single dedicated teacher.
          </p>
        </div>
      </section>

      {/* Courses */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className={`card overflow-visible relative ${course.popular
                    ? 'ring-2 ring-gold-400'
                    : ''
                  }`}
              >
                {course.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gold-500 text-navy-900 text-xs font-bold px-4 py-1 rounded-full shadow">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="bg-navy-900 p-6 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-gold-500 text-navy-900 text-xs font-bold px-3 py-1 rounded-full">
                      {course.badge}
                    </span>

                    <div className="flex items-center gap-4 text-gray-400 text-xs">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.duration}
                      </span>

                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {course.batch_size}
                      </span>
                    </div>
                  </div>

                  <h2 className="font-serif text-2xl font-bold">
                    {course.name}
                  </h2>

                  <p className="text-gray-300 text-sm mt-2">
                    {course.description}
                  </p>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-navy-900 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gold-500" />
                    Subjects Covered
                  </h3>

                  <div className="space-y-2 mb-6">
                    {course.subjects.map((sub, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4 text-gold-500 flex-shrink-0" />

                        <span className="text-gray-700 text-sm">
                          {sub}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Fees Section */}
                  <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 mb-6">
                    <p className="text-xs font-semibold text-gold-700 uppercase tracking-wider mb-2">
                      Course Fees
                    </p>

                    {course.fees_monthly ||
                      course.fees_yearly ? (
                      <div className="flex gap-4">
                        {course.fees_monthly && (
                          <div>
                            <p className="font-bold text-navy-900 text-xl">
                              ₹
                              {Number(
                                course.fees_monthly
                              ).toLocaleString('en-IN')}
                            </p>

                            <p className="text-gray-500 text-xs">
                              per month
                            </p>
                          </div>
                        )}

                        {course.fees_yearly && (
                          <div>
                            <p className="font-bold text-navy-900 text-xl">
                              ₹
                              {Number(
                                course.fees_yearly
                              ).toLocaleString('en-IN')}
                            </p>

                            <p className="text-gray-500 text-xs">
                              per year
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="font-bold text-navy-900">
                          Contact for Fee Details
                        </p>

                        <p className="text-gray-500 text-xs mt-1">
                          Fees are structured based on subjects
                          and batch. Call or WhatsApp us for the
                          current fee structure.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Link
                      to="/admission"
                      className="flex-1 btn-primary text-center flex items-center justify-center gap-2 text-sm"
                    >
                      Apply Now
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <a
                      href="tel:9130136257"
                      className="btn-navy flex items-center gap-2 text-sm"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Included Section */}
          <div className="mt-16 bg-navy-900 rounded-3xl p-10 text-white">
            <h2 className="font-serif text-2xl font-bold text-center mb-8">
              Everything Included in Your Fee
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                'All subject teaching by expert teacher',
                'Printed study notes & material',
                'Regular class tests',
                'Unit test papers & solutions',
                'Mock board exam practice',
                'Free career counseling',
                'Doubt-solving sessions',
                'Access to student portal',
                'Downloadable digital notes'
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 text-gold-400 flex-shrink-0" />

                  <span className="text-gray-300 text-sm">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gold-500 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-navy-900 mb-4">
            Have Questions About Fees?
          </h2>

          <p className="text-navy-700 mb-6">
            Call or WhatsApp us directly. We'll explain
            everything clearly.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:9130136257"
              className="btn-navy flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Call: 9130136257
            </a>

            <a
              href="https://wa.me/919130136257"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-navy-900 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}