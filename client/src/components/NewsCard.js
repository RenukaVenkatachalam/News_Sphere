import React, { useState, useContext, useEffect } from "react";
import { Bookmark, Clock, Flame } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import ViewCounter from "./ViewCounter";
import api from "../utils/api";
import { getCategoryColor } from "../utils/helpers";

const NewsCard = ({ article, onSaveToggle }) => {
  const { user } = useContext(AuthContext);

  const [isSaved, setIsSaved] = useState(false);

  const articleId = article?._id || null;

  /* ---------- Sync Saved State ---------- */
  useEffect(() => {
    if (!user || !articleId) {
      setIsSaved(false);
      return;
    }

    if (Array.isArray(user.savedArticles)) {
      const exists = user.savedArticles.some((item) => {
        const id = typeof item === "object" ? item._id : item;
        return String(id) === String(articleId);
      });

      setIsSaved(exists);
    }
  }, [user, articleId]);

  /* ---------- Save Toggle ---------- */
  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || !articleId) return;

    try {
      const newState = !isSaved;

      await api.post(`/user/save/${articleId}`);

      setIsSaved(newState);

      if (onSaveToggle) {
        onSaveToggle(articleId, newState);
      }
    } catch (error) {
      console.error("Save article failed:", error);
    }
  };

  /* ---------- View Counter ---------- */
  const handleTitleClick = async () => {
    if (!articleId) return;

    try {
      await api.post(`/news/${articleId}/view`);
    } catch {
      // silent fail
    }
  };

  /* ---------- Derived Data ---------- */
  const categoryColor = getCategoryColor(article?.category);

  const viewCount = article?.viewCount ?? 0;
  const isTrending = viewCount > 500;

  const summaryLength = article?.summary?.length ?? 200;
  const readTime = Math.max(1, Math.ceil(summaryLength / 200));

  const publishedDate = article?.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString()
    : "Unknown";

  if (!article) return null;

  /* ---------- Render ---------- */
  return (
    <div className="news-card rounded-xl overflow-hidden flex flex-col h-full group relative">

      <Link
        to={`/article/${articleId}`}
        onClick={handleTitleClick}
        className="block relative h-48 sm:h-56 overflow-hidden"
      >

        {article?.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article?.title || "News"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/400x300?text=News";
            }}
          />
        ) : (
          <div className="w-full h-full bg-[var(--surface2)] flex items-center justify-center font-mono text-[var(--text-muted)] uppercase tracking-widest text-xs">
            No Image Cover
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-3 inset-x-3 flex justify-between items-start">

          <div className="flex flex-col gap-2">

            <span
              className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded bg-[var(--surface)] text-[var(--text)] border-l-2 shadow-sm"
              style={{ borderLeftColor: categoryColor }}
            >
              {article?.category || "General"}
            </span>

            {isTrending && (
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded bg-[var(--red)]/10 text-[var(--red)] border border-[var(--red)]/20 shadow-sm backdrop-blur-md flex items-center w-fit">
                <Flame size={10} className="mr-1" />
                Trending
              </span>
            )}

          </div>

          <button
            onClick={handleSave}
            className={`p-2 rounded-full backdrop-blur-md shadow-sm transition ${
              isSaved
                ? "bg-[var(--accent2)] text-white hover:bg-blue-600"
                : "bg-[var(--surface)]/80 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]"
            }`}
            title={isSaved ? "Remove from saved" : "Save article"}
          >
            <Bookmark size={16} className={isSaved ? "fill-current" : ""} />
          </button>

        </div>
      </Link>

      <div className="p-5 flex flex-col flex-grow">

        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono font-medium text-[var(--accent)] uppercase tracking-wider">
            {article?.source || "NewsSphere"}
          </span>

          <ViewCounter articleId={articleId} initialCount={viewCount} />
        </div>

        <Link
          to={`/article/${articleId}`}
          onClick={handleTitleClick}
          className="flex-grow block"
        >

          <h3 className="font-playfair text-xl font-bold text-[var(--text)] mb-2 leading-snug line-clamp-3">
            {article?.title}
          </h3>

          <p className="text-[var(--text-muted)] text-sm mb-4 line-clamp-2">
            {article?.summary}
          </p>

        </Link>

        <div className="flex items-center text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wide border-t border-[var(--border)] pt-4 mt-auto">

          <span className="flex items-center">
            <Clock size={12} className="mr-1.5 opacity-70" />
            {publishedDate}
          </span>

          <span className="mx-2">•</span>

          <span>{readTime} MIN READ</span>

        </div>

      </div>
    </div>
  );
};

export default NewsCard;