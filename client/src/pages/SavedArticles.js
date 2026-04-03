import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import NewsCard from '../components/NewsCard';
import { Bookmark } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';

const SavedArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchSavedArticles = async () => {
      try {
        const res = await api.get('/user/saved');
        setArticles(res.data);
      } catch (err) {
        console.error('Error fetching saved articles:', err);
      }
      setLoading(false);
    };

    fetchSavedArticles();
  }, []);

  const handleSaveToggle = (articleId, isSaved) => {
    if (!isSaved) {
      // If it was unsaved, remove it from the list immediately for snappier UI
      setArticles(articles.filter(article => article._id !== articleId));
    }
  };

  return (
    <>
    <BackButton />
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-[var(--border)]">
        <div className="p-3 bg-[var(--surface2)] text-[var(--accent2)] rounded-full">
          <Bookmark size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-playfair font-black text-[var(--text)] tracking-tight">Saved Articles</h1>
          <p className="text-[var(--text-muted)] mt-1">Your personal reading list</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
             <div key={i} className="animate-pulse bg-[var(--surface)] h-80 rounded-xl"></div>
          ))}
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard 
              key={article._id} 
              article={article} 
              onSaveToggle={handleSaveToggle} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[var(--surface)] rounded-2xl border border-dashed border-[var(--border)] shadow-sm">
          <div className="flex justify-center mb-6">
            <Bookmark size={64} className="text-[var(--accent)] opacity-80" />
          </div>
          <h3 className="text-2xl text-[var(--text)] mb-3 font-playfair font-bold">Nothing saved yet</h3>
          <p className="text-[var(--text-muted)] mb-8 max-w-md mx-auto">
            Hit the bookmark icon on any article to save it here
          </p>
          <Link to="/" className="inline-flex items-center justify-center bg-[var(--text)] text-[var(--bg)] font-bold px-8 py-3 rounded-xl hover:bg-[var(--accent)] hover:shadow-[0_0_15px_rgba(232,197,71,0.3)] transition-all">
            Explore News
          </Link>
        </div>
      )}
    </div>
    </>
  );
};

export default SavedArticles;
