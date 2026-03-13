import React, { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import NewsCard from '../components/NewsCard';
import { Bookmark } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

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
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-slate-200">
        <div className="p-3 bg-blue-50 text-primary rounded-full">
          <Bookmark size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Saved Articles</h1>
          <p className="text-slate-500 mt-1">Your personal reading list</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
             <div key={i} className="animate-pulse bg-slate-100 h-80 rounded-xl"></div>
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
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <div className="flex justify-center mb-4">
            <Bookmark size={48} className="text-slate-300" />
          </div>
          <h3 className="text-xl text-slate-600 mb-2 font-medium">No saved articles yet.</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            When you find an interesting article on your feed, click the bookmark icon to save it here for later reading.
          </p>
          <Link to="/" className="inline-flex items-center text-primary font-medium hover:text-blue-700 hover:underline">
            Browse the latest news
          </Link>
        </div>
      )}
    </div>
  );
};

export default SavedArticles;
