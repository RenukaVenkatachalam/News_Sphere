import React from 'react';
import { Link } from 'react-router-dom';
import { getCategoryColor } from '../utils/helpers';
import { Share2, Clock, TrendingUp } from 'lucide-react';
import api from '../utils/api';

const HeroCard = ({ article }) => {
  if (!article) return null;

  const categoryColor = getCategoryColor(article.category);
  const isTrending = article.viewCount > 200;

  const handleTitleClick = async () => {
    try {
      await api.post(`/news/${article._id}/view`);
    } catch (error) {
      // Silent fail
    }
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden group btn-hover mb-8">

      {/* Background Image */}
      {article.imageUrl ? (
        <img
          src={article.imageUrl}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            e.target.src =
              'https://via.placeholder.com/1200x600?text=NewsSphere+Featured';
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface2)] to-[var(--bg)]"></div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent"></div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 z-10">

        {/* Category + Trending */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span
            className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded backdrop-blur-md bg-white/10 border border-white/20 text-white"
            style={{ borderLeftColor: categoryColor, borderLeftWidth: '3px' }}
          >
            {article.category || 'General'}
          </span>

          {isTrending && (
            <span className="flex items-center text-xs font-bold uppercase tracking-wider px-3 py-1 rounded bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 backdrop-blur-md">
              <TrendingUp size={14} className="mr-1.5" />
              Trending
            </span>
          )}
        </div>

        {/* Title */}
        <Link
          to={`/article/${article._id}`}
          onClick={handleTitleClick}
          className="block group-hover:text-white"
        >
          <h1 className="font-playfair text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-4 line-clamp-3">
            {article.title}
          </h1>
        </Link>

        {/* Summary */}
        <p className="text-gray-300 md:text-lg max-w-3xl mb-6 line-clamp-2 md:line-clamp-3">
          {article.summary}
        </p>

        {/* Meta + Actions */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2 border-t border-white/10 pt-6">
          <div className="flex items-center text-gray-400 text-sm font-mono tracking-wide gap-4">
            <span className="font-medium text-[var(--accent)]">
              {article.source}
            </span>

            <span className="flex items-center">
              <Clock size={14} className="mr-1.5" />
              {new Date(article.publishedAt).toLocaleDateString()}
            </span>

            <span>•</span>

            <span>
              {Math.ceil((article.summary?.length || 500) / 200)} min read
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/20 transition backdrop-blur-md">
              <Share2 size={18} />
            </button>

            <Link
              to={`/article/${article._id}`}
              onClick={handleTitleClick}
              className="px-6 py-2.5 bg-[var(--text)] text-[var(--bg)] font-bold rounded hover:bg-white transition"
            >
              Read Full Story
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HeroCard;