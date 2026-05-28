import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, ChevronRight } from 'lucide-react';
import api from '../utils/api';

export default function Blog() {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/blog').then(r => setPosts(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-16">
      <section className="bg-navy-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-subheading text-gold-400">News & Tips</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-6">Blog</h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Study tips, exam strategies, career guidance and updates from Shreya Commerce Classes.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-navy-800 border-t-gold-400 rounded-full animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-bold text-navy-900 text-xl mb-2">No posts yet</h3>
              <p className="text-gray-500">Blog articles will be published soon.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {posts.map(post => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="card group overflow-hidden">
                  {post.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img src={post.image_url} alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-semibold text-gold-600 bg-gold-50 px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
                      </span>
                    </div>
                    <h2 className="font-bold text-navy-900 text-xl mb-2 group-hover:text-gold-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
                    )}
                    <div className="flex items-center gap-1 text-gold-600 font-semibold text-sm">
                      Read more <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
