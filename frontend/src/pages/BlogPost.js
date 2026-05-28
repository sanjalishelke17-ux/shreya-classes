import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, User } from 'lucide-react';
import api from '../utils/api';

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    api.get(`/blog/${id}`)
      .then(r => setPost(r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="w-10 h-10 border-4 border-navy-800 border-t-gold-400 rounded-full animate-spin" />
    </div>
  );

  if (error || !post) return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-16">
      <h2 className="font-bold text-navy-900 text-2xl mb-4">Post not found</h2>
      <Link to="/blog" className="btn-navy flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>
    </div>
  );

  return (
    <div className="pt-16">
      {post.image_url && (
        <div className="h-72 md:h-96 overflow-hidden">
          <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <Link to="/blog" className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-500 font-medium mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
        <span className="text-xs font-semibold text-gold-600 bg-gold-50 px-3 py-1 rounded-full">
          {post.category}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-navy-900 mt-4 mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200">
          {post.author_name && (
            <span className="flex items-center gap-1"><User className="w-4 h-4" />{post.author_name}</span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(post.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
          </span>
        </div>
        <div
          className="prose prose-navy max-w-none text-gray-700 leading-relaxed"
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {post.content}
        </div>
      </div>
    </div>
  );
}
