import React, { useEffect, useState } from 'react';
import NewsItem from './NewsItem';
const News = ({ category }) => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=8235be4fe67b454dbfe837efc7f67367`
    )
      .then(response => response.json())
      .then(data => {
        setArticles(data.articles || []);
      })
      .catch(error => console.error(error));
  }, [category]);

  return (
    <div>
      <h2>News - {category}</h2>

      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px'
        }}
      >
        {articles.map((article, index) => (
            <NewsItem
              key={index}
              title={article.title}
              description={article.description}
              image={article.urlToImage}
              url={article.url}
            />
        ))}
      </div>
    </div>
  );
};

export default News;
