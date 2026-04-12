import React, { memo } from 'react';

// Intl.DateTimeFormat is much more performant than new Date().toLocaleString() inside the render cycle
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric', month: 'short', day: 'numeric',
  hour: 'numeric', minute: 'numeric', second: 'numeric'
});

const ArticleItem = memo(({ article, index }) => {
  return (
    <div className="article-card" data-testid="article-item">
      <h2><a href={article.url} target="_blank" rel="noopener noreferrer">{index + 1}. {article.title}</a></h2>
      <div className="article-meta">
        <span className="score">Score: {article.score}</span>
        <span className="author">By: {article.by}</span>
        <span className="date">Date: {article.time ? dateFormatter.format(article.time * 1000) : 'N/A'}</span>
      </div>
    </div>
  );
});

export default ArticleItem;
