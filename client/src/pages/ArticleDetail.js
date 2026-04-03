import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { getCategoryColor } from '../utils/helpers';
import ViewCounter from '../components/ViewCounter';
import NewsCard from '../components/NewsCard';
import BackButton from '../components/BackButton';
import { useToast } from '../context/ToastContext';
import { Clock, Share2, ExternalLink, Bookmark, ArrowLeft, Loader2 } from 'lucide-react';

const ArticleDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { showToast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const progress = (scrollY / (documentHeight - windowHeight)) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchArticleAndRelated = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/news/${id}`);
        setArticle(res.data);

        // Fetch related articles
        if (res.data.category) {
          const relatedRes = await api.get(`/news?category=${res.data.category}&limit=3`);
          setRelated(relatedRes.data.filter(a => a._id !== id).slice(0, 3));
        }

        // Check if saved
        if (user?.savedArticles?.length) {
          setIsSaved(user.savedArticles.some(item => (item._id || item) === id));
        }

      } catch (err) {
        console.error('Failed to load article details', err);
      }

      setLoading(false);
    };

    fetchArticleAndRelated();
  }, [id, user]);

  const handleSave = async () => {
    if (!user) return showToast('Please sign in to save articles', 'error');

    try {
      await api.post(`/user/save/${id}`);
      setIsSaved(!isSaved);
      showToast(isSaved ? 'Article removed from saved' : 'Article saved successfully', 'success');
    } catch (error) {
      console.error('Error saving article', error);
      showToast('Error saving article', 'error');
    }
  };

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'success');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-[var(--accent2)]" size={48} />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
        <Link to="/" className="text-[var(--accent2)] hover:underline flex items-center justify-center">
          <ArrowLeft size={16} className="mr-2" /> Back to Home
        </Link>
      </div>
    );
  }

  const categoryColor = getCategoryColor(article.category);
  const readTime = Math.ceil((article.summary?.length || 500) / 200);

  return (
    <>
      <div 
        className="fixed top-0 left-0 h-1 bg-[var(--accent)] z-50 transition-all duration-100" 
        style={{ width: `${scrollProgress}%` }} 
      />
      <BackButton />
      <div className="max-w-4xl mx-auto py-8">

      <div className="mb-8">

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">

            <span
              className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] border-l-4 shadow-sm"
              style={{ borderLeftColor: categoryColor }}
            >
              {article.category || 'General'}
            </span>

            <span className="font-mono text-sm font-bold text-[var(--accent2)] tracking-wider">
              {article.source || 'NewsSphere Focus'}
            </span>

          </div>

          <ViewCounter
            articleId={article._id}
            initialCount={article.viewCount}
            isDetail={true}
          />

        </div>

        <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-black text-[var(--text)] leading-tight mb-6">
          {article.title}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-y border-[var(--border)] py-4">

          <div className="flex items-center text-sm font-mono text-[var(--text-muted)]">
            <Clock size={16} className="mr-2" />
            <time>{new Date(article.publishedAt).toLocaleString()}</time>
            <span className="mx-3">•</span>
            <span>{readTime} min read</span>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={shareArticle}
              className="p-2.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface2)] hover:text-[var(--accent2)] transition-colors group"
              title="Share"
            >
              <Share2 size={18} className="group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={handleSave}
              className={`p-2.5 rounded-full border border-[var(--border)] transition-colors group ${
                isSaved
                  ? 'bg-[var(--accent2)] text-white border-[var(--accent2)] hover:bg-blue-600'
                  : 'bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface2)]'
              }`}
              title={isSaved ? "Remove from saved" : "Save article"}
            >
              <Bookmark
                size={18}
                className={`group-hover:scale-110 transition-transform ${
                  isSaved ? 'fill-current' : ''
                }`}
              />
            </button>

          </div>
        </div>
      </div>

      {article.imageUrl && (
        <div className="w-full h-[40vh] md:h-[60vh] rounded-2xl overflow-hidden mb-12 border border-[var(--border)] shadow-lg relative bg-[var(--surface2)]">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
      )}

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 md:p-12 mb-16 shadow-sm">

        <p className="text-xl md:text-2xl font-playfair text-[var(--text)] leading-relaxed mb-10 font-medium">
          {article.summary}
        </p>

        <div className="pt-8 border-t border-[var(--border)] flex flex-col items-center justify-center text-center">

          <p className="text-[var(--text-muted)] italic font-playfair mb-6 text-lg max-w-xl">
            This is a summary of the original piece. Read the full detailed story on the publisher's website.
          </p>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[var(--text)] text-[var(--bg)] font-bold px-8 py-4 rounded-xl hover:bg-[var(--accent)] hover:shadow-[0_0_20px_rgba(232,197,71,0.3)] transition-all flex items-center gap-3 group"
          >
            Read Original Content
            <ExternalLink size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>

        </div>
      </div>

      {related.length > 0 && (
        <div className="border-t border-[var(--border)] pt-16">

          <div className="flex items-center justify-between mb-8">
            <h3 className="font-playfair text-3xl font-bold text-[var(--text)]">
              More from {article.category}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map(item => (
              <NewsCard key={item._id} article={item} />
            ))}
          </div>

        </div>
      )}
    </div>
    </>
  );
};

export default ArticleDetail;