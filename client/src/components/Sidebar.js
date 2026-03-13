import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { TrendingUp, User, Bookmark, ChevronRight, Activity, Zap, Disc } from 'lucide-react';
import api from '../utils/api';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const [trending, setTrending] = useState([]);
  const [stats, setStats] = useState({ today: 0, categories: 0, sources: 0 });

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const trendRes = await api.get('/news/trending');
        setTrending(trendRes.data.slice(0, 5));

        setStats({
          today: Math.floor(Math.random() * 50) + 120,
          categories: 8,
          sources: Math.floor(Math.random() * 20) + 40
        });
      } catch (err) {
        console.error('Error fetching sidebar data', err);
      }
    };

    fetchSidebarData();
  }, []);

  return (
    <aside className="w-full flex md:flex-col gap-8 flex-col-reverse">

      {/* User Card */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-sm relative overflow-hidden group">

        {user ? (
          <>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[var(--accent2)] to-[var(--accent)] flex items-center justify-center text-white font-bold text-lg">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <h3 className="font-playfair text-xl font-bold text-[var(--text)]">
                  {user.name}
                </h3>
                <p className="text-[var(--text-muted)] text-sm">Free Member</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <Link
                to="/saved"
                className="bg-[var(--surface2)] rounded-xl p-3 flex flex-col items-center border border-[var(--border)]"
              >
                <Bookmark size={20} />
                <span className="text-xs">Saved</span>
                <span>{user.savedArticles?.length || 0}</span>
              </Link>

              <Link
                to="/profile"
                className="bg-[var(--surface2)] rounded-xl p-3 flex flex-col items-center border border-[var(--border)]"
              >
                <User size={20} />
                <span className="text-xs">Profile</span>
                <span>Edit</span>
              </Link>
            </div>

            <button className="w-full bg-[var(--accent)] text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2">
              <Zap size={18} /> Upgrade
            </button>
          </>
        ) : (
          <div className="text-center">
            <Activity size={30} className="mx-auto mb-4" />

            <h3 className="font-playfair text-xl font-bold">
              Personalise Your Feed
            </h3>

            <p className="text-sm text-[var(--text-muted)] mb-4">
              Create an account to save articles and manage topics
            </p>

            <Link
              to="/login"
              className="block w-full bg-[var(--text)] text-[var(--bg)] font-bold py-3 rounded-xl text-center"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* Trending */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">

        <div className="flex items-center gap-2 text-[var(--red)] font-bold mb-6">
          <TrendingUp size={18} />
          <span>Trending Now</span>
        </div>

        <div className="space-y-6">

          {trending.map((item, idx) => (

            <div key={item._id} className="relative pl-10">

              <span className="absolute left-0 font-mono text-2xl font-black text-[var(--border)]">
                {String(idx + 1).padStart(2, '0')}
              </span>

              {/* FIXED TEMPLATE STRING */}
              <Link to={`/article/${item._id}`} className="block">

                <h4 className="font-playfair font-medium mb-1">
                  {item.title}
                </h4>

                <div className="text-xs text-[var(--text-muted)]">
                  {item.source || 'News'} • {item.viewCount} views
                </div>

              </Link>

            </div>

          ))}

        </div>

        <Link
          to="/"
          className="mt-6 flex items-center justify-center text-sm text-[var(--accent2)]"
        >
          View all trending <ChevronRight size={16} />
        </Link>

      </div>

      {/* Stats */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6">

        <div className="flex items-center gap-2 text-[var(--green)] font-bold mb-6">
          <Disc size={18} />
          <span>Live Pulse</span>
        </div>

        <div className="grid grid-cols-2 gap-4">

          <div className="text-center p-3 bg-[var(--surface2)] rounded-xl">
            <div className="font-mono text-2xl font-bold">{stats.today}</div>
            <div className="text-xs">Articles Today</div>
          </div>

          <div className="text-center p-3 bg-[var(--surface2)] rounded-xl">
            <div className="font-mono text-2xl font-bold">{stats.categories}</div>
            <div className="text-xs">Categories</div>
          </div>

          <div className="col-span-2 text-center p-3 bg-[var(--surface2)] rounded-xl">
            <div className="font-mono text-2xl font-bold">{stats.sources}</div>
            <div className="text-xs">Active Sources</div>
          </div>

        </div>

      </div>

    </aside>
  );
};

export default Sidebar;