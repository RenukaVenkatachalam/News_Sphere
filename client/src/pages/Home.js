import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import BreakingTicker from '../components/BreakingTicker';
import HeroCard from '../components/HeroCard';
import NewsCard from '../components/NewsCard';
import Sidebar from '../components/Sidebar';
import { RefreshCcw, Search, Loader2 } from 'lucide-react';

const Home = ({ searchQuery, activeCategory }) => {
  const { user } = useContext(AuthContext);
  const [articles, setArticles] = useState([]);
  const [heroArticle, setHeroArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const prefs = user?.preferredCategories || [];
  const hasPrefs = prefs.length > 0;
  const isDefaultFeed = !searchQuery && (!activeCategory || activeCategory === 'All');

  let pickedForYou = [];
  let everythingElse = [];

  if (hasPrefs && isDefaultFeed) {
    const allLoaded = heroArticle ? [heroArticle, ...articles] : [...articles];
    allLoaded.forEach(a => {
      if (prefs.includes(a.category)) pickedForYou.push(a);
      else everythingElse.push(a);
    });
  }

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (activeCategory && activeCategory !== 'All') {
          queryParams.append('category', activeCategory);
        }
        if (searchQuery) {
          queryParams.append('search', searchQuery);
        }

        const limitParam = 16;
        const res = await api.get(`/news?${queryParams.toString()}&limit=${limitParam}`);

        const fetchedArticles = res.data;

        if (page === 1 && !searchQuery && fetchedArticles.length > 0) {
          setHeroArticle(fetchedArticles[0]);
          setArticles(fetchedArticles.slice(1));
        } else if (page === 1) {
          setHeroArticle(null);
          setArticles(fetchedArticles);
        } else {
          setArticles(prev => [...prev, ...fetchedArticles]);
        }

        if (fetchedArticles.length < limitParam) {
          setHasMore(false);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
      }

      setLoading(false);
    };

    fetchNews();
  }, [activeCategory, searchQuery, page]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [activeCategory, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen">
      <BreakingTicker />

      <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12 flex-grow">

        {searchQuery && (
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-playfair font-bold text-[var(--text)]">
              Search Results
            </h1>

            <div className="flex items-center gap-2 px-4 py-1.5 bg-[var(--surface2)] border border-[var(--border)] rounded-full text-[var(--text)]">
              <Search size={16} className="text-[var(--accent2)]" />
              <span className="font-mono text-sm tracking-wide">"{searchQuery}"</span>
            </div>
          </div>
        )}

        {!searchQuery && activeCategory && activeCategory !== 'All' && (
          <div className="mb-8 border-b border-[var(--border)] pb-6">
            <h1 className="text-3xl md:text-5xl font-playfair font-black text-[var(--text)]">
              {activeCategory} News
            </h1>
          </div>
        )}

        <div className="flex flex-col xl:flex-row gap-8 lg:gap-12">

          <div className="w-full xl:w-3/4">
          
            {user && !hasPrefs && isDefaultFeed && page === 1 && (
              <div className="mb-8 p-4 bg-[var(--surface2)] rounded-xl border border-[var(--border)] text-center text-[var(--text)] flex justify-center items-center">
                <span className="font-medium mr-1 tracking-wide">👋 Personalise your feed — </span>
                <Link to="/profile" className="text-[var(--accent)] hover:underline font-bold transition-all">go to Profile to pick your topics</Link>
              </div>
            )}

            {heroArticle && !searchQuery && page === 1 && (!hasPrefs || !isDefaultFeed) && (
              <div className="animate-stagger-fade-up" style={{ animationDelay: '0ms' }}>
                <HeroCard article={heroArticle} />
              </div>
            )}

            {loading && page === 1 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-[var(--surface)] border border-[var(--border)] h-96 rounded-2xl"
                  />
                ))}
              </div>
            ) : articles.length > 0 ? (
              <>
                {hasPrefs && isDefaultFeed ? (
                  <>
                    {pickedForYou.length > 0 && (
                      <div className="mb-10">
                        <h2 className="text-2xl font-playfair font-bold text-[var(--text)] mb-6 flex items-center border-b border-[var(--border)] pb-3">
                          <span className="mr-2">✨</span> Picked For You
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {pickedForYou.map((article, idx) => (
                            <div key={article._id + 'picked' + idx} className="h-full animate-stagger-fade-up" style={{ animationDelay: `${Math.min((idx % 12) * 60, 600)}ms` }}>
                              <NewsCard article={article} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {everythingElse.length > 0 && (
                      <div className="mb-6 mt-8">
                        <h2 className="text-2xl font-playfair font-bold text-[var(--text)] mb-6 flex items-center border-b border-[var(--border)] pb-3 opacity-90">
                          <span className="mr-2 opacity-80">📰</span> Everything Else
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {everythingElse.map((article, idx) => (
                            <div key={article._id + 'other' + idx} className="h-full animate-stagger-fade-up" style={{ animationDelay: `${Math.min((idx % 12) * 60, 600)}ms` }}>
                              <NewsCard article={article} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article, idx) => (
                      <div
                        key={article._id + idx}
                        className="animate-stagger-fade-up h-full"
                        style={{ animationDelay: `${Math.min((idx % 12) * 60, 600)}ms` }}
                      >
                        <NewsCard article={article} />
                      </div>
                    ))}
                  </div>
                )}

                {hasMore && (
                  <div className="mt-12 text-center">
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={loading}
                      className="inline-flex items-center gap-2 bg-[var(--surface2)] hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] font-semibold px-8 py-3 rounded-xl transition-all btn-hover disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <RefreshCcw size={18} />
                      )}
                      Load More Stories
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 px-4 border border-dashed border-[var(--border)] rounded-2xl bg-[var(--surface)]">
                <Search size={48} className="mx-auto text-[var(--border)] mb-4" />

                <h3 className="font-playfair text-2xl font-bold text-[var(--text)] mb-2">
                  No headlines found
                </h3>

                <p className="text-[var(--text-muted)] max-w-md mx-auto">
                  We couldn't find any articles matching your search criteria.
                  Try using different keywords or clearing your filters.
                </p>
              </div>
            )}

          </div>

          <div className="w-full xl:w-1/4 hidden md:block">
            <div className="sticky top-28">
              <Sidebar />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;