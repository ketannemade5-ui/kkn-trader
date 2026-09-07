import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  Tag,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export const BlogPostPage = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await blogAPI.getPostBySlug(slug);
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-kkn-gold/30 border-t-kkn-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data?.post) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Article Not Found</h2>
        <Link to="/blog" className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-kkn-gold">
          Return to Blog
        </Link>
      </div>
    );
  }

  const { post, related } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb */}
      <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-kkn-gold transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Articles</span>
      </Link>

      {/* Article Header */}
      <div className="space-y-4 border-b border-slate-800 pb-6">
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-kkn-gold/20 text-kkn-gold border border-kkn-gold/40">
          {post.category}
        </span>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Outfit'] leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2">
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-kkn-gold" />
            {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {post.readTimeMinutes} min read
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Article Body Content */}
      <div className="prose prose-invert max-w-none text-slate-200 text-sm sm:text-base leading-relaxed space-y-6">
        <div className="whitespace-pre-line leading-relaxed font-sans">
          {post.content}
        </div>
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="pt-6 border-t border-slate-800 flex items-center gap-2">
          <Tag className="w-4 h-4 text-slate-500" />
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Related Articles */}
      {related && related.length > 0 && (
        <div className="pt-10 border-t border-slate-800 space-y-6">
          <h3 className="text-xl font-bold text-white font-['Outfit']">Related Research & Lessons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((rel) => (
              <Link
                key={rel.slug}
                to={`/blog/${rel.slug}`}
                className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-kkn-gold/50 transition-all space-y-2 group"
              >
                <span className="text-[10px] font-mono font-bold text-kkn-gold uppercase">
                  {rel.category}
                </span>
                <h4 className="text-sm font-bold text-white group-hover:text-kkn-gold transition-colors line-clamp-2">
                  {rel.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">{rel.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
