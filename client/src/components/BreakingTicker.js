import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { getCategoryColor } from '../utils/helpers';

const BreakingTicker = () => {
  const [headlines, setHeadlines] = useState([]);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await api.get('/news?limit=6');
        setHeadlines(res.data.slice(0, 6)); // Ensure we only take 6
      } catch (err) {
        console.error('Failed to fetch ticker news', err);
      }
    };
    fetchLatest();
  }, []);

  if (headlines.length === 0) return null;

  return (
    <div className="bg-[#ff5f5f] text-white flex items-center overflow-hidden h-10 border-b border-[#dd4b4b]">
      <div className="bg-[#e63946] px-4 font-bold flex items-center h-full z-10 whitespace-nowrap uppercase tracking-wider text-sm shadow-[2px_0_10px_rgba(0,0,0,0.2)]">
        <span className="relative flex h-3 w-3 mr-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        Live
      </div>
      
      <div className="flex-1 overflow-hidden relative h-full">
        <div className="ticker-scroll absolute whitespace-nowrap h-full flex items-center style={{ animationDuration: '30s' }}">
          {headlines.map((item, idx) => (
            <React.Fragment key={item._id}>
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline font-medium px-4 text-sm"
              >
                <span style={{ color: getCategoryColor(item.category) }} className="mr-2 font-bold opacity-90">
                  [{item.category ? item.category.toUpperCase() : 'GENERAL'}]
                </span>
                {item.title}
              </a>
              {idx < headlines.length - 1 && <span className="text-white/50 px-2">•</span>}
            </React.Fragment>
          ))}
          {/* Duplicate for seamless looping */}
           {headlines.map((item, idx) => (
            <React.Fragment key={item._id + '-dup'}>
              <span className="text-white/50 px-2">•</span>
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline font-medium px-4 text-sm"
              >
                <span style={{ color: getCategoryColor(item.category) }} className="mr-2 font-bold opacity-90">
                  [{item.category ? item.category.toUpperCase() : 'GENERAL'}]
                </span>
                {item.title}
              </a>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BreakingTicker;
