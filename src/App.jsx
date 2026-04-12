import React, { useState, useEffect, Suspense, useMemo } from 'react';
import sortBy from 'lodash/sortBy';
import './App.css';

const VirtualizedList = React.lazy(() => import('./VirtualizedList'));

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
        
        const idsToFetch = storyIds.slice(0, 500);
        const fetchPromises = idsToFetch.map(id => 
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
        );
        
        const stories = await Promise.all(fetchPromises);
        setArticles(stories.filter(Boolean));
      } catch (error) {
        console.error("Failed to fetch stories", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllStories();
  }, []);

  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const sortedAndFilteredArticles = useMemo(() => {
    const filtered = articles.filter(article => 
      article.title && article.title.toLowerCase().includes(filter.toLowerCase())
    );
    
    const sorted = sortBy(filtered, 'score');
    return sortOrder === 'asc' ? sorted : sorted.reverse();
  }, [articles, filter, sortOrder]);

  return (
    <div className="app-container">
      <img 
        src="/hero-image.png" 
        srcSet="/hero-image.png 1000w, /hero-image.png 2000w"
        sizes="(max-width: 1000px) 100vw, 1000px"
        width="1200" 
        height="400" 
        alt="Hero" 
        className="hero-image optimized" 
        loading="lazy"
        data-testid="hero-image"
      />
      
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
          <div className="loading" style={{color: '#00f3ff'}}>Establishing parallel connection stream...</div>
        ) : (
          <Suspense fallback={<div className="loading">Initializing Neural List Render...</div>}>
            <VirtualizedList articles={sortedAndFilteredArticles} />
          </Suspense>
        )}
      </div>
    </div>
  );
}

export default App;
