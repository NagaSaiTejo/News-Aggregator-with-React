import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchAllStories = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        const storyIds = await response.json();
        
        const stories = [];
        // Anti-pattern: sequential fetching in a loop causing network waterfall
        for (const id of storyIds.slice(0, 500)) {
          const storyResp = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          const storyData = await storyResp.json();
          if (storyData) {
            stories.push(storyData);
          }
          // Intentionally update state frequently (although moving it to end is also fine, let's keep it simple at the end)
        }
        setArticles(stories);
      } catch (error) {
        console.error("Failed to fetch stories", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllStories();
  }, []);

  // Inefficient sorting and filtering using full lodash
  const filteredArticles = _.filter(articles, (article) => 
    article.title && article.title.toLowerCase().includes(filter.toLowerCase())
  );
  
  const sortedArticles = sortOrder === 'asc' 
    ? _.sortBy(filteredArticles, 'score')
    : _.sortBy(filteredArticles, 'score').reverse();

  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="app-container">
      {/* Unoptimized Images */}
      <img src="/hero-image.png" alt="Hero" className="hero-image" />
      
      <header className="header">
        <h1>CyberNews Aggregator</h1>
        <p>Real-time cyberpunk news feeds from HackerNews core processors.</p>
        
        <div className="controls">
          <input 
            type="text" 
            placeholder="Filter by title..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-input"
          />
          <button onClick={handleSortToggle} className="sort-button">
            Sort by Score ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
          </button>
        </div>
      </header>
      
      <div className="content">
        {loading ? (
          <div className="loading" style={{color: '#ff0055'}}>Establishing connection stream... (Downloading 500 articles sequentially)</div>
        ) : (
          <div className="article-list">
            {/* No List Virtualization: Render all matching items */}
            {sortedArticles.map((article) => (
              <div key={article.id} className="article-card">
                <h2><a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a></h2>
                <div className="article-meta">
                  <span className="score">Score: {article.score}</span>
                  <span className="author">By: {article.by}</span>
                  {/* Expensive Computations in Render */}
                  <span className="date">Date: {new Date(article.time * 1000).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
