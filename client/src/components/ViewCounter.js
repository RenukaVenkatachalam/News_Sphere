import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { Eye, Radio } from "lucide-react";

const POLL_INTERVAL = 30000;

const ViewCounter = ({ articleId, initialCount = 0, isDetail = false }) => {
  const [count, setCount] = useState(initialCount);

  /* ---------- Sync with prop changes ---------- */
  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  /* ---------- Poll live view count ---------- */
  useEffect(() => {
    if (!articleId) return;

    let isMounted = true;

    const fetchCount = async () => {
      try {
        const res = await api.get(`/news/${articleId}`);

        const viewCount = res?.data?.viewCount;

        if (isMounted && typeof viewCount === "number") {
          setCount(viewCount);
        }
      } catch (err) {
        // Don't spam console, but keep it visible during development
        if (process.env.NODE_ENV === "development") {
          console.error("View count fetch failed:", err);
        }
      }
    };

    fetchCount();

    const interval = setInterval(fetchCount, POLL_INTERVAL);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [articleId]);

  const formattedCount = count.toLocaleString();

  /* ---------- Detail Page Variant ---------- */
  if (isDetail) {
    return (
      <div className="flex items-center text-[var(--red)] font-mono text-sm font-medium bg-[var(--red)]/10 px-3 py-1.5 rounded-full border border-[var(--red)]/20 shadow-[0_0_10px_rgba(255,95,95,0.1)]">
        <Radio size={14} className="mr-2 animate-pulse" />
        LIVE — {formattedCount} people reading now
      </div>
    );
  }

  /* ---------- Card Variant ---------- */
  return (
    <div
      className="flex items-center text-[var(--text-muted)] font-mono text-xs"
      title="Live view count"
    >
      <Eye size={12} className="mr-1.5 opacity-70" />
      {formattedCount} watching
    </div>
  );
};

export default ViewCounter;